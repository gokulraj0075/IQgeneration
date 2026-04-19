import { eq } from "drizzle-orm"
import { NextResponse } from "next/server"
import { headers } from "next/headers"
import { db } from "@/server/db"
import { clients } from "@/server/db/schema"
import { auth } from "@/server/better-auth/config"

/* ---------------- GET SINGLE CLIENT ---------------- */

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {

  const { id } = await params

  const result = await db
    .select()
    .from(clients)
    .where(eq(clients.id, id))

  return NextResponse.json(result[0])

}

/* ---------------- UPDATE CLIENT ---------------- */

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {

  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params

  const body = await req.json()

  const { name, email, phone, address } = body

  const existing = await db
    .select()
    .from(clients)
    .where(eq(clients.email, email))

  const found = existing[0]

  if (found && found.id !== id) {
    return NextResponse.json(
      { error: "Client already exists" },
      { status: 400 }
    )
  }

  await db
    .update(clients)
    .set({
      name,
      email,
      phone,
      address,
    })
    .where(eq(clients.id, id))

  return NextResponse.json({
    message: "Client updated successfully"
  })

}

/* ---------------- DELETE CLIENT ---------------- */

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {

  const { id } = await params

  await db
    .delete(clients)
    .where(eq(clients.id, id))

  return NextResponse.json({
    message: "Client deleted successfully"
  })

}
