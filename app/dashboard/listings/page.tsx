"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Globe,
  Search,
  Plus,
  Filter,
  Download,
  ExternalLink,
  Eye,
  Edit,
  Trash2,
  RefreshCw,
  ShoppingCart,
  TrendingUp,
  BarChart3,
  Package,
} from "lucide-react";

// ==================== MOCK DATA ====================

const mockListings = [
  {
    id: "1",
    title: "Wireless Bluetooth Headphones - Noise Cancelling",
    marketplace: "Amazon",
    status: "ACTIVE",
    price: 79.99,
    currency: "USD",
    sku: "WBH-001",
    asin: "B09V3KXJPB",
    stock: 245,
    sales30d: 189,
    rating: 4.5,
    reviews: 1247,
    imageUrl: "/placeholder-product.jpg",
    createdAt: "2024-01-15",
    updatedAt: "2024-03-10",
  },
  {
    id: "2",
    title: "Premium Yoga Mat - Non-Slip, 6mm Thick",
    marketplace: "Amazon",
    status: "ACTIVE",
    price: 34.99,
    currency: "USD",
    sku: "YM-002",
    asin: "B08XYZ1234",
    stock: 512,
    sales30d: 324,
    rating: 4.7,
    reviews: 856,
    imageUrl: "/placeholder-product.jpg",
    createdAt: "2024-02-20",
    updatedAt: "2024-03-08",
  },
  {
    id: "3",
    title: "Stainless Steel Water Bottle - 32oz Insulated",
    marketplace: "eBay",
    status: "ACTIVE",
    price: 24.99,
    currency: "USD",
    sku: "SWB-003",
    ebayItemId: "123456789",
    stock: 178,
    sales30d: 98,
    rating: 4.3,
    reviews: 432,
    imageUrl: "/placeholder-product.jpg",
    createdAt: "2024-01-28",
    updatedAt: "2024-03-09",
  },
  {
    id: "4",
    title: "LED Desk Lamp - Adjustable brightness, USB port",
    marketplace: "Amazon",
    status: "ACTIVE",
    price: 45.99,
    currency: "USD",
    sku: "LDL-004",
    asin: "B0ABC1234D",
    stock: 89,
    sales30d: 156,
    rating: 4.6,
    reviews: 678,
    imageUrl: "/placeholder-product.jpg",
    createdAt: "2024-02-05",
    updatedAt: "2024-03-07",
  },
  {
    id: "5",
    title: "Portable Phone Charger - 20000mAh Fast Charging",
    marketplace: "eBay",
    status: "ACTIVE",
    price: 29.99,
    currency: "USD",
    sku: "PPC-005",
    ebayItemId: "987654321",
    stock: 34,
    sales30d: 267,
    rating: 4.4,
    reviews: 1023,
    imageUrl: "/placeholder-product.jpg",
    createdAt: "2024-01-10",
    updatedAt: "2024-03-10",
  },
  {
    id: "6",
    title: "Ceramic Coffee Mug Set - 4 Pack, 12oz",
    marketplace: "Amazon",
    status: "INACTIVE",
    price: 19.99,
    currency: "USD",
    sku: "CCM-006",
    asin: "B0DEF5678E",
    stock: 0,
    sales30d: 0,
    rating: 4.2,
    reviews: 234,
    imageUrl: "/placeholder-product.jpg",
    createdAt: "2024-02-15",
    updatedAt: "2024-03-01",
  },
  {
    id: "7",
    title: "Bamboo Cutting Board Set - 3 Pieces",
    marketplace: "Amazon",
    status: "ACTIVE",
    price: 27.99,
    currency: "USD",
    sku: "BCB-007",
    asin: "B0GHI9012F",
    stock: 156,
    sales30d: 89,
    rating: 4.8,
    reviews: 567,
    imageUrl: "/placeholder-product.jpg",
    createdAt: "2024-03-01",
    updatedAt: "2024-03-10",
  },
  {
    id: "8",
    title: "Electric Toothbrush - Rechargeable, 5 Modes",
    marketplace: "eBay",
    status: "ACTIVE",
    price: 39.99,
    currency: "USD",
    sku: "ETB-008",
    ebayItemId: "456789123",
    stock: 203,
    sales30d: 145,
    rating: 4.5,
    reviews: 890,
    imageUrl: "/placeholder-product.jpg",
    createdAt: "2024-01-20",
    updatedAt: "2024-03-09",
  },
];

// ==================== LISTINGS PAGE ====================

