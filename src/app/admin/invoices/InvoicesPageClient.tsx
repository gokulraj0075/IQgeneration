"use client"

import { useEffect,useState,useCallback } from "react"

import { AppSidebar } from "@/components/app-sidebar"

import {
 SidebarProvider,
 SidebarInset,
 SidebarTrigger
} from "@/components/ui/sidebar"

import {
 Breadcrumb,
 BreadcrumbItem,
 BreadcrumbLink,
 BreadcrumbList,
 BreadcrumbPage,
 BreadcrumbSeparator
} from "@/components/ui/breadcrumb"

import { Separator } from "@/components/ui/separator"

import {
 Card,
 CardContent,
 CardHeader,
 CardTitle
} from "@/components/ui/card"

import { Button } from "@/components/ui/button"

import { Input } from "@/components/ui/input"

import {
 Table,
 TableBody,
 TableCell,
 TableHead,
 TableHeader,
 TableRow
} from "@/components/ui/table"

import { Trash,Printer } from "lucide-react"


type Product={
 id:string
 name:string
 price:string
 taxRate:string
}

type Quotation={
 id:string
 quotationNumber:string
}

type Invoice={
 id:string
 invoiceNumber:string
 status:string
 total:number
}

type Item={
 id:string
 productId:string
 name:string
 price:number
 tax:number
 quantity:number
}

