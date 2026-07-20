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

// ==================== INTENT DETECTION ====================

interface IntentDetector {
  patterns: RegExp[];
  intent: string;
  priority: number;
}

const intentDetectors: IntentDetector[] = [
  // Pricing intent - detect "how much", "price", "cost", "fee" questions
  { patterns: [/\bhow\s+much\b/i, /\bprice\b/i, /\bcost\b/i, /\bfee\b/i, /\bcharge\b/i, /\brate\b/i, /\bplan\b/i, /\bsubscription\b/i], intent: "pricing", priority: 10 },
  // Help/support intent
  { patterns: [/\bhelp\b/i, /\bsupport\b/i, /\bassist\b/i, /\bguide\b/i], intent: "help", priority: 5 },
];

function detectIntent(input: string): string | null {
  let bestMatch: { intent: string; priority: number } | null = null;

  for (const detector of intentDetectors) {
    for (const pattern of detector.patterns) {
      if (pattern.test(input)) {
        if (!bestMatch || detector.priority > bestMatch.priority) {
          bestMatch = { intent: detector.intent, priority: detector.priority };
        }
      }
    }
  }

  return bestMatch?.intent ?? null;
}

// ==================== KNOWLEDGE BASE ====================

interface QA {
  q: string[];
  a: string;
  category?: string;
  requireIntent?: string; // If set, only match when this intent is detected
}

