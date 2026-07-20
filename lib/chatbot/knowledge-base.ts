import { KnowledgeEntry, ChatCategory } from "@/types/chat";

// ==================== KNOWLEDGE BASE ====================
// Comprehensive knowledge base for Amazon and eBay sellers

export const knowledgeBase: KnowledgeEntry[] = [
  // ==================== GENERAL ====================
  {
    id: "general_1",
    category: "general",
    keywords: ["hello", "hi", "hey", "greetings", "good morning", "good afternoon"],
    question: "Greetings and introductions",
    answer:
      "Hello! Welcome to Akhtar-Serve. I'm your AI eCommerce assistant, here to help you manage your Amazon and eBay selling business. I can assist with:\n\n• **Product Management** - Adding, editing, and optimizing your product listings\n• **Order Processing** - Tracking orders, handling fulfillment, and managing returns\n• **Inventory Control** - Monitoring stock levels, setting reorder points, and preventing stockouts\n• **Pricing Strategy** - Competitive pricing, margin optimization, and dynamic pricing\n• **Analytics & Reports** - Sales performance, revenue tracking, and market insights\n• **Marketplace Integration** - Connecting Amazon SP-API and eBay API\n• **Shipping & Logistics** - FBA, FBM, carrier management, and tracking\n\nWhat would you like help with today?",
    followUp: [
      "How do I add a new product?",
      "What are the pricing strategies?",
      "How do I connect my Amazon account?",
    ],
  },
  {
    id: "general_2",
    category: "general",
    keywords: ["what is", "about", "tell me about", "akhtar serve", "platform"],
    question: "What is Akhtar-Serve?",
    answer:
      "**Akhtar-Serve** is an enterprise-grade multi-channel eCommerce management platform designed specifically for Amazon and eBay sellers.\n\n**Key Features:**\n• **Unified Dashboard** - Manage all your marketplaces from one place\n• **AI-Powered Tools** - Product research, listing optimization, and pricing intelligence\n• **Real-time Sync** - Inventory, orders, and pricing sync across platforms\n• **Advanced Analytics** - Deep insights into your business performance\n• **Team Collaboration** - Multi-user access with role-based permissions\n• **Automation** - Automated repricing, inventory alerts, and order processing\n\n**Supported Marketplaces:**\n• Amazon (US, UK, DE, FR, IT, ES, JP, CA, AU)\n• eBay (Global)\n\n**Pricing Plans:**\n• **Free** - Up to 50 listings, basic features\n• **Starter** - $29/mo, up to 500 listings\n• **Professional** - $79/mo, unlimited listings, advanced analytics\n• **Enterprise** - Custom pricing, API access, dedicated support\n\nHow can I help you get started?",
  },
  {
    id: "general_3",
    category: "general",
    keywords: ["help", "support", "assist", "guide", "how to use"],
    question: "How to get help",
    answer:
      "I'm here to help! Here are the ways you can get support:\n\n**AI Assistant (Me!)**\n• Ask me anything about using the platform\n• Get instant answers about features and best practices\n• I can guide you through any workflow\n\n**Documentation**\n• Visit our Help Center for detailed guides\n• Check out video tutorials for visual learners\n• Read our API documentation for technical integrations\n\n**Support Channels**\n• **In-App Chat** - Click the chat icon (that's me!)\n• **Email Support** - support@akhtarserve.com\n• **Knowledge Base** - Searchable articles and FAQs\n• **Community Forum** - Connect with other sellers\n\n**What can I help you with right now?**",
  },

  // ==================== PRODUCTS ====================
  {
    id: "products_1",
    category: "products",
    keywords: ["add product", "new product", "create product", "list product"],
    question: "How to add a new product",
    answer:
      "Adding a new product to Akhtar-Serve is simple! Here's how:\n\n**Step-by-Step Guide:**\n\n1. **Navigate to Products**\n   → Go to Dashboard → Products → Click \"Add Product\"\n\n2. **Fill in Product Details**\n   • **Name** - Clear, descriptive product title\n   • **SKU** - Your unique stock keeping unit\n   • **Barcode** - UPC, EAN, or ISBN (optional)\n   • **Description** - Detailed product description\n   • **Brand** - Product brand name\n   • **Category** - Product category\n\n3. **Set Pricing**\n   • **Cost Price** - Your acquisition cost\n   • **Selling Price** - Price on marketplace\n   • **MSRP** - Manufacturer's suggested retail price\n\n4. **Add Images**\n   • Upload high-quality images (min 1000x1000px)\n   • Add lifestyle images for better conversion\n\n5. **Configure Marketplace Listings**\n   • Select target marketplaces (Amazon/eBay)\n   • Set marketplace-specific pricing\n   • Add marketplace-specific keywords\n\n6. **Save & Publish**\n   • Save as Draft for later editing\n   • Publish immediately to go live\n\n**Pro Tips:**\n• Use high-quality images with white backgrounds\n• Write SEO-optimized titles with relevant keywords\n• Include all product variations (size, color, etc.)",
    followUp: [
      "How do I optimize my product listing?",
      "What are the best practices for product images?",
      "How do I set up product variants?",
    ],
  },
  {
    id: "products_2",
    category: "products",
    keywords: ["optimize listing", "listing optimization", "seo", "keywords", "title optimization"],
    question: "How to optimize product listings",
    answer:
      "Listing optimization is crucial for visibility and sales. Here's a comprehensive guide:\n\n**Title Optimization:**\n• Include brand name, key features, and main keyword\n• Keep it under 200 characters (Amazon) or 80 characters (eBay)\n• Use natural language, not keyword stuffing\n• Example: \"Premium Wireless Bluetooth Headphones - Noise Cancelling, 40H Battery, Foldable\"\n\n**Bullet Points / Key Features:**\n• Highlight 5-7 key benefits\n• Start each bullet with a capitalized benefit\n• Include dimensions, materials, and compatibility\n• Use keywords naturally\n\n**Description:**\n• Write detailed, compelling descriptions\n• Use HTML formatting for readability\n• Include use cases and benefits\n• Add social proof and guarantees\n\n**Backend Keywords (Amazon):**\n• Use all 250 bytes of backend search terms\n• Include synonyms and misspellings\n• Don't repeat words from the title\n• Use commas to separate terms\n\n**Images:**\n• Main image: Pure white background (RGB 255,255,255)\n• Include 6-7 images minimum\n• Add lifestyle/in-use images\n• Include infographics with dimensions\n\n**Pricing Strategy:**\n• Research competitor pricing\n• Consider psychological pricing ($29.99 vs $30.00)\n• Factor in all fees (referral, FBA, shipping)\n\nNeed help with any specific optimization?",
  },
  {
    id: "products_3",
    category: "products",
    keywords: ["variants", "variations", "size", "color", "product options"],
    question: "How to set up product variants",
    answer:
      "Product variants allow you to offer different options (size, color, material) under one listing.\n\n**Setting Up Variants:**\n\n1. **Create Parent Product**\n   → Products → Add Product → Select \"Variable Product\"\n\n2. **Define Variation Theme**\n   • Color, Size, Material, Style, or Custom\n   • Example: T-Shirt with Color + Size\n\n3. **Add Variant Options**\n   • Colors: Red, Blue, Green\n   • Sizes: S, M, L, XL\n\n4. **Set Individual Details**\n   • Each variant gets its own:\n     - SKU\n     - Price\n     - Barcode\n     - Image\n     - Stock quantity\n\n5. **Configure Inventory**\n   • Track inventory per variant\n   • Set individual reorder points\n\n**Best Practices:**\n• Use clear, descriptive option names\n• Set competitive pricing per variant\n• Use variant-specific images\n• Monitor stock levels per variant\n• Use the inventory matrix for bulk updates\n\n**Amazon-Specific:**\n• Parent ASIN + Child ASINs\n• Variation relationship type (SizeColor)\n• Theme-specific attributes\n\n**eBay-Specific:**\n• Item specifics for each variation\n• Up to 50 variations per listing\n• Variation-specific shipping profiles",
  },

  // ==================== ORDERS ====================
  {
    id: "orders_1",
    category: "orders",
    keywords: ["order status", "track order", "where is order", "order tracking"],
    question: "How to check order status",
    answer:
      "You can track all your orders from the Orders dashboard:\n\n**Checking Order Status:**\n\n1. **Go to Orders**\n   → Dashboard → Orders\n\n2. **Filter by Status**\n   • **Pending** - Awaiting processing\n   • **Confirmed** - Payment verified\n   • **Processing** - Being prepared\n   • **Shipped** - In transit\n   • **Delivered** - Received by customer\n   • **Cancelled** - Order cancelled\n   • **Refunded** - Money returned\n\n3. **Track Individual Orders**\n   • Click on any order for full details\n   • View tracking number and carrier\n   • See customer information\n   • Check order timeline\n\n**Order Actions:**\n• **Update Status** - Change order status manually\n• **Add Tracking** - Enter tracking number and carrier\n• **Print Label** - Generate shipping label\n• **Send Notification** - Notify customer of status update\n• **Process Refund** - Initiate refund process\n\n**Bulk Operations:**\n• Select multiple orders with checkboxes\n• Bulk update status, add tracking, or print labels\n• Export orders to CSV/Excel\n\n**Real-time Sync:**\n• Orders auto-sync from Amazon/eBay every 15 minutes\n• Manual sync available via refresh button\n• Webhooks for instant updates",
  },
  {
    id: "orders_2",
    category: "orders",
    keywords: ["cancel order", "order cancellation", "refund order"],
    question: "How to cancel or refund an order",
    answer:
      "Here's how to handle order cancellations and refunds:\n\n**Order Cancellation:**\n\n1. **Before Shipment**\n   → Orders → Select Order → Cancel Order\n   • Full refund issued automatically\n   • Customer notified via email\n   • Inventory restored\n\n2. **After Shipment**\n   → Contact customer for return\n   → Process return → Issue refund\n\n**Refund Process:**\n\n1. **Partial Refund**\n   → Orders → Select Order → Issue Refund\n   • Enter refund amount\n   • Select reason (item damaged, not as described, etc.)\n   • Add notes for records\n\n2. **Full Refund**\n   → Same process, enter full order amount\n\n**Refund Policies:**\n• **Amazon:** 30-day return window (extendable)\n• **eBay:** 30-day money-back guarantee\n• **Your Store:** Set custom return policies\n\n**Important Notes:**\n• Refunds take 3-5 business days to process\n• Original shipping costs may or may not be refunded\n• Amazon deducts referral fees on refunds\n• Keep records for tax purposes\n\n**Automated Rules:**\n• Set up auto-refund for certain scenarios\n• Create return merchandise authorization (RMA) workflows\n• Configure return shipping labels",
  },

  // ==================== INVENTORY ====================
  {
    id: "inventory_1",
    category: "inventory",
    keywords: ["inventory management", "stock level", "reorder", "stockout"],
    question: "How to manage inventory",
    answer:
      "Effective inventory management prevents stockouts and overstocking. Here's how:\n\n**Inventory Dashboard:**\n→ Dashboard → Inventory\n\n**Key Features:**\n\n1. **Real-time Stock Levels**\n   • Current quantity across all warehouses\n   • Reserved stock (pending orders)\n   • Available to sell\n\n2. **Low Stock Alerts**\n   • Set minimum stock levels per product\n   • Get email/Slack notifications when low\n   • Auto-reorder suggestions\n\n3. **Multi-Warehouse Management**\n   • Track inventory across locations\n   • Transfer stock between warehouses\n   • FBA vs FBM inventory split\n\n4. **Inventory Tracking Methods**\n   • **FIFO** - First In, First Out\n   • **LIFO** - Last In, First Out\n   • **Average Cost** - Weighted average\n\n**Best Practices:**\n• Set reorder points 2-3 weeks before stockout\n• Use safety stock for high-demand items\n• Regular cycle counting (weekly/monthly)\n• Analyze sales velocity for forecasting\n• Consider seasonality in reorder calculations\n\n**Automation:**\n• Auto-reorder when stock hits minimum\n• Sync inventory across marketplaces\n• Low stock alerts via email, SMS, Slack\n• Daily inventory reports",
  },
  {
    id: "inventory_2",
    category: "inventory",
    keywords: ["fba", "fulfillment by amazon", "amazon fba", "fbm"],
    question: "FBA vs FBM inventory management",
    answer:
      "**Fulfillment by Amazon (FBA)** vs **Fulfillment by Merchant (FBM)**\n\n**FBA Overview:**\n• Amazon stores, packs, and ships your products\n• Amazon handles customer service and returns\n• Products qualify for Prime badge\n• Higher fees but more hands-off\n\n**FBA Fees:**\n• **Storage Fee:** $0.75-$2.40/cubic foot/month\n• **Fulfillment Fee:** $3.22-$10+ per unit (size-dependent)\n• **Long-term Storage:** $6.90/cubic foot (365+ days)\n\n**FBM Overview:**\n• You handle storage, packing, and shipping\n• You manage customer service\n• No Prime badge (unless SFP)\n• Lower fees but more work\n\n**When to Use FBA:**\n• High-volume products\n• Small, lightweight items\n• Products needing fast shipping\n• Want Prime badge\n\n**When to Use FBM:**\n• Large/heavy items\n• Low-volume products\n• Want more control\n• Better margins needed\n\n**Hybrid Strategy:**\n• Use FBA for bestsellers\n• FBM for slow-movers\n• FBA for Prime-eligible items\n• FBM for oversized items\n\n**Managing Both:**\n→ Inventory → FBA Tab\n• See FBA inventory levels\n• Monitor FBA fees\n• Track inbound shipments\n• Manage removal orders",
  },

  // ==================== PRICING ====================
  {
    id: "pricing_0",
    category: "pricing",
    keywords: ["amazon full account handling price", "amazon account handling cost", "amazon managed service price", "amazon full service price"],
    question: "Amazon full account handling pricing",
    answer:
      "**Amazon Full Account Handling:**\n\n**Akhtar-Serve Managed Amazon Services:**\n\n• **Starter Package:** $499/mo - Up to 100 SKUs, basic management\n• **Growth Package:** $999/mo - Up to 500 SKUs, full optimization\n• **Enterprise Package:** $1,999/mo - Unlimited SKUs, dedicated account manager\n\n**Includes:**\n• Product listing & optimization\n• Inventory management\n• Order processing\n• PPC advertising management\n• Customer support handling\n• Monthly analytics reports\n\nContact sales@akhtarserve.com for custom pricing.",
    followUp: [
      "What's included in the Growth package?",
      "How do I get started with managed services?",
      "What are the eBay managed service prices?",
    ],
  },
  {
    id: "pricing_1b",
    category: "pricing",
    keywords: ["ebay full account handling price", "ebay account handling cost", "ebay managed service price", "ebay full service price"],
    question: "eBay full account handling pricing",
    answer:
      "**eBay Full Account Handling:**\n\n**Akhtar-Serve Managed eBay Services:**\n\n• **Starter Package:** $399/mo - Up to 100 listings\n• **Growth Package:** $799/mo - Up to 500 listings\n• **Enterprise Package:** $1,499/mo - Unlimited listings\n\n**Includes:**\n• Listing creation & optimization\n• Inventory sync\n• Order management\n• Promoted Listings management\n• Customer communication\n• Performance reporting\n\nContact sales@akhtarserve.com for custom pricing.",
    followUp: [
      "What's included in the Growth package?",
      "How do I get started with managed services?",
      "What are the Amazon managed service prices?",
    ],
  },
  {
    id: "pricing_1c",
    category: "pricing",
    keywords: ["how much does it cost", "what is the price", "pricing information", "what are the rates", "service pricing"],
    question: "Service pricing information",
    answer:
      "**Akhtar-Serve Pricing:**\n\n**Platform Plans:**\n• **Free Plan:** 50 listings, basic features\n• **Starter:** $29/mo - 500 listings\n• **Professional:** $79/mo - Unlimited listings\n• **Enterprise:** Custom pricing\n\n**Managed Services:**\n• **Amazon:** Starting at $499/mo\n• **eBay:** Starting at $399/mo\n\nView full pricing: Dashboard → Billing",
    followUp: [
      "What's included in the Professional plan?",
      "How much does Amazon account management cost?",
      "How do I upgrade my plan?",
    ],
  },
  {
    id: "pricing_1",
    category: "pricing",
    keywords: ["pricing strategy", "price optimization", "competitive pricing", "dynamic pricing"],
    question: "Pricing strategies for eCommerce",
    answer:
      "Effective pricing is key to profitability. Here are proven strategies:\n\n**1. Cost-Plus Pricing**\n• Calculate all costs (product, shipping, fees, taxes)\n• Add desired margin (typically 30-50%)\n• Simple but may not be competitive\n\n**2. Competitive Pricing**\n• Monitor competitor prices\n• Price within 5-10% of market average\n• Use repricing tools for real-time updates\n\n**3. Dynamic Pricing**\n• Adjust prices based on demand\n• Increase during high demand\n• Decrease during low demand\n• Automate with rules\n\n**4. Psychological Pricing**\n• $29.99 instead of $30.00\n• Charm pricing increases conversions\n• Bundle pricing for perceived value\n\n**5. Penetration Pricing**\n• Start low to gain market share\n• Gradually increase as you build reviews\n• Good for new product launches\n\n**6. Premium Pricing**\n• Price higher for perceived quality\n• Works for unique/branded products\n• Requires strong value proposition\n\n**Fee Structure (Amazon):**\n• **Referral Fee:** 8-15% of sale price\n• **FBA Fee:** $3.22-$10+ per unit\n• **Closing Fee:** $0.99 per item\n\n**Fee Structure (eBay):**\n• **Final Value Fee:** 12.9% + $0.30\n• **Promoted Listings:** 2-20% of sale\n\n**Pricing Calculator:**\n→ Dashboard → Profit Calculator\n• Input costs, see profit margins\n• Factor in all marketplace fees\n• Compare FBA vs FBM profitability",
  },
  {
    id: "pricing_2",
    category: "pricing",
    keywords: ["profit margin", "calculate profit", "break even", "roi"],
    question: "How to calculate profit margins",
    answer:
      "Understanding your profit margins is essential for business success:\n\n**Basic Profit Formula:**\n```\nProfit = Selling Price - (Cost + Fees + Shipping)\n```\n\n**Margin Calculation:**\n```\nMargin % = (Profit / Selling Price) × 100\n```\n\n**Example:**\n• Selling Price: $29.99\n• Cost: $8.00\n• Amazon Referral Fee (15%): $4.50\n• FBA Fee: $5.50\n• Shipping: $0.00 (FBA)\n• **Profit: $11.99**\n• **Margin: 40%**\n\n**Key Metrics:**\n• **Gross Margin:** Revenue - Cost of Goods\n• **Net Margin:** Revenue - All Expenses\n• **ROI:** (Profit / Investment) × 100\n• **Break-even Point:** Fixed Costs / (Price - Variable Cost)\n\n**Using the Profit Calculator:**\n→ Dashboard → Profit Calculator\n1. Enter product cost\n2. Select marketplace\n3. Enter selling price\n4. See detailed profit breakdown\n5. View ROI and break-even analysis\n\n**Pro Tips:**\n• Don't forget hidden costs (storage, returns, advertising)\n• Factor in tax implications\n• Consider currency conversion for international sales\n• Track lifetime value per customer",
  },

  // ==================== ANALYTICS ====================
  {
    id: "analytics_1",
    category: "analytics",
    keywords: ["analytics", "reports", "dashboard", "metrics", "sales report"],
    question: "How to use analytics and reports",
    answer:
      "Akhtar-Serve provides comprehensive analytics to track your business performance:\n\n**Dashboard Overview:**\n→ Dashboard → Analytics\n\n**Key Metrics:**\n• **Revenue** - Total sales revenue (daily/weekly/monthly)\n• **Orders** - Number of orders and growth rate\n• **Units Sold** - Total units across marketplaces\n• **Average Order Value** - Revenue per order\n• **Conversion Rate** - Visitors to buyers\n\n**Reports Available:**\n\n1. **Sales Reports**\n   • Sales by marketplace\n   • Sales by product/category\n   • Sales trends over time\n   • Geographic breakdown\n\n2. **Profit Reports**\n   • Profit by product\n   • Fee breakdown\n   • Margin analysis\n   • Cost trends\n\n3. **Inventory Reports**\n   • Stock levels\n   • Turnover rate\n   • Aging inventory\n   • Reorder recommendations\n\n4. **Customer Reports**\n   • Customer demographics\n   • Repeat purchase rate\n   • Customer lifetime value\n\n5. **Performance Reports**\n   • Buy Box percentage\n   • IPI score (Amazon)\n   • Seller rating\n\n**Export Options:**\n• CSV/Excel download\n• Scheduled email reports\n• API access for custom analytics\n\n**Custom Dashboards:**\n• Drag-and-drop widget arrangement\n• Save custom date ranges\n• Share reports with team members",
  },

  // ==================== INTEGRATIONS ====================
  {
    id: "integrations_1",
    category: "integrations",
    keywords: ["connect amazon", "amazon integration", "amazon api", "sp-api"],
    question: "How to connect Amazon seller account",
    answer:
      "Connecting your Amazon Seller Central account to Akhtar-Serve is straightforward:\n\n**Step-by-Step Setup:**\n\n1. **Navigate to Integrations**\n   → Dashboard → Integrations → Connect Marketplace\n\n2. **Select Amazon**\n   → Click \"Connect Amazon\"\n\n3. **Authorize Access**\n   • You'll be redirected to Amazon Seller Central\n   • Log in with your seller credentials\n   • Review requested permissions\n   • Click \"Authorize\" to grant access\n\n4. **Configure Settings**\n   • Select marketplace(s): US, UK, DE, etc.\n   • Set sync frequency (recommended: 15 minutes)\n   • Enable auto-sync for orders, inventory, pricing\n\n5. **Test Connection**\n   • Verify data is syncing correctly\n   • Check product count matches\n   • Confirm order data is accurate\n\n**Required Permissions:**\n• **Catalog Items** - Read product data\n• **Orders** - Read order data\n• **Inventory** - Read/write inventory\n• **Reports** - Access business reports\n• **Notifications** - Receive alerts\n\n**Troubleshooting:**\n• Ensure LWA token is not expired\n   → Re-authorize if needed\n• Check API rate limits\n   → Reduce sync frequency if throttled\n• Verify marketplace region settings\n\n**Data Synced:**\n• Products and listings\n• Orders and fulfillments\n• Inventory levels\n• Pricing updates\n• Customer messages\n• Performance metrics",
  },
  {
    id: "integrations_2",
    category: "integrations",
    keywords: ["connect ebay", "ebay integration", "ebay api", "ebay developer"],
    question: "How to connect eBay seller account",
    answer:
      "Connect your eBay account to manage everything from Akhtar-Serve:\n\n**Step-by-Step Setup:**\n\n1. **Navigate to Integrations**\n   → Dashboard → Integrations → Connect Marketplace\n\n2. **Select eBay**\n   → Click \"Connect eBay\"\n\n3. **Create eBay Developer Account** (if needed)\n   • Go to developer.ebay.com\n   • Create an account and app\n   • Get your App ID and Cert ID\n\n4. **Authorize Access**\n   • Log in with your eBay seller credentials\n   • Grant necessary permissions\n   • Copy the auth token\n\n5. **Configure Settings**\n   • Set default shipping profiles\n   • Configure return policies\n   • Set listing defaults\n\n6. **Verify Sync**\n   • Check listings imported correctly\n   • Confirm order history loaded\n   • Test inventory sync\n\n**Required Permissions:**\n• **Browse** - View listings\n• **Sell** - Manage listings\n• **Order** - Process orders\n• **Account** - Access seller info\n\n**eBay-Specific Features:**\n• **Good 'Til Canceled (GTC)** listings\n• **Auction** format support\n• **Best Offer** management\n• **Promoted Listings** integration\n• **eBay Premium Service** badge\n\n**Data Synced:**\n• Active listings\n• Sold items and orders\n• Inventory levels\n• Buyer messages\n• Seller performance metrics\n• Return/refund requests",
  },

  // ==================== SHIPPING ====================
  {
    id: "shipping_1",
    category: "shipping",
    keywords: ["shipping", "shipping labels", "carrier", "usps", "ups", "fedex"],
    question: "Shipping and fulfillment options",
    answer:
      "Akhtar-Serve supports multiple shipping and fulfillment options:\n\n**Fulfillment Options:**\n\n1. **Fulfillment by Amazon (FBA)**\n   • Amazon stores, packs, ships\n   • Prime eligible\n   • Best for high-volume sellers\n\n2. **Fulfillment by Merchant (FBM)**\n   • You handle everything\n   • More control over packaging\n   • Better for custom/large items\n\n3. **Seller Fulfilled Prime (SFP)**\n   • Ship from your warehouse\n   • Still get Prime badge\n   • Must meet strict SLAs\n\n4. **Third-Party Logistics (3PL)**\n   • Use fulfillment centers\n   • Scale without warehouse space\n   • Examples: ShipBob, Deliverr\n\n**Supported Carriers:**\n• **USPS** - Best for small/light items\n• **UPS** - Reliable, tracking included\n• **FedEx** - Fast delivery options\n• **DHL** - International shipping\n• **Royal Mail** - UK domestic\n\n**Shipping Features:**\n→ Dashboard → Orders → Shipping\n• Generate shipping labels\n• Compare carrier rates\n• Bulk print labels\n• Track shipments\n• Automate shipping rules\n\n**Shipping Labels:**\n• Print directly from dashboard\n• Bulk label generation\n• Custom label formats\n• Return labels included\n\n**Best Practices:**\n• Offer free shipping when possible\n• Set handling time accurately\n• Use tracking for all shipments\n• Consider shipping insurance for high-value items",
  },

  // ==================== COMPLIANCE ====================
  {
    id: "compliance_1",
    category: "compliance",
    keywords: ["tax", "taxes", "vat", "gst", "sales tax", "tax compliance"],
    question: "Tax compliance for sellers",
    answer:
      "Tax compliance is crucial for eCommerce sellers. Here's what you need to know:\n\n**Sales Tax (US):**\n• **Nexus** - Economic or physical presence in a state\n• **Marketplace Facilitator Laws** - Amazon/eBay collect and remit in most states\n• **Your Responsibility** - Shipments to non-marketplace states\n\n**VAT (UK/EU):**\n• **Registration** - Required above threshold (£85K UK, varies EU)\n• **Rate** - 20% UK, varies by EU country\n• **IOSS** - Import One-Stop Shop for EU\n\n**GST (Australia/Canada):**\n• **Australia** - 10% GST on goods\n• **Canada** - 5% GST + provincial tax\n\n**Tax Management in Akhtar-Serve:**\n→ Settings → Tax Configuration\n• Set tax rates by region\n• Configure tax-exempt customers\n• Generate tax reports\n• Export tax data for filing\n\n**Important Deadlines:**\n• **US** - Quarterly estimated taxes\n• **UK** - VAT return deadlines\n• **EU** - Varies by country\n\n**Best Practices:**\n• Keep detailed records of all transactions\n• Use accounting software integration\n• Consult with a tax professional\n• Monitor marketplace tax reports\n• Set aside funds for tax payments\n\n**Automated Tax Features:**\n• Automatic tax calculation at checkout\n• Tax-inclusive pricing option\n• Tax reporting by jurisdiction\n• Integration with accounting software",
  },

  // ==================== TECHNICAL ====================
  {
    id: "technical_1",
    category: "technical",
    keywords: ["error", "bug", "not working", "issue", "problem", "help"],
    question: "Troubleshooting common issues",
    answer:
      "Here are solutions to common issues:\n\n**Sync Issues:**\n• **Problem:** Data not updating\n• **Solution:** Check API connection, re-authorize if needed\n• **Solution:** Verify sync frequency settings\n• **Solution:** Check for rate limiting\n\n**Login Issues:**\n• **Problem:** Can't log in\n• **Solution:** Clear browser cache and cookies\n• **Solution:** Reset password via email\n• **Solution:** Check if account is suspended\n\n**Product Listing Errors:**\n• **Problem:** Listing rejected by marketplace\n• **Solution:** Check required fields (title, images, price)\n• **Solution:** Verify category requirements\n• **Solution:** Ensure compliance with policies\n\n**Order Processing Errors:**\n• **Problem:** Orders not syncing\n• **Solution:** Check API permissions\n• **Solution:** Verify order status in marketplace\n• **Solution:** Manual sync available\n\n**Performance Issues:**\n• **Problem:** Dashboard loading slowly\n• **Solution:** Clear browser cache\n• **Solution:** Check internet connection\n• **Solution:** Try different browser\n\n**Still Need Help?**\n• Contact support@akhtarserve.com\n• Use the in-app chat (that's me!)\n• Check our documentation\n• Visit the community forum",
  },

  // ==================== ACCOUNT ====================
  {
    id: "account_1",
    category: "account",
    keywords: ["team", "members", "roles", "permissions", "invite"],
    question: "Team management and roles",
    answer:
      "Akhtar-Serve supports multi-user access with role-based permissions:\n\n**Roles Available:**\n\n1. **Owner**\n   • Full access to everything\n   • Can delete account\n   • Manages billing\n   • Invites/removes members\n\n2. **Admin**\n   • Full operational access\n   • Manages team members\n   • Cannot delete account\n   • Can manage integrations\n\n3. **Manager**\n   • Manages products, orders, inventory\n   • Views analytics and reports\n   • Cannot manage team or billing\n   • Can process refunds\n\n4. **Operator**\n   • Daily operations\n   • Processes orders\n   • Updates inventory\n   • Limited analytics access\n\n5. **Viewer**\n   • Read-only access\n   • Views dashboards and reports\n   • Cannot make changes\n   • Good for stakeholders\n\n**Inviting Team Members:**\n→ Dashboard → Team → Invite Member\n1. Enter email address\n2. Select role\n3. Add personal message (optional)\n4. Click \"Send Invitation\"\n\n**Managing Members:**\n→ Dashboard → Team\n• View all team members\n• Change roles\n• Remove members\n• View activity logs\n\n**Security Best Practices:**\n• Use least-privilege principle\n• Enable 2FA for all users\n• Review access regularly\n• Audit team activity",
  },
];

