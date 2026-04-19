import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { auth } from "@/server/better-auth/config"

import InvoicesPageClient from "./InvoicesPageClient"

export default async function Page(){

 const session = await auth.api.getSession({
  headers: await headers()
 })

 if(!session?.user){
  redirect("/login")
 }

 return(
  <InvoicesPageClient
   userRole={session.user.role as "admin"|"employee"|"client"}
   name={session.user.name}
   email={session.user.email}
   userId={session.user.id}
  />
 )

}
