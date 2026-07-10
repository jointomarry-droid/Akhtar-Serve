"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "What is Akhtar Serve?",
    answer: "Akhtar Serve is an enterprise-grade multi-channel eCommerce management platform that helps sellers manage their Amazon, eBay, Walmart, Shopify, and other marketplace businesses from one powerful dashboard. We provide tools for inventory sync, order management, listing optimization, pricing intelligence, and business analytics.",
  },
  {
    question: "How does the multi-channel inventory sync work?",
    answer: "Our real-time inventory sync connects to Amazon SP-API, eBay Trading API, and other marketplace APIs. When a sale happens on any channel, inventory is automatically updated across all connected stores within seconds. This prevents overselling and keeps your stock levels accurate across all marketplaces.",
  },
  {
    question: "What marketplaces do you support?",
    answer: "We support Amazon (US, UK, DE, FR, ES, IT, CA, JP, AU), eBay (all global sites), Walmart Marketplace, Shopify, Etsy, TikTok Shop, and WooCommerce. We're constantly adding new marketplace integrations based on seller demand.",
  },
  {
    question: "How much does Akhtar Serve cost?",
    answer: "We offer flexible pricing plans starting from $29/month for small sellers up to custom enterprise plans. All plans include a 14-day free trial with no credit card required. Visit our pricing page for detailed plan comparisons and features.",
  },
  {
    question: "Can I try Akhtar Serve before committing?",
    answer: "Yes! We offer a 14-day free trial on all plans. No credit card required. You get full access to all features in your chosen plan so you can evaluate the platform thoroughly before making a decision.",
  },
  {
    question: "How does the AI Product Hunter work?",
    answer: "Our AI Product Hunter analyzes market trends, competition levels, demand scores, and profit margins to identify winning products. It scans thousands of products across marketplaces and uses machine learning to predict which products have the highest potential for success in your niche.",
  },
  {
    question: "Can I connect multiple Amazon/eBay accounts?",
    answer: "Yes! You can connect unlimited Amazon and eBay accounts under one Akhtar Serve dashboard. This is perfect for sellers who operate multiple brands or stores. Each account is managed independently while providing a unified view of your entire business.",
  },
  {
    question: "Do you offer product sourcing services?",
    answer: "Yes, our Product Sources tool helps you find reliable suppliers from platforms like Alibaba, AliExpress, CJ Dropshipping, and more. We provide verified supplier information, MOQ details, pricing, shipping times, and ratings to help you make informed sourcing decisions.",
  },
  {
    question: "How accurate is the Profit Calculator?",
    answer: "Our Profit Calculator accounts for all costs including product cost, shipping, packaging, marketplace fees (Amazon referral fees, eBay fees), FBA fees, and more. It provides real-time profit margins, ROI calculations, break-even analysis, and monthly/annual projections.",
  },
  {
    question: "Is my business data secure?",
    answer: "Absolutely. We use bank-level AES-256 encryption, SOC 2 Type II compliance, GDPR adherence, and regular third-party security audits. Your data is stored in secure Firebase infrastructure with automated backups and 99.99% uptime SLA.",
  },
  {
    question: "Do you provide customer support?",
    answer: "Yes! We offer 24/7 customer support through live chat, email, and phone. Enterprise customers get dedicated account managers. Our support team specializes in eCommerce and marketplace operations to help you resolve issues quickly.",
  },
  {
    question: "How do I get started?",
    answer: "Getting started is easy: 1) Sign up for a free trial at akhtarserve.com/register, 2) Connect your Amazon/eBay accounts, 3) Import your products, 4) Start managing your business from one dashboard. Setup takes less than 15 minutes.",
  },
];

function FAQItem({ faq, index }: { faq: typeof faqs[0]; index: number }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between py-4 text-left font-medium transition hover:text-primary"
      >
        <span>{faq.question}</span>
        <ChevronDown
          className={`h-5 w-5 flex-shrink-0 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${
          isOpen ? "max-h-96 pb-4" : "max-h-0"
        }`}
      >
        <p className="text-muted-foreground">{faq.answer}</p>
      </div>
    </div>
  );
}

export default function FAQSection() {
  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-2">Frequently Asked Questions</h2>
          <p className="text-muted-foreground">
            Everything you need to know about Akhtar Serve
          </p>
        </div>

        <div className="mx-auto max-w-3xl">
          {faqs.map((faq, i) => (
            <FAQItem key={i} faq={faq} index={i} />
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-muted-foreground mb-4">
            Still have questions? We&apos;re here to help.
          </p>
          <a href="/contact" className="text-primary font-medium hover:underline">
            Contact our support team →
          </a>
        </div>
      </div>
    </section>
  );
}