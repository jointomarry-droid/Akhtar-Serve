"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Save, Shield, Bell, Globe, Database, Key } from "lucide-react";

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">System Settings</h1>
        <p className="text-muted-foreground">Configure platform settings and integrations</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Shield className="h-5 w-5" />Security Settings</CardTitle><CardDescription>Manage security and authentication</CardDescription></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Two-Factor Authentication</Label>
              <div className="flex items-center justify-between rounded-lg border p-3"><span className="text-sm">Require 2FA for all admin users</span><Badge variant="default">Enabled</Badge></div>
            </div>
            <div className="space-y-2"><Label>Session Timeout (minutes)</Label><Input defaultValue="30" type="number" /></div>
            <div className="space-y-2">
              <Label>Password Policy</Label>
              <div className="flex items-center justify-between rounded-lg border p-3"><span className="text-sm">Min 8 chars, 1 uppercase, 1 number</span><Badge variant="outline">Active</Badge></div>
            </div>
            <Button className="gap-2"><Save className="h-4 w-4" />Save Security Settings</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Bell className="h-5 w-5" />Notification Settings</CardTitle><CardDescription>Configure email and push notifications</CardDescription></CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between rounded-lg border p-3"><span className="text-sm">New user registrations</span><Badge variant="default">On</Badge></div>
            <div className="flex items-center justify-between rounded-lg border p-3"><span className="text-sm">Low stock alerts</span><Badge variant="default">On</Badge></div>
            <div className="flex items-center justify-between rounded-lg border p-3"><span className="text-sm">Order notifications</span><Badge variant="default">On</Badge></div>
            <div className="flex items-center justify-between rounded-lg border p-3"><span className="text-sm">Daily summary email</span><Badge variant="secondary">Off</Badge></div>
            <Button className="gap-2"><Save className="h-4 w-4" />Save Notification Settings</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Globe className="h-5 w-5" />API Configuration</CardTitle><CardDescription>Manage API keys and integrations</CardDescription></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Amazon SP-API Key</Label>
              <Input type="password" placeholder="Enter API key" defaultValue="••••••••••••••••" />
            </div>
            <div className="space-y-2">
              <Label>eBay API Token</Label>
              <Input type="password" placeholder="Enter API token" defaultValue="••••••••••••••••" />
            </div>
            <div className="flex items-center justify-between rounded-lg border p-3"><span className="text-sm">Firebase Status</span><Badge variant="default">Connected</Badge></div>
            <Button className="gap-2"><Key className="h-4 w-4" />Update API Keys</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Database className="h-5 w-5" />Database Settings</CardTitle><CardDescription>Firestore configuration and backups</CardDescription></CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between rounded-lg border p-3"><span className="text-sm">Firestore Region</span><Badge variant="outline">us-central1</Badge></div>
            <div className="flex items-center justify-between rounded-lg border p-3"><span className="text-sm">Auto Backup</span><Badge variant="default">Daily 2AM</Badge></div>
            <div className="flex items-center justify-between rounded-lg border p-3"><span className="text-sm">Data Retention</span><Badge variant="outline">90 days</Badge></div>
            <div className="flex items-center justify-between rounded-lg border p-3"><span className="text-sm">Storage Used</span><Badge variant="outline">2.4 GB / 10 GB</Badge></div>
            <Button className="gap-2"><Save className="h-4 w-4" />Save Database Settings</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}