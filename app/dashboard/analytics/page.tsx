"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, TrendingUp, DollarSign, ShoppingCart, ArrowUpRight, ArrowDownRight } from "lucide-react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend,
} from "recharts";

// ==================== CHART DATA ====================

const revenueTrendData = [
  { date: "Mon", revenue: 4200, orders: 68 },
  { date: "Tue", revenue: 3800, orders: 52 },
  { date: "Wed", revenue: 5100, orders: 85 },
  { date: "Thu", revenue: 4700, orders: 74 },
  { date: "Fri", revenue: 6200, orders: 98 },
  { date: "Sat", revenue: 7800, orders: 124 },
  { date: "Sun", revenue: 6500, orders: 102 },
];

const ordersByMarketplace = [
  { name: "Amazon", value: 1847, color: "#FF9900" },
  { name: "eBay", value: 503, color: "#E53238" },
];

const salesByCategory = [
  { category: "Electronics", amazon: 18200, ebay: 6400 },
  { category: "Home & Kitchen", amazon: 12400, ebay: 3200 },
  { category: "Sports", amazon: 8900, ebay: 2100 },
  { category: "Beauty", amazon: 5200, ebay: 1800 },
  { category: "Toys", amazon: 3800, ebay: 1200 },
];

const conversionData = [
  { day: "Mon", visits: 1240, conversions: 42 },
  { day: "Tue", visits: 1180, conversions: 38 },
  { day: "Wed", visits: 1420, conversions: 51 },
  { day: "Thu", visits: 1350, conversions: 47 },
  { day: "Fri", visits: 1680, conversions: 62 },
  { day: "Sat", visits: 2100, conversions: 78 },
  { day: "Sun", visits: 1890, conversions: 68 },
];

// ==================== ANALYTICS PAGE ====================

const stats = [
  {
    title: "Total Revenue",
    value: "$58,100",
    change: "+12.5%",
    trend: "up" as const,
    icon: DollarSign,
  },
  {
    title: "Total Orders",
    value: "2,350",
    change: "+8.2%",
    trend: "up" as const,
    icon: ShoppingCart,
  },
  {
    title: "Conversion Rate",
    value: "3.2%",
    change: "+0.5%",
    trend: "up" as const,
    icon: TrendingUp,
  },
  {
    title: "Avg Order Value",
    value: "$31.45",
    change: "-2.1%",
    trend: "down" as const,
    icon: BarChart3,
  },
];

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Analytics</h2>
        <p className="text-muted-foreground">
          Track your business performance and gain insights
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
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
                <span className={stat.trend === "up" ? "text-green-600" : "text-red-600"}>
                  {stat.change}
                </span>
                <span className="text-muted-foreground">vs last week</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Revenue Trend & Orders Pie Chart */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Revenue Trend (7 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueTrendData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="day" className="text-xs" tick={{ fill: "hsl(var(--muted-foreground))" }} />
                  <YAxis className="text-xs" tick={{ fill: "hsl(var(--muted-foreground))" }} tickFormatter={(v) => `$${(v / 1000).toFixed(1)}k`} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px" }}
                    formatter={(value) => [`$${Number(value).toLocaleString()}`, "Revenue"]}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.1} strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Orders by Marketplace</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={ordersByMarketplace}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {ordersByMarketplace.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px" }}
                    formatter={(value) => [Number(value).toLocaleString(), "Orders"]}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sales by Category & Conversion Rate */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Sales by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={salesByCategory}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="category" className="text-xs" tick={{ fill: "hsl(var(--muted-foreground))" }} />
                  <YAxis className="text-xs" tick={{ fill: "hsl(var(--muted-foreground))" }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px" }}
                    formatter={(value) => [`$${Number(value).toLocaleString()}`, ""]}
                  />
                  <Legend />
                  <Bar dataKey="amazon" name="Amazon" fill="#FF9900" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="ebay" name="eBay" fill="#E53238" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Conversion Rate (7 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={conversionData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="day" className="text-xs" tick={{ fill: "hsl(var(--muted-foreground))" }} />
                  <YAxis className="text-xs" tick={{ fill: "hsl(var(--muted-foreground))" }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px" }}
                    formatter={(value, name) => [name === "conversions" ? value : Number(value).toLocaleString(), name === "conversions" ? "Conversions" : "Visits"]}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="visits" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="conversions" stroke="#22c55e" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Products */}
      <Card>
        <CardHeader>
          <CardTitle>Top Performing Products</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topProducts.map((product, index) => (
              <div
                key={product.name}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-sm font-medium">
                    {index + 1}
                  </span>
                  <div>
                    <p className="font-medium">{product.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {product.units} units sold
                    </p>
                  </div>
                </div>
                <span className="font-medium">${product.revenue}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ==================== MOCK DATA ====================

const topProducts = [
  { name: "Wireless Headphones Pro", units: 1234, revenue: "184,500" },
  { name: "Smart Watch Series 5", units: 890, revenue: "267,000" },
  { name: "USB-C Hub Adapter", units: 2345, revenue: "117,250" },
  { name: "Bluetooth Speaker", units: 567, revenue: "45,360" },
  { name: "Laptop Stand Aluminum", units: 456, revenue: "27,360" },
];
