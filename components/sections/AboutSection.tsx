"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Rocket, Target, Heart, Shield, Zap, Globe } from "lucide-react";

const values = [
  {
    icon: Rocket,
    title: "Innovation First",
    description: "We constantly push boundaries to bring you cutting-edge eCommerce solutions powered by AI and real-time data.",
  },
  {
    icon: Target,
    title: "Results Driven",
    description: "Every feature we build is designed to increase your sales, reduce costs, and save you time.",
  },
  {
    icon: Heart,
    title: "Customer Obsessed",
    description: "Your success is our success. We provide 24/7 support and dedicated account managers for every seller.",
  },
  {
    icon: Shield,
    title: "Trust & Security",
    description: "Bank-level encryption, SOC 2 compliance, and GDPR adherence protect your business data.",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "99.99% uptime SLA with global CDN and edge computing for instant response times.",
  },
  {
    icon: Globe,
    title: "Global Reach",
    description: "Support for 47+ countries, 12 languages, and all major marketplaces worldwide.",
  },
];

const milestones = [
  { year: "2020", event: "Founded by Shoaib Akhtar with a vision to simplify multi-channel selling" },
  { year: "2021", event: "Launched Amazon SP-API integration, onboarded first 500 sellers" },
  { year: "2022", event: "Added eBay Trading API, reached 5,000 active sellers milestone" },
  { year: "2023", event: "Introduced AI-powered listing optimization and dynamic pricing engine" },
  { year: "2024", event: "Expanded to 10,000+ sellers, $500M+ annual GMV processed" },
  { year: "2025", event: "Launched enterprise plans, Walmart Marketplace integration coming soon" },
];

export default function AboutSection() {
  return (
    <section className="py-24">
      <div className="container mx-auto px-4">
        {/* Hero */}
        <div className="mb-24 text-center">
          <Badge variant="secondary" className="mb-4 gap-1">About Akhtar Serve</Badge>
          <h2 className="text-4xl font-bold mb-4">
            Empowering eCommerce Sellers<br />Since 2020
          </h2>
          <p className="mx-auto max-w-3xl text-lg text-muted-foreground">
            Founded by Shoaib Akhtar, Akhtar Serve was born from the frustration of managing
            multiple marketplaces with disconnected tools. We envisioned a single platform that
            would unify inventory, orders, analytics, and growth — and we built it.
          </p>
        </div>

        {/* Founder */}
        <div className="mb-24 rounded-3xl border bg-card p-8 md:p-12 shadow-sm">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex-shrink-0">
              <div className="h-32 w-32 rounded-full bg-primary/10 flex items-center justify-center text-5xl font-bold text-primary">
                SA
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-1">Shoaib Akhtar</h3>
              <p className="text-primary font-medium mb-4">Founder & CEO</p>
              <blockquote className="text-lg text-muted-foreground italic border-l-4 border-primary pl-4 mb-4">
                "When I started selling on Amazon and eBay, I spent more time managing tools than
                growing my business. I built Akhtar Serve to give sellers back their time — so
                they can focus on what matters: selling great products and delighting customers."
              </blockquote>
              <p className="text-sm text-muted-foreground">
                With over a decade of experience in eCommerce and technology, Shoaib leads our
                team in building the most powerful multi-channel selling platform in the market.
              </p>
            </div>
          </div>
        </div>

        {/* Mission & Vision */}
        <div className="mb-24 grid gap-8 md:grid-cols-2">
          <div className="rounded-2xl border bg-card p-8 shadow-sm">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Target className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold mb-2">Our Mission</h3>
            <p className="text-muted-foreground">
              To democratize multi-channel eCommerce by providing enterprise-grade tools to
              sellers of all sizes. We believe every seller deserves access to the same
              technology that powers the world's biggest brands.
            </p>
          </div>
          <div className="rounded-2xl border bg-card p-8 shadow-sm">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Rocket className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold mb-2">Our Vision</h3>
            <p className="text-muted-foreground">
              To become the world's most trusted eCommerce operating system, enabling sellers
              to manage their entire business from a single platform — from listing to delivery,
              from analytics to growth.
            </p>
          </div>
        </div>

        {/* Values */}
        <div className="mb-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-2">Our Core Values</h2>
            <p className="text-muted-foreground">The principles that guide everything we do</p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {values.map((value) => (
              <div key={value.title} className="rounded-xl border bg-card p-6 shadow-sm transition-all hover:shadow-md hover:-translate-y-1">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <value.icon className="h-6 w-6" />
                </div>
                <h4 className="text-lg font-semibold mb-2">{value.title}</h4>
                <p className="text-sm text-muted-foreground">{value.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Timeline */}
        <div className="mb-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-2">Our Journey</h2>
            <p className="text-muted-foreground">Key milestones in our growth story</p>
          </div>
          <div className="relative">
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-border" />
            <div className="space-y-8">
              {milestones.map((milestone, i) => (
                <div key={milestone.year} className={`relative flex items-center ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}>
                  <div className="absolute left-4 md:left-1/2 -translate-x-1/2 h-4 w-4 rounded-full border-4 border-primary bg-background z-10" />
                  <div className={`ml-12 md:ml-0 md:w-1/2 ${i % 2 === 0 ? "md:pr-12" : "md:pl-12"}`}>
                    <div className="rounded-xl border bg-card p-4 shadow-sm">
                      <Badge variant="outline" className="mb-2">{milestone.year}</Badge>
                      <p className="text-sm">{milestone.event}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Join Our Story?</h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Start your journey with Akhtar Serve today and experience the power of unified
            multi-channel eCommerce management.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link href="/register">
              <Button size="lg" className="px-8">Get Started Free</Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline" className="px-8">Contact Us</Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}