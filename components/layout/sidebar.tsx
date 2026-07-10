"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Warehouse,
  BarChart3,
  DollarSign,
  Link2,
  Users,
  Settings,
  HelpCircle,
  CreditCard,
  Zap,
  Sparkles,
  Globe,
  Calculator,
  Bot,
  TrendingUp,
  Target,
  Truck,
  MessageSquare,
} from "lucide-react";

const navItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "AI Tools & Agents",
    href: "/dashboard/ai-tools",
    icon: Bot,
  },
  {
    title: "AI Chat Assistant",
    href: "/dashboard/chat-history",
    icon: MessageSquare,
  },
  {
    title: "AI Product Hunter",
    href: "/dashboard/ai-hunting",
    icon: Zap,
  },
  {
    title: "AI Listing Optimizer",
    href: "/dashboard/ai-listing",
    icon: Sparkles,
  },
  {
    title: "Product Sources",
    href: "/dashboard/product-sources",
    icon: Globe,
  },
];

const calculatorItems = [
  {
    title: "Profit Calculator",
    href: "/dashboard/profit-calculator",
    icon: Calculator,
  },
  {
    title: "eBay Fee Calculator",
    href: "/dashboard/ebay-calculator",
    icon: DollarSign,
  },
  {
    title: "ROI Calculator",
    href: "/dashboard/roi-calculator",
    icon: TrendingUp,
  },
  {
    title: "Break-Even Calculator",
    href: "/dashboard/break-even",
    icon: Target,
  },
  {
    title: "Shipping Calculator",
    href: "/dashboard/shipping-calculator",
    icon: Truck,
  },
];

const managementItems = [
  {
    title: "Products",
    href: "/dashboard/products",
    icon: Package,
  },
  {
    title: "Listings",
    href: "/dashboard/listings",
    icon: Globe,
  },
  {
    title: "Orders",
    href: "/dashboard/orders",
    icon: ShoppingCart,
  },
  {
    title: "Inventory",
    href: "/dashboard/inventory",
    icon: Warehouse,
  },
  {
    title: "Analytics",
    href: "/dashboard/analytics",
    icon: BarChart3,
  },
  {
    title: "Pricing",
    href: "/dashboard/pricing",
    icon: DollarSign,
  },
  {
    title: "Integrations",
    href: "/dashboard/integrations",
    icon: Link2,
  },
  {
    title: "Team",
    href: "/dashboard/team",
    icon: Users,
  },
];

const bottomNavItems = [
  {
    title: "Billing",
    href: "/dashboard/billing",
    icon: CreditCard,
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
  {
    title: "Help & Support",
    href: "/dashboard/support",
    icon: HelpCircle,
  },
];

export function Sidebar() {
  const pathname = usePathname();

  const NavItem = ({ item }: { item: typeof navItems[0] }) => {
    const isActive = pathname === item.href;
    return (
      <Link
        href={item.href}
        className={cn(
          "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
          isActive
            ? "bg-primary/10 text-primary"
            : "text-muted-foreground hover:bg-muted hover:text-foreground"
        )}
      >
        <item.icon className="h-4 w-4" />
        {item.title}
      </Link>
    );
  };

  return (
    <aside className="flex h-screen w-64 flex-col border-r bg-card">
      {/* Logo */}
      <div className="flex h-16 items-center gap-2 border-b px-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm">
          AS
        </div>
        <span className="text-lg font-bold">Akhtar Serve</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto p-4">
        {/* Main Nav */}
        {navItems.map((item) => (
          <NavItem key={item.href} item={item} />
        ))}

        {/* Calculators Section */}
        <div className="pt-4 pb-2">
          <p className="px-3 text-xs font-semibold uppercase text-muted-foreground">Calculators</p>
        </div>
        {calculatorItems.map((item) => (
          <NavItem key={item.href} item={item} />
        ))}

        {/* Management Section */}
        <div className="pt-4 pb-2">
          <p className="px-3 text-xs font-semibold uppercase text-muted-foreground">Management</p>
        </div>
        {managementItems.map((item) => (
          <NavItem key={item.href} item={item} />
        ))}
      </nav>

      {/* Bottom Navigation */}
      <div className="space-y-1 border-t p-4">
        {bottomNavItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.title}
            </Link>
          );
        })}
      </div>
    </aside>
  );
}