// ==================== KNOWLEDGE SEARCH FUNCTION ====================

export function searchKnowledge(
  query: string,
  category?: ChatCategory
): KnowledgeEntry[] {
  const normalizedQuery = query.toLowerCase();
  const words = normalizedQuery.split(/\s+/).filter((w) => w.length > 2);

  // Detect pricing intent
  const hasPricingIntent = /\b(how\s+much|price|cost|fee|charge|rate|subscription|plan)\b/i.test(normalizedQuery);

  let filteredEntries = knowledgeBase;

  // Filter by category if specified
  if (category && category !== "general") {
    filteredEntries = filteredEntries.filter(
      (entry) => entry.category === category || entry.category === "general"
    );
  }

  // Score each entry based on keyword matches
  const scoredEntries = filteredEntries.map((entry) => {
    let score = 0;

    // Boost pricing entries when pricing intent is detected
    if (hasPricingIntent && entry.category === "pricing") {
      score += 10;
    }

    // Check keyword matches
    for (const keyword of entry.keywords) {
      const keywordLower = keyword.toLowerCase();
      for (const word of words) {
        if (keywordLower.includes(word) || word.includes(keywordLower)) {
          score += 3;
        }
      }
      // Exact phrase match (highest score)
      if (normalizedQuery.includes(keywordLower)) {
        score += 10;
      }
    }

    // Check question match
    const questionLower = entry.question.toLowerCase();
    for (const word of words) {
      if (questionLower.includes(word)) {
        score += 1;
      }
    }

    // Check answer match
    const answerLower = entry.answer.toLowerCase();
    for (const word of words) {
      if (answerLower.includes(word)) {
        score += 1;
      }
    }

    return { entry, score };
  });

  // Sort by score and return top matches
  return scoredEntries
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((item) => item.entry);
}

