import { desc, eq } from "drizzle-orm"
import { NextResponse } from "next/server"
import { db } from "@/server/db"
import { headers } from "next/headers"
import { auth } from "@/server/better-auth/config"

import {
 payments,
 invoices
} from "@/server/db/schema"




/* ---------------- GET PAYMENTS ---------------- */


export async function GET() {


 const data = await db
  .select()
  .from(payments)
  .orderBy(desc(payments.paidAt))


 return NextResponse.json(data)


}






/* ---------------- CREATE PAYMENT ---------------- */


export async function POST(req: Request) {

 const session = await auth.api.getSession({
  headers: await headers(),
 })

 if(!session?.user){
  return NextResponse.json(
   {error:"Unauthorized"},
   {status:401}
  )
 }

 const body = await req.json()

 const {
  invoiceId,
  amount,
  paymentMode,
  reference
 } = body

 await db.transaction(async (tx) => {

  const invoice = await tx
   .select()
   .from(invoices)
   .where(eq(invoices.id, invoiceId))
   .limit(1)

  if(!invoice[0]){
   throw new Error("Invoice not found")
  }

  /* employee cannot pay admin invoice */

  if(
   session.user.role==="employee" &&
   invoice[0].userId!==session.user.id
  ){
   throw new Error("Not allowed")
  }

  /* Generate Payment ID */

  const last = await tx
   .select()
   .from(payments)
   .orderBy(desc(payments.id))
   .limit(1)

  let id="PAY-0001"

  if(last.length>0){
   const lastId=last[0]?.id ?? "PAY-0000"
   const number=lastId.split("-")[1] ?? "0"
   const next=parseInt(number)+1
   id=`PAY-${String(next).padStart(4,"0")}`
  }

  await tx.insert(payments).values({
   id,
   invoiceId,
   amount:String(amount),
   paymentMode,
   reference
  })

  await tx
   .update(invoices)
   .set({status:"paid"})
   .where(eq(invoices.id, invoiceId))

 })

 return NextResponse.json({
  message:"Payment recorded"
 })
}


