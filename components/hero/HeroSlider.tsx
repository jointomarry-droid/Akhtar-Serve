"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

const slides = [
  {
    image: "https://images.unsplash.com/photo-1556740758-90de374c12ad?w=1920&q=100",
    title: "Amazon & eBay Management",
    subtitle: "Enterprise-Grade Multi-Channel Platform",
    description: "Automate listings, track inventory, process orders, and maximize profits across all marketplaces from one powerful dashboard.",
    cta: "Start Free Trial",
    ctaLink: "/register",
  },
  {
    image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1920&q=100",
    title: "Real-Time Inventory Sync",
    subtitle: "Never Oversell Again",
    description: "Keep your inventory perfectly synchronized across Amazon and eBay. Automatic stock updates prevent overselling and lost sales.",
    cta: "Explore Features",
    ctaLink: "/dashboard/inventory",
  },
  {
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1920&q=100",
    title: "Unified Order Processing",
    subtitle: "All Orders, One Dashboard",
    description: "Process orders from Amazon, eBay, and other channels in one place. Streamline fulfillment and reduce processing time by 70%.",
    cta: "View Dashboard",
    ctaLink: "/dashboard/orders",
  },
  {
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1920&q=100",
    title: "Advanced Analytics",
    subtitle: "Data-Driven Decisions",
    description: "Gain deep insights into sales performance, profit margins, and market trends. Make smarter decisions with real-time reporting.",
    cta: "View Analytics",
    ctaLink: "/dashboard/analytics",
  },
  {
    image: "https://images.unsplash.com/photo-1556742111-a301076d9d18?w=1920&q=100",
    title: "AI Listing Optimization",
    subtitle: "Maximize Visibility & Sales",
    description: "AI-powered tools optimize your product titles, descriptions, and keywords for maximum marketplace visibility and conversion rates.",
    cta: "Optimize Listings",
    ctaLink: "/dashboard/products",
  },
  {
    image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=1920&q=100",
    title: "Dynamic Pricing Engine",
    subtitle: "Competitive Pricing Intelligence",
    description: "Automated pricing rules based on competitor analysis, market demand, and profit margins. Stay competitive without sacrificing profits.",
    cta: "Set Pricing Rules",
    ctaLink: "/dashboard/pricing",
  },
  {
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1920&q=100",
    title: "Business Intelligence Reports",
    subtitle: "Comprehensive Performance Insights",
    description: "Generate detailed reports on sales trends, customer behavior, and marketplace performance. Export data for deeper analysis.",
    cta: "Generate Reports",
    ctaLink: "/dashboard/analytics",
  },
  {
    image: "https://images.unsplash.com/photo-1553028826-f4804a6dba3b?w=1920&q=100",
    title: "Marketplace Integration",
    subtitle: "Connect in Minutes",
    description: "Seamlessly connect your Amazon Seller Central and eBay accounts. Start syncing data within minutes of setup.",
    cta: "Connect Stores",
    ctaLink: "/dashboard/integrations",
  },
  {
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1920&q=100",
    title: "Team Collaboration",
    subtitle: "Manage Your Team with Ease",
    description: "Role-based access control, activity tracking, and collaborative tools. Empower your team while maintaining full control.",
    cta: "Manage Team",
    ctaLink: "/dashboard/team",
  },
  {
    image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=1920&q=100",
    title: "24/7 Support & Security",
    subtitle: "Enterprise-Grade Protection",
    description: "Bank-level security, automated backups, and 24/7 expert support. Your business data is always safe and accessible.",
    cta: "Contact Support",
    ctaLink: "/dashboard/support",
  },
];

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const [progress, setProgress] = useState(0);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % slides.length);
    setProgress(0);
  }, []);

  const prev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
    setProgress(0);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          next();
          return 0;
        }
        return prev + 2;
      });
    }, 100);
    return () => clearInterval(timer);
  }, [next]);

  const slide = slides[current];

  return (
    <section className="relative h-[85vh] w-full overflow-hidden">
      {slides.map((s, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            i === current ? "opacity-100" : "opacity-0"
          }`}
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${s.image})`,
              transform: i === current ? "scale(1.05)" : "scale(1)",
              transition: "transform 6s ease-out",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
        </div>
      ))}

      <div className="relative z-10 flex h-full items-center">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl">
            <div key={current} className="animate-fade-in-up">
              <span className="mb-4 inline-block rounded-full bg-white/20 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm">
                {slide.subtitle}
              </span>
              <h1 className="mb-6 text-5xl font-bold tracking-tight text-white lg:text-7xl">
                {slide.title}
              </h1>
              <p className="mb-8 text-lg text-white/80 lg:text-xl">
                {slide.description}
              </p>
              <div className="flex items-center gap-4">
                <Link href={slide.ctaLink}>
                  <Button size="lg" className="px-8 text-lg">
                    {slide.cta}
                  </Button>
                </Link>
                <Link href="/about">
                  <Button size="lg" variant="outline" className="px-8 text-lg border-white/30 text-white hover:bg-white/10">
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <button onClick={prev} className="absolute left-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/20 p-3 text-white backdrop-blur-sm transition hover:bg-white/30">
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button onClick={next} className="absolute right-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/20 p-3 text-white backdrop-blur-sm transition hover:bg-white/30">
        <ChevronRight className="h-6 w-6" />
      </button>

      <div className="absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => { setCurrent(i); setProgress(0); }}
            className="relative h-2 overflow-hidden rounded-full bg-white/30 transition-all"
            style={{ width: i === current ? 40 : 8 }}
          >
            {i === current && (
              <div
                className="absolute inset-y-0 left-0 bg-white"
                style={{ width: `${progress}%` }}
              />
            )}
          </button>
        ))}
      </div>

      <div className="absolute bottom-24 left-1/2 z-20 flex -translate-x-1/2 gap-4">
        <Link href="/dashboard">
          <Button size="lg" className="bg-[#FF9900] text-white hover:bg-[#FF9900]/90">
            Amazon Dashboard
          </Button>
        </Link>
        <Link href="/dashboard">
          <Button size="lg" className="bg-[#E53238] text-white hover:bg-[#E53238]/90">
            eBay Dashboard
          </Button>
        </Link>
      </div>
    </section>
  );
}