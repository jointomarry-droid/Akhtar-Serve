"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, DollarSign, TrendingUp, Target } from "lucide-react";

const pricingRules = [
  {
    id: "1",
    name: "Competitor Price Match",
    type: "Competitor",
    product: "All Products",
    action: "Match lowest competitor",
    status: "Active",
    lastApplied: "2 min ago",
  },
  {
    id: "2",
    name: "Margin Protection",
    type: "Margin",
    product: "Electronics",
    action: "Maintain 25% margin",
    status: "Active",
    lastApplied: "15 min ago",
  },
  {
    id: "3",
    name: "Slow Mover Discount",
    type: "Velocity",
    product: "Low Velocity Items",
    action: "10% discount after 30 days",
    status: "Active",
    lastApplied: "1 hour ago",
  },
  {
    id: "4",
    name: "Flash Sale Pricing",
    type: "Time-based",
    product: "Selected Products",
    action: "20% off during sale",
    status: "Paused",
    lastApplied: "2 days ago",
  },
];

export default function PricingPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Pricing</h2>
          <p className="text-muted-foreground">
            Manage pricing rules and optimize your margins
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Rule
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Rules
            </CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">
              1 rule paused
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Avg Margin
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">32.5%</div>
            <p className="text-xs text-green-600">+2.3% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Price Changes Today
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">47</div>
            <p className="text-xs text-muted-foreground">
              Across all marketplaces
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Pricing Rules Table */}
      <Card>
        <CardHeader>
          <CardTitle>Pricing Rules</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Rule Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Products</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Applied</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pricingRules.map((rule) => (
                <TableRow key={rule.id}>
                  <TableCell className="font-medium">{rule.name}</TableCell>
                  <TableCell>{rule.type}</TableCell>
                  <TableCell>{rule.product}</TableCell>
                  <TableCell>{rule.action}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                        rule.status === "Active"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {rule.status}
                    </span>
                  </TableCell>
                  <TableCell>{rule.lastApplied}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      Edit
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
