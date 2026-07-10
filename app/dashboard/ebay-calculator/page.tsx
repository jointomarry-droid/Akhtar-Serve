"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { DollarSign, Calculator, Info } from "lucide-react";

export default function EbayCalculatorPage() {
  const [sellPrice, setSellPrice] = useState(29.99);
  const [costPrice, setCostPrice] = useState(10);
  const [shippingCharge, setShippingCharge] = useState(5.99);
  const [shippingCost, setShippingCost] = useState(3.50);
  const [isStoreSubscriber, setIsStoreSubscriber] = useState(false);

  const calculations = useMemo(() => {
    const finalValueFeeRate = 0.1313;
    const finalValueFee = sellPrice * finalValueFeeRate;
    const perOrderFee = 0.30;
    const promotedListingFee = sellPrice * 0.03;
    const totalFees = finalValueFee + perOrderFee + promotedListingFee;
    const totalRevenue = sellPrice + shippingCharge;
    const totalCosts = costPrice + shippingCost + totalFees;
    const profit = totalRevenue - totalCosts;
    const margin = totalRevenue > 0 ? (profit / totalRevenue) * 100 : 0;
    const feePercentage = totalRevenue > 0 ? (totalFees / totalRevenue) * 100 : 0;

    return {
      finalValueFee,
      perOrderFee,
      promotedListingFee,
      totalFees,
      totalRevenue,
      totalCosts,
      profit,
      margin,
      feePercentage,
    };
  }, [sellPrice, costPrice, shippingCharge, shippingCost, isStoreSubscriber]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Calculator className="h-8 w-8 text-blue-500" />
          eBay Fee Calculator
        </h1>
        <p className="text-muted-foreground">Calculate eBay fees, profit, and margins for your listings</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Listing Details</CardTitle>
            <CardDescription>Enter your product pricing information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Selling Price</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input type="number" step="0.01" className="pl-9" value={sellPrice} onChange={(e) => setSellPrice(parseFloat(e.target.value) || 0)} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Cost Price</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input type="number" step="0.01" className="pl-9" value={costPrice} onChange={(e) => setCostPrice(parseFloat(e.target.value) || 0)} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Shipping Charge (to buyer)</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input type="number" step="0.01" className="pl-9" value={shippingCharge} onChange={(e) => setShippingCharge(parseFloat(e.target.value) || 0)} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Shipping Cost (your cost)</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input type="number" step="0.01" className="pl-9" value={shippingCost} onChange={(e) => setShippingCost(parseFloat(e.target.value) || 0)} />
                </div>
              </div>
            </div>
            <div className="rounded-lg bg-muted/50 p-3 text-sm">
              <p className="text-muted-foreground">eBay Final Value Fee: <span className="font-medium text-foreground">13.13% + $0.30/order</span></p>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Fee Breakdown
                <Badge variant="outline">{calculations.feePercentage.toFixed(1)}% of revenue</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm"><span className="text-muted-foreground">Final Value Fee (13.13%)</span><span className="font-medium">${calculations.finalValueFee.toFixed(2)}</span></div>
              <div className="flex justify-between text-sm"><span className="text-muted-foreground">Per Order Fee</span><span className="font-medium">${calculations.perOrderFee.toFixed(2)}</span></div>
              <div className="flex justify-between text-sm"><span className="text-muted-foreground">Promoted Listings (3%)</span><span className="font-medium">${calculations.promotedListingFee.toFixed(2)}</span></div>
              <div className="flex justify-between text-sm border-t pt-2"><span className="font-semibold">Total eBay Fees</span><span className="font-bold">${calculations.totalFees.toFixed(2)}</span></div>
            </CardContent>
          </Card>

          <Card className={calculations.profit >= 0 ? "border-green-500" : "border-red-500"}>
            <CardHeader>
              <CardTitle>Profit Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between"><span className="text-muted-foreground">Total Revenue</span><span className="font-medium">${calculations.totalRevenue.toFixed(2)}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Product Cost</span><span className="font-medium">-${costPrice.toFixed(2)}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Shipping Cost</span><span className="font-medium">-${shippingCost.toFixed(2)}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">eBay Fees</span><span className="font-medium">-${calculations.totalFees.toFixed(2)}</span></div>
              <div className="flex justify-between border-t pt-2">
                <span className="font-semibold text-lg">Net Profit</span>
                <span className={`text-2xl font-bold ${calculations.profit >= 0 ? "text-green-600" : "text-red-600"}`}>${calculations.profit.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Profit Margin</span>
                <span className={`font-semibold ${calculations.margin >= 0 ? "text-green-600" : "text-red-600"}`}>{calculations.margin.toFixed(1)}%</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}