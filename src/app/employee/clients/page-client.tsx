"use client";
import { useCallback, useEffect, useState } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";


/* added userId */
type Client = {
    id: string;
    name: string;
    email: string;
    phone?: string;
    address?: string;
    userId?: string;
};


export default function ClientsPageClient({
    userRole,
    name,
    email,
}: {
    userRole: "admin" | "employee" | "client";
    name: string;
    email: string;
}) {


    const [clients, setClients] = useState<Client[]>([]);
    const [currentUserId, setCurrentUserId] = useState("");


    const [open, setOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);


    const [form, setForm] = useState<Client>({
        id: "",
        name: "",
        email: "",
        phone: "",
        address: "",
    });


    const [editForm, setEditForm] = useState<Client>({
        id: "",
        name: "",
        email: "",
        phone: "",
        address: "",
    });


    const loadClients = useCallback(async () => {


        const res = await fetch("/api/clients");
        const data = await res.json();


        setClients(data.clients ?? data);


        /* store logged user id */
        if (data.userId) {
            setCurrentUserId(data.userId);
        }


    }, []);


    useEffect(() => {
        loadClients();
    }, [loadClients]);


    async function createClient() {


        const res = await fetch("/api/clients", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form),
        });


        const data = await res.json();


        if (!res.ok) {
            alert(data.error || "Failed to create client");
            return;
        }


        alert(data.message);


        setOpen(false);


        setForm({
            id: "",
            name: "",
            email: "",
            phone: "",
            address: "",
        });


        loadClients();
    }


    async function updateClient() {


        const res = await fetch(`/api/clients/${editForm.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(editForm),
        });


        const data = await res.json();


        if (!res.ok) {
            alert(data.error || "Failed to update client");
            return;
        }


        alert(data.message);


        setEditOpen(false);


        loadClients();
    }


    async function deleteClient(id: string) {


        const res = await fetch(`/api/clients/${id}`, {
            method: "DELETE",
        });


        const data = await res.json();


        alert(data.message);


        loadClients();
    }


    return (


        <SidebarProvider>


            <AppSidebar
                role={userRole}
                user={{ name, email }}
            />


            <SidebarInset>


                <header className="flex h-16 items-center gap-2">
                    <div className="flex items-center gap-2 px-4">


                        <SidebarTrigger className="-ml-1" />


                        <Separator className="mr-2 h-4" orientation="vertical" />


                        <Breadcrumb>
                            <BreadcrumbList>


                                <BreadcrumbItem>
                                    <BreadcrumbPage>Employee</BreadcrumbPage>
                                </BreadcrumbItem>


                                <BreadcrumbSeparator />


                                <BreadcrumbItem>
                                    <BreadcrumbPage>Clients</BreadcrumbPage>
                                </BreadcrumbItem>


                            </BreadcrumbList>
                        </Breadcrumb>


                    </div>
                </header>


                <div className="flex flex-1 flex-col gap-6 p-6">


                    <div className="flex items-center justify-between">


                        <h1 className="font-semibold text-2xl">Clients</h1>


                        <Dialog onOpenChange={setOpen} open={open}>
                            <DialogTrigger asChild>
                                <Button>Add Client</Button>
                            </DialogTrigger>


                            <DialogContent className="max-h-[90vh] overflow-y-auto">


                                <DialogHeader>
                                    <DialogTitle>Add Client</DialogTitle>
                                </DialogHeader>


                                <div className="space-y-3">


                                    <Input
                                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                                        placeholder="Name"
                                        value={form.name}
                                    />


                                    <Input
                                        onChange={(e) =>
                                            setForm({ ...form, email: e.target.value })
                                        }
                                        placeholder="Email"
                                        value={form.email}
                                    />


                                    <Input
                                        onChange={(e) =>
                                            setForm({ ...form, phone: e.target.value })
                                        }
                                        placeholder="Phone"
                                        value={form.phone}
                                    />


                                    <Input
                                        onChange={(e) =>
                                            setForm({ ...form, address: e.target.value })
                                        }
                                        placeholder="Address"
                                        value={form.address}
                                    />


                                    <Button className="w-full" onClick={createClient}>
                                        Save Client
                                    </Button>


                                </div>


                            </DialogContent>
                        </Dialog>


                    </div>


                    <Card>


                        <CardHeader>
                            <CardTitle>Client Directory</CardTitle>
                        </CardHeader>


                        <CardContent>


                            {clients.length === 0 ? (


                                <div className="py-10 text-center text-muted-foreground">
                                    No clients found. Add your first client.
                                </div>


                            ) : (


                                <Table>


                                    <TableHeader>


                                        <TableRow>


                                            <TableHead>Name</TableHead>
                                            <TableHead>Email</TableHead>
                                            <TableHead>Phone</TableHead>
                                            <TableHead>Address</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>


                                        </TableRow>


                                    </TableHeader>


                                    <TableBody>


                                        {clients.map((client) => {


                                            const canModify =
                                                userRole === "admin" ||
                                                client.userId === currentUserId;


                                            return (


                                                <TableRow key={client.id}>


                                                    <TableCell>{client.name}</TableCell>
                                                    <TableCell>{client.email}</TableCell>
                                                    <TableCell>{client.phone || "-"}</TableCell>
                                                    <TableCell>{client.address || "-"}</TableCell>


                                                    <TableCell className="space-x-2 text-right">


                                                        <Button
                                                            disabled={!canModify}
                                                            onClick={() => {
                                                                setEditForm(client);
                                                                setEditOpen(true);
                                                            }}
                                                            size="sm"
                                                            variant="secondary"
                                                        >
                                                            Edit
                                                        </Button>


                                                        <Button
                                                            disabled={!canModify}
                                                            onClick={() => deleteClient(client.id)}
                                                            size="sm"
                                                            variant="destructive"
                                                        >
                                                            Delete
                                                        </Button>


                                                    </TableCell>


                                                </TableRow>
                                            );


                                        })}


                                    </TableBody>


                                </Table>


                            )}


                        </CardContent>


                    </Card>


                </div>


                <Dialog onOpenChange={setEditOpen} open={editOpen}>


                    <DialogContent className="max-h-[90vh] overflow-y-auto">


                        <DialogHeader>
                            <DialogTitle>Edit Client</DialogTitle>
                        </DialogHeader>


                        <div className="space-y-3">


                            <Input
                                onChange={(e) =>
                                    setEditForm({ ...editForm, name: e.target.value })
                                }
                                value={editForm.name}
                            />


                            <Input
                                onChange={(e) =>
                                    setEditForm({ ...editForm, email: e.target.value })
                                }
                                value={editForm.email}
                            />


                            <Input
                                onChange={(e) =>
                                    setEditForm({ ...editForm, phone: e.target.value })
                                }
                                value={editForm.phone ?? ""}
                            />


                            <Input
                                onChange={(e) =>
                                    setEditForm({ ...editForm, address: e.target.value })
                                }
                                value={editForm.address ?? ""}
                            />


                            <Button className="w-full" onClick={updateClient}>
                                Update Client
                            </Button>


                        </div>


                    </DialogContent>


                </Dialog>


            </SidebarInset>


        </SidebarProvider>


    );
}

