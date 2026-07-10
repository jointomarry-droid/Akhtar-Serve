"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Brain,
  Bot,
  Zap,
  Target,
  TrendingUp,
  Search,
  FileText,
  BarChart3,
  ShoppingCart,
  Package,
  Globe,
  Shield,
  Sparkles,
  Play,
  ArrowRight,
  CheckCircle,
  Clock,
  Cpu,
  Database,
  Eye,
  Lightbulb,
} from "lucide-react";

const aiAgents = [
  {
    name: "Product Research Agent",
    description: "Analyzes market trends, competition, and demand to find winning products with high profit potential.",
    icon: Search,
    color: "text-blue-600",
    bg: "bg-blue-100",
    status: "active",
    tasks: "2,450 products analyzed",
    accuracy: "94%",
  },
  {
    name: "Listing Optimization Agent",
    description: "Generates SEO-optimized titles, descriptions, and keywords for maximum marketplace visibility.",
    icon: FileText,
    color: "text-green-600",
    bg: "bg-green-100",
    status: "active",
    tasks: "1,820 listings optimized",
    accuracy: "97%",
  },
  {
    name: "Pricing Intelligence Agent",
    description: "Monitors competitor pricing and adjusts your prices in real-time for maximum profitability.",
    icon: TrendingUp,
    color: "text-purple-600",
    bg: "bg-purple-100",
    status: "active",
    tasks: "5,600 price updates",
    accuracy: "92%",
  },
  {
    name: "Inventory Predictor",
    description: "Forecasts demand and suggests reorder quantities to prevent stockouts and overstocking.",
    icon: Package,
    color: "text-orange-600",
    bg: "bg-orange-100",
    status: "active",
    tasks: "890 forecasts made",
    accuracy: "89%",
  },
  {
    name: "Review Analysis Agent",
    description: "Analyzes customer reviews to identify product issues, competitor weaknesses, and opportunities.",
    icon: Eye,
    color: "text-cyan-600",
    bg: "bg-cyan-100",
    status: "active",
    tasks: "12,400 reviews analyzed",
    accuracy: "91%",
  },
  {
    name: "Keyword Research Agent",
    description: "Discovers high-traffic, low-competition keywords to boost your product rankings.",
    icon: Target,
    color: "text-red-600",
    bg: "bg-red-100",
    status: "active",
    tasks: "3,200 keywords found",
    accuracy: "95%",
  },
];

const aiSkills = [
  {
    name: "Product Hunting",
    description: "AI-powered product discovery across multiple marketplaces",
    icon: Search,
    level: "Expert",
    uses: 1250,
  },
  {
    name: "Niche Analysis",
    description: "Deep market analysis for profitable niches",
    icon: BarChart3,
    level: "Expert",
    uses: 890,
  },
  {
    name: "Competitor Spy",
    description: "Monitor competitor strategies and pricing",
    icon: Eye,
    level: "Advanced",
    uses: 2100,
  },
  {
    name: "Trend Predictor",
    description: "Predict market trends before they peak",
    icon: TrendingUp,
    level: "Expert",
    uses: 670,
  },
  {
    name: "Keyword Optimizer",
    description: "Maximize search visibility with smart keywords",
    icon: Target,
    level: "Expert",
    uses: 3400,
  },
  {
    name: "Content Writer",
    description: "Generate compelling product descriptions",
    icon: FileText,
    level: "Advanced",
    uses: 1800,
  },
  {
    name: "Price Calculator",
    description: "Optimize pricing for maximum profit margins",
    icon: TrendingUp,
    level: "Expert",
    uses: 4200,
  },
  {
    name: "Risk Assessor",
    description: "Evaluate product risks before investing",
    icon: Shield,
    level: "Advanced",
    uses: 560,
  },
];

