import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { auth } from "@/server/better-auth/config"
import PaymentsPageClient from "./PaymentsPageClient"

export default async function Page() {

 const session = await auth.api.getSession({
  headers: await headers(),
 })

 if (!session?.user) {
  redirect("/login")
 }

 return (
  <PaymentsPageClient
   userRole={session.user.role as "admin" | "employee" | "client"}
   name={session.user.name}
   email={session.user.email}
  />
 )
}

