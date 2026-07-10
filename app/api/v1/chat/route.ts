import { NextRequest, NextResponse } from "next/server";

// ==================== CONTENT FILTER ====================

const blockedPatterns = [
  /\b(drug|drugs|narcotic|cocaine|heroin|methamphetamine|cannabis|marijuana)\b/gi,
  /\b(weapon|weapons|gun|guns|firearm|rifle|pistol|ammo)\b/gi,
  /\b(hack|hacking|hacker|phishing|malware|ransomware|exploit)\b/gi,
  /\b(scam|scamming|fraud|fraudulent|counterfeit|fake\s+reviews)\b/gi,
  /\b(porn|pornography|xxx|nsfw)\b/gi,
  /\b(kill|murder|assault|terrorism|bomb\s+making)\b/gi,
  /\b(money\s+laundering|tax\s+evasion|bribery|corruption)\b/gi,
];

function isBlocked(input: string): boolean {
  return blockedPatterns.some((p) => { p.lastIndex = 0; return p.test(input); });
}

// ==================== TOPIC CLASSIFICATION ====================

type Category = "general" | "products" | "orders" | "inventory" | "pricing" | "analytics" | "integrations" | "shipping" | "returns" | "amazon" | "ebay" | "account" | "billing" | "technical" | "compliance";

function classify(input: string): Category {
  const s = input.toLowerCase();
  if (/\b(product|products|listing|listings|catalog|sku|barcode|brand|category)\b/i.test(s)) return "products";
  if (/\b(order|orders|purchase|checkout|track\s+order|cancel\s+order)\b/i.test(s)) return "orders";
  if (/\b(inventory|stock|warehouse|reorder|stockout|fba|fbm)\b/i.test(s)) return "inventory";
  if (/\b(price|pricing|cost|margin|margins|profit|discount)\b/i.test(s)) return "pricing";
  if (/\b(analytics|report|reports|metrics|dashboard|insights)\b/i.test(s)) return "analytics";
  if (/\b(integration|integrations|connect|api|sync)\b/i.test(s)) return "integrations";
  if (/\b(shipping|ship|delivery|carrier|tracking|fulfillment)\b/i.test(s)) return "shipping";
  if (/\b(return|returns|refund|refunds|exchange)\b/i.test(s)) return "returns";
  if (/\b(amazon|fba|amazon\s+seller|amazon\s+prime)\b/i.test(s)) return "amazon";
  if (/\b(ebay|ebay\s+seller|ebay\s+store)\b/i.test(s)) return "ebay";
  if (/\b(account|profile|settings|password|team|members|roles)\b/i.test(s)) return "account";
  if (/\b(billing|payment|invoice|subscription|plan|upgrade)\b/i.test(s)) return "billing";
  if (/\b(error|bug|issue|problem|not\s+working|fix)\b/i.test(s)) return "technical";
  if (/\b(compliance|policy|tax|taxes|legal|vat)\b/i.test(s)) return "compliance";
  return "general";
}

// ==================== KNOWLEDGE BASE ====================

interface KBEntry { keywords: string[]; answer: string; }

