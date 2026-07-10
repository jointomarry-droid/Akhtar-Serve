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

// ==================== KNOWLEDGE BASE ====================

interface QA { q: string[]; a: string; }

const kb: QA[] = [
  // PRODUCTS
  { q: ["add product", "new product", "create product", "list product", "add a product", "how to add product"], a: "**Adding a New Product:**\n\n1. Go to Dashboard → Products → Click \"Add Product\"\n2. Fill in: Name, SKU, Barcode, Description, Brand, Category\n3. Set Pricing: Cost Price, Selling Price, MSRP\n4. Add Images (min 1000x1000px)\n5. Configure Marketplace Listings\n6. Save & Publish\n\n**Pro Tips:** Use high-quality images with white backgrounds, write SEO-optimized titles." },
  { q: ["optimize listing", "listing optimization", "seo", "keywords", "optimize my listing"], a: "**Listing Optimization:**\n\n• **Title:** Include brand, key features, main keyword (under 200 chars)\n• **Bullet Points:** 5-7 key benefits\n• **Description:** Detailed, compelling content\n• **Images:** 6-7 minimum, white background main image\n• **Backend Keywords:** Use all 250 bytes" },
  { q: ["variants", "variations", "size", "color", "product options"], a: "**Product Variants:**\n\n1. Products → Add Product → Variable Product\n2. Define Theme (Color, Size, Material)\n3. Add Options per variant\n4. Set individual SKU, price, stock per variant\n\nBest practice: Track inventory per variant, use variant-specific images." },

  // ORDERS
  { q: ["order status", "track order", "where is order", "check order", "order tracking"], a: "**Order Status:**\n\nDashboard → Orders → Filter by Status (Pending, Confirmed, Shipped, Delivered)\n\nClick any order for full details, tracking info, and actions." },
  { q: ["cancel order", "refund", "cancel order", "process refund"], a: "**Cancellations & Refunds:**\n\n• **Before Shipment:** Orders → Select → Cancel → Auto refund\n• **After Shipment:** Contact customer → Process return → Issue refund\n\nRefunds take 3-5 business days." },

  // INVENTORY
  { q: ["inventory management", "stock level", "reorder", "manage inventory", "stock"], a: "**Inventory Management:**\n\nDashboard → Inventory\n\n• Real-time stock levels\n• Low stock alerts\n• Multi-warehouse support\n• Auto-reorder suggestions\n\nSet reorder points 2-3 weeks before stockout." },
  { q: ["fba", "fulfillment by amazon", "fbm", "fba vs fbm"], a: "**FBA vs FBM:**\n\n**FBA:** Amazon handles storage, packing, shipping. Prime badge. Higher fees.\n**FBM:** You handle everything. Lower fees, more control.\n\nBest strategy: FBA for bestsellers, FBM for slow-movers." },

  // PRICING
  { q: ["pricing strategy", "price optimization", "competitive pricing", "how to price"], a: "**Pricing Strategies:**\n\n1. **Cost-Plus:** Costs + margin (30-50%)\n2. **Competitive:** Match/beat competitors\n3. **Dynamic:** Adjust based on demand\n4. **Psychological:** $29.99 vs $30.00\n\nFees: Amazon 8-15%, eBay 12.9% + $0.30" },
  { q: ["profit margin", "calculate profit", "break even", "roi", "how much profit"], a: "**Profit Calculation:**\n\nProfit = Selling Price - (Cost + Fees + Shipping)\n\n**Example:** $29.99 price - $8 cost - $4.50 Amazon fee - $5.50 FBA = $11.99 profit (40% margin)\n\nUse Dashboard → Profit Calculator for detailed breakdown." },

  // ANALYTICS
  { q: ["analytics", "reports", "metrics", "dashboard", "view reports", "sales report"], a: "**Analytics:**\n\nDashboard → Analytics\n\n• Revenue, Orders, Conversion Rate\n• Sales by marketplace/category\n• Top performing products\n• Export to CSV/Excel/PDF" },

  // INTEGRATIONS
  { q: ["connect amazon", "amazon integration", "amazon api", "link amazon"], a: "**Connect Amazon:**\n\n1. Dashboard → Integrations → Connect Amazon\n2. Log in to Seller Central\n3. Authorize access\n4. Configure sync\n\nData synced: Products, Orders, Inventory, Pricing." },
  { q: ["connect ebay", "ebay integration", "ebay api", "link ebay"], a: "**Connect eBay:**\n\n1. Dashboard → Integrations → Connect eBay\n2. Create Developer Account (if needed)\n3. Authorize access\n4. Verify sync\n\nData synced: Listings, Orders, Inventory, Messages." },

  // SHIPPING
  { q: ["shipping", "shipping labels", "carrier", "how to ship", "shipping options"], a: "**Shipping Options:**\n\n• **FBA** - Amazon handles everything\n• **FBM** - You ship from warehouse\n• **SFP** - Ship from warehouse, get Prime badge\n\nCarriers: USPS, UPS, FedEx, DHL\nDashboard → Orders → Shipping for labels." },

  // RETURNS
  { q: ["return", "returns", "refund policy", "return policy"], a: "**Returns:**\n\n• Amazon: 30-day return window\n• eBay: 30-day money-back guarantee\n• Your store: Set custom policies\n\nDashboard → Orders → Process Returns." },

  // AMAZON
  { q: ["amazon seller", "amazon prime", "amazon listing", "amazon guide"], a: "**Amazon Seller Guide:**\n\n• Use FBA for Prime badge\n• Optimize listings with SEO\n• Use Sponsored Products for ads\n• Monitor performance metrics\n\nDashboard → Integrations for connection." },

  // EBAY
  { q: ["ebay seller", "ebay store", "ebay listing", "ebay guide"], a: "**eBay Seller Guide:**\n\n• Use GTC (Good 'Til Canceled) listings\n• Auction format for unique items\n• Promoted Listings for visibility\n\nDashboard → Integrations for connection." },

  // ACCOUNT
  { q: ["team", "members", "roles", "permissions", "invite member"], a: "**Team Management:**\n\nRoles: Owner, Admin, Manager, Operator, Viewer\n\nDashboard → Team → Invite Member → Enter email → Select role → Send" },
  { q: ["account", "profile", "settings", "password", "change password"], a: "**Account Settings:**\n\nDashboard → Settings\n\n• Update profile info\n• Change password\n• Enable 2FA\n• Manage notifications" },

  // BILLING
  { q: ["billing", "payment", "subscription", "plan", "pricing plan", "upgrade plan"], a: "**Plans:**\n\n• Free: 50 listings, basic features\n• Starter: $29/mo, 500 listings\n• Professional: $79/mo, unlimited\n• Enterprise: Custom\n\nDashboard → Billing for plan management." },

  // TECHNICAL
  { q: ["error", "bug", "issue", "not working", "fix", "problem", "broken"], a: "**Troubleshooting:**\n\n• Sync issues: Check API connection, re-authorize\n• Login issues: Clear cache, reset password\n• Performance: Clear cache, try different browser\n\nContact support@akhtarserve.com if issues persist." },

  // COMPLIANCE
  { q: ["tax", "taxes", "vat", "sales tax", "tax setup"], a: "**Tax Compliance:**\n\n• US: Marketplace facilitator laws (Amazon/eBay collect)\n• UK VAT: Register above £85K\n• EU VAT: IOSS for imports\n\nSettings → Tax Configuration for setup." },

  // GENERAL
  { q: ["hello", "hi", "hey", "greetings", "good morning", "good afternoon"], a: "Hello! Welcome to Akhtar-Serve. I'm your AI eCommerce assistant. How can I help you today?" },
  { q: ["thank", "thanks", "appreciate"], a: "You're welcome! Is there anything else I can help you with?" },
  { q: ["bye", "goodbye", "see you", "later", "take care"], a: "Goodbye! Have a great day and happy selling!" },
  { q: ["what is", "about", "tell me about", "akhtar serve", "akhtarserve"], a: "**Akhtar-Serve** is an enterprise-grade multi-channel eCommerce platform for Amazon and eBay sellers.\n\nFeatures: Unified Dashboard, AI Tools, Real-time Sync, Analytics, Team Collaboration.\n\nHow can I help you get started?" },
  { q: ["help", "support", "assist", "guide", "what can you do"], a: "I can help with:\n\n• **Products** - Add, optimize, manage listings\n• **Orders** - Track, process, handle returns\n• **Inventory** - Stock levels, reorder, FBA/FBM\n• **Pricing** - Strategies, profit calculation\n• **Analytics** - Reports, metrics, insights\n• **Integrations** - Amazon & eBay connection\n• **Account** - Team, settings, billing\n\nWhat would you like to know?" },
];

