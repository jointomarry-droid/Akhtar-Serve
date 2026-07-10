"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, ShoppingCart, Package, TrendingUp, ArrowUpRight, ArrowDownRight } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

// ==================== CHART DATA ====================

const revenueData = [
  { month: "Jan", revenue: 18500, orders: 312 },
  { month: "Feb", revenue: 22300, orders: 385 },
  { month: "Mar", revenue: 28100, orders: 421 },
  { month: "Apr", revenue: 31400, orders: 498 },
  { month: "May", revenue: 35200, orders: 534 },
  { month: "Jun", revenue: 38900, orders: 612 },
  { month: "Jul", revenue: 42100, orders: 687 },
  { month: "Aug", revenue: 39800, orders: 645 },
  { month: "Sep", revenue: 44500, orders: 723 },
  { month: "Oct", revenue: 48200, orders: 789 },
  { month: "Nov", revenue: 52800, orders: 856 },
  { month: "Dec", revenue: 58100, orders: 942 },
];

const marketplaceData = [
  { name: "Amazon", sales: 32450, color: "#FF9900" },
  { name: "eBay", sales: 12782, color: "#E53238" },
];

const categoryData = [
  { category: "Electronics", sales: 18200, percentage: 38 },
  { category: "Home & Kitchen", sales: 12400, percentage: 26 },
  { category: "Sports", sales: 8900, percentage: 19 },
  { category: "Beauty", sales: 5200, percentage: 11 },
  { category: "Other", sales: 3132, percentage: 6 },
];

// ==================== DASHBOARD PAGE ====================

const stats = [
  {
    title: "Total Revenue",
    value: "$58,100",
    change: "+12.5%",
    trend: "up",
    icon: DollarSign,
    period: "vs last month",
  },
  {
    title: "Orders",
    value: "1,847",
    change: "+8.2%",
    trend: "up",
    icon: ShoppingCart,
    period: "vs last month",
  },
  {
    title: "Products",
    value: "234",
    change: "+5.1%",
    trend: "up",
    icon: Package,
    period: "vs last month",
  },
  {
    title: "Avg. Order Value",
    value: "$31.45",
    change: "-2.3%",
    trend: "down",
    icon: TrendingUp,
    period: "vs last month",
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
              <div className="flex items-center gap-1 text-xs">
                {stat.trend === "up" ? (
                  <ArrowUpRight className="h-3 w-3 text-green-600" />
                ) : (
                  <ArrowDownRight className="h-3 w-3 text-red-600" />
                )}
                <span
                  className={
                    stat.trend === "up" ? "text-green-600" : "text-red-600"
                  }
                >
                  {stat.change}
                </span>
                <span className="text-muted-foreground">{stat.period}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Revenue Chart & Recent Orders */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Revenue Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis
                    dataKey="month"
                    className="text-xs"
                    tick={{ fill: "hsl(var(--muted-foreground))" }}
                  />
                  <YAxis
                    className="text-xs"
                    tick={{ fill: "hsl(var(--muted-foreground))" }}
                    tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                    formatter={(value) => [`$${Number(value).toLocaleString()}`, "Revenue"]}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="hsl(var(--primary))"
                    fill="hsl(var(--primary))"
                    fillOpacity={0.1}
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
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

      {/* Marketplace Performance & Category Breakdown */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Marketplace Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={marketplaceData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis
                    type="number"
                    className="text-xs"
                    tick={{ fill: "hsl(var(--muted-foreground))" }}
                    tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    className="text-xs"
                    tick={{ fill: "hsl(var(--muted-foreground))" }}
                    width={80}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                    formatter={(value) => [`$${Number(value).toLocaleString()}`, "Sales"]}
                  />
                  <Bar dataKey="sales" radius={[0, 4, 4, 0]}>
                    {marketplaceData.map((entry, index) => (
                      <rect key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 space-y-2">
              {marketplaceData.map((mp) => (
                <div key={mp.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: mp.color }}
                    />
                    <span className="text-sm">{mp.name}</span>
                  </div>
                  <span className="text-sm font-medium">
                    ${mp.sales.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {categoryData.map((cat) => (
                <div key={cat.category} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{cat.category}</span>
                    <span className="text-sm text-muted-foreground">
                      ${cat.sales.toLocaleString()}
                    </span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full"
                      style={{ width: `${cat.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// ==================== MOCK DATA ====================

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
