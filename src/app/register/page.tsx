"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

export default function RegisterPage() {
	const router = useRouter();

	const [form, setForm] = useState({
		fullName: "",
		email: "",
		password: "",
		role: "employee",
	});

	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");
		setLoading(true);

		const res = await fetch("/api/auth/sign-up/email", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				name: form.fullName,
				email: form.email,
				password: form.password,
				role: form.role,
			}),
		});

		setLoading(false);

		if (res.ok) {
			router.push("/login");
		} else {
			const data = (await res.json().catch(() => null)) as { message?: string } | null;
			setError(data?.message || "Registration failed.");
		}
	};

	return (
		<div className="flex min-h-screen items-center justify-center bg-muted/40 px-4">
			<Card className="w-full max-w-md shadow-lg">
				<CardHeader className="space-y-1 text-center">
					<CardTitle className="font-bold text-2xl">
						Create Your Account
					</CardTitle>
					<CardDescription>Start using InvoQuote today</CardDescription>
				</CardHeader>

				<CardContent className="space-y-6">
					{error && (
						<div className="rounded-md border border-red-200 bg-red-50 p-3 text-red-600 text-sm">
							{error}
						</div>
					)}

					<form className="space-y-4" onSubmit={handleSubmit}>
						<div className="space-y-2">
							<Label>Full Name</Label>
							<Input
								onChange={(e) => setForm({ ...form, fullName: e.target.value })}
								placeholder="John Doe"
								required
							/>
						</div>

						<div className="space-y-2">
							<Label>Email</Label>
							<Input
								onChange={(e) => setForm({ ...form, email: e.target.value })}
								placeholder="john@example.com"
								required
								type="email"
							/>
						</div>

						<div className="space-y-2">
							<Label>Password</Label>
							<Input
								onChange={(e) => setForm({ ...form, password: e.target.value })}
								placeholder="Enter password"
								required
								type="password"
							/>
						</div>

						<div className="space-y-2">
							<Label>Select Role</Label>

							<Select
								onValueChange={(value) => setForm({ ...form, role: value })}
								value={form.role}
							>
								<SelectTrigger>
									<SelectValue placeholder="Select Role" />
								</SelectTrigger>

								<SelectContent>
									<SelectItem value="admin">Admin</SelectItem>
									<SelectItem value="employee">Employee</SelectItem>
									{/* <SelectItem value="client">Client</SelectItem> */}
								</SelectContent>
							</Select>
						</div>

						<Button className="w-full" disabled={loading} type="submit">
							{loading ? "Creating account..." : "Register"}
						</Button>
					</form>

					<div className="text-center text-muted-foreground text-sm">
						Already a user?{" "}
						<Link
							className="font-medium text-primary hover:underline"
							href="/login"
						>
							Login
						</Link>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