const kb: Record<Category, KBEntry[]> = {
  general: [
    { keywords: ["hello", "hi", "hey", "greetings"], answer: "Hello! Welcome to Akhtar-Serve. I'm your AI eCommerce assistant. I can help with products, orders, inventory, pricing, analytics, integrations, and more. What would you like to know?" },
    { keywords: ["what is", "about", "tell me about", "akhtar serve"], answer: "**Akhtar-Serve** is an enterprise-grade multi-channel eCommerce management platform for Amazon and eBay sellers. Features include:\n• Unified Dashboard\n• AI-Powered Tools\n• Real-time Sync\n• Advanced Analytics\n• Team Collaboration\n\nHow can I help you get started?" },
    { keywords: ["help", "support", "assist", "guide"], answer: "I'm here to help! Here are ways to get support:\n• **AI Assistant (Me!)** - Ask anything about the platform\n• **Documentation** - Detailed guides and tutorials\n• **Email Support** - support@akhtarserve.com\n\nWhat can I help you with right now?" },
  ],
  products: [
    { keywords: ["add product", "new product", "create product", "list product"], answer: "**Adding a New Product:**\n\n1. Go to Dashboard → Products → Click \"Add Product\"\n2. Fill in Details: Name, SKU, Barcode, Description, Brand, Category\n3. Set Pricing: Cost Price, Selling Price, MSRP\n4. Add Images (min 1000x1000px)\n5. Configure Marketplace Listings\n6. Save & Publish\n\n**Pro Tips:**\n• Use high-quality images with white backgrounds\n• Write SEO-optimized titles with keywords\n• Include all product variations" },
    { keywords: ["optimize listing", "listing optimization", "seo", "keywords"], answer: "**Listing Optimization Guide:**\n\n**Title:** Include brand, key features, main keyword. Keep under 200 chars (Amazon) or 80 chars (eBay).\n\n**Bullet Points:** Highlight 5-7 key benefits. Start with capitalized benefit.\n\n**Description:** Write detailed, compelling descriptions. Include use cases.\n\n**Backend Keywords (Amazon):** Use all 250 bytes. Include synonyms.\n\n**Images:** 6-7 minimum. Main image with white background." },
    { keywords: ["variants", "variations", "size", "color"], answer: "**Setting Up Product Variants:**\n\n1. Products → Add Product → Select \"Variable Product\"\n2. Define Theme: Color, Size, Material\n3. Add Options: e.g., Colors: Red, Blue + Sizes: S, M, L\n4. Set Individual Details per variant (SKU, price, stock)\n\n**Best Practices:**\n• Use clear option names\n• Track inventory per variant\n• Use variant-specific images" },
  ],
  orders: [
    { keywords: ["order status", "track order", "where is order"], answer: "**Checking Order Status:**\n\n1. Dashboard → Orders\n2. Filter by Status: Pending, Confirmed, Processing, Shipped, Delivered\n3. Click any order for full details\n\n**Order Actions:**\n• Update Status\n• Add Tracking Number\n• Print Shipping Label\n• Process Refund\n\n**Bulk Operations:** Select multiple orders for bulk updates." },
    { keywords: ["cancel order", "refund"], answer: "**Cancellations & Refunds:**\n\n**Before Shipment:**\n→ Orders → Select Order → Cancel → Full refund issued\n\n**After Shipment:**\n→ Contact customer → Process return → Issue refund\n\n**Refund Processing:** 3-5 business days. Keep records for tax purposes." },
  ],
  inventory: [
    { keywords: ["inventory management", "stock level", "reorder"], answer: "**Inventory Management:**\n\nDashboard → Inventory\n\n**Key Features:**\n• Real-time Stock Levels\n• Low Stock Alerts\n• Multi-Warehouse Management\n• Auto-Reorder Suggestions\n\n**Best Practices:**\n• Set reorder points 2-3 weeks before stockout\n• Use safety stock for high-demand items\n• Regular cycle counting" },
    { keywords: ["fba", "fulfillment by amazon", "fbm"], answer: "**FBA vs FBM:**\n\n**FBA:** Amazon stores, packs, ships. Prime badge. Higher fees.\n• Storage: $0.75-$2.40/cubic ft/month\n• Fulfillment: $3.22-$10+ per unit\n\n**FBM:** You handle everything. Lower fees, more work.\n\n**Hybrid Strategy:** FBA for bestsellers, FBM for slow-movers." },
  ],
  pricing: [
    { keywords: ["pricing strategy", "price optimization", "competitive pricing"], answer: "**Pricing Strategies:**\n\n1. **Cost-Plus:** Calculate costs + add margin (30-50%)\n2. **Competitive:** Monitor competitors, stay within 5-10%\n3. **Dynamic:** Adjust based on demand\n4. **Psychological:** $29.99 instead of $30.00\n5. **Penetration:** Start low, increase gradually\n6. **Premium:** Higher price for perceived quality\n\n**Fees:** Amazon 8-15%, eBay 12.9% + $0.30" },
    { keywords: ["profit margin", "calculate profit", "break even", "roi"], answer: "**Profit Calculation:**\n\n```\nProfit = Selling Price - (Cost + Fees + Shipping)\nMargin % = (Profit / Selling Price) × 100\n```\n\n**Example:**\n• Price: $29.99, Cost: $8.00\n• Amazon Fee (15%): $4.50\n• FBA Fee: $5.50\n• **Profit: $11.99 (40% margin)**\n\nUse Dashboard → Profit Calculator for detailed breakdown." },
  ],
  analytics: [
    { keywords: ["analytics", "reports", "metrics", "dashboard"], answer: "**Analytics Dashboard:**\n\nDashboard → Analytics\n\n**Key Metrics:**\n• Revenue, Orders, Units Sold\n• Average Order Value\n• Conversion Rate\n\n**Reports:**\n• Sales by marketplace/category\n• Profit analysis\n• Inventory reports\n• Customer demographics\n\nExport options: CSV, Excel, PDF." },
  ],
  integrations: [
    { keywords: ["connect amazon", "amazon integration", "amazon api"], answer: "**Connecting Amazon:**\n\n1. Dashboard → Integrations → Connect Amazon\n2. Log in to Amazon Seller Central\n3. Authorize access\n4. Configure sync settings\n5. Test connection\n\n**Data Synced:** Products, Orders, Inventory, Pricing, Messages." },
    { keywords: ["connect ebay", "ebay integration", "ebay api"], answer: "**Connecting eBay:**\n\n1. Dashboard → Integrations → Connect eBay\n2. Create eBay Developer Account (if needed)\n3. Authorize access\n4. Configure shipping/return policies\n5. Verify sync\n\n**Data Synced:** Listings, Orders, Inventory, Buyer Messages." },
  ],
  shipping: [
    { keywords: ["shipping", "shipping labels", "carrier"], answer: "**Shipping Options:**\n\n• **FBA** - Amazon handles everything\n• **FBM** - You ship from your warehouse\n• **SFP** - Ship from warehouse, get Prime badge\n• **3PL** - Third-party logistics\n\n**Carriers:** USPS, UPS, FedEx, DHL\n\nDashboard → Orders → Shipping for label generation." },
  ],
  returns: [
    { keywords: ["return", "returns", "refund", "refund"], answer: "**Returns Management:**\n\n• Amazon: 30-day return window\n• eBay: 30-day money-back guarantee\n• Your Store: Set custom policies\n\nDashboard → Orders → Process Returns." },
  ],
  amazon: [
    { keywords: ["amazon seller", "amazon prime", "amazon listing"], answer: "**Amazon Seller Guide:**\n\n• **FBA:** Use for high-volume, small items\n• **Prime Badge:** Automatic with FBA\n• **Listing Optimization:** SEO titles, 7+ images\n• **Advertising:** Sponsored Products, Brands, Display\n\nDashboard → Integrations for Amazon connection." },
  ],
  ebay: [
    { keywords: ["ebay seller", "ebay store", "ebay listing"], answer: "**eBay Seller Guide:**\n\n• **GTC Listings:** Good 'Til Canceled\n• **Auction Format:** For unique items\n• **Best Offer:** Negotiate with buyers\n• **Promoted Listings:** Boost visibility\n\nDashboard → Integrations for eBay connection." },
  ],
  account: [
    { keywords: ["team", "members", "roles", "permissions", "invite"], answer: "**Team Management:**\n\nRoles: Owner, Admin, Manager, Operator, Viewer\n\n→ Dashboard → Team → Invite Member\n1. Enter email\n2. Select role\n3. Send invitation\n\n**Security:** Enable 2FA, use least-privilege principle." },
  ],
  billing: [
    { keywords: ["billing", "payment", "subscription", "plan"], answer: "**Plans:**\n• **Free:** 50 listings, basic features\n• **Starter:** $29/mo, 500 listings\n• **Professional:** $79/mo, unlimited\n• **Enterprise:** Custom\n\n→ Dashboard → Billing for plan management." },
  ],
  technical: [
    { keywords: ["error", "bug", "issue", "not working", "fix"], answer: "**Troubleshooting:**\n\n• **Sync Issues:** Check API connection, re-authorize\n• **Login Issues:** Clear cache, reset password\n• **Performance:** Clear cache, try different browser\n\nContact support@akhtarserve.com for persistent issues." },
  ],
  compliance: [
    { keywords: ["tax", "taxes", "vat", "sales tax"], answer: "**Tax Compliance:**\n\n• **US Sales Tax:** Marketplace facilitator laws (Amazon/eBay collect)\n• **UK VAT:** Register above £85K threshold\n• **EU VAT:** IOSS for imports\n\n→ Settings → Tax Configuration for setup." },
  ],
};

