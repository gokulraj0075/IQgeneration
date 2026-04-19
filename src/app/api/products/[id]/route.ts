import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "@/server/db";
import { products } from "@/server/db/schema";

export async function PUT(
	req: Request,
	{ params }: { params: Promise<{ id: string }> },
) {
	const { id } = await params;

	const body = await req.json();
	const { name, description, price, taxRate, unit } = body;

	await db
		.update(products)
		.set({
			name,
			description,
			price,
			taxRate,
			unit,
		})
		.where(eq(products.id, id));

	return NextResponse.json({
		message: "Product updated successfully",
	});
}

export async function DELETE(
	_req: Request,
	{ params }: { params: Promise<{ id: string }> },
) {
	const { id } = await params;

	await db.delete(products).where(eq(products.id, id));

	return NextResponse.json({
		message: "Product deleted successfully",
	});
}
