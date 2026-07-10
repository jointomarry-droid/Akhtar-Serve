"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { DollarSign, Target, ShoppingCart, Package } from "lucide-react";

export default function BreakEvenPage() {
  const [fixedCosts, setFixedCosts] = useState(2000);
  const [variableCostPerUnit, setVariableCostPerUnit] = useState(8);
  const [sellingPricePerUnit, setSellingPricePerUnit] = useState(29.99);

  const calculations = useMemo(() => {
    const contributionMargin = sellingPricePerUnit - variableCostPerUnit;
    const breakEvenUnits = contributionMargin > 0 ? Math.ceil(fixedCosts / contributionMargin) : 0;
    const breakEvenRevenue = breakEvenUnits * sellingPricePerUnit;
    const breakEvenDays30 = Math.ceil(breakEvenUnits / 30);
    const breakEvenDays10 = Math.ceil(breakEvenUnits / 10);

    return {
      contributionMargin,
      breakEvenUnits,
      breakEvenRevenue,
      breakEvenDays30,
      breakEvenDays10,
    };
  }, [fixedCosts, variableCostPerUnit, sellingPricePerUnit]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Target className="h-8 w-8 text-red-500" />
          Break-Even Calculator
        </h1>
        <p className="text-muted-foreground">Calculate how many units you need to sell to break even</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Cost Structure</CardTitle>
            <CardDescription>Enter your fixed and variable costs</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Monthly Fixed Costs (rent, salaries, software, etc.)</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input type="number" className="pl-9" value={fixedCosts} onChange={(e) => setFixedCosts(parseFloat(e.target.value) || 0)} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Variable Cost Per Unit (product, shipping, fees)</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input type="number" step="0.01" className="pl-9" value={variableCostPerUnit} onChange={(e) => setVariableCostPerUnit(parseFloat(e.target.value) || 0)} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Selling Price Per Unit</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input type="number" step="0.01" className="pl-9" value={sellingPricePerUnit} onChange={(e) => setSellingPricePerUnit(parseFloat(e.target.value) || 0)} />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="border-2 border-primary">
            <CardHeader>
              <CardTitle className="text-primary">Break-Even Point</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between rounded-lg bg-primary/10 p-4">
                <div className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5 text-primary" />
                  <span className="font-medium">Units to Break Even</span>
                </div>
                <span className="text-3xl font-bold text-primary">{calculations.breakEvenUnits.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between rounded-lg border p-3">
                <span className="text-sm">Break-Even Revenue</span>
                <span className="font-bold">${calculations.breakEvenRevenue.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between rounded-lg border p-3">
                <span className="text-sm">Contribution Margin/Unit</span>
                <Badge variant="default">${calculations.contributionMargin.toFixed(2)}</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Time Estimates</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between rounded-lg border p-3">
                <span className="text-sm">If selling 10 units/day</span>
                <Badge variant="outline">{calculations.breakEvenDays10} days</Badge>
              </div>
              <div className="flex items-center justify-between rounded-lg border p-3">
                <span className="text-sm">If selling 30 units/day</span>
                <Badge variant="outline">{calculations.breakEvenDays30} days</Badge>
              </div>
              <div className="flex items-center justify-between rounded-lg border p-3">
                <span className="text-sm">If selling 100 units/day</span>
                <Badge variant="outline">{Math.ceil(calculations.breakEvenUnits / 100)} days</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}