// ==================== RESPONSE GENERATOR ====================

function generateResponse(message: string): { content: string; category: Category } {
  if (isBlocked(message)) {
    return { content: "I'm sorry, but I cannot assist with that request. I'm here to help with legitimate eCommerce questions about selling on Amazon and eBay. How can I help you with your business?", category: "general" };
  }

  const s = message.toLowerCase();
  if (/^(hello|hi|hey|greetings|good\s+(morning|afternoon|evening))/i.test(s)) {
    return { content: "Hello! Welcome to Akhtar-Serve. I'm your AI eCommerce assistant. How can I help you today?", category: "general" };
  }
  if (/^(thanks?|thank\s+you|thx|appreciate)/i.test(s)) {
    return { content: "You're welcome! Is there anything else I can help you with?", category: "general" };
  }
  if (/^(bye|goodbye|see\s+you|later|take\s+care)/i.test(s)) {
    return { content: "Goodbye! Have a great day and happy selling!", category: "general" };
  }

  const category = classify(message);
  const entries = kb[category] || [];
  
  for (const entry of entries) {
    if (entry.keywords.some((k) => s.includes(k))) {
      return { content: entry.answer, category };
    }
  }

  // Fallback
  const fallbacks: Record<Category, string> = {
    general: "I'm not sure I understand. Could you rephrase? I can help with products, orders, inventory, pricing, analytics, and more.",
    products: "I can help with products. Try asking: 'How do I add a new product?' or 'How to optimize listings?'",
    orders: "I can help with orders. Try: 'How to track orders?' or 'How to process refunds?'",
    inventory: "I can help with inventory. Try: 'How to manage stock levels?' or 'FBA vs FBM?'",
    pricing: "I can help with pricing. Try: 'What are pricing strategies?' or 'How to calculate profit?'",
    analytics: "I can help with analytics. Try: 'How to view reports?' or 'Sales metrics?'",
    integrations: "I can help with integrations. Try: 'How to connect Amazon?' or 'eBay setup?'",
    shipping: "I can help with shipping. Try: 'Shipping options?' or 'How to print labels?'",
    returns: "I can help with returns. Try: 'Return policy?' or 'How to process refunds?'",
    amazon: "I can help with Amazon. Try: 'Amazon FBA guide?' or 'Listing optimization?'",
    ebay: "I can help with eBay. Try: 'eBay store setup?' or 'eBay fees?'",
    account: "I can help with account management. Try: 'How to invite team members?'",
    billing: "I can help with billing. Try: 'What are the pricing plans?'",
    technical: "I can help with technical issues. Try: 'Not working' or 'Error fix?'",
    compliance: "I can help with compliance. Try: 'Tax setup?' or 'VAT compliance?'",
  };

  return { content: fallbacks[category], category };
}

// ==================== POST HANDLER ====================

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, conversationId } = body;

    if (!message || typeof message !== "string" || message.trim().length === 0) {
      return NextResponse.json({ success: false, error: "Message is required" }, { status: 400 });
    }

    if (message.length > 2000) {
      return NextResponse.json({ success: false, error: "Message too long (max 2000 chars)" }, { status: 400 });
    }

    const { content, category } = generateResponse(message);
    const convId = conversationId || `conv_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

    return NextResponse.json({
      success: true,
      data: {
        message: {
          id: `msg_${Date.now()}_assistant`,
          conversationId: convId,
          role: "assistant",
          content,
          timestamp: new Date(),
          metadata: { category, confidence: 0.9 },
        },
        conversationId: convId,
      },
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json({ success: false, error: "An unexpected error occurred" }, { status: 500 });
  }
}
