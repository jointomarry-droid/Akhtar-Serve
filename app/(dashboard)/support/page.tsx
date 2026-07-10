"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  HelpCircle,
  BookOpen,
  MessageCircle,
  Mail,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

const faqs = [
  {
    question: "How do I connect my Amazon account?",
    answer:
      "Go to Integrations > Amazon > Connect. You'll be redirected to Amazon to authorize the connection. Once approved, your products and orders will sync automatically.",
  },
  {
    question: "How do I connect my eBay account?",
    answer:
      "Go to Integrations > eBay > Connect. You'll need to log in to your eBay account and authorize the application. The sync will start automatically.",
  },
  {
    question: "How often does inventory sync?",
    answer:
      "Inventory syncs in real-time when orders are placed. You can also manually trigger a sync from the Integrations page.",
  },
  {
    question: "Can I manage multiple stores?",
    answer:
      "Yes! You can connect multiple Amazon and eBay stores to a single Akhtar Serve account. Each store will appear as a separate integration.",
  },
  {
    question: "How do I add team members?",
    answer:
      "Go to Team > Invite Member. Enter their email address and select a role. They'll receive an invitation to join your organization.",
  },
  {
    question: "Is my data secure?",
    answer:
      "Yes! We use Firebase Security Rules, encryption at rest, and follow industry best practices for data security. Your marketplace credentials are encrypted and never exposed.",
  },
];

export default function SupportPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [ticketForm, setTicketForm] = useState({
    subject: "",
    description: "",
    priority: "medium",
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Help & Support</h2>
        <p className="text-muted-foreground">
          Get help with using Akhtar Serve
        </p>
      </div>

      <Tabs defaultValue="faq" className="space-y-6">
        <TabsList>
          <TabsTrigger value="faq" className="flex items-center gap-2">
            <HelpCircle className="h-4 w-4" />
            FAQ
          </TabsTrigger>
          <TabsTrigger value="docs" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Documentation
          </TabsTrigger>
          <TabsTrigger value="contact" className="flex items-center gap-2">
            <MessageCircle className="h-4 w-4" />
            Contact Support
          </TabsTrigger>
        </TabsList>

        <TabsContent value="faq">
          <Card>
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {faqs.map((faq, index) => (
                <div key={index} className="border rounded-lg">
                  <button
                    className="flex w-full items-center justify-between p-4 text-left"
                    onClick={() =>
                      setOpenFaq(openFaq === index ? null : index)
                    }
                  >
                    <span className="font-medium">{faq.question}</span>
                    {openFaq === index ? (
                      <ChevronUp className="h-5 w-5 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-muted-foreground" />
                    )}
                  </button>
                  {openFaq === index && (
                    <div className="px-4 pb-4 text-muted-foreground">
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="docs">
          <Card>
            <CardHeader>
              <CardTitle>Documentation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-lg border p-4">
                  <h3 className="font-semibold">Getting Started</h3>
                  <p className="text-sm text-muted-foreground">
                    Learn the basics of setting up your account and connecting
                    your marketplaces.
                  </p>
                  <Button variant="link" className="mt-2 p-0">
                    Read Guide
                  </Button>
                </div>
                <div className="rounded-lg border p-4">
                  <h3 className="font-semibold">Product Management</h3>
                  <p className="text-sm text-muted-foreground">
                    How to add, edit, and manage your products across
                    marketplaces.
                  </p>
                  <Button variant="link" className="mt-2 p-0">
                    Read Guide
                  </Button>
                </div>
                <div className="rounded-lg border p-4">
                  <h3 className="font-semibold">Order Processing</h3>
                  <p className="text-sm text-muted-foreground">
                    Understanding order workflows and fulfillment options.
                  </p>
                  <Button variant="link" className="mt-2 p-0">
                    Read Guide
                  </Button>
                </div>
                <div className="rounded-lg border p-4">
                  <h3 className="font-semibold">Analytics & Reports</h3>
                  <p className="text-sm text-muted-foreground">
                    How to use analytics to grow your business.
                  </p>
                  <Button variant="link" className="mt-2 p-0">
                    Read Guide
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contact">
          <Card>
            <CardHeader>
              <CardTitle>Submit a Support Ticket</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    placeholder="Brief description of your issue"
                    value={ticketForm.subject}
                    onChange={(e) =>
                      setTicketForm({ ...ticketForm, subject: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <select
                    id="priority"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    value={ticketForm.priority}
                    onChange={(e) =>
                      setTicketForm({
                        ...ticketForm,
                        priority: e.target.value,
                      })
                    }
                  >
                    <option value="low">Low - General question</option>
                    <option value="medium">Medium - Issue affecting work</option>
                    <option value="high">
                      High - Critical issue, need immediate help
                    </option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <textarea
                    id="description"
                    placeholder="Please describe your issue in detail..."
                    className="flex min-h-[150px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    value={ticketForm.description}
                    onChange={(e) =>
                      setTicketForm({
                        ...ticketForm,
                        description: e.target.value,
                      })
                    }
                  />
                </div>
                <Button type="submit">
                  <Mail className="mr-2 h-4 w-4" />
                  Submit Ticket
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
