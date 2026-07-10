"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, ExternalLink, Star, Truck, Shield, DollarSign, Globe, Package } from "lucide-react";

const suppliers = [
  {
    name: "Alibaba",
    type: "Wholesale",
    rating: 4.8,
    products: "50,000+",
    moq: "100 pcs",
    price: "$2.50 - $15.00",
    shipping: "7-21 days",
    verified: true,
    bestFor: "Bulk orders, custom products",
    url: "alibaba.com",
  },
  {
    name: "AliExpress",
    type: "Dropshipping",
    rating: 4.5,
    products: "100,000+",
    moq: "1 pc",
    price: "$3.00 - $25.00",
    shipping: "15-30 days",
    verified: true,
    bestFor: "Dropshipping, small quantities",
    url: "aliexpress.com",
  },
  {
    name: "CJ Dropshipping",
    type: "Dropshipping",
    rating: 4.6,
    products: "200,000+",
    moq: "1 pc",
    price: "$2.00 - $20.00",
    shipping: "7-15 days",
    verified: true,
    bestFor: "Fast shipping, US warehouse",
    url: "cjdropshipping.com",
  },
  {
    name: "Amazon FBA",
    type: "Wholesale",
    rating: 4.9,
    products: "Unlimited",
    moq: "Varies",
    price: "Wholesale price",
    shipping: "2-5 days",
    verified: true,
    bestFor: "Prime eligible, fast delivery",
    url: "amazon.com",
  },
  {
    name: "DHgate",
    type: "Wholesale",
    rating: 4.3,
    products: "30,000+",
    moq: "5 pcs",
    price: "$1.50 - $12.00",
    shipping: "10-25 days",
    verified: false,
    bestFor: "Electronics, fashion",
    url: "dhgate.com",
  },
  {
    name: "SaleHoo",
    type: "Directory",
    rating: 4.7,
    products: "8,000+",
    moq: "Varies",
    price: "Wholesale price",
    shipping: "Varies",
    verified: true,
    bestFor: "Vetted suppliers, market research",
    url: "salehoo.com",
  },
  {
    name: "Worldwide Brands",
    type: "Directory",
    rating: 4.6,
    products: "16,000+",
    moq: "Varies",
    price: "Wholesale price",
    shipping: "Varies",
    verified: true,
    bestFor: "Certified wholesalers",
    url: "worldwidebrands.com",
  },
  {
    name: "ThomasNet",
    type: "Manufacturer",
    rating: 4.4,
    products: "5,000+",
    moq: "1000+ pcs",
    price: "Factory price",
    shipping: "14-30 days",
    verified: true,
    bestFor: "US manufacturers, custom production",
    url: "thomasnet.com",
  },
];

export default function ProductSourcesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");

  const filtered = suppliers.filter((s) => {
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.bestFor.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === "all" || s.type.toLowerCase() === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Globe className="h-8 w-8 text-blue-500" />
          Product Sources
        </h1>
        <p className="text-muted-foreground">Find reliable suppliers and sourcing partners worldwide</p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search suppliers..." className="pl-9" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            </div>
            <div className="flex gap-2">
              {["all", "wholesale", "dropshipping", "directory", "manufacturer"].map((type) => (
                <Button key={type} variant={filterType === type ? "default" : "outline"} size="sm" onClick={() => setFilterType(type)}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        {filtered.map((supplier, i) => (
          <Card key={i} className="transition-all hover:shadow-md">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary font-bold text-lg">
                    {supplier.name.charAt(0)}
                  </div>
                  <div>
                    <CardTitle className="text-lg">{supplier.name}</CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{supplier.type}</Badge>
                      {supplier.verified && <Badge variant="default">Verified</Badge>}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold">{supplier.rating}</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex items-center gap-2"><Package className="h-4 w-4 text-muted-foreground" /><span>{supplier.products} products</span></div>
                <div className="flex items-center gap-2"><DollarSign className="h-4 w-4 text-muted-foreground" /><span>{supplier.price}</span></div>
                <div className="flex items-center gap-2"><Truck className="h-4 w-4 text-muted-foreground" /><span>{supplier.shipping}</span></div>
                <div className="flex items-center gap-2"><Shield className="h-4 w-4 text-muted-foreground" /><span>MOQ: {supplier.moq}</span></div>
              </div>
              <div className="rounded-lg bg-muted/50 p-3 text-sm">
                <p className="text-muted-foreground">Best for: <span className="font-medium text-foreground">{supplier.bestFor}</span></p>
              </div>
              <Button variant="outline" className="w-full">
                <ExternalLink className="mr-2 h-4 w-4" />Visit {supplier.url}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}