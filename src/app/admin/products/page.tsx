import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/server/better-auth/config";
import ProductsPageClient from "./ProductsPageClient";

export default async function Page() {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session?.user) {
		redirect("/login");
	}

	return (
		<ProductsPageClient
			email={session.user.email}
			name={session.user.name}
			userRole={session.user.role as "admin" | "employee" | "client"}
		/>
	);
}
