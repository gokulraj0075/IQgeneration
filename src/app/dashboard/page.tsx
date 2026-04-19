import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { AppSidebar } from "@/components/app-sidebar";

import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import { Separator } from "@/components/ui/separator";

import {
	SidebarInset,
	SidebarProvider,
	SidebarTrigger,
} from "@/components/ui/sidebar";

import { auth } from "@/server/better-auth";
import { db } from "@/server/db";
import { user } from "@/server/db/schema";

import AdminDashboard from "./_components/admindashboard";
// import ClientDashboard from "./_components/clientdashboard";
import EmployeeDashboard from "./_components/employeedashboard";

export default async function Page() {
	/* -------------------- CHECK SESSION -------------------- */

	const headerStore = await headers();

	const session = await auth.api.getSession({
		headers: headerStore,
	});

	if (!session) {
		redirect("/login");
	}

	/* -------------------- FETCH USER ROLE -------------------- */

	const dbUser = await db.query.user.findFirst({
		where: eq(user.id, session.user.id),
	});

	if (!dbUser) {
		redirect("/login");
	}

	const role = (dbUser.role ?? "employee") as "admin" | "employee" | "client";

	/* -------------------- PAGE -------------------- */

	return (
		<SidebarProvider>
			<AppSidebar
				role={role}
				user={{
					name: session.user.name,
					email: session.user.email,
				}}
			/>

			<SidebarInset>
				<header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
					<div className="flex items-center gap-2 px-4">
						<SidebarTrigger className="-ml-1" />

						<Separator
							className="mr-2 data-[orientation=vertical]:h-4"
							orientation="vertical"
						/>

						<Breadcrumb>
							<BreadcrumbList>
								<BreadcrumbItem className="hidden md:block">
									<BreadcrumbLink href="#">Dashboard</BreadcrumbLink>
								</BreadcrumbItem>

								<BreadcrumbSeparator className="hidden md:block" />

								<BreadcrumbItem>
									<BreadcrumbPage>{role}</BreadcrumbPage>
								</BreadcrumbItem>
							</BreadcrumbList>
						</Breadcrumb>
					</div>
				</header>

				<div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                    {role === "admin" && <AdminDashboard />}
                    {role === "employee" && <EmployeeDashboard userId={session.user.id} />}
                    {/* {role === "client" && <ClientDashboard />} */}
                </div>
			</SidebarInset>
		</SidebarProvider>
	);
}