export default function AIToolsPage() {
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<{ role: string; content: string }[]>([
    { role: "assistant", content: "Hello! I'm your AI Business Assistant. I can help you with product research, pricing strategies, listing optimization, and more. What would you like to know?" },
  ]);

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;

    const userMessage = chatInput;
    setChatInput("");
    setChatMessages((prev) => [...prev, { role: "user", content: userMessage }]);

    setTimeout(() => {
      const responses = [
        "Based on my analysis, I recommend focusing on the Electronics category. The demand is high with moderate competition. Average profit margins are 35-45%.",
        "I've analyzed your top 10 products. 3 have pricing optimization opportunities that could increase your margins by 12-18%. Would you like me to show the details?",
        "The trending keywords for your niche are: 'wireless', 'portable', 'premium', '2024'. Adding these to your listings could boost visibility by 40%.",
        "Your inventory levels look good. I predict a 25% increase in sales for Product SKU-001 next month. Consider increasing stock by 30 units.",
        "I found 5 high-potential products in the Home & Kitchen category with low competition and 40%+ profit margins. Want me to generate a full analysis?",
      ];
      const response = responses[Math.floor(Math.random() * responses.length)];
      setChatMessages((prev) => [...prev, { role: "assistant", content: response }]);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Brain className="h-8 w-8 text-purple-500" />
          AI Tools & Agents
        </h1>
        <p className="text-muted-foreground">Powerful AI-powered tools to automate and optimize your eCommerce business</p>
      </div>

      {/* AI Chat Assistant */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-primary" />
            AI Business Assistant
          </CardTitle>
          <CardDescription>Ask anything about your business, products, or marketplace strategy</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-xl border bg-muted/30 p-4 h-80 overflow-y-auto mb-4 space-y-4">
            {chatMessages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[80%] rounded-xl p-3 ${msg.role === "user" ? "bg-primary text-primary-foreground" : "bg-card border"}`}>
                  <p className="text-sm">{msg.content}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="flex gap-3">
            <Input
              placeholder="Ask about products, pricing, inventory, trends..."
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            />
            <Button onClick={handleSendMessage}>Send</Button>
          </div>
        </CardContent>
      </Card>

      {/* AI Agents */}
      <div>
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <Cpu className="h-6 w-6" />
          Active AI Agents
        </h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {aiAgents.map((agent) => (
            <Card key={agent.name} className="transition-all hover:shadow-md">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${agent.bg}`}>
                    <agent.icon className={`h-6 w-6 ${agent.color}`} />
                  </div>
                  <Badge variant="default" className="gap-1">
                    <span className="h-2 w-2 rounded-full bg-green-500" />
                    {agent.status}
                  </Badge>
                </div>
                <CardTitle className="text-lg">{agent.name}</CardTitle>
                <CardDescription>{agent.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{agent.tasks}</span>
                  <span className="font-semibold text-green-600">{agent.accuracy} accuracy</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* AI Skills */}
      <div>
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <Sparkles className="h-6 w-6" />
          AI Skills Library
        </h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {aiSkills.map((skill) => (
            <Card key={skill.name} className="transition-all hover:shadow-md hover:-translate-y-1 cursor-pointer">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <skill.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium">{skill.name}</p>
                    <Badge variant="outline" className="text-xs">{skill.level}</Badge>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-3">{skill.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">{skill.uses.toLocaleString()} uses</span>
                  <Button variant="ghost" size="sm" className="gap-1">
                    <Play className="h-3 w-3" /> Run
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>AI-Powered Quick Actions</CardTitle>
          <CardDescription>One-click AI operations for common tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            <Button variant="outline" className="h-auto py-4 justify-start gap-3">
              <Search className="h-5 w-5 text-blue-600" />
              <div className="text-left">
                <p className="font-medium">Find Winning Products</p>
                <p className="text-xs text-muted-foreground">AI product research</p>
              </div>
            </Button>
            <Button variant="outline" className="h-auto py-4 justify-start gap-3">
              <FileText className="h-5 w-5 text-green-600" />
              <div className="text-left">
                <p className="font-medium">Optimize Listings</p>
                <p className="text-xs text-muted-foreground">AI content generation</p>
              </div>
            </Button>
            <Button variant="outline" className="h-auto py-4 justify-start gap-3">
              <TrendingUp className="h-5 w-5 text-purple-600" />
              <div className="text-left">
                <p className="font-medium">Price Optimization</p>
                <p className="text-xs text-muted-foreground">Dynamic pricing AI</p>
              </div>
            </Button>
            <Button variant="outline" className="h-auto py-4 justify-start gap-3">
              <BarChart3 className="h-5 w-5 text-orange-600" />
              <div className="text-left">
                <p className="font-medium">Market Analysis</p>
                <p className="text-xs text-muted-foreground">Trend predictions</p>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}