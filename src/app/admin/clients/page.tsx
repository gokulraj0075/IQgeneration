import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/server/better-auth";
import { db } from "@/server/db";
import { user } from "@/server/db/schema";

import ClientsPageClient from "./page-client";

export default async function Page() {
	const headerStore = await headers();

	const session = await auth.api.getSession({
		headers: headerStore,
	});

	if (!session) {
		redirect("/login");
	}

	const dbUser = await db.query.user.findFirst({
		where: eq(user.id, session.user.id),
	});

	if (!dbUser) {
		redirect("/login");
	}

	return (
		<ClientsPageClient
			email={session.user.email}
			name={session.user.name}
			userRole={dbUser.role as "admin" | "employee" | "client"}
		/>
	);
}
