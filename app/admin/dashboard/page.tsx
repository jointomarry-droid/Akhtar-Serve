"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
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

interface DashboardStats {
  totalUsers: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  recentUsers: any[];
  recentOrders: any[];
  marketplaceStats: {
    amazon: { orders: number; revenue: number };
    ebay: { orders: number; revenue: number };
  };
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    recentUsers: [],
    recentOrders: [],
    marketplaceStats: {
      amazon: { orders: 0, revenue: 0 },
      ebay: { orders: 0, revenue: 0 },
    },
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch real data from API
    const fetchDashboardData = async () => {
      try {
        const [productsRes, ordersRes] = await Promise.all([
          fetch("/api/products"),
          fetch("/api/orders"),
        ]);

        const productsData = await productsRes.json();
        const ordersData = await ordersRes.json();

        // Calculate stats from real data
        const totalProducts = productsData.total || 0;
        const totalOrders = ordersData.total || 0;
        const totalRevenue = ordersData.stats?.totalRevenue || 0;

        // Marketplace breakdown
        const amazonOrders = ordersData.orders?.filter(
          (o: any) => o.marketplace === "amazon"
        ).length || 0;
        const ebayOrders = ordersData.orders?.filter(
          (o: any) => o.marketplace === "ebay"
        ).length || 0;

        const amazonRevenue = ordersData.orders
          ?.filter((o: any) => o.marketplace === "amazon")
          .reduce((sum: number, o: any) => sum + o.total, 0) || 0;
        const ebayRevenue = ordersData.orders
          ?.filter((o: any) => o.marketplace === "ebay")
          .reduce((sum: number, o: any) => sum + o.total, 0) || 0;

        setStats({
          totalUsers: 24, // Mock for now - would need users API
          totalProducts,
          totalOrders,
          totalRevenue,
          recentUsers: [], // Would come from users API
          recentOrders: ordersData.orders?.slice(0, 5) || [],
          marketplaceStats: {
            amazon: { orders: amazonOrders, revenue: amazonRevenue },
            ebay: { orders: ebayOrders, revenue: ebayRevenue },
          },
        });
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const statCards = [
    {
      title: "Total Users",
      value: stats.totalUsers.toLocaleString(),
      change: "+12%",
      trend: "up",
      icon: Users,
      color: "text-blue-600",
      bg: "bg-blue-100",
    },
    {
      title: "Active Products",
      value: stats.totalProducts.toLocaleString(),
      change: "+8%",
      trend: "up",
      icon: Package,
      color: "text-green-600",
      bg: "bg-green-100",
    },
    {
      title: "Total Orders",
      value: stats.totalOrders.toLocaleString(),
      change: "+23%",
      trend: "up",
      icon: ShoppingCart,
      color: "text-purple-600",
      bg: "bg-purple-100",
    },
    {
      title: "Total Revenue",
      value: `$${stats.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      change: "+18%",
      trend: "up",
      icon: DollarSign,
      color: "text-orange-600",
      bg: "bg-orange-100",
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold">Welcome back, Admin!</h1>
        <p className="text-blue-100 mt-1">
          Here&apos;s what&apos;s happening with your platform today.
        </p>
        <div className="flex gap-3 mt-4">
          <Link href="/admin/users">
            <Button className="bg-white text-blue-600 hover:bg-blue-50">
              <Users className="w-4 h-4 mr-2" />
              Manage Users
            </Button>
          </Link>
          <Link href="/admin/products">
            <Button className="bg-blue-500 hover:bg-blue-400 border border-blue-400">
              <Package className="w-4 h-4 mr-2" />
              View Products
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className={`text-xs mt-1 ${stat.trend === "up" ? "text-green-600" : "text-red-600"}`}>
                    {stat.trend === "up" ? (
                      <ArrowUpRight className="inline w-3 h-3 mr-1" />
                    ) : (
                      <ArrowDownRight className="inline w-3 h-3 mr-1" />
                    )}
                    {stat.change} from last month
                  </p>
                </div>
                <div className={`p-3 rounded-full ${stat.bg}`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Marketplace Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5" />
              Marketplace Performance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Amazon */}
            <div className="flex items-center justify-between p-4 bg-orange-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">A</span>
                </div>
                <div>
                  <p className="font-medium">Amazon</p>
                  <p className="text-sm text-muted-foreground">
                    {stats.marketplaceStats.amazon.orders} orders
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-orange-600">
                  ${stats.marketplaceStats.amazon.revenue.toFixed(2)}
                </p>
                <Badge className="bg-orange-100 text-orange-800">Active</Badge>
              </div>
            </div>

            {/* eBay */}
            <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">E</span>
                </div>
                <div>
                  <p className="font-medium">eBay</p>
                  <p className="text-sm text-muted-foreground">
                    {stats.marketplaceStats.ebay.orders} orders
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-red-600">
                  ${stats.marketplaceStats.ebay.revenue.toFixed(2)}
                </p>
                <Badge className="bg-red-100 text-red-800">Active</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="w-5 h-5" />
              Recent Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.recentOrders.length > 0 ? (
                stats.recentOrders.map((order: any) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <p className="font-medium">{order.id}</p>
                      <p className="text-sm text-muted-foreground">
                        {order.customerName}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">${order.total.toFixed(2)}</p>
                      <Badge
                        className={
                          order.status === "shipped"
                            ? "bg-blue-100 text-blue-800"
                            : order.status === "delivered"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }
                      >
                        {order.status}
                      </Badge>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground text-center py-4">
                  No orders yet
                </p>
              )}
            </div>
            <Link href="/admin/orders">
              <Button variant="outline" className="w-full mt-4">
                View All Orders
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link href="/admin/users">
              <Button variant="outline" className="w-full h-20 flex flex-col">
                <Users className="w-6 h-6 mb-2" />
                <span>Manage Users</span>
              </Button>
            </Link>
            <Link href="/admin/products">
              <Button variant="outline" className="w-full h-20 flex flex-col">
                <Package className="w-6 h-6 mb-2" />
                <span>View Products</span>
              </Button>
            </Link>
            <Link href="/admin/orders">
              <Button variant="outline" className="w-full h-20 flex flex-col">
                <ShoppingCart className="w-6 h-6 mb-2" />
                <span>Process Orders</span>
              </Button>
            </Link>
            <Link href="/admin/settings">
              <Button variant="outline" className="w-full h-20 flex flex-col">
                <Settings className="w-6 h-6 mb-2" />
                <span>Settings</span>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
