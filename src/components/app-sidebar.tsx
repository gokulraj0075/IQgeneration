"use client";

import {
	BarChart3,
	CreditCard,
	FileSpreadsheet,
	FileText,
	LayoutDashboard,
	Package,
	Receipt,
	Settings,
	Users,
} from "lucide-react";
import type * as React from "react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";

import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarRail,
} from "@/components/ui/sidebar";

type Role = "admin" | "employee" | "client";

export function AppSidebar({
	role = "employee",
	user = {
		name: "User",
		email: "user@email.com",
	},
	...props
}: React.ComponentProps<typeof Sidebar> & {
	role?: Role;
	user?: {
		name: string;
		email: string;
		avatar?: string;
	};
}) {
	const adminNav = [
		{ title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
		{ title: "Clients", url: "/admin/clients", icon: Users },
		{ title: "Products", url: "/admin/products", icon: Package },
		{ title: "Quotations", url: "/admin/quotations", icon: FileText },
		{ title: "Invoices", url: "/admin/invoices", icon: Receipt },
		{ title: "Payments", url: "/admin/payments", icon: CreditCard },
		// { title: "Reports", url: "/admin/reports", icon: BarChart3 },
		// { title: "Settings", url: "/admin/settings", icon: Settings },
	];

	const employeeNav = [
		{ title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
		{ title: "Clients", url: "/employee/clients", icon: Users },
		{ title: "Quotations", url: "/employee/quotations", icon: FileText },
		{ title: "Invoices", url: "/employee/invoices", icon: Receipt },
		{ title: "Payments", url: "/employee/payments", icon: CreditCard },
	];

	const clientNav = [
		{ title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
		{ title: "Quotations", url: "/quotations", icon: FileText },
		{ title: "Invoices", url: "/invoices", icon: Receipt },
		{ title: "Payments", url: "/payments", icon: CreditCard },
	];

	const nav =
		role === "admin" ? adminNav : role === "employee" ? employeeNav : clientNav;

	return (
		<Sidebar collapsible="icon" {...props}>
			{/* HEADER */}
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton size="lg">
							{/* ICON */}
							<div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
								<FileSpreadsheet className="size-4" />
							</div>

							{/* TEXT */}
							<div className="grid flex-1 text-left text-sm leading-tight">
								<span className="truncate font-semibold">InvoQuote</span>
								<span className="truncate text-muted-foreground text-xs capitalize">
									{role}
								</span>
							</div>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>

			{/* MENU */}
			<SidebarContent>
				<NavMain items={nav} />
			</SidebarContent>

			{/* USER */}
			<SidebarFooter>
				<NavUser user={user} />
			</SidebarFooter>

			<SidebarRail />
		</Sidebar>
	);
}
