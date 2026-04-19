"use client"

import { useCallback, useEffect, useState } from "react"
import { Eye, Printer, Trash2, Plus } from "lucide-react"

import { AppSidebar } from "@/components/app-sidebar"
import {
SidebarInset,
SidebarProvider,
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

import { Button } from "@/components/ui/button"

import {
Card,
CardContent,
CardHeader,
CardTitle,
CardDescription
} from "@/components/ui/card"

import {
Table,
TableBody,
TableCell,
TableHead,
TableHeader,
TableRow
} from "@/components/ui/table"

import { Input } from "@/components/ui/input"

import {
Popover,
PopoverTrigger,
PopoverContent
} from "@/components/ui/popover"

import {
Command,
CommandEmpty,
CommandGroup,
CommandInput,
CommandItem,
CommandList
} from "@/components/ui/command"

import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"

/* ---------------- TYPES ---------------- */

type Client = {
id:string
name:string
}

type Product = {
id:string
name:string
price:string
taxRate:string
}

type Item = {
id:string
productId:string
name:string
price:number
tax:number
quantity:number
}

type SavedQuotation = {
id:string
quotationNumber:string
clientId:string
total:number
subtotal:number
tax:number
userId:string
}


/* ---------------- COMPONENT ---------------- */

export default function QuotationsPageClient({
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

const [clients,setClients] = useState<Client[]>([])
const [products,setProducts] = useState<Product[]>([])
const [items,setItems] = useState<Item[]>([])
const [clientId,setClientId] = useState("")
const [saved,setSaved] = useState<SavedQuotation[]>([])

// FIX: Hydration Error by initializing ID in useEffect
const [quotationNumber, setQuotationNumber] = useState("")

useEffect(() => {
    setQuotationNumber(`QT-${Date.now().toString().slice(-6)}`)
}, [])


/* ---------------- LOAD DATA ---------------- */

const loadData = useCallback(async()=>{

const cRes = await fetch("/api/clients")
const cData = await cRes.json()
const p = await fetch("/api/products").then(r=>r.json())
const q = await fetch("/api/quotations").then(r=>r.json())

setClients(cData.clients)
setProducts(p)
setSaved(q)

},[])

useEffect(()=>{
loadData()
},[loadData])


/* ---------------- ITEMS ---------------- */

function addItem(){
setItems(prev=>[
...prev,
{
id:`item-${prev.length+1}-${Math.random()}`,
productId:"",
name:"",
price:0,
tax:0,
quantity:1
}
])
}

function updateProduct(i:number,pid:string){

const p = products.find(x=>x.id===pid)
if(!p) return

setItems(prev=>{
const list=[...prev]
if(!list[i]) return prev

list[i]={
...list[i],
productId:p.id,
name:p.name,
price:Number(p.price),
tax:Number(p.taxRate)
}

return list
})
}

function updateQty(i:number,val:string){
const q=parseInt(val || "0")
setItems(prev=>{
const list=[...prev]
if(!list[i]) return prev
list[i].quantity=q
return list
})
}

function removeItem(i:number){
setItems(prev=>prev.filter((_,idx)=>idx!==i))
}


/* ---------------- TOTALS ---------------- */

const subtotal = items.reduce((s,i)=>s+i.price*i.quantity,0)
const tax = items.reduce((s,i)=>s+(i.price*i.quantity*i.tax)/100,0)
const total = subtotal + tax


/* ---------------- SAVE ---------------- */

async function saveQuotation(){

if(!clientId) return alert("Select client")
if(items.length===0) return alert("Add product")

await fetch("/api/quotations",{
method:"POST",
headers:{ "Content-Type":"application/json"},
body:JSON.stringify({
quotationNumber,
clientId,
userId,
subtotal,
tax,
discount:0,
total,
items
})
})

alert("Quotation saved")
setItems([])
setClientId("")
loadData()
}


/* ---------------- DELETE ---------------- */

async function deleteQuotation(id:string){
if(!confirm("Are you sure?")) return
await fetch(`/api/quotations/${id}`,{method:"DELETE"})
loadData()
}


/* ---------------- VIEW ---------------- */

async function viewQuotation(id:string){
const res = await fetch(`/api/quotations/${id}`)
const data = await res.json()

// FIX: Ensure items are mapped correctly from API response
if(data.quotation && data.items) {
    setClientId(data.quotation.clientId)
    setItems(data.items)
    window.scrollTo({ top: 0, behavior: 'smooth' })
}
}


/* ---------------- PRINT ---------------- */

async function printQuotation(q: SavedQuotation) {

const clientName =
clients.find(c => c.id === q.clientId)?.name ?? "N/A"

const date = new Date().toLocaleDateString("en-IN")

/* fetch quotation items */

const res = await fetch(`/api/quotations/${q.id}`)
const data = await res.json()

const printItems = data.items || []

const printWindow = window.open("", "_blank")

if (!printWindow) return

printWindow.document.write(`

<html>

<head>

<title>Quotation ${q.quotationNumber}</title>

<style>

body{
font-family:sans-serif;
padding:40px;
color:#333;
}

.header{
display:flex;
justify-content:space-between;
border-bottom:2px solid #000;
padding-bottom:10px;
margin-bottom:30px;
}

.title{
font-size:28px;
font-weight:bold;
color:#1a365d;
}

.meta{
text-align:right;
}

.section{
margin-bottom:25px;
}

.section-label{
font-size:12px;
font-weight:bold;
color:#666;
text-transform:uppercase;
margin-bottom:5px;
}

table{
width:100%;
border-collapse:collapse;
margin-top:10px;
}

th{
background:#f1f5f9;
text-align:left;
padding:12px;
border-bottom:2px solid #cbd5e1;
}

td{
padding:12px;
border-bottom:1px solid #e2e8f0;
}

.text-right{
text-align:right;
}

.totals-container{
margin-top:30px;
display:flex;
justify-content:flex-end;
}

.totals-table{
width:300px;
}

.totals-table td{
padding:8px 0;
border:none;
}

.grand-total{
font-size:18px;
font-weight:bold;
border-top:2px solid #000 !important;
padding-top:12px !important;
}

</style>

</head>

<body>

<div class="header">

<div class="title">InvoQuote</div>

<div class="meta">

<div style="font-size:20px;font-weight:bold;">QUOTATION</div>

<div># ${q.quotationNumber}</div>

<div>Date: ${date}</div>

</div>

</div>

<div class="section">

<div class="section-label">Bill To:</div>

<div style="font-size:16px;font-weight:bold;">
${clientName}
</div>

</div>

<table>

<thead>

<tr>

<th>Product Description</th>

<th class="text-right">Qty</th>

<th class="text-right">Unit Price</th>

<th class="text-right">Tax (%)</th>

<th class="text-right">Total</th>

</tr>

</thead>

<tbody>

${printItems.map((item: Item) => {

const total =
item.price * item.quantity +
(item.price * item.quantity * item.tax / 100)

return `

<tr>

<td>${item.name}</td>

<td class="text-right">${item.quantity}</td>

<td class="text-right">₹${Number(item.price).toLocaleString()}</td>

<td class="text-right">${item.tax}%</td>

<td class="text-right">₹${total.toLocaleString()}</td>

</tr>

`

}).join("")}

</tbody>

</table>

<div class="totals-container">

<table class="totals-table">

<tr>
<td>Subtotal</td>
<td class="text-right">₹${Number(q.subtotal).toLocaleString()}</td>
</tr>

<tr>
<td>Tax Amount</td>
<td class="text-right">₹${Number(q.tax).toLocaleString()}</td>
</tr>

<tr class="grand-total">
<td>Grand Total</td>
<td class="text-right">₹${Number(q.total).toLocaleString()}</td>
</tr>

</table>

</div>

<div style="margin-top:50px;font-size:12px;color:#666;text-align:center;">
This is a computer-generated quotation.
</div>

<script>
window.onload = () => { window.print(); window.close(); }
</script>

</body>

</html>

`)

printWindow.document.close()

}


/* ---------------- UI ---------------- */

return(
<SidebarProvider>
<AppSidebar role={userRole} user={{name,email}}/>
<SidebarInset>
<header className="flex h-16 items-center border-b px-6">
    <div className="flex items-center gap-2">
        <SidebarTrigger/>
        <Separator orientation="vertical" className="h-4"/>
        <Breadcrumb>
            <BreadcrumbList>
                <BreadcrumbItem><BreadcrumbPage>Employee</BreadcrumbPage></BreadcrumbItem>
                <BreadcrumbSeparator/>
                <BreadcrumbItem><BreadcrumbPage>Quotations</BreadcrumbPage></BreadcrumbItem>
            </BreadcrumbList>
        </Breadcrumb>
    </div>
</header>

<div className="p-8 max-w-7xl mx-auto w-full space-y-8">
    <Card className="shadow-md border-muted-foreground/10">
        <CardHeader className="flex flex-row items-center justify-between pb-6">
            <div>
                <CardTitle className="text-2xl font-bold">New Quotation</CardTitle>
                <CardDescription>Fill in details to generate an estimate.</CardDescription>
            </div>
            <Badge variant="secondary" className="font-mono">{quotationNumber || "Loading..."}</Badge>
        </CardHeader>

        <CardContent className="space-y-6">
            <div className="flex gap-4 items-center">
                <Popover>
                    <PopoverTrigger asChild>
                        <Button variant="outline" className="w-64 justify-start">
                            {clientId ? clients.find(c=>c.id===clientId)?.name : "Select Client"}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="p-0 w-64">
                        <Command>
                            <CommandInput placeholder="Search client..."/>
                            <CommandList>
                                <CommandEmpty>No client found.</CommandEmpty>
                                <CommandGroup>
                                    {clients.map(c=>(
                                        <CommandItem key={c.id} onSelect={()=>setClientId(c.id)}>{c.name}</CommandItem>
                                    ))}
                                </CommandGroup>
                            </CommandList>
                        </Command>
                    </PopoverContent>
                </Popover>
                <Button variant="secondary" onClick={addItem} className="gap-2"><Plus size={16}/> Add Item</Button>
            </div>

            <Table className="border rounded-lg overflow-hidden">
                <TableHeader className="bg-muted/50">
                    <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead className="w-24">Qty</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead className="text-right">Line Total</TableHead>
                        <TableHead className="w-12"/>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {items.map((it, i) => (
                        <TableRow key={it.id}>
                            <TableCell>
                                <select 
                                    className="w-full h-9 bg-transparent border rounded-md px-2 text-sm"
                                    value={it.productId} 
                                    onChange={(e)=>updateProduct(i, e.target.value)}
                                >
                                    <option value="">Choose product...</option>
                                    {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                                </select>
                            </TableCell>
                            <TableCell><Input type="number" value={it.quantity} onChange={(e)=>updateQty(i, e.target.value)} /></TableCell>
                            <TableCell>₹{it.price.toLocaleString()}</TableCell>
                            <TableCell className="text-right font-medium">
                                ₹{(it.price * it.quantity * (1 + it.tax/100)).toLocaleString()}
                            </TableCell>
                            <TableCell>
                                <Button variant="ghost" size="icon" onClick={()=>removeItem(i)}><Trash2 size={16} className="text-destructive"/></Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <div className="flex flex-col items-end pt-4 border-t gap-2">


  <div className="flex justify-between w-full max-w-xs">
    <span>Subtotal:</span>
    <span>₹ {subtotal.toLocaleString()}</span>
  </div>


  <div className="flex justify-between w-full max-w-xs">
    <span>Tax:</span>
    <span>₹ {tax.toLocaleString()}</span>
  </div>


  <div className="flex justify-between w-full max-w-xs text-xl font-bold text-primary">
    <span>Total:</span>
    <span>₹ {total.toLocaleString()}</span>
  </div>


  <Button
    onClick={saveQuotation}
    size="lg"
    className="mt-4 px-10"
  >
    Save Quotation
  </Button>


</div>


        </CardContent>
    </Card>

    <Card>
        <CardHeader><CardTitle>Quotation History</CardTitle></CardHeader>
        <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Ref No.</TableHead>
                        <TableHead>Client</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {saved.map(q => (
                        <TableRow key={q.id}>
                            <TableCell className="font-mono">{q.quotationNumber}</TableCell>
                            <TableCell>{clients.find(c=>c.id===q.clientId)?.name}</TableCell>
                            <TableCell className="font-semibold">₹{q.total.toLocaleString()}</TableCell>
                            <TableCell className="text-right space-x-2">
                                {/* <Button variant="outline" size="icon" onClick={()=>viewQuotation(q.id)}><Eye size={16}/></Button> */}
                                <Button variant="outline" size="icon" onClick={()=>printQuotation(q)}><Printer size={16}/></Button>
                                <Button variant="outline" size="icon" disabled={q.userId !== userId} onClick={()=>deleteQuotation(q.id)}><Trash2 size={16} className="text-destructive"/></Button>
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