"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, Package, Truck, CheckCircle, XCircle, Clock, Eye } from "lucide-react";

const orders = [
  { id: "AMZ-1001", customer: "John Smith", items: 3, total: 89.97, marketplace: "amazon", status: "shipped", date: "2 hours ago" },
  { id: "EBY-2001", customer: "Sarah Johnson", items: 1, total: 24.99, marketplace: "ebay", status: "delivered", date: "5 hours ago" },
  { id: "AMZ-1002", customer: "Mike Wilson", items: 5, total: 149.95, marketplace: "amazon", status: "processing", date: "1 day ago" },
  { id: "EBY-2002", customer: "Emily Davis", items: 2, total: 59.98, marketplace: "ebay", status: "pending", date: "2 days ago" },
  { id: "AMZ-1003", customer: "Chris Brown", items: 1, total: 34.99, marketplace: "amazon", status: "cancelled", date: "3 days ago" },
  { id: "EBY-2003", customer: "Lisa Anderson", items: 4, total: 119.96, marketplace: "ebay", status: "shipped", date: "4 days ago" },
];

const statusConfig: Record<string, { icon: typeof Clock; color: string; bg: string }> = {
  pending: { icon: Clock, color: "text-yellow-600", bg: "bg-yellow-100" },
  processing: { icon: Package, color: "text-blue-600", bg: "bg-blue-100" },
  shipped: { icon: Truck, color: "text-purple-600", bg: "bg-purple-100" },
  delivered: { icon: CheckCircle, color: "text-green-600", bg: "bg-green-100" },
  cancelled: { icon: XCircle, color: "text-red-600", bg: "bg-red-100" },
};

export default function AdminOrdersPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredOrders = orders.filter(
    (o) =>
      o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Order Management</h1>
        <p className="text-muted-foreground">Monitor and manage all marketplace orders</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm">Total Orders</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{orders.length}</div></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm">Revenue</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm">Pending</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold text-yellow-600">{orders.filter(o => o.status === "pending").length}</div></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm">Shipped</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold text-purple-600">{orders.filter(o => o.status === "shipped").length}</div></CardContent></Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>All Orders ({filteredOrders.length})</CardTitle>
              <CardDescription>Orders from Amazon and eBay</CardDescription>
            </div>
            <div className="relative w-72">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search orders..." className="pl-9" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredOrders.map((order) => {
              const statusInfo = statusConfig[order.status];
              const StatusIcon = statusInfo.icon;
              return (
                <div key={order.id} className="flex items-center justify-between rounded-lg border p-4 transition hover:bg-muted/50">
                  <div className="flex items-center gap-4">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${statusInfo.bg}`}>
                      <StatusIcon className={`h-6 w-6 ${statusInfo.color}`} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{order.id}</p>
                        <Badge variant={order.marketplace === "amazon" ? "outline" : "secondary"}>{order.marketplace === "amazon" ? "Amazon" : "eBay"}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{order.customer} · {order.items} items</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-semibold">${order.total.toFixed(2)}</p>
                      <p className="text-xs text-muted-foreground">{order.date}</p>
                    </div>
                    <Badge variant={order.status === "delivered" ? "default" : order.status === "cancelled" ? "destructive" : "secondary"}>{order.status}</Badge>
                    <Button variant="ghost" size="icon"><Eye className="h-4 w-4" /></Button>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}