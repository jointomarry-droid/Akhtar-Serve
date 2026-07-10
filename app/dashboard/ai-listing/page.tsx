"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Copy, Check, RotateCcw, Zap, Target, FileText } from "lucide-react";

export default function AIListingPage() {
  const [productName, setProductName] = useState("");
  const [category, setCategory] = useState("");
  const [keywords, setKeywords] = useState("");
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [copied, setCopied] = useState(false);

  const [listing, setListing] = useState({
    title: "",
    description: "",
    bullets: [] as string[],
    backendKeywords: "",
    seoScore: 0,
  });

  const handleGenerate = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 2000));
    setListing({
      title: "Wireless Bluetooth Earbuds Pro - Active Noise Cancelling, 40H Battery Life, IPX7 Waterproof, Hi-Fi Audio, Touch Control - Premium Sound for iPhone, Samsung, Android",
      description: "Experience crystal-clear audio with our premium wireless earbuds featuring advanced Active Noise Cancelling technology. Designed for audiophiles and active lifestyles, these earbuds deliver studio-quality sound with deep bass and crisp highs. The ergonomic design ensures a secure, comfortable fit during workouts, commutes, or relaxation. With IPX7 waterproof rating, they withstand sweat and rain. Enjoy 40 hours of total playtime with the compact charging case. Perfect for music lovers, gamers, and professionals who demand the best.",
      bullets: [
        "Advanced ANC Technology - Block out distractions with hybrid active noise cancelling for immersive audio",
        "40-Hour Battery Life - Extended playtime with charging case, never run out of power",
        "IPX7 Waterproof - Built to withstand sweat, rain, and splashes for active lifestyles",
        "Premium Hi-Fi Audio - Custom drivers deliver rich bass and crystal-clear highs",
        "Ergonomic Comfort Fit - Soft silicone ear tips in 3 sizes for secure all-day wear",
      ],
      backendKeywords: "wireless earbuds, bluetooth earbuds, noise cancelling earbuds, waterproof earbuds, sports earbuds, running earbuds, gym earbuds, true wireless, stereo earbuds, bass earbuds",
      seoScore: 94,
    });
    setGenerated(true);
    setLoading(false);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Sparkles className="h-8 w-8 text-purple-500" />
          AI Listing Optimizer
        </h1>
        <p className="text-muted-foreground">Generate SEO-optimized product listings for Amazon & eBay</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Product Information</CardTitle>
            <CardDescription>Enter product details to generate optimized listing</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Product Name</Label>
              <Input placeholder="e.g., Wireless Bluetooth Earbuds" value={productName} onChange={(e) => setProductName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Category</Label>
              <Input placeholder="e.g., Electronics, Kitchen, Sports" value={category} onChange={(e) => setCategory(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Target Keywords</Label>
              <Input placeholder="e.g., wireless earbuds, bluetooth, noise cancelling" value={keywords} onChange={(e) => setKeywords(e.target.value)} />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleGenerate} disabled={loading} className="flex-1">
                {loading ? "Generating..." : "Generate Listing"}
              </Button>
              <Button variant="outline" onClick={() => { setGenerated(false); setProductName(""); setCategory(""); setKeywords(""); }}>
                <RotateCcw className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              SEO Score
              {generated && <Badge variant="default" className="ml-2">{listing.seoScore}/100</Badge>}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {generated ? (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-green-600">
                    <span className="text-2xl font-bold">{listing.seoScore}</span>
                  </div>
                  <div>
                    <p className="font-semibold text-lg text-green-600">Excellent</p>
                    <p className="text-sm text-muted-foreground">Your listing is optimized for maximum visibility</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm"><span>Title Length</span><Badge variant="default">Optimal</Badge></div>
                  <div className="flex justify-between text-sm"><span>Keyword Density</span><Badge variant="default">Good</Badge></div>
                  <div className="flex justify-between text-sm"><span>Readability</span><Badge variant="default">Excellent</Badge></div>
                  <div className="flex justify-between text-sm"><span>Bullet Points</span><Badge variant="default">5/5</Badge></div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                <Target className="h-12 w-12 mb-4 opacity-50" />
                <p>Enter product details and generate to see SEO score</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {generated && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Optimized Title
                <Button variant="ghost" size="sm" onClick={() => handleCopy(listing.title)}>
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="rounded-lg bg-muted p-4 text-sm">{listing.title}</p>
              <p className="mt-2 text-xs text-muted-foreground">{listing.title.length} characters</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2"><FileText className="h-5 w-5" />Product Description</span>
                <Button variant="ghost" size="sm" onClick={() => handleCopy(listing.description)}>
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="rounded-lg bg-muted p-4 text-sm leading-relaxed">{listing.description}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2"><Zap className="h-5 w-5" />Bullet Points</span>
                <Button variant="ghost" size="sm" onClick={() => handleCopy(listing.bullets.join("\n"))}>
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {listing.bullets.map((bullet, i) => (
                  <div key={i} className="flex items-start gap-2 rounded-lg bg-muted p-3">
                    <span className="text-primary font-bold">•</span>
                    <span className="text-sm">{bullet}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Backend Keywords
                <Button variant="ghost" size="sm" onClick={() => handleCopy(listing.backendKeywords)}>
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="rounded-lg bg-muted p-4 text-sm">{listing.backendKeywords}</p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}