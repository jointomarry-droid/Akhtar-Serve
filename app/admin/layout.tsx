"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LogOut, Home, ChevronRight } from "lucide-react";

function checkAdminAuth(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem("admin_auth") === "true";
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!checkAdminAuth()) {
      router.replace("/admin");
    } else {
      setIsAuthenticated(true);
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("admin_auth");
    localStorage.removeItem("admin_user");
    document.cookie = "admin_auth=; path=/; max-age=0";
    router.push("/admin");
  };

  if (!mounted || !isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-background">
      {/* Admin Header */}
      <header className="sticky top-0 z-50 border-b bg-card shadow-sm">
        <div className="mx-auto flex h-16 w-full items-center justify-between px-6">
          {/* Left - Logo & Breadcrumb */}
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm">
                AS
              </div>
              <span className="text-lg font-bold hidden sm:inline">Akhtar Serve</span>
            </Link>
            <div className="h-6 w-px bg-border" />
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Link href="/" className="hover:text-foreground transition-colors">
                <Home className="h-4 w-4" />
              </Link>
              <ChevronRight className="h-3 w-3" />
              <Link href="/admin/dashboard" className="hover:text-foreground transition-colors">
                Admin
              </Link>
              <ChevronRight className="h-3 w-3" />
              <span className="text-foreground font-medium">Dashboard</span>
            </div>
          </div>

          {/* Right - Admin Info & Logout */}
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium">Admin</p>
              <p className="text-xs text-muted-foreground">Administrator</p>
            </div>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold text-sm">
              A
            </div>
            <Button variant="outline" size="sm" onClick={handleLogout} className="gap-2">
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Admin Navigation */}
      <div className="border-b bg-card/50">
        <div className="mx-auto flex h-12 w-full items-center gap-1 px-6 overflow-x-auto">
          {adminNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground whitespace-nowrap"
            >
              <item.icon className="h-4 w-4" />
              {item.title}
            </Link>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <main className="mx-auto w-full max-w-[1400px] p-6">
        {children}
      </main>
    </div>
  );
}

import {
  LayoutDashboard,
  Users,
  Package,
  ShoppingCart,
  Settings,
  BarChart3,
  Shield,
} from "lucide-react";

const adminNav = [
  { title: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { title: "Users", href: "/admin/users", icon: Users },
  { title: "Products", href: "/admin/products", icon: Package },
  { title: "Orders", href: "/admin/orders", icon: ShoppingCart },
  { title: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
  { title: "Settings", href: "/admin/settings", icon: Settings },
];