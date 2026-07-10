"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, UserPlus, Mail, Shield, Trash2, Eye, MoreVertical } from "lucide-react";

const users = [
  { id: "k1fNG2x8nIP6gNcQ53yc6woWolv2", name: "Shoaib Akhtar", email: "fiaz.ahmad1427@gmail.com", role: "owner", status: "active", joined: "Jan 2024", lastActive: "Just now" },
  { id: "user_2", name: "John Smith", email: "john@example.com", role: "admin", status: "active", joined: "Feb 2024", lastActive: "2 hours ago" },
  { id: "user_3", name: "Sarah Johnson", email: "sarah@example.com", role: "manager", status: "active", joined: "Mar 2024", lastActive: "5 hours ago" },
  { id: "user_4", name: "Mike Wilson", email: "mike@example.com", role: "member", status: "pending", joined: "Apr 2024", lastActive: "1 day ago" },
  { id: "user_5", name: "Emily Davis", email: "emily@example.com", role: "member", status: "active", joined: "May 2024", lastActive: "2 days ago" },
  { id: "user_6", name: "Chris Brown", email: "chris@example.com", role: "member", status: "suspended", joined: "Jun 2024", lastActive: "5 days ago" },
];

export default function AdminUsersPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">User Management</h1>
          <p className="text-muted-foreground">Manage all registered users</p>
        </div>
        <Button className="gap-2"><UserPlus className="h-4 w-4" />Add User</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm">Total Users</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{users.length}</div></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm">Active</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold text-green-600">{users.filter(u => u.status === "active").length}</div></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm">Pending</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold text-yellow-600">{users.filter(u => u.status === "pending").length}</div></CardContent></Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>All Users ({filteredUsers.length})</CardTitle>
              <CardDescription>Manage user accounts and permissions</CardDescription>
            </div>
            <div className="relative w-72">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search users..." className="pl-9" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredUsers.map((user) => (
              <div key={user.id} className="flex items-center justify-between rounded-lg border p-4 transition hover:bg-muted/50">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold">
                    {user.name.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{user.name}</p>
                      <Badge variant={user.role === "owner" ? "default" : user.role === "admin" ? "secondary" : "outline"}>{user.role}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                    <p className="text-xs text-muted-foreground">ID: {user.id.substring(0, 20)}...</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <Badge variant={user.status === "active" ? "default" : user.status === "pending" ? "secondary" : "destructive"}>{user.status}</Badge>
                    <p className="mt-1 text-xs text-muted-foreground">{user.lastActive}</p>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon"><Eye className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon"><Mail className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon"><Shield className="h-4 w-4" /></Button>
                    {user.role !== "owner" && (
                      <Button variant="ghost" size="icon"><Trash2 className="h-4 w-4 text-destructive" /></Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}