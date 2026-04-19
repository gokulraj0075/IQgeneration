"use client"

import { useEffect, useState } from "react"

import {
 Card,
 CardContent,
 CardHeader,
 CardTitle
} from "@/components/ui/card"



type DashboardData = {

 clients:number
 products:number
 quotations:number
 invoices:number
 revenue:number
 pendingInvoices:number

}



export default function AdminDashboard(){

 const [data,setData] = useState<DashboardData>({
  clients:0,
  products:0,
  quotations:0,
  invoices:0,
  revenue:0,
  pendingInvoices:0
 })


 useEffect(()=>{

  fetch("/api/dashboard/admin")
  .then(r=>r.json())
  .then(setData)

 },[])



 return(

 <div className="grid gap-6 md:grid-cols-3">


 <Card>
 <CardHeader>
 <CardTitle>Total Clients</CardTitle>
 </CardHeader>
 <CardContent className="text-3xl font-bold">
 {data.clients}
 </CardContent>
 </Card>



 <Card>
 <CardHeader>
 <CardTitle>Total Products</CardTitle>
 </CardHeader>
 <CardContent className="text-3xl font-bold">
 {data.products}
 </CardContent>
 </Card>



 <Card>
 <CardHeader>
 <CardTitle>Total Quotations</CardTitle>
 </CardHeader>
 <CardContent className="text-3xl font-bold">
 {data.quotations}
 </CardContent>
 </Card>



 <Card>
 <CardHeader>
 <CardTitle>Total Invoices</CardTitle>
 </CardHeader>
 <CardContent className="text-3xl font-bold">
 {data.invoices}
 </CardContent>
 </Card>



 <Card>
 <CardHeader>
 <CardTitle>Total Revenue</CardTitle>
 </CardHeader>
 <CardContent className="text-3xl font-bold">
 ₹{Number(data.revenue).toLocaleString()}
 </CardContent>
 </Card>



 <Card>
 <CardHeader>
 <CardTitle>Pending Invoices</CardTitle>
 </CardHeader>
 <CardContent className="text-3xl font-bold text-red-600">
 {data.pendingInvoices}
 </CardContent>
 </Card>


 </div>

 )

}