export default function ListingsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterMarketplace, setFilterMarketplace] = useState("ALL");
  const [filterStatus, setFilterStatus] = useState("ALL");

  // Filter listings
  const filteredListings = mockListings.filter((listing) => {
    const matchesSearch =
      listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      listing.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesMarketplace =
      filterMarketplace === "ALL" || listing.marketplace === filterMarketplace;
    const matchesStatus =
      filterStatus === "ALL" || listing.status === filterStatus;
    return matchesSearch && matchesMarketplace && matchesStatus;
  });

  // Calculate stats
  const totalListings = filteredListings.length;
  const activeListings = filteredListings.filter((l) => l.status === "ACTIVE").length;
  const totalSales30d = filteredListings.reduce((sum, l) => sum + l.sales30d, 0);
  const totalRevenue30d = filteredListings.reduce(
    (sum, l) => sum + l.sales30d * l.price,
    0
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Globe className="h-8 w-8 text-primary" />
            Marketplace Listings
          </h1>
          <p className="text-muted-foreground">
            Manage your product listings across Amazon and eBay
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Sync
          </Button>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Create Listing
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Listings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalListings}</div>
            <p className="text-xs text-muted-foreground">
              {activeListings} active
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Sales (30d)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSales30d.toLocaleString()}</div>
            <p className="text-xs text-green-600">+12% vs last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Revenue (30d)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${totalRevenue30d.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-green-600">+8% vs last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Avg. Rating
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(filteredListings.reduce((sum, l) => sum + l.rating, 0) / filteredListings.length).toFixed(1)}
            </div>
            <p className="text-xs text-muted-foreground">
              {filteredListings.reduce((sum, l) => sum + l.reviews, 0).toLocaleString()} total reviews
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by title or SKU..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <select
              value={filterMarketplace}
              onChange={(e) => setFilterMarketplace(e.target.value)}
              className="px-3 py-2 border rounded-lg bg-background text-sm"
            >
              <option value="ALL">All Marketplaces</option>
              <option value="Amazon">Amazon</option>
              <option value="eBay">eBay</option>
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border rounded-lg bg-background text-sm"
            >
              <option value="ALL">All Status</option>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
              <option value="DRAFT">Draft</option>
            </select>
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Listings Table */}
      <Card>
        <CardHeader>
          <CardTitle>Your Listings</CardTitle>
          <CardDescription>
            {filteredListings.length} listings found
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-2 font-medium">Product</th>
                  <th className="text-left py-3 px-2 font-medium">Marketplace</th>
                  <th className="text-left py-3 px-2 font-medium">Price</th>
                  <th className="text-left py-3 px-2 font-medium">Stock</th>
                  <th className="text-left py-3 px-2 font-medium">Sales (30d)</th>
                  <th className="text-left py-3 px-2 font-medium">Rating</th>
                  <th className="text-left py-3 px-2 font-medium">Status</th>
                  <th className="text-left py-3 px-2 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredListings.map((listing) => (
                  <tr key={listing.id} className="border-b hover:bg-muted/50">
                    <td className="py-3 px-2">
                      <div>
                        <p className="font-medium line-clamp-1">{listing.title}</p>
                        <p className="text-xs text-muted-foreground">
                          SKU: {listing.sku}
                          {listing.asin && ` • ASIN: ${listing.asin}`}
                          {listing.ebayItemId && ` • Item ID: ${listing.ebayItemId}`}
                        </p>
                      </div>
                    </td>
                    <td className="py-3 px-2">
                      <Badge
                        variant={listing.marketplace === "Amazon" ? "default" : "secondary"}
                      >
                        {listing.marketplace}
                      </Badge>
                    </td>
                    <td className="py-3 px-2 font-medium">
                      ${listing.price.toFixed(2)}
                    </td>
                    <td className="py-3 px-2">
                      <span
                        className={
                          listing.stock < 50
                            ? "text-red-600 font-medium"
                            : "text-muted-foreground"
                        }
                      >
                        {listing.stock}
                      </span>
                    </td>
                    <td className="py-3 px-2">{listing.sales30d}</td>
                    <td className="py-3 px-2">
                      <div className="flex items-center gap-1">
                        <span>{listing.rating}</span>
                        <span className="text-muted-foreground">
                          ({listing.reviews})
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-2">
                      <Badge
                        variant={
                          listing.status === "ACTIVE"
                            ? "default"
                            : listing.status === "INACTIVE"
                            ? "destructive"
                            : "secondary"
                        }
                      >
                        {listing.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-2">
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
