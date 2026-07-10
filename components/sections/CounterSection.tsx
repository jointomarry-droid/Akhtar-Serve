"use client";

import { useEffect, useState, useRef } from "react";
import { Users, Package, ShoppingCart, Globe, Clock, Award } from "lucide-react";

interface CounterProps {
  end: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
}

function Counter({ end, suffix = "", prefix = "", duration = 2000 }: CounterProps) {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    let startTime: number;
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * end));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [isVisible, end, duration]);

  return (
    <div ref={ref} className="text-4xl font-bold text-primary">
      {prefix}{count.toLocaleString()}{suffix}
    </div>
  );
}

const stats = [
  {
    icon: Users,
    title: "Active Sellers",
    value: 10847,
    suffix: "+",
    description: "Growing every day",
    color: "text-blue-600",
    bg: "bg-blue-100",
  },
  {
    icon: Package,
    title: "Products Managed",
    value: 2450000,
    suffix: "+",
    description: "Across all marketplaces",
    color: "text-green-600",
    bg: "bg-green-100",
  },
  {
    icon: ShoppingCart,
    title: "Orders Processed",
    value: 52000000,
    suffix: "+",
    description: "And counting...",
    color: "text-purple-600",
    bg: "bg-purple-100",
  },
  {
    icon: Globe,
    title: "Countries Served",
    value: 47,
    suffix: "+",
    description: "Worldwide reach",
    color: "text-orange-600",
    bg: "bg-orange-100",
  },
  {
    icon: Clock,
    title: "Hours Saved Weekly",
    value: 250000,
    suffix: "+",
    description: "For our customers",
    color: "text-cyan-600",
    bg: "bg-cyan-100",
  },
  {
    icon: Award,
    title: "Customer Rating",
    value: 49,
    prefix: "4.",
    suffix: "/5",
    description: "Average satisfaction",
    color: "text-yellow-600",
    bg: "bg-yellow-100",
  },
];

export default function CounterSection() {
  return (
    <section className="py-24 bg-gradient-to-br from-primary to-primary/80 text-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-2">Numbers That Speak for Themselves</h2>
          <p className="text-white/80">
            Trusted by sellers worldwide to power their eCommerce success
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {stats.map((stat) => (
            <div
              key={stat.title}
              className="rounded-2xl bg-white/10 backdrop-blur-sm p-6 text-center transition-all hover:bg-white/15 hover:scale-105"
            >
              <div className={`inline-flex h-14 w-14 items-center justify-center rounded-xl ${stat.bg} mb-4`}>
                <stat.icon className={`h-7 w-7 ${stat.color}`} />
              </div>
              <Counter end={stat.value} suffix={stat.suffix} prefix={stat.prefix} />
              <p className="text-lg font-medium mt-2">{stat.title}</p>
              <p className="text-sm text-white/70">{stat.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}