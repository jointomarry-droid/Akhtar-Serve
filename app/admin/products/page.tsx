"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, Plus, Package, Edit, Trash2, Eye } from "lucide-react";

const products = [
  { id: "1", name: "Wireless Bluetooth Headphones", sku: "WBH-001", price: 49.99, stock: 150, amazon: true, ebay: true, status: "active" },
  { id: "2", name: "USB-C Charging Cable 6ft", sku: "UCC-002", price: 12.99, stock: 500, amazon: true, ebay: false, status: "active" },
  { id: "3", name: "Phone Case - Clear", sku: "PC-003", price: 9.99, stock: 300, amazon: false, ebay: true, status: "active" },
  { id: "4", name: "Laptop Stand Adjustable", sku: "LSA-004", price: 34.99, stock: 75, amazon: true, ebay: true, status: "active" },
  { id: "5", name: "LED Desk Lamp", sku: "LDL-005", price: 29.99, stock: 0, amazon: true, ebay: true, status: "out_of_stock" },
  { id: "6", name: "Portable Charger 10000mAh", sku: "PC10-006", price: 19.99, stock: 200, amazon: true, ebay: false, status: "active" },
  { id: "7", name: "Wireless Mouse Ergonomic", sku: "WME-007", price: 24.99, stock: 120, amazon: false, ebay: true, status: "active" },
  { id: "8", name: "Monitor Riser Stand", sku: "MRS-008", price: 39.99, stock: 45, amazon: true, ebay: true, status: "low_stock" },
];

export default function AdminProductsPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Product Management</h1>
          <p className="text-muted-foreground">Manage all products across marketplaces</p>
        </div>
        <Button className="gap-2"><Plus className="h-4 w-4" />Add Product</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm">Total Products</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{products.length}</div></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm">Active</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold text-green-600">{products.filter(p => p.status === "active").length}</div></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm">Out of Stock</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold text-red-600">{products.filter(p => p.status === "out_of_stock").length}</div></CardContent></Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>All Products ({filteredProducts.length})</CardTitle>
              <CardDescription>Product catalog across all marketplaces</CardDescription>
            </div>
            <div className="relative w-72">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search products..." className="pl-9" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredProducts.map((product) => (
              <div key={product.id} className="flex items-center justify-between rounded-lg border p-4 transition hover:bg-muted/50">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <Package className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{product.name}</p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>SKU: {product.sku}</span><span>·</span><span>${product.price}</span><span>·</span><span>{product.stock} in stock</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex gap-1">
                    {product.amazon && <Badge variant="outline" className="bg-[#FF9900]/10 text-[#FF9900]">Amazon</Badge>}
                    {product.ebay && <Badge variant="outline" className="bg-[#E53238]/10 text-[#E53238]">eBay</Badge>}
                  </div>
                  <Badge variant={product.status === "active" ? "default" : product.status === "low_stock" ? "secondary" : "destructive"}>
                    {product.status.replace("_", " ")}
                  </Badge>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon"><Eye className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon"><Edit className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon"><Trash2 className="h-4 w-4 text-destructive" /></Button>
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