import { desc, eq } from "drizzle-orm"
import { NextResponse } from "next/server"
import { db } from "@/server/db"

import {
 invoices,
 invoiceItems,
 quotations,
 clients
} from "@/server/db/schema"

/* ---------------- GET ALL INVOICES ---------------- */

export async function GET() {

 const data = await db
  .select()
  .from(invoices)
  .orderBy(desc(invoices.id))

 return NextResponse.json(data)

}


/* ---------------- CREATE INVOICE ---------------- */

export async function POST(req: Request) {

 const body = await req.json()

 const {
  customerName,
  phone,
  quotationId,
  userId,
  items,
  subtotal,
  tax,
  discount,
  total
 } = body


 await db.transaction(async (tx) => {

  /* ---------- Generate Invoice ID ---------- */

  const last = await tx
   .select()
   .from(invoices)
   .orderBy(desc(invoices.id))
   .limit(1)

  let id = "INV-0001"
  let invoiceNumber = "INV-0001"

  if (last.length > 0) {

   const lastId = last[0]?.id ?? "INV-0000"
   const number = lastId.split("-")[1] ?? "0"
   const next = parseInt(number, 10) + 1

   id = `INV-${String(next).padStart(4, "0")}`
   invoiceNumber = id
  }


  /* ---------- Get clientId if invoice from quotation ---------- */

  let clientId: string | null = null
let finalCustomerName: string | null = customerName ?? null
let finalPhone: string | null = phone ?? null
if (quotationId) {
 const q = await tx
  .select({
    clientId: quotations.clientId
  })
  .from(quotations)
  .where(eq(quotations.id, quotationId))
  .limit(1)
 if (q.length > 0) {
  clientId = q[0]?.clientId ?? null
  if(clientId){
    const client = await tx
   .select()
   .from(clients)
   .where(eq(clients.id, clientId))
   .limit(1)
   if (client.length > 0) {
   finalCustomerName = client[0]?.name ?? null
   finalPhone = client[0]?.phone ?? null
  }
  
  
  }
 }
}

  /* ---------- Insert Invoice ---------- */

  await tx.insert(invoices).values({
   id,
   invoiceNumber,
   quotationId: quotationId || null,
   clientId,
   customerName: finalCustomerName || null,
   phone: finalPhone ,
   userId,
   subtotal: String(subtotal ?? 0),
   tax: String(tax ?? 0),
   discount: String(discount ?? 0),
   total: String(total ?? 0)
  })


  /* ---------- Generate Item Counter ---------- */

  const lastItem = await tx
   .select()
   .from(invoiceItems)
   .orderBy(desc(invoiceItems.id))
   .limit(1)

  let counter = 1

  if (lastItem.length > 0) {

   const lastId = lastItem[0]?.id ?? "ITEM-0000"
   const number = lastId.split("-")[1] ?? "0"
   counter = parseInt(number, 10) + 1
  }


  /* ---------- Insert Invoice Items ---------- */

  for (const item of items || []) {

   if (!item.productId) continue

   const itemId = `ITEM-${String(counter).padStart(4, "0")}`

   const lineTotal =
    item.price * item.quantity +
    (item.price * item.quantity * item.tax) / 100

   await tx.insert(invoiceItems).values({
    id: itemId,
    invoiceId: id,
    productId: item.productId,
    quantity: item.quantity,
    price: String(item.price),
    tax: item.tax !== undefined ? String(item.tax) : null,
    total: String(lineTotal)
   })

   counter++
  }

 })

 return NextResponse.json({
  message: "Invoice created successfully"
 })

}
