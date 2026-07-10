"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, Plus, Warehouse, AlertTriangle, Package } from "lucide-react";

const mockInventory = [
  {
    id: "1",
    product: "Wireless Headphones Pro",
    sku: "WHP-001",
    quantity: 234,
    reserved: 12,
    location: "Main Warehouse",
    reorderPoint: 50,
    status: "In Stock",
  },
  {
    id: "2",
    product: "Smart Watch Series 5",
    sku: "SWS-002",
    quantity: 89,
    reserved: 5,
    location: "FBA Warehouse",
    reorderPoint: 30,
    status: "In Stock",
  },
  {
    id: "3",
    product: "USB-C Hub Adapter",
    sku: "UCH-003",
    quantity: 567,
    reserved: 23,
    location: "Main Warehouse",
    reorderPoint: 100,
    status: "In Stock",
  },
  {
    id: "4",
    product: "Bluetooth Speaker",
    sku: "BTS-004",
    quantity: 0,
    reserved: 0,
    location: "Main Warehouse",
    reorderPoint: 50,
    status: "Out of Stock",
  },
  {
    id: "5",
    product: "Laptop Stand Aluminum",
    sku: "LSA-005",
    quantity: 15,
    reserved: 8,
    location: "FBA Warehouse",
    reorderPoint: 20,
    status: "Low Stock",
  },
];

export default function InventoryPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredInventory = mockInventory.filter(
    (item) =>
      item.product.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Inventory</h2>
          <p className="text-muted-foreground">
            Track and manage your inventory across all locations
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Warehouse className="mr-2 h-4 w-4" />
            Add Location
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Stock
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Total Products
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,247</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">In Stock</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">1,180</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">42</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">25</div>
          </CardContent>
        </Card>
      </div>

      {/* Low Stock Alert */}
      <Card className="border-yellow-200 bg-yellow-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-yellow-800">
            <AlertTriangle className="h-5 w-5" />
            Low Stock Alerts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p className="text-sm text-yellow-700">
              <strong>Laptop Stand Aluminum (LSA-005)</strong> - Only 15 units
              remaining (reorder point: 20)
            </p>
            <p className="text-sm text-yellow-700">
              <strong>Wireless Charger Pad (WCP-012)</strong> - Only 8 units
              remaining (reorder point: 25)
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Inventory Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search inventory..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Button variant="outline">Filter</Button>
            <Button variant="outline">Export</Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Reserved</TableHead>
                <TableHead>Available</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInventory.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.product}</TableCell>
                  <TableCell>{item.sku}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>{item.reserved}</TableCell>
                  <TableCell>{item.quantity - item.reserved}</TableCell>
                  <TableCell>{item.location}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                        item.status === "In Stock"
                          ? "bg-green-100 text-green-700"
                          : item.status === "Low Stock"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {item.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      Adjust
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