// ==================== FALLBACK RESPONSES ====================

export const fallbackResponses: Record<ChatCategory, string> = {
  general:
    "I'm not sure I understand your question. Could you rephrase it? I can help with products, orders, inventory, pricing, analytics, integrations, and more.",
  products:
    "I can help with product management. Could you be more specific? For example:\n• How to add a product\n• Product listing optimization\n• Managing product variants",
  orders:
    "I can help with order management. What specifically would you like to know?\n• Order status tracking\n• Processing orders\n• Handling returns and refunds",
  inventory:
    "I can help with inventory management. What's your question about?\n• Stock level monitoring\n• FBA vs FBM inventory\n• Reorder automation",
  pricing:
    "I can help with pricing strategies. What would you like to know?\n• Pricing optimization\n• Profit margin calculation\n• Competitive pricing",
  analytics:
    "I can help with analytics and reporting. What metrics are you looking for?\n• Sales reports\n• Profit analysis\n• Performance metrics",
  integrations:
    "I can help with marketplace integrations. Which marketplace?\n• Amazon SP-API setup\n• eBay API connection\n• Sync configuration",
  account:
    "I can help with account management. What do you need?\n• Team member management\n• Role permissions\n• Account settings",
  billing:
    "I can help with billing questions. What would you like to know?\n• Subscription plans\n• Payment methods\n• Invoice history",
  technical:
    "I can help troubleshoot technical issues. What problem are you experiencing?\n• Sync errors\n• Login issues\n• Performance problems",
  marketplace_amazon:
    "I can help with Amazon-specific questions. What would you like to know?\n• Amazon seller setup\n• FBA management\n• Amazon advertising",
  marketplace_ebay:
    "I can help with eBay-specific questions. What would you like to know?\n• eBay store setup\n• Listing optimization\n• eBay promotions",
  shipping:
    "I can help with shipping and logistics. What's your question?\n• Shipping label generation\n• Carrier comparison\n• FBA shipment setup",
  returns:
    "I can help with returns management. What do you need?\n• Return policy setup\n• Processing refunds\n• RMA management",
  compliance:
    "I can help with compliance questions. What would you like to know?\n• Tax configuration\n• Marketplace policies\n• Legal requirements",
};

// ==================== GREETING RESPONSES ====================

export const greetingResponses: string[] = [
  "Hello! Welcome to Akhtar-Serve. I'm your AI eCommerce assistant. How can I help you today?",
  "Hi there! Ready to optimize your Amazon and eBay selling business? What can I help you with?",
  "Welcome! I'm here to help you manage your multi-channel eCommerce business. What's on your mind?",
  "Hey! Great to see you. Whether it's products, orders, inventory, or pricing - I'm here to help!",
];

export function getGreetingResponse(): string {
  return greetingResponses[Math.floor(Math.random() * greetingResponses.length)];
}