const kb: QA[] = [
  // ==================== SERVICE PRICING (HIGH PRIORITY - Specific) ====================
  { q: ["amazon full account handling price", "amazon account handling cost", "amazon full service price", "amazon managed service price"], a: "**Amazon Full Account Handling:**\n\n**Akhtar-Serve Managed Amazon Services:**\n\n• **Starter Package:** $499/mo - Up to 100 SKUs, basic management\n• **Growth Package:** $999/mo - Up to 500 SKUs, full optimization\n• **Enterprise Package:** $1,999/mo - Unlimited SKUs, dedicated account manager\n\n**Includes:**\n• Product listing & optimization\n• Inventory management\n• Order processing\n• PPC advertising management\n• Customer support handling\n• Monthly analytics reports\n\nContact sales@akhtarserve.com for custom pricing.", category: "pricing", requireIntent: "pricing" },
  { q: ["ebay full account handling price", "ebay account handling cost", "ebay full service price", "ebay managed service price"], a: "**eBay Full Account Handling:**\n\n**Akhtar-Serve Managed eBay Services:**\n\n• **Starter Package:** $399/mo - Up to 100 listings\n• **Growth Package:** $799/mo - Up to 500 listings\n• **Enterprise Package:** $1,499/mo - Unlimited listings\n\n**Includes:**\n• Listing creation & optimization\n• Inventory sync\n• Order management\n• Promoted Listings management\n• Customer communication\n• Performance reporting\n\nContact sales@akhtarserve.com for custom pricing.", category: "pricing", requireIntent: "pricing" },
  { q: ["amazon handling fee", "amazon management fee", "amazon service charge"], a: "**Amazon Management Fees:**\n\n• **Account Audit:** $149 (one-time)\n• **Listing Optimization:** $25/product\n• **PPC Management:** 10% of ad spend\n• **Full Account Management:** Starting at $499/mo\n\nAll packages include 24/7 support and monthly reporting.\n\nGet a free consultation: sales@akhtarserve.com", category: "pricing", requireIntent: "pricing" },
  { q: ["how much does it cost", "what is the price", "pricing information", "what are the rates"], a: "**Akhtar-Serve Pricing:**\n\n• **Free Plan:** 50 listings, basic features\n• **Starter:** $29/mo - 500 listings\n• **Professional:** $79/mo - Unlimited listings\n• **Enterprise:** Custom pricing\n\n**Managed Services:**\n• Amazon: Starting at $499/mo\n• eBay: Starting at $399/mo\n\nView full pricing: Dashboard → Billing", category: "pricing", requireIntent: "pricing" },

  // ==================== PRODUCTS ====================
  { q: ["add product", "new product", "create product", "list product", "add a product", "how to add product"], a: "**Adding a New Product:**\n\n1. Go to Dashboard → Products → Click \"Add Product\"\n2. Fill in: Name, SKU, Barcode, Description, Brand, Category\n3. Set Pricing: Cost Price, Selling Price, MSRP\n4. Add Images (min 1000x1000px)\n5. Configure Marketplace Listings\n6. Save & Publish\n\n**Pro Tips:** Use high-quality images with white backgrounds, write SEO-optimized titles.", category: "products" },
  { q: ["optimize listing", "listing optimization", "seo", "keywords", "optimize my listing"], a: "**Listing Optimization:**\n\n• **Title:** Include brand, key features, main keyword (under 200 chars)\n• **Bullet Points:** 5-7 key benefits\n• **Description:** Detailed, compelling content\n• **Images:** 6-7 minimum, white background main image\n• **Backend Keywords:** Use all 250 bytes", category: "products" },
  { q: ["variants", "variations", "size", "color", "product options"], a: "**Product Variants:**\n\n1. Products → Add Product → Variable Product\n2. Define Theme (Color, Size, Material)\n3. Add Options per variant\n4. Set individual SKU, price, stock per variant\n\nBest practice: Track inventory per variant, use variant-specific images.", category: "products" },

  // ==================== ORDERS ====================
  { q: ["order status", "track order", "where is order", "check order", "order tracking"], a: "**Order Status:**\n\nDashboard → Orders → Filter by Status (Pending, Confirmed, Shipped, Delivered)\n\nClick any order for full details, tracking info, and actions.", category: "orders" },
  { q: ["cancel order", "process refund"], a: "**Cancellations & Refunds:**\n\n• **Before Shipment:** Orders → Select → Cancel → Auto refund\n• **After Shipment:** Contact customer → Process return → Issue refund\n\nRefunds take 3-5 business days.", category: "orders" },

  // ==================== INVENTORY ====================
  { q: ["inventory management", "stock level", "reorder", "manage inventory", "stock"], a: "**Inventory Management:**\n\nDashboard → Inventory\n\n• Real-time stock levels\n• Low stock alerts\n• Multi-warehouse support\n• Auto-reorder suggestions\n\nSet reorder points 2-3 weeks before stockout.", category: "inventory" },
  { q: ["fba", "fulfillment by amazon", "fbm", "fba vs fbm"], a: "**FBA vs FBM:**\n\n**FBA:** Amazon handles storage, packing, shipping. Prime badge. Higher fees.\n**FBM:** You handle everything. Lower fees, more control.\n\nBest strategy: FBA for bestsellers, FBM for slow-movers.", category: "inventory" },

  // ==================== PRICING STRATEGY ====================
  { q: ["pricing strategy", "price optimization", "competitive pricing", "how to price"], a: "**Pricing Strategies:**\n\n1. **Cost-Plus:** Costs + margin (30-50%)\n2. **Competitive:** Match/beat competitors\n3. **Dynamic:** Adjust based on demand\n4. **Psychological:** $29.99 vs $30.00\n\nFees: Amazon 8-15%, eBay 12.9% + $0.30", category: "pricing" },
  { q: ["profit margin", "calculate profit", "break even", "roi", "how much profit"], a: "**Profit Calculation:**\n\nProfit = Selling Price - (Cost + Fees + Shipping)\n\n**Example:** $29.99 price - $8 cost - $4.50 Amazon fee - $5.50 FBA = $11.99 profit (40% margin)\n\nUse Dashboard → Profit Calculator for detailed breakdown.", category: "pricing" },

  // ==================== ANALYTICS ====================
  { q: ["analytics", "reports", "metrics", "view reports", "sales report"], a: "**Analytics:**\n\nDashboard → Analytics\n\n• Revenue, Orders, Conversion Rate\n• Sales by marketplace/category\n• Top performing products\n• Export to CSV/Excel/PDF", category: "analytics" },

  // ==================== INTEGRATIONS ====================
  { q: ["connect amazon", "amazon integration", "amazon api", "link amazon"], a: "**Connect Amazon:**\n\n1. Dashboard → Integrations → Connect Amazon\n2. Log in to Seller Central\n3. Authorize access\n4. Configure sync\n\nData synced: Products, Orders, Inventory, Pricing.", category: "integrations" },
  { q: ["connect ebay", "ebay integration", "ebay api", "link ebay"], a: "**Connect eBay:**\n\n1. Dashboard → Integrations → Connect eBay\n2. Create Developer Account (if needed)\n3. Authorize access\n4. Verify sync\n\nData synced: Listings, Orders, Inventory, Messages.", category: "integrations" },

  // ==================== SHIPPING ====================
  { q: ["shipping", "shipping labels", "carrier", "how to ship", "shipping options"], a: "**Shipping Options:**\n\n• **FBA** - Amazon handles everything\n• **FBM** - You ship from warehouse\n• **SFP** - Ship from warehouse, get Prime badge\n\nCarriers: USPS, UPS, FedEx, DHL\nDashboard → Orders → Shipping for labels.", category: "shipping" },

  // ==================== RETURNS ====================
  { q: ["return", "returns", "refund policy", "return policy"], a: "**Returns:**\n\n• Amazon: 30-day return window\n• eBay: 30-day money-back guarantee\n• Your store: Set custom policies\n\nDashboard → Orders → Process Returns.", category: "returns" },

  // ==================== AMAZON ====================
  { q: ["amazon seller", "amazon prime", "amazon listing", "amazon guide"], a: "**Amazon Seller Guide:**\n\n• Use FBA for Prime badge\n• Optimize listings with SEO\n• Use Sponsored Products for ads\n• Monitor performance metrics\n\nDashboard → Integrations for connection.", category: "marketplace_amazon" },

  // ==================== EBAY ====================
  { q: ["ebay seller", "ebay store", "ebay listing", "ebay guide"], a: "**eBay Seller Guide:**\n\n• Use GTC (Good 'Til Canceled) listings\n• Auction format for unique items\n• Promoted Listings for visibility\n\nDashboard → Integrations for connection.", category: "marketplace_ebay" },

  // ==================== ACCOUNT (More specific keywords) ====================
  { q: ["team", "members", "roles", "permissions", "invite member"], a: "**Team Management:**\n\nRoles: Owner, Admin, Manager, Operator, Viewer\n\nDashboard → Team → Invite Member → Enter email → Select role → Send", category: "account" },
  { q: ["update profile", "change password", "enable 2fa", "manage notifications", "account settings", "user settings"], a: "**Account Settings:**\n\nDashboard → Settings\n\n• Update profile info\n• Change password\n• Enable 2FA\n• Manage notifications", category: "account" },

  // ==================== BILLING ====================
  { q: ["billing", "payment", "subscription", "upgrade plan"], a: "**Plans:**\n\n• Free: 50 listings, basic features\n• Starter: $29/mo, 500 listings\n• Professional: $79/mo, unlimited\n• Enterprise: Custom\n\nDashboard → Billing for plan management.", category: "billing" },

  // ==================== TECHNICAL ====================
  { q: ["error", "bug", "issue", "not working", "fix", "problem", "broken"], a: "**Troubleshooting:**\n\n• Sync issues: Check API connection, re-authorize\n• Login issues: Clear cache, reset password\n• Performance: Clear cache, try different browser\n\nContact support@akhtarserve.com if issues persist.", category: "technical" },

  // ==================== COMPLIANCE ====================
  { q: ["tax", "taxes", "vat", "sales tax", "tax setup"], a: "**Tax Compliance:**\n\n• US: Marketplace facilitator laws (Amazon/eBay collect)\n• UK VAT: Register above £85K\n• EU VAT: IOSS for imports\n\nSettings → Tax Configuration for setup.", category: "compliance" },

  // ==================== GENERAL ====================
  { q: ["hello", "hi", "hey", "greetings", "good morning", "good afternoon"], a: "Hello! Welcome to Akhtar-Serve. I'm your AI eCommerce assistant. How can I help you today?", category: "general" },
  { q: ["thank", "thanks", "appreciate"], a: "You're welcome! Is there anything else I can help you with?", category: "general" },
  { q: ["bye", "goodbye", "see you", "later", "take care"], a: "Goodbye! Have a great day and happy selling!", category: "general" },
  { q: ["what is", "about", "tell me about", "akhtar serve", "akhtarserve"], a: "**Akhtar-Serve** is an enterprise-grade multi-channel eCommerce platform for Amazon and eBay sellers.\n\nFeatures: Unified Dashboard, AI Tools, Real-time Sync, Analytics, Team Collaboration.\n\nHow can I help you get started?", category: "general" },
  { q: ["help", "support", "assist", "guide", "what can you do"], a: "I can help with:\n\n• **Products** - Add, optimize, manage listings\n• **Orders** - Track, process, handle returns\n• **Inventory** - Stock levels, reorder, FBA/FBM\n• **Pricing** - Strategies, profit calculation\n• **Analytics** - Reports, metrics, insights\n• **Integrations** - Amazon & eBay connection\n• **Account** - Team, settings, billing\n\nWhat would you like to know?", category: "general" },
];

