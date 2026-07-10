"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { DollarSign, TrendingUp, ArrowUpRight, ArrowDownRight, Calculator } from "lucide-react";

export default function ROICalculatorPage() {
  const [investment, setInvestment] = useState(5000);
  const [monthlyRevenue, setMonthlyRevenue] = useState(8000);
  const [monthlyCosts, setMonthlyCosts] = useState(3500);
  const [months, setMonths] = useState(12);

  const calculations = useMemo(() => {
    const monthlyProfit = monthlyRevenue - monthlyCosts;
    const annualProfit = monthlyProfit * 12;
    const totalInvestment = investment;
    const roi = totalInvestment > 0 ? (annualProfit / totalInvestment) * 100 : 0;
    const paybackMonths = monthlyProfit > 0 ? Math.ceil(totalInvestment / monthlyProfit) : 0;
    const totalReturn = totalInvestment + annualProfit;
    const profitMultiple = totalInvestment > 0 ? totalReturn / totalInvestment : 0;
    const monthlyROI = roi / 12;

    return {
      monthlyProfit,
      annualProfit,
      roi,
      paybackMonths,
      totalReturn,
      profitMultiple,
      monthlyROI,
    };
  }, [investment, monthlyRevenue, monthlyCosts, months]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <TrendingUp className="h-8 w-8 text-green-500" />
          ROI Calculator
        </h1>
        <p className="text-muted-foreground">Calculate return on investment for your eCommerce business</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Investment Details</CardTitle>
            <CardDescription>Enter your investment and revenue information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Total Investment</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input type="number" className="pl-9" value={investment} onChange={(e) => setInvestment(parseFloat(e.target.value) || 0)} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Monthly Revenue</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input type="number" className="pl-9" value={monthlyRevenue} onChange={(e) => setMonthlyRevenue(parseFloat(e.target.value) || 0)} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Monthly Costs</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input type="number" className="pl-9" value={monthlyCosts} onChange={(e) => setMonthlyCosts(parseFloat(e.target.value) || 0)} />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>ROI Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between rounded-lg bg-green-50 p-4 dark:bg-green-950">
                <span className="font-medium">Return on Investment</span>
                <span className={`text-2xl font-bold ${calculations.roi >= 0 ? "text-green-600" : "text-red-600"}`}>
                  {calculations.roi.toFixed(1)}%
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg border p-3 text-center">
                  <p className="text-sm text-muted-foreground">Monthly Profit</p>
                  <p className={`text-xl font-bold ${calculations.monthlyProfit >= 0 ? "text-green-600" : "text-red-600"}`}>${calculations.monthlyProfit.toFixed(2)}</p>
                </div>
                <div className="rounded-lg border p-3 text-center">
                  <p className="text-sm text-muted-foreground">Annual Profit</p>
                  <p className={`text-xl font-bold ${calculations.annualProfit >= 0 ? "text-green-600" : "text-red-600"}`}>${calculations.annualProfit.toFixed(2)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Projections</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between rounded-lg border p-3">
                <span className="text-sm">Payback Period</span>
                <Badge variant="outline">{calculations.paybackMonths} months</Badge>
              </div>
              <div className="flex items-center justify-between rounded-lg border p-3">
                <span className="text-sm">Total Return (12 months)</span>
                <span className="font-bold">${calculations.totalReturn.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between rounded-lg border p-3">
                <span className="text-sm">Profit Multiple</span>
                <Badge variant={calculations.profitMultiple >= 2 ? "default" : "secondary"}>{calculations.profitMultiple.toFixed(2)}x</Badge>
              </div>
              <div className="flex items-center justify-between rounded-lg border p-3">
                <span className="text-sm">Monthly ROI</span>
                <span className="font-semibold">{calculations.monthlyROI.toFixed(1)}%</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}