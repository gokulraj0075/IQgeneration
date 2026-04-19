"use client"

import { useEffect, useState, useCallback } from "react"

import { AppSidebar } from "@/components/app-sidebar"

import {
 SidebarProvider,
 SidebarInset,
 SidebarTrigger
} from "@/components/ui/sidebar"

import {
 Breadcrumb,
 BreadcrumbList,
 BreadcrumbItem,
 BreadcrumbLink,
 BreadcrumbSeparator,
 BreadcrumbPage
} from "@/components/ui/breadcrumb"

import { Separator } from "@/components/ui/separator"

import {
 Card,
 CardHeader,
 CardTitle,
 CardContent
} from "@/components/ui/card"

import { Button } from "@/components/ui/button"

import { Input } from "@/components/ui/input"

import {
 Table,
 TableHeader,
 TableHead,
 TableRow,
 TableBody,
 TableCell
} from "@/components/ui/table"



type Invoice = {
 id:string
 invoiceNumber:string
 total:number
 status:string
}

type Payment = {
 id:string
 invoiceId:string
 amount:string
 paymentMode:string
 reference:string
 paidAt:string
}



export default function PaymentsPageClient({
 userRole,
 name,
 email
}:{
 userRole:"admin"|"employee"|"client"
 name:string
 email:string
}){


const [invoices,setInvoices]=useState<Invoice[]>([])
const [payments,setPayments]=useState<Payment[]>([])

const [invoiceId,setInvoiceId]=useState("")
const [amount,setAmount]=useState("")
const [paymentMode,setPaymentMode]=useState("UPI")
const [reference,setReference]=useState("")



/* LOAD DATA */

const loadData = useCallback(async()=>{

 const invRes = await fetch("/api/invoices")
 const invData = await invRes.json()

 const payRes = await fetch("/api/payments")
 const payData = await payRes.json()

 setInvoices(invData)
 setPayments(payData)

},[])



useEffect(()=>{
 loadData()
},[loadData])



/* SAVE PAYMENT */

async function savePayment(){

 if(!invoiceId){
  alert("Select invoice")
  return
 }

 if(!amount){
  alert("Enter amount")
  return
 }

 await fetch("/api/payments",{
  method:"POST",
  headers:{
   "Content-Type":"application/json"
  },
  body:JSON.stringify({
   invoiceId,
   amount,
   paymentMode,
   reference
  })
 })

 alert("Payment recorded")

 setInvoiceId("")
 setAmount("")
 setReference("")

 loadData()

}



return(

<SidebarProvider>

<AppSidebar role={userRole} user={{name,email}}/>

<SidebarInset>

<header className="flex h-16 items-center gap-2">

<div className="flex items-center gap-2 px-4">

<SidebarTrigger/>

<Separator orientation="vertical" className="h-4"/>

<Breadcrumb>

<BreadcrumbList>

<BreadcrumbItem>
<BreadcrumbLink href="/admin">
Admin
</BreadcrumbLink>
</BreadcrumbItem>

<BreadcrumbSeparator/>

<BreadcrumbItem>
<BreadcrumbPage>
Payments
</BreadcrumbPage>
</BreadcrumbItem>

</BreadcrumbList>

</Breadcrumb>

</div>

</header>



<div className="p-6 space-y-6">


{/* PAYMENT FORM */}

<Card>

<CardHeader>
<CardTitle>Record Payment</CardTitle>
</CardHeader>

<CardContent className="space-y-4">


<select
value={invoiceId}
onChange={(e)=>setInvoiceId(e.target.value)}
className="border rounded px-3 py-2 w-64"
>

<option value="">Select Invoice</option>

{invoices
.filter(i=>i.status!=="paid")
.map(inv=>(

<option key={inv.id} value={inv.id}>
{inv.invoiceNumber} — ₹{Number(inv.total).toLocaleString()}
</option>

))}

</select>



<Input
placeholder="Amount"
value={amount}
onChange={(e)=>setAmount(e.target.value)}
/>



<select
value={paymentMode}
onChange={(e)=>setPaymentMode(e.target.value)}
className="border rounded px-3 py-2 w-64"
>

<option>UPI</option>
<option>Cash</option>
<option>Bank Transfer</option>
<option>Card</option>

</select>



<Input
placeholder="Reference (optional)"
value={reference}
onChange={(e)=>setReference(e.target.value)}
/>



<Button onClick={savePayment}>
Record Payment
</Button>

</CardContent>

</Card>



{/* PAYMENT HISTORY */}

<Card>

<CardHeader>
<CardTitle>Payments</CardTitle>
</CardHeader>

<CardContent>

<Table>

<TableHeader>

<TableRow>

<TableHead>Payment</TableHead>
<TableHead>Invoice</TableHead>
<TableHead>Amount</TableHead>
<TableHead>Mode</TableHead>
<TableHead>Date</TableHead>

</TableRow>

</TableHeader>



<TableBody>

{payments.map(p=>(

<TableRow key={p.id}>

<TableCell>{p.id}</TableCell>

<TableCell>{p.invoiceId}</TableCell>

<TableCell>
₹{Number(p.amount).toLocaleString()}
</TableCell>

<TableCell>{p.paymentMode}</TableCell>

<TableCell>
{new Date(p.paidAt).toLocaleDateString()}
</TableCell>

</TableRow>

))}

</TableBody>

</Table>

</CardContent>

</Card>

</div>

</SidebarInset>

</SidebarProvider>

)

}

