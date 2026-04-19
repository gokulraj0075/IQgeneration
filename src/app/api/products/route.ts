import { desc, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "@/server/db";
import { products } from "@/server/db/schema";

export async function GET() {
	const data = await db.select().from(products);
	return NextResponse.json(data);
}

export async function POST(req: Request) {
	const body = await req.json();
	const { name, description, price, taxRate, unit } = body;

	const existing = await db
		.select()
		.from(products)
		.where(eq(products.name, name));

	/* UPDATE IF PRODUCT EXISTS */

	if (existing.length > 0) {
		await db
			.update(products)
			.set({
				description,
				price,
				taxRate,
				unit,
			})
			.where(eq(products.name, name));

		return NextResponse.json({
			message: "Product updated successfully",
		});
	}

	/* GENERATE PRODUCT ID */

	const last = await db
		.select()
		.from(products)
		.orderBy(desc(products.id))
		.limit(1);

	let id = "PR-0001";

	if (last.length > 0) {
		const lastId = last[0]?.id ?? "PR-0000";
		const number = lastId.split("-")[1] ?? "0";
		const next = parseInt(number, 10) + 1;
		id = `PR-${String(next).padStart(4, "0")}`;
	}

	await db.insert(products).values({
		id,
		name,
		description,
		price,
		taxRate,
		unit,
	});

	return NextResponse.json({
		message: "Product created successfully",
	});
}