export default function InvoicesPageClient({
 userRole,
 name,
 email,
 userId
}:{
 userRole:"admin"|"employee"|"client"
 name:string
 email:string
 userId:string
}){

const [mode,setMode]=useState("standalone")

const [products,setProducts]=useState<Product[]>([])
const [quotations,setQuotations]=useState<Quotation[]>([])
const [invoices,setInvoices]=useState<Invoice[]>([])

const [quotationId,setQuotationId]=useState("")

const [customerName,setCustomerName]=useState("")
const [phone,setPhone]=useState("")

const [items,setItems]=useState<Item[]>([])

const [discount,setDiscount]=useState(0)

const loadInvoices=useCallback(async()=>{

 const res=await fetch("/api/invoices")
 const data=await res.json()
 setInvoices(data)

},[])

useEffect(()=>{

 fetch("/api/products")
 .then(r=>r.json())
 .then(setProducts)

 fetch("/api/quotations")
 .then(r=>r.json())
 .then(setQuotations)

 loadInvoices()

},[loadInvoices])

async function loadQuotation(qid:string){

 const res=await fetch(`/api/quotations/${qid}`)
 const data=await res.json()

 const mapped=data.items.map((i:any)=>({

  id:i.id,
  productId:i.productId,
  name:i.name,
  price:Number(i.price),
  tax:Number(i.tax),
  quantity:i.quantity

 }))

 setItems(mapped)

}

function addItem(){

 setItems(prev=>[
  ...prev,
  {
   id:`item-${prev.length}`,
   productId:"",
   name:"",
   price:0,
   tax:0,
   quantity:1
  }
 ])

}

function selectProduct(index:number,pid:string){

 const p=products.find(x=>x.id===pid)
 if(!p) return

 setItems(prev=>{

  const list=[...prev]
  if(!list[index]) return prev

  list[index]={
   ...list[index],
   productId:p.id,
   name:p.name,
   price:Number(p.price),
   tax:Number(p.taxRate)
  }

  return list

 })

}

function updateQty(index:number,val:string){

 const qty=parseInt(val||"0",10)

 setItems(prev=>{

  const list=[...prev]
  if(!list[index]) return prev

  list[index].quantity=qty
  return list

 })

}

function removeItem(index:number){

 setItems(prev=>prev.filter((_,i)=>i!==index))

}

const subtotal = items.reduce(
 (sum,item)=>sum + item.price * item.quantity,
0)

const tax = items.reduce(
 (sum,item)=>sum + (item.price * item.quantity * item.tax)/100,
0)

const total = subtotal + tax - discount

async function saveInvoice(){

 if(mode==="standalone" && !customerName){
  alert("Customer name required")
  return
 }

 await fetch("/api/invoices",{
  method:"POST",
  headers:{
   "Content-Type":"application/json"
  },
  body:JSON.stringify({
   customerName,
   phone,
   quotationId,
   userId,
   items,
   subtotal,
   tax,
   discount,
   total
  })
 })

 alert("Invoice created")

 setItems([])
 setCustomerName("")
 setPhone("")
 setDiscount(0)

 loadInvoices()

}

async function deleteInvoice(id:string){

 if(!confirm("Delete invoice?")) return

 await fetch(`/api/invoices/${id}`,{
  method:"DELETE"
 })

 loadInvoices()

}

async function printInvoice(invoice: Invoice) {


const res = await fetch(`/api/invoices/${invoice.id}`)
const data = await res.json()


const items = data.items


const date = new Date().toLocaleDateString("en-IN")


const subtotal = Number(data.invoice.subtotal ?? 0)
const tax = Number(data.invoice.tax ?? 0)
const discount = Number(data.invoice.discount ?? 0)
const total = Number(data.invoice.total ?? 0)


const customerName = data.invoice.customerName
const phone = data.invoice.phone


const itemsHTML = items.map((item:any)=>{


const subtotal = Number(item.price) * item.quantity
const taxAmount = subtotal * Number(item.tax) / 100
const total = subtotal + taxAmount


return `
<tr>
<td>${item.name}</td>
<td>${item.quantity}</td>
<td>₹ ${Number(item.price).toLocaleString()}</td>
<td>${item.tax}%</td>
<td>₹ ${total.toLocaleString()}</td>
</tr>
`


}).join("")




const win = window.open("", "", "width=900,height=700")
if(!win) return




win.document.write(`
<html>
<head>
<title>Invoice</title>


<style>


body{
font-family:Arial, sans-serif;
padding:40px;
color:#333;
}


.page{
width:210mm;
margin:auto;
}


.header{
display:flex;
justify-content:space-between;
border-bottom:2px solid #000;
padding-bottom:10px;
margin-bottom:20px;
}


.company{
font-size:26px;
font-weight:bold;
}


.meta{
text-align:right;
}


.section{
margin-bottom:20px;
}


.section-title{
font-size:12px;
font-weight:bold;
color:#666;
text-transform:uppercase;
margin-bottom:5px;
}


table{
width:100%;
border-collapse:collapse;
margin-top:20px;
}


th{
background:#f3f4f6;
padding:10px;
text-align:left;
border-bottom:2px solid #ccc;
}


td{
padding:10px;
border-bottom:1px solid #eee;
}


.text-right{
text-align:right;
}


.totals{
width:320px;
margin-left:auto;
margin-top:20px;
}


.row{
display:flex;
justify-content:space-between;
padding:6px 0;
}


.grand{
font-weight:bold;
font-size:18px;
border-top:2px solid #000;
padding-top:10px;
}


.footer{
margin-top:60px;
display:flex;
justify-content:space-between;
font-size:12px;
color:#666;
}


.signature{
text-align:right;
}


</style>


</head>


<body>


<div class="page">


<div class="header">


<div class="company">
InvoQuote
</div>


<div class="meta">
<div><strong>Invoice:</strong> ${invoice.invoiceNumber}</div>
<div><strong>Date:</strong> ${date}</div>
</div>


</div>




<div class="section">


<div class="section-title">Bill To</div>


<div><strong>${customerName || "Walk-in Customer"}</strong></div>
<div>${phone || ""}</div>


</div>




<table>


<thead>
<tr>
<th>Product</th>
<th class="text-right">Qty</th>
<th class="text-right">Price</th>
<th class="text-right">Tax</th>
<th class="text-right">Total</th>
</tr>
</thead>


<tbody>
${itemsHTML}
</tbody>


</table>




<div class="totals">


<div class="row">
<span>Subtotal</span>
<span>₹ ${subtotal.toLocaleString()}</span>
</div>


<div class="row">
<span>Tax</span>
<span>₹ ${tax.toLocaleString()}</span>
</div>


<div class="row">
<span>Discount</span>
<span>₹ ${discount.toLocaleString()}</span>
</div>


<div class="row grand">
<span>Grand Total</span>
<span>₹ ${total.toLocaleString()}</span>
</div>


</div>




<div class="footer">


<div>
This is a computer generated invoice.
</div>


<div class="signature">
<br><br>
Authorized Signature
</div>


</div>


</div>




<script>
window.onload = () => {
window.print()
window.close()
}
</script>


</body>
</html>
`)


win.document.close()


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
Invoices
</BreadcrumbPage>
</BreadcrumbItem>

</BreadcrumbList>

</Breadcrumb>

</div>

</header>

<div className="p-6 space-y-6">

<Card>

<CardHeader>
<CardTitle>Create Invoice</CardTitle>
</CardHeader>

<CardContent className="space-y-4">

<select
value={mode}
onChange={(e)=>setMode(e.target.value)}
className="border rounded px-3 py-2"
>
<option value="standalone">Standalone</option>
<option value="quotation">From Quotation</option>
</select>

{mode==="quotation" && (

<select
value={quotationId}
onChange={(e)=>{
 setQuotationId(e.target.value)
 loadQuotation(e.target.value)
}}
className="border rounded px-3 py-2"
>

<option value="">Select quotation</option>

{quotations.map(q=>(
<option key={q.id} value={q.id}>
{q.quotationNumber}
</option>
))}

</select>

)}

{mode==="standalone" && (

<div className="grid grid-cols-2 gap-4">

<Input
placeholder="Customer Name"
value={customerName}
onChange={(e)=>setCustomerName(e.target.value)}
/>

<Input
placeholder="Phone"
value={phone}
onChange={(e)=>setPhone(e.target.value)}
/>

</div>

)}

<Button onClick={addItem}>
Add Product
</Button>

<Table>

<TableHeader>
<TableRow>
<TableHead>Product</TableHead>
<TableHead>Qty</TableHead>
<TableHead>Price</TableHead>
<TableHead>Total</TableHead>
<TableHead></TableHead>
</TableRow>
</TableHeader>

<TableBody>

{items.map((item,index)=>{

const line =
 item.price*item.quantity +
 (item.price*item.quantity*item.tax)/100

return(

<TableRow key={item.id}>

<TableCell>

<select
value={item.productId}
onChange={(e)=>selectProduct(index,e.target.value)}
className="border rounded px-2 py-1"
>

<option value="">Select</option>

{products.map(p=>(
<option key={p.id} value={p.id}>
{p.name}
</option>
))}

</select>

</TableCell>

<TableCell>

<Input
type="number"
value={item.quantity}
onChange={(e)=>updateQty(index,e.target.value)}
className="w-20"
/>

</TableCell>

<TableCell>
₹{item.price}
</TableCell>

<TableCell>
₹{line.toFixed(2)}
</TableCell>

<TableCell>

<Button
variant="ghost"
size="icon"
onClick={()=>removeItem(index)}
>
<Trash size={16}/>
</Button>

</TableCell>

</TableRow>

)

})}

</TableBody>

</Table>

<div className="flex items-center gap-3">

<span>Discount</span>

<Input
type="number"
value={discount}
onChange={(e)=>setDiscount(Number(e.target.value))}
className="w-32"
/>

</div>

<div className="pt-4 border-t mt-4 flex flex-col items-end space-y-2">


  <div className="w-60 flex justify-between">
    <span>Subtotal</span>
    <span>₹ {subtotal.toLocaleString()}</span>
  </div>


  <div className="w-60 flex justify-between">
    <span>Tax</span>
    <span>₹ {tax.toLocaleString()}</span>
  </div>


  <div className="w-60 flex justify-between font-bold text-lg">
    <span>Total</span>
    <span>₹ {total.toLocaleString()}</span>
  </div>


</div>



<Button onClick={saveInvoice}>
Save Invoice
</Button>

</CardContent>

</Card>

<Card>

<CardHeader>
<CardTitle>Invoices</CardTitle>
</CardHeader>

<CardContent>

<Table>

<TableHeader>

<TableRow>
<TableHead>Invoice</TableHead>
<TableHead>Status</TableHead>
<TableHead>Total</TableHead>
<TableHead className="text-right">
Actions
</TableHead>
</TableRow>

</TableHeader>

<TableBody>

{invoices.map(inv=>(

<TableRow key={inv.id}>

<TableCell>{inv.invoiceNumber}</TableCell>

<TableCell>
<span className={
inv.status==="paid"
? "text-green-600 font-semibold"
: "text-orange-500 font-semibold"
}>
{inv.status}
</span>
</TableCell>

<TableCell>
₹{inv.total}
</TableCell>

<TableCell className="text-right space-x-2">

<Button
variant="ghost"
size="icon"
onClick={()=>printInvoice(inv)}
>
<Printer size={18}/>
</Button>

<Button
variant="ghost"
size="icon"
onClick={()=>deleteInvoice(inv.id)}
>
<Trash size={18}/>
</Button>

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
