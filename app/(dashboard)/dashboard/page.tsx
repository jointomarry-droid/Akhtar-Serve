"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, ShoppingCart, Package, TrendingUp } from "lucide-react";

const stats = [
  {
    title: "Total Revenue",
    value: "$45,231.89",
    change: "+20.1% from last month",
    icon: DollarSign,
  },
  {
    title: "Orders",
    value: "2,350",
    change: "+180.1% from last month",
    icon: ShoppingCart,
  },
  {
    title: "Products",
    value: "1,247",
    change: "+19% from last month",
    icon: Package,
  },
  {
    title: "Conversion Rate",
    value: "3.2%",
    change: "+2.1% from last month",
    icon: TrendingUp,
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          Welcome back! Here&apos;s an overview of your business.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity & Charts Placeholder */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Revenue Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex h-[300px] items-center justify-center text-muted-foreground">
              Chart will be displayed here
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between border-b pb-4 last:border-0"
                >
                  <div>
                    <p className="text-sm font-medium">{order.customer}</p>
                    <p className="text-xs text-muted-foreground">
                      {order.product}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{order.amount}</p>
                    <p className="text-xs text-muted-foreground">
                      {order.date}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Marketplace Performance */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded bg-[#FF9900] text-white text-xs font-bold">
                a
              </div>
              Amazon Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">
                  Active Listings
                </span>
                <span className="font-medium">847</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">
                  Monthly Sales
                </span>
                <span className="font-medium">$32,450.00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">
                  Pending Orders
                </span>
                <span className="font-medium">23</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded bg-[#E53238] text-white text-xs font-bold">
                e
              </div>
              eBay Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">
                  Active Listings
                </span>
                <span className="font-medium">400</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">
                  Monthly Sales
                </span>
                <span className="font-medium">$12,781.89</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">
                  Pending Orders
                </span>
                <span className="font-medium">15</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

const recentOrders = [
  {
    id: "1",
    customer: "John Smith",
    product: "Wireless Headphones Pro",
    amount: "$149.99",
    date: "2 min ago",
  },
  {
    id: "2",
    customer: "Sarah Johnson",
    product: "Smart Watch Series 5",
    amount: "$299.99",
    date: "15 min ago",
  },
  {
    id: "3",
    customer: "Mike Davis",
    product: "USB-C Hub Adapter",
    amount: "$49.99",
    date: "1 hour ago",
  },
  {
    id: "4",
    customer: "Emily Brown",
    product: "Bluetooth Speaker",
    amount: "$79.99",
    date: "2 hours ago",
  },
];
