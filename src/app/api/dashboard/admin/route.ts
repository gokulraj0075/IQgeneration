import { NextResponse } from "next/server"
import { db } from "@/server/db"

import {
 clients,
 products,
 quotations,
 invoices
} from "@/server/db/schema"

import { sql } from "drizzle-orm"


export async function GET(){

 const totalClients = await db.select({count:sql<number>`count(*)`}).from(clients)

 const totalProducts = await db.select({count:sql<number>`count(*)`}).from(products)

 const totalQuotations = await db.select({count:sql<number>`count(*)`}).from(quotations)

 const totalInvoices = await db.select({count:sql<number>`count(*)`}).from(invoices)

 const revenue = await db.select({
  sum:sql<number>`coalesce(sum(total),0)`
 }).from(invoices)

 const pending = await db.select({
  count:sql<number>`count(*)`
 }).from(invoices)
 .where(sql`status='pending'`)

 return NextResponse.json({

  clients: totalClients[0]?.count ?? 0,
  products: totalProducts[0]?.count ?? 0,
  quotations: totalQuotations[0]?.count ?? 0,
  invoices: totalInvoices[0]?.count ?? 0,
  revenue: revenue[0]?.sum ?? 0,
  pendingInvoices: pending[0]?.count ?? 0

 })

}
