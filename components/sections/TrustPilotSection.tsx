"use client";

import { Star } from "lucide-react";

const reviews = [
  {
    name: "Sarah Johnson",
    company: "Johnson Trading Co.",
    rating: 5,
    title: "Game changer for our eBay business",
    text: "Akhtar Serve transformed how we manage our eBay store. The inventory sync alone saved us from overselling 50+ times last month. Absolutely essential tool.",
    date: "2 weeks ago",
    verified: true,
  },
  {
    name: "Michael Chen",
    company: "Pacific Imports LLC",
    rating: 5,
    title: "Best multi-channel tool we've used",
    text: "We tried 5 different tools before finding Akhtar Serve. The Amazon SP-API integration is rock solid and the analytics give us insights we never had before.",
    date: "1 month ago",
    verified: true,
  },
  {
    name: "Emily Rodriguez",
    company: "QuickShip Solutions",
    rating: 5,
    title: "Outstanding customer support",
    text: "The support team is incredible. They helped us set up our Amazon integration in under an hour. The platform is intuitive and powerful.",
    date: "3 weeks ago",
    verified: true,
  },
  {
    name: "David Kim",
    company: "GlobalRetail Inc.",
    rating: 5,
    title: "Scaled from 100 to 10,000 orders/month",
    text: "Akhtar Serve grew with us. From a small eBay shop to a multi-million dollar operation, this platform handled everything seamlessly.",
    date: "2 months ago",
    verified: true,
  },
  {
    name: "Lisa Thompson",
    company: "Thompson Enterprises",
    rating: 5,
    title: "The pricing engine is brilliant",
    text: "Dynamic pricing rules increased our profit margins by 23%. We no longer have to manually adjust prices across marketplaces.",
    date: "1 week ago",
    verified: true,
  },
  {
    name: "James Wilson",
    company: "Wilson Commerce",
    rating: 5,
    title: "Finally, one dashboard for everything",
    text: "Managing Amazon and eBay from a single dashboard saved us 20 hours per week. The order management is exceptional.",
    date: "4 days ago",
    verified: true,
  },
];

const StarRating = ({ rating }: { rating: number }) => (
  <div className="flex gap-1">
    {Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? "fill-[#00B67A] text-[#00B67A]" : "text-gray-300"
        }`}
      />
    ))}
  </div>
);

export default function TrustPilotSection() {
  return (
    <section className="py-24 bg-[#00B67A]/5">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="flex items-center gap-1 rounded-lg bg-[#00B67A] px-3 py-1.5">
              <span className="text-white font-bold text-sm">★ TrustScore</span>
              <span className="text-white font-bold text-lg">4.9</span>
              <span className="text-white/80 text-sm">|</span>
              <span className="text-white text-sm">5,247 reviews</span>
            </div>
          </div>
          <h2 className="text-3xl font-bold mb-2">What Our Customers Say</h2>
          <p className="text-muted-foreground">Trusted by thousands of sellers worldwide</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {reviews.map((review, i) => (
            <div
              key={i}
              className="rounded-xl border bg-card p-6 shadow-sm transition-all hover:shadow-md"
            >
              <div className="flex items-center justify-between mb-3">
                <StarRating rating={review.rating} />
                {review.verified && (
                  <span className="text-xs text-[#00B67A] font-medium flex items-center gap-1">
                    ✓ Verified
                  </span>
                )}
              </div>
              <h4 className="font-semibold mb-2">{review.title}</h4>
              <p className="text-sm text-muted-foreground mb-4">{review.text}</p>
              <div className="flex items-center justify-between border-t pt-4">
                <div>
                  <p className="font-medium text-sm">{review.name}</p>
                  <p className="text-xs text-muted-foreground">{review.company}</p>
                </div>
                <span className="text-xs text-muted-foreground">{review.date}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-4 rounded-xl border bg-card px-8 py-4 shadow-sm">
            <div className="text-left">
              <p className="font-semibold">Excellent</p>
              <p className="text-sm text-muted-foreground">Based on 5,247 reviews</p>
            </div>
            <div className="h-12 w-px bg-border" />
            <div className="flex items-center gap-2">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#00B67A] text-white text-xl font-bold">
                4.9
              </div>
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex h-6 w-6 items-center justify-center rounded bg-[#00B67A]">
                    <span className="text-white text-xs font-bold">★</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}