import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl;

	const session =
		request.cookies.get("better-auth.session_token")?.value ||
		request.cookies.get("__Secure-better-auth.session_token")?.value;

	/* ---------- PROTECTED ROUTES ---------- */

	const protectedRoutes = [
		"/dashboard",
		"/admin",
		"/products",
		"/quotations",
		"/invoices",
		"/payments",
	];

	const isProtected = protectedRoutes.some((route) =>
		pathname.startsWith(route),
	);

	/* ---------- NOT LOGGED IN ---------- */

	if (!session && isProtected) {
		return NextResponse.redirect(new URL("/login", request.url));
	}

	return NextResponse.next();
}

export const config = {
	matcher: [
		"/dashboard/:path*",
		"/admin/:path*",
		"/products/:path*",
		"/quotations/:path*",
		"/invoices/:path*",
		"/payments/:path*",
	],
};
