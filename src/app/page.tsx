import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function Page() {
	return (
		<main className="min-h-screen bg-background">
			{/* Navbar */}
			<header className="border-b">
				<div className="container mx-auto flex h-16 items-center justify-between px-6">
					<h1 className="font-bold text-xl tracking-tight">InvoQuote</h1>

					<div className="flex items-center gap-3">
						<Link href="/login">
							<Button variant="outline">Login</Button>
						</Link>

						<Link href="/register">
							<Button>Register</Button>
						</Link>
					</div>
				</div>
			</header>

			{/* Hero */}
			<section className="container mx-auto px-6 py-20">
				<div className="mx-auto max-w-4xl text-center">
					<h2 className="font-bold text-4xl tracking-tight sm:text-5xl">
						Create Professional Invoices & Quotations Effortlessly
					</h2>

					<p className="mt-6 text-lg text-muted-foreground">
						InvoQuote helps businesses generate quotations, convert them to
						invoices, track payments, and manage clients — all from a single
						professional dashboard.
					</p>

					<div className="mt-10 flex justify-center gap-4">
						<Link href="/register">
							<Button size="lg">Get Started</Button>
						</Link>

						<Link href="/login">
							<Button size="lg" variant="outline">
								Login
							</Button>
						</Link>
					</div>
				</div>
			</section>

			{/* Features */}
			<section className="container mx-auto px-6 pb-20">
				<div className="grid gap-6 md:grid-cols-3">
					<Card>
						<CardContent className="pt-6">
							<h3 className="font-semibold text-lg">Quotation Management</h3>
							<p className="mt-2 text-muted-foreground text-sm">
								Create and send professional quotations with product details,
								taxes, discounts, and pricing breakdown.
							</p>
						</CardContent>
					</Card>

					<Card>
						<CardContent className="pt-6">
							<h3 className="font-semibold text-lg">Invoice Generation</h3>
							<p className="mt-2 text-muted-foreground text-sm">
								Convert approved quotations into invoices instantly and export
								them as printable PDFs.
							</p>
						</CardContent>
					</Card>

					<Card>
						<CardContent className="pt-6">
							<h3 className="font-semibold text-lg">Payment Tracking</h3>
							<p className="mt-2 text-muted-foreground text-sm">
								Track paid, unpaid, and overdue invoices while maintaining
								complete payment history.
							</p>
						</CardContent>
					</Card>
				</div>
			</section>

			{/* Footer */}
			<footer className="border-t">
				<div className="container mx-auto px-6 py-6 text-center text-muted-foreground text-sm">
					© {new Date().getFullYear()} InvoQuote. All rights reserved.
				</div>
			</footer>
		</main>
	);
}
