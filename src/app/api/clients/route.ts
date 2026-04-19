import { desc, eq } from "drizzle-orm"
import { NextResponse } from "next/server"
import { headers } from "next/headers"
import { db } from "@/server/db"
import { clients } from "@/server/db/schema"
import { auth } from "@/server/better-auth/config"


/* ---------------- GET ALL CLIENTS ---------------- */


export async function GET() {

  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const userId = session.user.id
  const role = session.user.role

  let data

  if (role === "admin") {
    // Admin → all clients
    data = await db
      .select()
      .from(clients)
      .orderBy(desc(clients.id))
  } else {
    // Employee → only their clients
    data = await db
      .select()
      .from(clients)
      .where(eq(clients.userId, userId))
      .orderBy(desc(clients.id))
  }

  return NextResponse.json({
    clients: data,
  })
}


/* ---------------- CREATE CLIENT ---------------- */


export async function POST(req: Request) {


  const session = await auth.api.getSession({
    headers: await headers(),
  })


  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }


  const body = await req.json()


  const { name, email, phone, address } = body


  /* -------- prevent duplicate client -------- */


  const existing = await db
    .select()
    .from(clients)
    .where(eq(clients.email, email))


  if (existing.length > 0) {
    return NextResponse.json(
      { error: "Client already exists" },
      { status: 400 }
    )
  }


  /* -------- generate client id -------- */


  const last = await db
    .select()
    .from(clients)
    .orderBy(desc(clients.id))
    .limit(1)


  let id = "CL-0001"


  if (last.length > 0) {


    const lastId = last[0]?.id ?? "CL-0000"


    const number = lastId.split("-")[1] ?? "0"


    const next = parseInt(number, 10) + 1


    id = `CL-${String(next).padStart(4, "0")}`


  }


  /* -------- insert client -------- */


  await db.insert(clients).values({
    id,
    name,
    email,
    phone,
    address,
    userId: session.user.id
  })


  return NextResponse.json({
    message: "Client created successfully"
  })


}

