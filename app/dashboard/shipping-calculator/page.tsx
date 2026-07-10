"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
// Using native HTML select for simplicity
import { Truck, Package, DollarSign, Clock, Weight } from "lucide-react";

const shippingMethods = [
  { name: "USPS First Class", baseRate: 3.50, perPound: 0.50, days: "5-7", maxWeight: 13 },
  { name: "USPS Priority Mail", baseRate: 7.50, perPound: 0.80, days: "2-3", maxWeight: 70 },
  { name: "USPS Priority Express", baseRate: 25.00, perPound: 1.20, days: "1-2", maxWeight: 70 },
  { name: "UPS Ground", baseRate: 9.00, perPound: 0.75, days: "3-5", maxWeight: 150 },
  { name: "UPS 2nd Day Air", baseRate: 18.00, perPound: 1.50, days: "2", maxWeight: 150 },
  { name: "UPS Next Day Air", baseRate: 35.00, perPound: 2.50, days: "1", maxWeight: 150 },
  { name: "FedEx Ground", baseRate: 8.50, perPound: 0.70, days: "3-5", maxWeight: 150 },
  { name: "FedEx Express", baseRate: 22.00, perPound: 1.80, days: "1-2", maxWeight: 150 },
  { name: "Amazon FBA", baseRate: 3.50, perPound: 0.50, days: "1-2 (Prime)", maxWeight: 70 },
];

export default function ShippingCalculatorPage() {
  const [weight, setWeight] = useState(2);
  const [length, setLength] = useState(10);
  const [width, setWidth] = useState(8);
  const [height, setHeight] = useState(4);
  const [selectedMethod, setSelectedMethod] = useState("USPS First Class");

  const calculations = useMemo(() => {
    const method = shippingMethods.find((m) => m.name === selectedMethod) || shippingMethods[0];
    const dimensionalWeight = (length * width * height) / 166;
    const billableWeight = Math.max(weight, dimensionalWeight);
    const shippingCost = method.baseRate + (billableWeight * method.perPound);
    const volume = length * width * height;

    return {
      method,
      dimensionalWeight,
      billableWeight,
      shippingCost,
      volume,
    };
  }, [weight, length, width, height, selectedMethod]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Truck className="h-8 w-8 text-orange-500" />
          Shipping Cost Calculator
        </h1>
        <p className="text-muted-foreground">Compare shipping costs across carriers and find the best rates</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Package Details</CardTitle>
            <CardDescription>Enter package weight and dimensions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Weight (lbs)</Label>
              <div className="relative">
                <Weight className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input type="number" step="0.1" className="pl-9" value={weight} onChange={(e) => setWeight(parseFloat(e.target.value) || 0)} />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Length (in)</Label>
                <Input type="number" value={length} onChange={(e) => setLength(parseFloat(e.target.value) || 0)} />
              </div>
              <div className="space-y-2">
                <Label>Width (in)</Label>
                <Input type="number" value={width} onChange={(e) => setWidth(parseFloat(e.target.value) || 0)} />
              </div>
              <div className="space-y-2">
                <Label>Height (in)</Label>
                <Input type="number" value={height} onChange={(e) => setHeight(parseFloat(e.target.value) || 0)} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Shipping Method</Label>
              <select
                className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                value={selectedMethod}
                onChange={(e) => setSelectedMethod(e.target.value)}
              >
                {shippingMethods.map((method) => (
                  <option key={method.name} value={method.name}>{method.name}</option>
                ))}
              </select>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Shipping Cost</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between rounded-lg bg-orange-50 p-4 dark:bg-orange-950">
                <span className="font-medium">Estimated Cost</span>
                <span className="text-3xl font-bold text-orange-600">${calculations.shippingCost.toFixed(2)}</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg border p-3 text-center">
                  <p className="text-sm text-muted-foreground">Actual Weight</p>
                  <p className="text-xl font-bold">{weight} lbs</p>
                </div>
                <div className="rounded-lg border p-3 text-center">
                  <p className="text-sm text-muted-foreground">Billable Weight</p>
                  <p className="text-xl font-bold">{calculations.billableWeight.toFixed(1)} lbs</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Package Info</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between rounded-lg border p-3">
                <span className="text-sm">Delivery Time</span>
                <Badge variant="outline">{calculations.method.days} days</Badge>
              </div>
              <div className="flex items-center justify-between rounded-lg border p-3">
                <span className="text-sm">Max Weight</span>
                <span className="font-medium">{calculations.method.maxWeight} lbs</span>
              </div>
              <div className="flex items-center justify-between rounded-lg border p-3">
                <span className="text-sm">Volume</span>
                <span className="font-medium">{calculations.volume.toLocaleString()} cu in</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Rate Comparison */}
      <Card>
        <CardHeader>
          <CardTitle>Rate Comparison - All Carriers</CardTitle>
          <CardDescription>Compare shipping costs across all carriers for your package</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {shippingMethods.map((method) => {
              const dimWeight = (length * width * height) / 166;
              const billWeight = Math.max(weight, dimWeight);
              const cost = method.baseRate + (billWeight * method.perPound);
              const isSelected = method.name === selectedMethod;

              return (
                <div
                  key={method.name}
                  className={`rounded-lg border p-4 transition-all hover:shadow-md cursor-pointer ${isSelected ? "border-primary bg-primary/5" : ""}`}
                  onClick={() => setSelectedMethod(method.name)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-medium text-sm">{method.name}</p>
                    {isSelected && <Badge variant="default" className="text-xs">Selected</Badge>}
                  </div>
                  <p className="text-2xl font-bold text-primary">${cost.toFixed(2)}</p>
                  <p className="text-xs text-muted-foreground mt-1">{method.days} days · Up to {method.maxWeight} lbs</p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}