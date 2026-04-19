import { eq } from "drizzle-orm"
import { NextResponse } from "next/server"
import { db } from "@/server/db"
import { headers } from "next/headers"
import {auth} from "@/server/better-auth/config"

import {
 invoices,
 invoiceItems,
 products
} from "@/server/db/schema"

/* ---------------- GET SINGLE INVOICE ---------------- */

export async function GET(
 req:Request,
 context:{params:Promise<{id:string}>}
){

 const { id } = await context.params

 const invoice = await db
  .select()
  .from(invoices)
  .where(eq(invoices.id,id))
  .limit(1)

 const items = await db
  .select({
   id:invoiceItems.id,
   productId:invoiceItems.productId,
   quantity:invoiceItems.quantity,
   price:invoiceItems.price,
   tax:invoiceItems.tax,
   total:invoiceItems.total,
   name:products.name
  })
  .from(invoiceItems)
  .leftJoin(products,eq(products.id,invoiceItems.productId))
  .where(eq(invoiceItems.invoiceId,id))

 return NextResponse.json({
  invoice:invoice[0],
  items
 })

}

/* ---------------- DELETE ---------------- */

export async function DELETE(
 req:Request,
 context:{params:Promise<{id:string}>}
){

    const session =await auth.api.getSession({headers:await headers(),})
    if(!session?.user){
        return NextResponse.json({error:"Unauthorized"},{status:401})
    }


 const { id } = await context.params
 const inv =await db
 .select()
 .from(invoices)
 .where(eq(invoices.id,id))
 .limit(1)

 if(!inv[0]){
    return NextResponse.json({error:"Invoice not found"},{status:404})
 }

 if(
    session.user.role === "employee" &&
    inv[0].userId !== session.user.id
 ){
    return NextResponse.json( {error:"Not allowed to delete thiis invoice"}, {status:403})
 }

 await db.delete(invoiceItems)
  .where(eq(invoiceItems.invoiceId,id))

 await db.delete(invoices)
  .where(eq(invoices.id,id))

 return NextResponse.json({
  message:"Invoice deleted"
 })

}
