"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CreditCard,
  Check,
  ArrowRight,
  Download,
  Receipt,
} from "lucide-react";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    features: [
      "1 marketplace integration",
      "Up to 100 products",
      "Basic analytics",
      "Email support",
    ],
    current: true,
  },
  {
    name: "Starter",
    price: "$29",
    period: "/month",
    features: [
      "2 marketplace integrations",
      "Up to 1,000 products",
      "Advanced analytics",
      "Priority support",
      "Inventory sync",
    ],
    current: false,
  },
  {
    name: "Professional",
    price: "$79",
    period: "/month",
    features: [
      "Unlimited marketplace integrations",
      "Unlimited products",
      "Custom reports",
      "API access",
      "Dedicated support",
      "Advanced pricing rules",
    ],
    current: false,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    features: [
      "Everything in Professional",
      "Custom integrations",
      "White-label options",
      "SLA guarantee",
      "Account manager",
      "On-premise deployment",
    ],
    current: false,
  },
];

const invoices = [
  {
    id: "INV-001",
    date: "2024-01-01",
    amount: "$0.00",
    status: "Paid",
  },
];

export default function BillingPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Billing & Subscription</h2>
        <p className="text-muted-foreground">
          Manage your subscription plan and payment methods
        </p>
      </div>

      {/* Current Plan */}
      <Card>
        <CardHeader>
          <CardTitle>Current Plan</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-2xl font-bold">Free Plan</h3>
                <Badge variant="secondary">Current</Badge>
              </div>
              <p className="text-muted-foreground">
                You are currently on the free plan
              </p>
            </div>
            <Button>
              Upgrade Plan
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Pricing Plans */}
      <div>
        <h3 className="mb-4 text-lg font-semibold">Available Plans</h3>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={plan.current ? "border-primary" : ""}
            >
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  {plan.name}
                  {plan.current && (
                    <Badge variant="secondary">Current</Badge>
                  )}
                </CardTitle>
                <div className="mt-2">
                  <span className="text-3xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground">
                    {plan.period}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-green-600" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button
                  variant={plan.current ? "outline" : "default"}
                  className="w-full"
                  disabled={plan.current}
                >
                  {plan.current ? "Current Plan" : "Select Plan"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Payment Method */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Method</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-16 items-center justify-center rounded border bg-muted">
                <CreditCard className="h-6 w-6" />
              </div>
              <div>
                <p className="font-medium">No payment method added</p>
                <p className="text-sm text-muted-foreground">
                  Add a payment method to upgrade your plan
                </p>
              </div>
            </div>
            <Button variant="outline">Add Payment Method</Button>
          </div>
        </CardContent>
      </Card>

      {/* Invoice History */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Invoice History</CardTitle>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Download All
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {invoices.map((invoice) => (
              <div
                key={invoice.id}
                className="flex items-center justify-between border-b pb-4 last:border-0"
              >
                <div className="flex items-center gap-4">
                  <Receipt className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{invoice.id}</p>
                    <p className="text-sm text-muted-foreground">
                      {invoice.date}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-medium">{invoice.amount}</span>
                  <Badge variant="outline">{invoice.status}</Badge>
                  <Button variant="ghost" size="sm">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