// ==================== RESPONSE GENERATOR ====================

function generateResponse(message: string): string {
  if (isBlocked(message)) {
    return "I'm sorry, but I cannot assist with that request. I'm here to help with legitimate eCommerce questions about selling on Amazon and eBay. How can I help you?";
  }

  const input = message.toLowerCase().replace(/['"?!.,]/g, "").trim();

  // Greetings
  if (/^(hello|hi|hey|greetings|good\s*(morning|afternoon|evening))/.test(input)) {
    return "Hello! Welcome to Akhtar-Serve. I'm your AI eCommerce assistant. How can I help you today?";
  }

  // Thanks
  if (/^(thanks?|thank\s*you|thx|appreciate)/.test(input)) {
    return "You're welcome! Is there anything else I can help you with?";
  }

  // Goodbye
  if (/^(bye|goodbye|see\s*you|later|take\s*care)/.test(input)) {
    return "Goodbye! Have a great day and happy selling!";
  }

  // Search knowledge base - match if ANY keyword is found in the input
  for (const entry of kb) {
    for (const keyword of entry.q) {
      // Check if the keyword words appear in the input
      const keywordWords = keyword.toLowerCase().split(" ");
      const allWordsFound = keywordWords.every((word) => input.includes(word));
      if (allWordsFound) {
        return entry.a;
      }
    }
  }

  // Fallback
  return "I'm not sure I understand. Could you rephrase? I can help with products, orders, inventory, pricing, analytics, integrations, and more.";
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
      return NextResponse.json({ success: false, error: "Message too long" }, { status: 400 });
    }

    const response = generateResponse(message);
    const convId = conversationId || `conv_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

    return NextResponse.json({
      success: true,
      data: {
        message: {
          id: `msg_${Date.now()}`,
          conversationId: convId,
          role: "assistant",
          content: response,
          timestamp: new Date(),
        },
        conversationId: convId,
      },
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json({ success: false, error: "An unexpected error occurred" }, { status: 500 });
  }
}
