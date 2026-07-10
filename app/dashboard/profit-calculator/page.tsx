"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Calculator, DollarSign, TrendingUp, TrendingDown, Package, Truck, ShoppingCart } from "lucide-react";

export default function ProfitCalculatorPage() {
  const [costPrice, setCostPrice] = useState(10);
  const [sellPrice, setSellPrice] = useState(29.99);
  const [shippingCost, setShippingCost] = useState(3.50);
  const [unitsSold, setUnitsSold] = useState(100);
  const [amazonFee, setAmazonFee] = useState(15);
  const [packagingCost, setPackagingCost] = useState(1.50);

  const calculations = useMemo(() => {
    const totalCostPerUnit = costPrice + shippingCost + packagingCost;
    const sellingPrice = sellPrice;
    const marketplaceFee = (sellingPrice * amazonFee) / 100;
    const profitPerUnit = sellingPrice - totalCostPerUnit - marketplaceFee;
    const margin = sellingPrice > 0 ? (profitPerUnit / sellingPrice) * 100 : 0;
    const totalRevenue = sellingPrice * unitsSold;
    const totalCost = totalCostPerUnit * unitsSold;
    const totalFees = marketplaceFee * unitsSold;
    const totalProfit = profitPerUnit * unitsSold;
    const roi = totalCost > 0 ? (totalProfit / totalCost) * 100 : 0;
    const breakEven = profitPerUnit > 0 ? Math.ceil(totalCost / profitPerUnit) : 0;
    const annualProfit = totalProfit * 12;

    return {
      totalCostPerUnit,
      marketplaceFee,
      profitPerUnit,
      margin,
      totalRevenue,
      totalCost,
      totalFees,
      totalProfit,
      roi,
      breakEven,
      annualProfit,
    };
  }, [costPrice, sellPrice, shippingCost, unitsSold, amazonFee, packagingCost]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Calculator className="h-8 w-8 text-green-500" />
          Profit & Loss Calculator
        </h1>
        <p className="text-muted-foreground">Calculate your margins and profitability for Amazon & eBay</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Cost Inputs</CardTitle>
            <CardDescription>Enter your product costs and pricing</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Cost Price (per unit)</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input type="number" step="0.01" className="pl-9" value={costPrice} onChange={(e) => setCostPrice(parseFloat(e.target.value) || 0)} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Selling Price</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input type="number" step="0.01" className="pl-9" value={sellPrice} onChange={(e) => setSellPrice(parseFloat(e.target.value) || 0)} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Shipping Cost</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input type="number" step="0.01" className="pl-9" value={shippingCost} onChange={(e) => setShippingCost(parseFloat(e.target.value) || 0)} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Packaging Cost</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input type="number" step="0.01" className="pl-9" value={packagingCost} onChange={(e) => setPackagingCost(parseFloat(e.target.value) || 0)} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Marketplace Fee (%)</Label>
                <div className="relative">
                  <Input type="number" step="0.1" className="pl-9" value={amazonFee} onChange={(e) => setAmazonFee(parseFloat(e.target.value) || 0)} />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">%</span>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Units Sold (monthly)</Label>
                <Input type="number" value={unitsSold} onChange={(e) => setUnitsSold(parseInt(e.target.value) || 0)} />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profit Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between rounded-lg bg-green-50 p-4 dark:bg-green-950">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-green-600" />
                  <span className="font-medium">Profit Per Unit</span>
                </div>
                <span className={`text-2xl font-bold ${calculations.profitPerUnit >= 0 ? "text-green-600" : "text-red-600"}`}>
                  ${calculations.profitPerUnit.toFixed(2)}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg border p-3 text-center">
                  <p className="text-sm text-muted-foreground">Profit Margin</p>
                  <p className={`text-xl font-bold ${calculations.margin >= 0 ? "text-green-600" : "text-red-600"}`}>
                    {calculations.margin.toFixed(1)}%
                  </p>
                </div>
                <div className="rounded-lg border p-3 text-center">
                  <p className="text-sm text-muted-foreground">ROI</p>
                  <p className={`text-xl font-bold ${calculations.roi >= 0 ? "text-green-600" : "text-red-600"}`}>
                    {calculations.roi.toFixed(1)}%
                  </p>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Revenue (monthly)</span><span className="font-medium">${calculations.totalRevenue.toFixed(2)}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Product Cost</span><span className="font-medium">${(costPrice * unitsSold).toFixed(2)}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Shipping Cost</span><span className="font-medium">${(shippingCost * unitsSold).toFixed(2)}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Packaging Cost</span><span className="font-medium">${(packagingCost * unitsSold).toFixed(2)}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Marketplace Fees</span><span className="font-medium">${calculations.totalFees.toFixed(2)}</span></div>
                <div className="flex justify-between border-t pt-2"><span className="font-semibold">Total Profit (monthly)</span>
                  <span className={`font-bold ${calculations.totalProfit >= 0 ? "text-green-600" : "text-red-600"}`}>${calculations.totalProfit.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Projections</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between rounded-lg border p-3">
                <div className="flex items-center gap-2"><TrendingUp className="h-4 w-4 text-green-600" /><span className="text-sm">Annual Profit (12 months)</span></div>
                <span className="font-bold text-green-600">${calculations.annualProfit.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between rounded-lg border p-3">
                <div className="flex items-center gap-2"><Package className="h-4 w-4 text-blue-600" /><span className="text-sm">Break-even Units</span></div>
                <span className="font-bold">{calculations.breakEven} units</span>
              </div>
              <div className="flex items-center justify-between rounded-lg border p-3">
                <div className="flex items-center gap-2"><ShoppingCart className="h-4 w-4 text-purple-600" /><span className="text-sm">Daily Sales Needed (for $5K/mo)</span></div>
                <span className="font-bold">{calculations.profitPerUnit > 0 ? Math.ceil(5000 / calculations.profitPerUnit) : "N/A"} units</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}