import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "@/server/db";
import { quotations, quotationItems, products } from "@/server/db/schema";
import { headers } from "next/headers";
import { auth } from "@/server/better-auth/config";

/* GET SINGLE QUOTATION */

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {

  const { id } = params;

  const quotation = await db
    .select()
    .from(quotations)
    .where(eq(quotations.id, id))
    .limit(1);

  const items = await db
    .select({
      id: quotationItems.id,
      productId: quotationItems.productId,
      quantity: quotationItems.quantity,
      price: quotationItems.price,
      tax: quotationItems.tax,
      name: products.name
    })
    .from(quotationItems)
    .leftJoin(products, eq(products.id, quotationItems.productId))
    .where(eq(quotationItems.quotationId, id));

  return NextResponse.json({
    quotation: quotation[0],
    items
  });

}


/* DELETE QUOTATION */

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {

  const session =await auth.api.getSession({headers:await headers(),})
  if(!session?.user){
    return NextResponse.json({error:"Unauthorized"},{status:401})
  }

  const { id } = params;
  const q=await db
  .select()
  .from(quotations)
  .where(eq(quotations.id,id))
  .limit(1)

  if(!q[0]){
    return NextResponse.json({error:"Quotation not found"},{status:404})
  }

  if(session.user.role === "employee" && q[0].userId !== session.user.id){
    return NextResponse.json(
      {error:"Not allowed to delete this quotation"},
      {status:403}
    )
  }

  await db.delete(quotations).where(eq(quotations.id, id));

  return NextResponse.json({
    message: "Quotation deleted successfully"
  });

}
