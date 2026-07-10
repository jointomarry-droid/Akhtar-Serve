import Link from "next/link";
import { Button } from "@/components/ui/button";
import HeroSlider from "@/components/hero/HeroSlider";
import TrustPilotSection from "@/components/sections/TrustPilotSection";
import TrustedCompaniesSection from "@/components/sections/TrustedCompaniesSection";
import NewsletterSection from "@/components/sections/NewsletterSection";
import AboutSection from "@/components/sections/AboutSection";
import CounterSection from "@/components/sections/CounterSection";
import FAQSection from "@/components/sections/FAQSection";
import ThemeToggle from "@/components/ui/ThemeToggle";
import SchemaOrg from "@/components/seo/SchemaOrg";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SchemaOrg />

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b bg-background/80 backdrop-blur-sm">
        <div className="mx-auto flex h-16 w-full max-w-[1400px] items-center px-6">
          {/* Logo - Far Left */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
              AS
            </div>
            <span className="text-xl font-bold">Akhtar Serve</span>
          </Link>

          {/* Spacer */}
          <div className="flex-1" />

          {/* All Buttons - Far Right */}
          <nav className="flex items-center gap-1 flex-shrink-0">
            <Link href="/about">
              <Button variant="ghost" className="hidden sm:inline-flex">About</Button>
            </Link>
            <Link href="/contact">
              <Button variant="ghost" className="hidden sm:inline-flex">Contact</Button>
            </Link>
            <ThemeToggle />
            <Link href="/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link href="/register">
              <Button>Get Started</Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Slider */}
      <main className="flex-1">
        <div className="pt-16">
          <HeroSlider />
        </div>

        {/* Trusted Companies */}
        <TrustedCompaniesSection />

        {/* Features */}
        <section className="border-t bg-muted/50 py-24">
          <div className="container mx-auto px-4">
            <h2 className="mb-4 text-center text-3xl font-bold">
              Everything You Need to Scale
            </h2>
            <p className="mb-12 text-center text-muted-foreground">
              Powerful tools to manage your Amazon and eBay businesses efficiently
            </p>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {features.map((feature, i) => (
                <div
                  key={feature.title}
                  className={`animate-fade-in-up stagger-${i + 1} rounded-lg border bg-card p-6 shadow-sm transition-all hover:shadow-md hover:-translate-y-1`}
                >
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    {feature.icon}
                  </div>
                  <h3 className="mb-2 text-lg font-semibold">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                  <Link href={feature.link} className="mt-4 inline-block">
                    <Button variant="link" className="p-0 h-auto text-sm">
                      Learn more →
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Integrations */}
        <section className="py-24">
          <div className="container mx-auto px-4 text-center">
            <h2 className="mb-4 text-3xl font-bold">
              Integrated with Leading Marketplaces
            </h2>
            <p className="mb-12 text-muted-foreground">
              Connect your Amazon and eBay stores in minutes
            </p>
            <div className="flex flex-wrap items-center justify-center gap-12">
              <Link href="/dashboard/integrations" className="group">
                <div className="flex items-center gap-3 transition group-hover:scale-105">
                  <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-[#FF9900] text-white font-bold text-2xl shadow-lg shadow-[#FF9900]/30">
                    a
                  </div>
                  <div className="text-left">
                    <span className="text-2xl font-bold block">Amazon</span>
                    <span className="text-sm text-muted-foreground">SP-API Integration</span>
                  </div>
                </div>
              </Link>
              <Link href="/dashboard/integrations" className="group">
                <div className="flex items-center gap-3 transition group-hover:scale-105">
                  <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-[#E53238] text-white font-bold text-2xl shadow-lg shadow-[#E53238]/30">
                    e
                  </div>
                  <div className="text-left">
                    <span className="text-2xl font-bold block">eBay</span>
                    <span className="text-sm text-muted-foreground">Trading API</span>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </section>

        {/* Counter Stats */}
        <CounterSection />

        {/* About Section */}
        <AboutSection />

        {/* TrustPilot Reviews */}
        <TrustPilotSection />

        {/* FAQ Section */}
        <FAQSection />

        {/* Newsletter */}
        <NewsletterSection />

        {/* CTA */}
        <section className="py-24">
          <div className="container mx-auto px-4 text-center">
            <h2 className="mb-4 text-3xl font-bold">
              Ready to Scale Your eCommerce Business?
            </h2>
            <p className="mb-8 text-lg text-muted-foreground">
              Join thousands of sellers who trust Akhtar Serve to grow their Amazon and eBay businesses.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Link href="/register">
                <Button size="lg" className="px-8 text-lg">
                  Start Free Trial
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline" className="px-8 text-lg">
                  Talk to Sales
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-5">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
                  AS
                </div>
                <span className="text-xl font-bold">Akhtar Serve</span>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Enterprise-grade multi-channel eCommerce management platform for Amazon and eBay sellers.
              </p>
              <p className="text-sm text-muted-foreground">
                Founded by Shoaib Akhtar
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/dashboard/products" className="hover:underline">Products</Link></li>
                <li><Link href="/dashboard/orders" className="hover:underline">Orders</Link></li>
                <li><Link href="/dashboard/inventory" className="hover:underline">Inventory</Link></li>
                <li><Link href="/dashboard/analytics" className="hover:underline">Analytics</Link></li>
                <li><Link href="/dashboard/pricing" className="hover:underline">Pricing</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/dashboard/support" className="hover:underline">Help Center</Link></li>
                <li><Link href="/contact" className="hover:underline">Contact Support</Link></li>
                <li><Link href="/about" className="hover:underline">About Us</Link></li>
                <li><Link href="/dashboard/integrations" className="hover:underline">Integrations</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/privacy" className="hover:underline">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:underline">Terms of Service</Link></li>
                <li><Link href="/cookies" className="hover:underline">Cookie Policy</Link></li>
              </ul>
              <h4 className="font-semibold mt-6 mb-4">Admin</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/admin" className="hover:underline text-primary font-medium">Admin Panel →</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} Akhtar Serve. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

const features = [
  {
    title: "Multi-Channel Inventory",
    description: "Sync inventory across Amazon and eBay in real-time. Never oversell again.",
    icon: "📦",
    link: "/dashboard/inventory",
  },
  {
    title: "Order Management",
    description: "Process orders from all marketplaces in one unified dashboard.",
    icon: "🛒",
    link: "/dashboard/orders",
  },
  {
    title: "Listing Optimization",
    description: "AI-powered tools to optimize your product listings for maximum visibility.",
    icon: "✨",
    link: "/dashboard/products",
  },
  {
    title: "Pricing Intelligence",
    description: "Dynamic pricing rules based on competitors, margins, and demand.",
    icon: "💰",
    link: "/dashboard/pricing",
  },
  {
    title: "Analytics & Reports",
    description: "Deep insights into sales, profits, and business performance.",
    icon: "📊",
    link: "/dashboard/analytics",
  },
  {
    title: "Team Collaboration",
    description: "Manage your team with role-based access and activity tracking.",
    icon: "👥",
    link: "/dashboard/team",
  },
];