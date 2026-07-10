"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Mail, CheckCircle, Sparkles, Gift, Zap } from "lucide-react";

export default function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    // Simulate API call
    await new Promise((r) => setTimeout(r, 1500));
    setSubscribed(true);
    setLoading(false);
  };

  return (
    <section className="py-24 bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl">
          <div className="rounded-3xl border bg-card p-8 shadow-xl md:p-12">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 mb-4">
                <Badge variant="secondary" className="gap-1">
                  <Sparkles className="h-3 w-3" />
                  Free Resources
                </Badge>
              </div>
              <h2 className="text-3xl font-bold mb-2">
                Stay Ahead of the Market
              </h2>
              <p className="text-muted-foreground">
                Get exclusive insights, marketplace updates, and eCommerce tips delivered to your inbox weekly.
              </p>
            </div>

            {!subscribed ? (
              <form onSubmit={handleSubscribe} className="space-y-6">
                <div className="flex gap-3">
                  <div className="relative flex-1">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      type="email"
                      placeholder="Enter your email address"
                      className="pl-10 h-12"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" size="lg" className="h-12 px-8" disabled={loading}>
                    {loading ? "Subscribing..." : "Subscribe"}
                  </Button>
                </div>
                <p className="text-xs text-center text-muted-foreground">
                  No spam. Unsubscribe anytime. We respect your privacy.
                </p>
              </form>
            ) : (
              <div className="text-center py-4">
                <div className="inline-flex items-center gap-2 text-green-600 mb-2">
                  <CheckCircle className="h-6 w-6" />
                  <span className="text-lg font-semibold">Welcome aboard!</span>
                </div>
                <p className="text-muted-foreground">
                  Check your inbox for a confirmation email with your welcome gift.
                </p>
              </div>
            )}

            <div className="mt-8 grid grid-cols-3 gap-4 text-center">
              <div className="rounded-xl bg-muted/50 p-4">
                <Gift className="h-6 w-6 mx-auto mb-2 text-primary" />
                <p className="text-sm font-medium">Free eBook</p>
                <p className="text-xs text-muted-foreground">eCommerce Growth Guide</p>
              </div>
              <div className="rounded-xl bg-muted/50 p-4">
                <Zap className="h-6 w-6 mx-auto mb-2 text-primary" />
                <p className="text-sm font-medium">Weekly Tips</p>
                <p className="text-xs text-muted-foreground">Marketplace Strategies</p>
              </div>
              <div className="rounded-xl bg-muted/50 p-4">
                <Mail className="h-6 w-6 mx-auto mb-2 text-primary" />
                <p className="text-sm font-medium">Early Access</p>
                <p className="text-xs text-muted-foreground">New Features First</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}