// ==================== RESPONSE GENERATOR ====================

function generateResponse(message: string): string {
  if (isBlocked(message)) {
    return "I'm sorry, but I cannot assist with that request. I'm here to help with legitimate eCommerce questions about selling on Amazon and eBay. How can I help you?";
  }

  const input = message.toLowerCase().replace(/['"?!.,]/g, "").trim();

  // Greetings - check first with exact prefix match
  if (/^(hello|hi|hey|greetings|good\s*(morning|afternoon|evening))/.test(input)) {
    return "Hello! Welcome to Akhtar-Serve. I'm your AI eCommerce assistant. How can I help you today?";
  }

  // Thanks - check with exact prefix match
  if (/^(thanks?|thank\s*you|thx|appreciate)/.test(input)) {
    return "You're welcome! Is there anything else I can help you with?";
  }

  // Goodbye - check with exact prefix match
  if (/^(bye|goodbye|see\s*you|later|take\s*care)/.test(input)) {
    return "Goodbye! Have a great day and happy selling!";
  }

  // Detect intent from the message
  const detectedIntent = detectIntent(input);

  // Search knowledge base with improved matching
  let bestMatch: { entry: QA; score: number } | null = null;

  for (const entry of kb) {
    // If entry requires a specific intent, skip if not detected
    if (entry.requireIntent && entry.requireIntent !== detectedIntent) {
      continue;
    }

    for (const keyword of entry.q) {
      const keywordWords = keyword.toLowerCase().split(" ");
      
      // Calculate match score based on how many words match
      const matchedWords = keywordWords.filter((word) => input.includes(word));
      const score = matchedWords.length / keywordWords.length;

      // Require at least 70% of keyword words to match
      if (score >= 0.7) {
        // If this is a better match than current best, update
        if (!bestMatch || score > bestMatch.score) {
          bestMatch = { entry, score };
        }
      }
    }
  }

  // Return best match if found
  if (bestMatch) {
    return bestMatch.entry.a;
  }

  // Fallback - provide helpful guidance based on detected intent
  if (detectedIntent === "pricing") {
    return "**Pricing Information:**\n\nI can help with pricing! Here are some options:\n\n• **Platform Plans:** Free, Starter ($29/mo), Professional ($79/mo), Enterprise\n• **Amazon Managed Services:** Starting at $499/mo\n• **eBay Managed Services:** Starting at $399/mo\n\nFor detailed pricing, visit Dashboard → Billing or contact sales@akhtarserve.com";
  }

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
