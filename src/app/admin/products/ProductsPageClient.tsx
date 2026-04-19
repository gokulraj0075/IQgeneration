"use client";

import { useCallback, useEffect, useState } from "react";

import { AppSidebar } from "@/components/app-sidebar";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
	SidebarInset,
	SidebarProvider,
	SidebarTrigger,
} from "@/components/ui/sidebar";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

type Product = {
	id: string;
	name: string;
	description?: string;
	price: string;
	taxRate?: string;
	unit?: string;
};

export default function ProductsPageClient({
	userRole,
	name,
	email,
}: {
	userRole: "admin" | "employee" | "client";
	name: string;
	email: string;
}) {
	const [products, setProducts] = useState<Product[]>([]);
	const [open, setOpen] = useState(false);
	const [editOpen, setEditOpen] = useState(false);

	const [form, setForm] = useState<Product>({
		id: "",
		name: "",
		description: "",
		price: "",
		taxRate: "",
		unit: "",
	});

	const [editForm, setEditForm] = useState<Product>({
		id: "",
		name: "",
		description: "",
		price: "",
		taxRate: "",
		unit: "",
	});

	const loadProducts = useCallback(async () => {
		const res = await fetch("/api/products");
		const data = await res.json();
		setProducts(data);
	}, []);

	useEffect(() => {
		loadProducts();
	}, [loadProducts]);

	async function createProduct() {
		const res = await fetch("/api/products", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(form),
		});

		const data = await res.json();

		alert(data.message);

		setOpen(false);

		setForm({
			id: "",
			name: "",
			description: "",
			price: "",
			taxRate: "",
			unit: "",
		});

		loadProducts();
	}

	async function updateProduct() {
		const res = await fetch(`/api/products/${editForm.id}`, {
			method: "PUT",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(editForm),
		});

		const data = await res.json();

		alert(data.message);

		setEditOpen(false);

		loadProducts();
	}

	async function deleteProduct(id: string) {
		const res = await fetch(`/api/products/${id}`, {
			method: "DELETE",
		});

		const data = await res.json();

		alert(data.message);

		loadProducts();
	}

	return (
		<SidebarProvider>
			<AppSidebar role={userRole} user={{ name, email }} />

			<SidebarInset>
				<header className="flex h-16 items-center gap-2">
					<div className="flex items-center gap-2 px-4">
						<SidebarTrigger className="-ml-1" />

						<Separator className="mr-2 h-4" orientation="vertical" />

						<Breadcrumb>
							<BreadcrumbList>
								<BreadcrumbItem>
									<BreadcrumbLink href="/admin">Admin</BreadcrumbLink>
								</BreadcrumbItem>

								<BreadcrumbSeparator />

								<BreadcrumbItem>
									<BreadcrumbPage>Products</BreadcrumbPage>
								</BreadcrumbItem>
							</BreadcrumbList>
						</Breadcrumb>
					</div>
				</header>

				<div className="flex flex-1 flex-col gap-6 p-6">
					<div className="flex items-center justify-between">
						<h1 className="font-semibold text-2xl">Products</h1>

						<Dialog onOpenChange={setOpen} open={open}>
							<DialogTrigger asChild>
								<Button>Add Product</Button>
							</DialogTrigger>

							<DialogContent>
								<DialogHeader>
									<DialogTitle>Add Product</DialogTitle>
								</DialogHeader>

								<div className="space-y-3">
									<Input
										onChange={(e) => setForm({ ...form, name: e.target.value })}
										placeholder="Name"
										value={form.name}
									/>

									<Input
										onChange={(e) =>
											setForm({ ...form, description: e.target.value })
										}
										placeholder="Description"
										value={form.description}
									/>

									<Input
										onChange={(e) =>
											setForm({ ...form, price: e.target.value })
										}
										placeholder="Price"
										type="number"
										value={form.price}
									/>

									<Select
										onValueChange={(v) => setForm({ ...form, taxRate: v })}
									>
										<SelectTrigger>
											<SelectValue placeholder="Tax Rate" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="0">0%</SelectItem>
											<SelectItem value="5">5%</SelectItem>
											<SelectItem value="12">12%</SelectItem>
											<SelectItem value="18">18%</SelectItem>
											<SelectItem value="28">28%</SelectItem>
										</SelectContent>
									</Select>

									<Select onValueChange={(v) => setForm({ ...form, unit: v })}>
										<SelectTrigger>
											<SelectValue placeholder="Unit" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="piece">piece</SelectItem>
											<SelectItem value="hour">hour</SelectItem>
											<SelectItem value="service">service</SelectItem>
											<SelectItem value="license">license</SelectItem>
											<SelectItem value="month">month</SelectItem>
											<SelectItem value="year">year</SelectItem>
										</SelectContent>
									</Select>

									<Button className="w-full" onClick={createProduct}>
										Save Product
									</Button>
								</div>
							</DialogContent>
						</Dialog>
					</div>

					<Card>
						<CardHeader>
							<CardTitle>Product Catalog</CardTitle>
						</CardHeader>

						<CardContent>
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Name</TableHead>
										<TableHead>Price</TableHead>
										<TableHead>Tax</TableHead>
										<TableHead>Unit</TableHead>
										<TableHead className="text-right">Actions</TableHead>
									</TableRow>
								</TableHeader>

								<TableBody>
									{products.map((product) => (
										<TableRow key={product.id}>
											<TableCell>{product.name}</TableCell>
											<TableCell>{product.price}</TableCell>
											<TableCell>{product.taxRate}%</TableCell>
											<TableCell>{product.unit}</TableCell>

											<TableCell className="space-x-2 text-right">
												<Button
													onClick={() => {
														setEditForm(product);
														setEditOpen(true);
													}}
													size="sm"
													variant="secondary"
												>
													Edit
												</Button>

												<Button
													onClick={() => deleteProduct(product.id)}
													size="sm"
													variant="destructive"
												>
													Delete
												</Button>
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</CardContent>
					</Card>
				</div>

				<Dialog onOpenChange={setEditOpen} open={editOpen}>
					<DialogContent className="max-h-[90vh] overflow-y-auto">
						<DialogHeader>
							<DialogTitle>Edit Product</DialogTitle>
						</DialogHeader>

						<div className="space-y-3">
							<Input
								onChange={(e) =>
									setEditForm({ ...editForm, name: e.target.value })
								}
								value={editForm.name}
							/>

							<Input
								onChange={(e) =>
									setEditForm({ ...editForm, description: e.target.value })
								}
								value={editForm.description ?? ""}
							/>

							<Input
								onChange={(e) =>
									setEditForm({ ...editForm, price: e.target.value })
								}
								type="number"
								value={editForm.price}
							/>

							<Select
								onValueChange={(v) => setEditForm({ ...editForm, taxRate: v })}
								value={editForm.taxRate}
							>
								<SelectTrigger>
									<SelectValue placeholder="Tax Rate" />
								</SelectTrigger>

								<SelectContent>
									<SelectItem value="0">0%</SelectItem>
									<SelectItem value="5">5%</SelectItem>
									<SelectItem value="12">12%</SelectItem>
									<SelectItem value="18">18%</SelectItem>
									<SelectItem value="28">28%</SelectItem>
								</SelectContent>
							</Select>

							<Select
								onValueChange={(v) => setEditForm({ ...editForm, unit: v })}
								value={editForm.unit}
							>
								<SelectTrigger>
									<SelectValue placeholder="Unit" />
								</SelectTrigger>

								<SelectContent>
									<SelectItem value="piece">piece</SelectItem>
									<SelectItem value="hour">hour</SelectItem>
									<SelectItem value="service">service</SelectItem>
									<SelectItem value="license">license</SelectItem>
									<SelectItem value="month">month</SelectItem>
									<SelectItem value="year">year</SelectItem>
								</SelectContent>
							</Select>

							<Button className="w-full" onClick={updateProduct}>
								Update Product
							</Button>
						</div>
					</DialogContent>
				</Dialog>
			</SidebarInset>
		</SidebarProvider>
	);
}
