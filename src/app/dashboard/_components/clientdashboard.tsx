"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ClientDashboard() {
	return (
		<div className="grid gap-4 md:grid-cols-3">
			<Card>
				<CardHeader>
					<CardTitle>Total Quotations</CardTitle>
				</CardHeader>
				<CardContent>
					<p className="font-bold text-2xl">12</p>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>Total Invoices</CardTitle>
				</CardHeader>
				<CardContent>
					<p className="font-bold text-2xl">8</p>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>Pending Payments</CardTitle>
				</CardHeader>
				<CardContent>
					<p className="font-bold text-2xl">$1,200</p>
				</CardContent>
			</Card>

			<Card className="col-span-3">
				<CardHeader>
					<CardTitle>Recent Transactions</CardTitle>
				</CardHeader>
				<CardContent className="h-48 rounded-md bg-muted/40" />
			</Card>
		</div>
	);
}
