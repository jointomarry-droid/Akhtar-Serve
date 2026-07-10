"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Save, Building2, Bell, Shield, CreditCard } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">
          Manage your account and application settings
        </p>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList>
          <TabsTrigger value="general" className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            General
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Security
          </TabsTrigger>
          <TabsTrigger value="billing" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            Billing
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>Organization Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="orgName">Organization Name</Label>
                  <Input id="orgName" defaultValue="Akhtar Serve" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="orgEmail">Contact Email</Label>
                  <Input
                    id="orgEmail"
                    type="email"
                    defaultValue="contact@akhtarserve.com"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="orgAddress">Business Address</Label>
                <Input id="orgAddress" defaultValue="123 Business St, Suite 100" />
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="orgCity">City</Label>
                  <Input id="orgCity" defaultValue="New York" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="orgState">State</Label>
                  <Input id="orgState" defaultValue="NY" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="orgZip">ZIP Code</Label>
                  <Input id="orgZip" defaultValue="10001" />
                </div>
              </div>
              <div className="flex justify-end">
                <Button>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="text-sm font-medium">Email Notifications</h4>
                {emailNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className="flex items-center justify-between"
                  >
                    <div>
                      <p className="font-medium">{notification.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {notification.description}
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      defaultChecked={notification.default}
                      className="h-4 w-4"
                    />
                  </div>
                ))}
              </div>
              <div className="flex justify-end">
                <Button>
                  <Save className="mr-2 h-4 w-4" />
                  Save Preferences
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="text-sm font-medium">
                  Two-Factor Authentication
                </h4>
                <p className="text-sm text-muted-foreground">
                  Add an extra layer of security to your account
                </p>
                <Button variant="outline">Enable 2FA</Button>
              </div>
              <div className="space-y-4">
                <h4 className="text-sm font-medium">Change Password</h4>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input id="currentPassword" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input id="newPassword" type="password" />
                  </div>
                </div>
                <Button variant="outline">Update Password</Button>
              </div>
              <div className="space-y-4">
                <h4 className="text-sm font-medium">API Keys</h4>
                <p className="text-sm text-muted-foreground">
                  Manage your API keys for external integrations
                </p>
                <Button variant="outline">Generate New Key</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="billing">
          <Card>
            <CardHeader>
              <CardTitle>Billing & Subscription</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="rounded-lg border p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Current Plan: Professional</p>
                    <p className="text-sm text-muted-foreground">
                      $79/month - Billed monthly
                    </p>
                  </div>
                  <Button variant="outline">Upgrade Plan</Button>
                </div>
              </div>
              <div className="space-y-4">
                <h4 className="text-sm font-medium">Payment Method</h4>
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-16 items-center justify-center rounded border bg-muted">
                    **** **** **** 4242
                  </div>
                  <Button variant="outline" size="sm">
                    Update
                  </Button>
                </div>
              </div>
              <div className="space-y-4">
                <h4 className="text-sm font-medium">Billing History</h4>
                <p className="text-sm text-muted-foreground">
                  View your past invoices and payments
                </p>
                <Button variant="outline" size="sm">
                  View History
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

const emailNotifications = [
  {
    id: "orders",
    title: "Order Updates",
    description: "Receive notifications for new orders and status changes",
    default: true,
  },
  {
    id: "inventory",
    title: "Inventory Alerts",
    description: "Get notified when stock is low or out of stock",
    default: true,
  },
  {
    id: "pricing",
    title: "Price Changes",
    description: "Alerts when competitor prices change significantly",
    default: true,
  },
  {
    id: "sync",
    title: "Sync Errors",
    description: "Notifications for marketplace sync failures",
    default: true,
  },
  {
    id: "weekly",
    title: "Weekly Reports",
    description: "Receive weekly performance summaries",
    default: false,
  },
];
