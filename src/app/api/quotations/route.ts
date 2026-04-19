import { desc } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "@/server/db";
import { quotationItems, quotations } from "@/server/db/schema";

export async function GET() {
	const data=await db
	.select()
	.from(quotations)
	.orderBy(desc(quotations.id))

	return NextResponse.json(data);
}

export async function POST(req: Request) {
	const body = await req.json();

	const { clientId, userId, items, subtotal, tax, discount, total } = body;

	const last = await db
		.select()
		.from(quotations)
		.orderBy(desc(quotations.id))
		.limit(1);

	let id = "QT-0001";
	let quotationNumber = "QTN-0001";

	if (last.length > 0) {
		const lastId = last[0]?.id ?? "QT-0000";

		const number = lastId.split("-")[1] ?? "0";

		const next = parseInt(number, 10) + 1;

		id = `QT-${String(next).padStart(4, "0")}`;
		quotationNumber = `QTN-${String(next).padStart(4, "0")}`;
	}

	await db.insert(quotations).values({
		id,
		quotationNumber,
		clientId,
		userId,
		subtotal,
		tax,
		discount,
		total,
	});

	for (const item of items) {
		await db.insert(quotationItems).values({
			id: crypto.randomUUID(),
			quotationId: id,
			productId: item.productId,
			quantity: item.quantity,
			price: item.price,
			tax: item.tax,
			total: item.total,
		});
	}

	return NextResponse.json({
		message: "Quotation created successfully",
	});
}
