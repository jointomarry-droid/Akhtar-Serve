"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, X, ExternalLink, RefreshCw } from "lucide-react";

const integrations = [
  {
    id: "amazon",
    name: "Amazon SP-API",
    description:
      "Connect your Amazon Seller Central account to sync products, orders, and inventory.",
    icon: "a",
    color: "#FF9900",
    connected: true,
    storeName: "My Amazon Store",
    lastSync: "2 minutes ago",
    status: "Connected",
  },
  {
    id: "ebay",
    name: "eBay API",
    description:
      "Connect your eBay account to manage listings, orders, and fulfillment.",
    icon: "e",
    color: "#E53238",
    connected: true,
    storeName: "My eBay Store",
    lastSync: "5 minutes ago",
    status: "Connected",
  },
  {
    id: "shopify",
    name: "Shopify",
    description:
      "Sync your Shopify store products and orders with Akhtar Serve.",
    icon: "S",
    color: "#96BF48",
    connected: false,
    storeName: null,
    lastSync: null,
    status: "Not Connected",
  },
  {
    id: "walmart",
    name: "Walmart Marketplace",
    description:
      "Connect your Walmart Marketplace account to expand your reach.",
    icon: "W",
    color: "#0071DC",
    connected: false,
    storeName: null,
    lastSync: null,
    status: "Not Connected",
  },
];

export default function IntegrationsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Integrations</h2>
          <p className="text-muted-foreground">
            Connect your marketplace accounts to sync data
          </p>
        </div>
        <Button>
          <RefreshCw className="mr-2 h-4 w-4" />
          Sync All
        </Button>
      </div>

      {/* Connected Integrations */}
      <div>
        <h3 className="mb-4 text-lg font-semibold">Connected</h3>
        <div className="grid gap-4 md:grid-cols-2">
          {integrations
            .filter((i) => i.connected)
            .map((integration) => (
              <Card key={integration.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="flex h-12 w-12 items-center justify-center rounded-xl text-white font-bold text-xl"
                        style={{ backgroundColor: integration.color }}
                      >
                        {integration.icon}
                      </div>
                      <div>
                        <CardTitle>{integration.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">
                          {integration.storeName}
                        </p>
                      </div>
                    </div>
                    <span className="flex items-center gap-1 text-sm text-green-600">
                      <Check className="h-4 w-4" />
                      {integration.status}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="mb-4 text-sm text-muted-foreground">
                    {integration.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      Last sync: {integration.lastSync}
                    </span>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <RefreshCw className="mr-1 h-3 w-3" />
                        Sync
                      </Button>
                      <Button variant="outline" size="sm">
                        <ExternalLink className="mr-1 h-3 w-3" />
                        Settings
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>
      </div>

      {/* Available Integrations */}
      <div>
        <h3 className="mb-4 text-lg font-semibold">Available Integrations</h3>
        <div className="grid gap-4 md:grid-cols-2">
          {integrations
            .filter((i) => !i.connected)
            .map((integration) => (
              <Card key={integration.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="flex h-12 w-12 items-center justify-center rounded-xl text-white font-bold text-xl"
                        style={{ backgroundColor: integration.color }}
                      >
                        {integration.icon}
                      </div>
                      <div>
                        <CardTitle>{integration.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">
                          Not connected
                        </p>
                      </div>
                    </div>
                    <span className="flex items-center gap-1 text-sm text-muted-foreground">
                      <X className="h-4 w-4" />
                      {integration.status}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="mb-4 text-sm text-muted-foreground">
                    {integration.description}
                  </p>
                  <Button className="w-full">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Connect {integration.name}
                  </Button>
                </CardContent>
              </Card>
            ))}
        </div>
      </div>
    </div>
  );
}
