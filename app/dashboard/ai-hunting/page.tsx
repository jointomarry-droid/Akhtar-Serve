"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, TrendingUp, DollarSign, ShoppingCart, Star, Zap, Target, BarChart3 } from "lucide-react";

const trendingProducts = [
  { name: "Wireless Earbuds Pro", category: "Electronics", demand: 95, competition: "Medium", avgPrice: 29.99, monthlySales: 12500, trend: "rising", score: 92 },
  { name: "Reusable Water Bottle", category: "Kitchen", demand: 88, competition: "High", avgPrice: 19.99, monthlySales: 8900, trend: "stable", score: 87 },
  { name: "Phone Stand Holder", category: "Accessories", demand: 82, competition: "Low", avgPrice: 12.99, monthlySales: 6700, trend: "rising", score: 85 },
  { name: "LED Strip Lights", category: "Home", demand: 91, competition: "Medium", avgPrice: 15.99, monthlySales: 10200, trend: "rising", score: 89 },
  { name: "Yoga Mat Premium", category: "Sports", demand: 78, competition: "High", avgPrice: 34.99, monthlySales: 5400, trend: "stable", score: 81 },
  { name: "Cable Organizer Box", category: "Office", demand: 76, competition: "Low", avgPrice: 14.99, monthlySales: 4200, trend: "rising", score: 83 },
  { name: "Desk Lamp Touch", category: "Office", demand: 85, competition: "Medium", avgPrice: 24.99, monthlySales: 7800, trend: "stable", score: 86 },
  { name: "Travel Toiletry Bag", category: "Travel", demand: 73, competition: "Low", avgPrice: 9.99, monthlySales: 3900, trend: "rising", score: 80 },
];

export default function AIHuntingPage() {
  const [niche, setNiche] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(trendingProducts);

  const handleSearch = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    setResults(trendingProducts);
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Zap className="h-8 w-8 text-yellow-500" />
          AI Product Hunter
        </h1>
        <p className="text-muted-foreground">Discover trending products with high demand and low competition</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Find Winning Products</CardTitle>
          <CardDescription>Enter a niche or category to find trending products</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Enter niche (e.g., kitchen gadgets, pet supplies, fitness)"
                className="pl-10"
                value={niche}
                onChange={(e) => setNiche(e.target.value)}
              />
            </div>
            <Button onClick={handleSearch} disabled={loading}>
              {loading ? "Analyzing..." : "Hunt Products"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm">Products Found</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold">{results.length}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm">Avg Demand Score</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold text-green-600">{Math.round(results.reduce((s, p) => s + p.demand, 0) / results.length)}%</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm">Top Category</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold">Electronics</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm">Opportunity Score</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold text-primary">{Math.round(results.reduce((s, p) => s + p.score, 0) / results.length)}/100</div></CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Trending Products</CardTitle>
          <CardDescription>AI-analyzed products with highest potential</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {results.map((product, i) => (
              <div key={i} className="flex items-center justify-between rounded-lg border p-4 transition hover:bg-muted/50">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary font-bold">
                    #{i + 1}
                  </div>
                  <div>
                    <p className="font-medium">{product.name}</p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Badge variant="outline">{product.category}</Badge>
                      <span>·</span>
                      <span>${product.avgPrice}</span>
                      <span>·</span>
                      <span>{product.monthlySales.toLocaleString()} sales/mo</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground">Demand</p>
                    <p className="font-semibold text-green-600">{product.demand}%</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground">Competition</p>
                    <Badge variant={product.competition === "Low" ? "default" : product.competition === "Medium" ? "secondary" : "destructive"}>
                      {product.competition}
                    </Badge>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground">Trend</p>
                    <p className="font-semibold flex items-center gap-1">
                      <TrendingUp className="h-4 w-4 text-green-600" />
                      {product.trend}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground">Score</p>
                    <p className="font-bold text-lg text-primary">{product.score}</p>
                  </div>
                  <Button size="sm">Source Product</Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}