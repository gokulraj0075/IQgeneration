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
import { authClient } from "@/server/better-auth/client";

export default function LoginPage() {
	const router = useRouter();

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const defaultLoginError = "Invalid password or user doesn't exist.";

	const handleLogin = async () => {
		setError("");

		try {
			const result = await authClient.signIn.email({
				email,
				password,
			});

			if (result?.error) {
				setError(
					result.error.message === "Invalid email or password"
						? defaultLoginError
						: (result.error.message || defaultLoginError),
				);
				return;
			}

			router.push("/dashboard");
			router.refresh();
		} catch (err) {
			const authError = err as {
				message?: string;
				error?: {
					message?: string;
					code?: string;
				};
			};

			setError(
				authError.error?.message === "Invalid email or password" ||
					authError.message === "Invalid email or password"
					? defaultLoginError
					: (authError.error?.message || authError.message || defaultLoginError),
			);
		}
	};

	return (
		<div className="flex min-h-screen items-center justify-center bg-muted/40 px-4">
			<Card className="w-full max-w-md">
				<CardHeader>
					<CardTitle>Login</CardTitle>
					<CardDescription>Access your InvoQuote dashboard</CardDescription>
				</CardHeader>

				<CardContent className="space-y-4">
					{error && (
						<div className="rounded-md border border-red-200 bg-red-50 p-3 text-red-600 text-sm">
							{error}
						</div>
					)}

					<div className="space-y-2">
						<Label>Email</Label>
						<Input
							onChange={(e) => setEmail(e.target.value)}
							placeholder="john@example.com"
							type="email"
							value={email}
						/>
					</div>

					<div className="space-y-2">
						<Label>Password</Label>
						<Input
							onChange={(e) => setPassword(e.target.value)}
							placeholder="Enter password"
							type="password"
							value={password}
						/>
					</div>

					<Button className="w-full" onClick={handleLogin}>
						Login
					</Button>

					<p className="text-center text-muted-foreground text-sm">
						Don’t have an account?{" "}
						<Link className="font-medium underline" href="/register">
							Register
						</Link>
					</p>
				</CardContent>
			</Card>
		</div>
	);
}
