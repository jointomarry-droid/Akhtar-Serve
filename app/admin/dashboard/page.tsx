"use client";

import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  Package,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  Activity,
  BarChart3,
  Settings,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  CreditCard,
  Globe,
  Clock,
  Zap,
  AlertTriangle,
} from "lucide-react";

const stats = [
  {
    title: "Total Users",
    value: "1,234",
    change: "+12%",
    trend: "up",
    icon: Users,
    color: "text-blue-600",
    bg: "bg-blue-100",
  },
  {
    title: "Active Products",
    value: "5,678",
    change: "+8%",
    trend: "up",
    icon: Package,
    color: "text-green-600",
    bg: "bg-green-100",
  },
  {
    title: "Total Orders",
    value: "8,901",
    change: "+23%",
    trend: "up",
    icon: ShoppingCart,
    color: "text-purple-600",
    bg: "bg-purple-100",
  },
  {
    title: "Revenue",
    value: "$45,678",
    change: "+15%",
    trend: "up",
    icon: DollarSign,
    color: "text-yellow-600",
    bg: "bg-yellow-100",
  },
];

const recentUsers = [
  { id: "1", name: "Shoaib Akhtar", email: "fiaz.ahmad1427@gmail.com", status: "active", joined: "Just now", role: "Owner" },
  { id: "2", name: "John Smith", email: "john@example.com", status: "active", joined: "2 hours ago", role: "Admin" },
  { id: "3", name: "Sarah Johnson", email: "sarah@example.com", status: "active", joined: "5 hours ago", role: "Manager" },
  { id: "4", name: "Mike Wilson", email: "mike@example.com", status: "pending", joined: "1 day ago", role: "Member" },
  { id: "5", name: "Emily Davis", email: "emily@example.com", status: "active", joined: "2 days ago", role: "Member" },
];

const recentOrders = [
  { id: "AMZ-1001", customer: "John Smith", total: 89.97, marketplace: "amazon", status: "shipped", time: "2h ago" },
  { id: "EBY-2001", customer: "Sarah Johnson", total: 24.99, marketplace: "ebay", status: "delivered", time: "5h ago" },
  { id: "AMZ-1002", customer: "Mike Wilson", total: 149.95, marketplace: "amazon", status: "processing", time: "1d ago" },
  { id: "EBY-2002", customer: "Emily Davis", total: 59.98, marketplace: "ebay", status: "pending", time: "2d ago" },
];

const activityFeed = [
  { time: "2 min ago", action: "New user registered", user: "Chris Brown", icon: Users, color: "text-blue-600" },
  { time: "15 min ago", action: "Order #AMZ-1001 shipped", user: "John Smith", icon: ShoppingCart, color: "text-green-600" },
  { time: "1 hour ago", action: "Product stock alert", user: "LED Desk Lamp", icon: AlertTriangle, color: "text-yellow-600" },
  { time: "2 hours ago", action: "New review received", user: "5 stars from Sarah", icon: TrendingUp, color: "text-purple-600" },
  { time: "3 hours ago", action: "Payment received", user: "$149.95 from Mike", icon: CreditCard, color: "text-green-600" },
  { time: "5 hours ago", action: "Integration connected", user: "eBay store linked", icon: Globe, color: "text-orange-600" },
];

