import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/server/better-auth/config";
import QuotationsPageClient from "./QuotationsPageClient";

export default async function Page() {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session?.user) {
		redirect("/login");
	}

	return (
		<QuotationsPageClient
			email={session.user.email}
			name={session.user.name}
			userId={session.user.id}
			userRole={session.user.role as "admin" | "employee" | "client"}
		/>
	);
}