const marketplaceStats = [
  { name: "Amazon", orders: 5420, revenue: 28500, growth: "+18%", color: "#FF9900" },
  { name: "eBay", orders: 3481, revenue: 17178, growth: "+25%", color: "#E53238" },
];

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-primary to-primary/80 p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-1">Welcome back, Admin!</h1>
            <p className="text-white/80">Here&apos;s what&apos;s happening with your platform today.</p>
          </div>
          <div className="flex gap-2">
            <Link href="/admin/users">
              <Button variant="secondary" className="gap-2">
                <Users className="h-4 w-4" />Manage Users
              </Button>
            </Link>
            <Link href="/admin/products">
              <Button variant="secondary" className="gap-2">
                <Package className="h-4 w-4" />Products
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="transition-all hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
              <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${stat.bg}`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stat.value}</div>
              <div className="flex items-center gap-1 mt-1">
                {stat.trend === "up" ? (
                  <ArrowUpRight className="h-4 w-4 text-green-600" />
                ) : (
                  <ArrowDownRight className="h-4 w-4 text-red-600" />
                )}
                <span className={`text-sm ${stat.trend === "up" ? "text-green-600" : "text-red-600"}`}>{stat.change}</span>
                <span className="text-sm text-muted-foreground">from last month</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Marketplace Performance */}
      <div className="grid gap-4 md:grid-cols-2">
        {marketplaceStats.map((mp) => (
          <Card key={mp.name}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg text-white font-bold text-sm" style={{ backgroundColor: mp.color }}>
                    {mp.name.charAt(0)}
                  </div>
                  {mp.name}
                </CardTitle>
                <Badge variant="outline">{mp.growth}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Orders</p>
                  <p className="text-2xl font-bold">{mp.orders.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Revenue</p>
                  <p className="text-2xl font-bold">${mp.revenue.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Users */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Recent Users</CardTitle>
              <Link href="/admin/users">
                <Button variant="ghost" size="sm" className="gap-1">
                  View All <ArrowUpRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
            <CardDescription>Latest user registrations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentUsers.map((user) => (
                <div key={user.id} className="flex items-center justify-between rounded-lg border p-3 transition hover:bg-muted/50">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-semibold">
                      {user.name.split(" ").map((n) => n[0]).join("")}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{user.name}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant={user.status === "active" ? "default" : "secondary"} className="text-xs">
                      {user.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Orders */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Recent Orders</CardTitle>
              <Link href="/admin/orders">
                <Button variant="ghost" size="sm" className="gap-1">
                  View All <ArrowUpRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
            <CardDescription>Latest marketplace orders</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between rounded-lg border p-3 transition hover:bg-muted/50">
                  <div className="flex items-center gap-3">
                    <div className={`flex h-9 w-9 items-center justify-center rounded-lg text-white font-bold text-xs ${order.marketplace === "amazon" ? "bg-[#FF9900]" : "bg-[#E53238]"}`}>
                      {order.marketplace === "amazon" ? "A" : "E"}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{order.id}</p>
                      <p className="text-xs text-muted-foreground">{order.customer}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold">${order.total}</p>
                    <Badge variant={order.status === "delivered" ? "default" : order.status === "cancelled" ? "destructive" : "secondary"} className="text-xs">
                      {order.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Activity Feed */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Activity Feed
            </CardTitle>
            <CardDescription>Recent platform activity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {activityFeed.map((activity, i) => (
                <div key={i} className="flex items-start gap-3 rounded-lg border p-3 transition hover:bg-muted/50">
                  <div className={`flex h-8 w-8 items-center justify-center rounded-lg bg-muted ${activity.color}`}>
                    <activity.icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">{activity.user}</p>
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">{activity.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common administrative tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            <Link href="/admin/users">
              <Button variant="outline" className="w-full justify-start gap-2 h-auto py-4">
                <Users className="h-5 w-5 text-blue-600" />
                <div className="text-left">
                  <p className="font-medium">Users</p>
                  <p className="text-xs text-muted-foreground">1,234 total</p>
                </div>
              </Button>
            </Link>
            <Link href="/admin/products">
              <Button variant="outline" className="w-full justify-start gap-2 h-auto py-4">
                <Package className="h-5 w-5 text-green-600" />
                <div className="text-left">
                  <p className="font-medium">Products</p>
                  <p className="text-xs text-muted-foreground">5,678 active</p>
                </div>
              </Button>
            </Link>
            <Link href="/admin/orders">
              <Button variant="outline" className="w-full justify-start gap-2 h-auto py-4">
                <ShoppingCart className="h-5 w-5 text-purple-600" />
                <div className="text-left">
                  <p className="font-medium">Orders</p>
                  <p className="text-xs text-muted-foreground">8,901 total</p>
                </div>
              </Button>
            </Link>
            <Link href="/dashboard/analytics">
              <Button variant="outline" className="w-full justify-start gap-2 h-auto py-4">
                <BarChart3 className="h-5 w-5 text-orange-600" />
                <div className="text-left">
                  <p className="font-medium">Analytics</p>
                  <p className="text-xs text-muted-foreground">View reports</p>
                </div>
              </Button>
            </Link>
            <Link href="/admin/settings">
              <Button variant="outline" className="w-full justify-start gap-2 h-auto py-4">
                <Settings className="h-5 w-5 text-gray-600" />
                <div className="text-left">
                  <p className="font-medium">Settings</p>
                  <p className="text-xs text-muted-foreground">Configure</p>
                </div>
              </Button>
            </Link>
            <Link href="/dashboard/support">
              <Button variant="outline" className="w-full justify-start gap-2 h-auto py-4">
                <Zap className="h-5 w-5 text-yellow-600" />
                <div className="text-left">
                  <p className="font-medium">Support</p>
                  <p className="text-xs text-muted-foreground">12 tickets</p>
                </div>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}