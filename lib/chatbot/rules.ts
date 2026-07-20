import { ContentFilterRule, ChatCategory } from "@/types/chat";

// ==================== CONTENT FILTER RULES ====================
// These rules filter out illegal, harmful, or inappropriate content

export const contentFilterRules: ContentFilterRule[] = [
  // Illegal activities
  {
    id: "illegal_1",
    name: "Drug-related content",
    patterns: [
      /\b(drug|drugs|narcotic|narcotics|cocaine|heroin|methamphetamine|cannabis|marijuana|weed|opioid)\b/gi,
      /\b(buy\s+drugs|sell\s+drugs|drug\s+dealing|drug\s+trade)\b/gi,
    ],
    action: "block",
    message:
      "I'm sorry, but I cannot assist with any drug-related queries. Akhtar-Serve is a legitimate eCommerce platform. If you have questions about our services, I'd be happy to help.",
  },
  // Weapons
  {
    id: "illegal_2",
    name: "Weapons-related content",
    patterns: [
      /\b(weapon|weapons|gun|guns|firearm|firearms|rifle|pistol|ammo|ammunition|explosive|explosives)\b/gi,
      /\b(buy\s+weapons|sell\s+weapons|weapon\s+trade|illegal\s+weapons)\b/gi,
    ],
    action: "block",
    message:
      "I cannot assist with weapons-related queries. Our platform is for legitimate eCommerce activities. How can I help you with your Amazon or eBay selling needs?",
  },
  // Hacking/Cybercrime
  {
    id: "illegal_3",
    name: "Hacking and cybercrime",
    patterns: [
      /\b(hack|hacking|hacker|phishing|malware|ransomware|ddos|exploit|exploits|cracking)\b/gi,
      /\b(buy\s+hacks|sell\s+hacks|cyber\s+attack|identity\s+theft|credit\s+card\s+fraud)\b/gi,
    ],
    action: "block",
    message:
      "I cannot assist with hacking, cybercrime, or any illegal digital activities. I'm here to help with legitimate eCommerce questions. What would you like to know about selling on Amazon or eBay?",
  },
  // Fraud
  {
    id: "illegal_4",
    name: "Fraud and scams",
    patterns: [
      /\b(scam|scamming|fraud|fraudulent|counterfeit|fake\s+products|fake\s+reviews|review\s+manipulation)\b/gi,
      /\b(money\s+laundering|tax\s+evasion|bribery|corruption)\b/gi,
    ],
    action: "block",
    message:
      "I cannot assist with fraud, scams, or any deceptive practices. Akhtar-Serve promotes ethical business practices. Let me help you with legitimate selling strategies instead.",
  },
  // Adult content
  {
    id: "illegal_5",
    name: "Adult content",
    patterns: [
      /\b(porn|pornography|xxx|adult\s+content|nsfw|sexually\s+explicit)\b/gi,
    ],
    action: "block",
    message:
      "I cannot assist with adult content queries. Our platform focuses on legitimate eCommerce. How can I help you with your selling business?",
  },
  // Violence
  {
    id: "illegal_6",
    name: "Violence and threats",
    patterns: [
      /\b(kill|murder|assault|terrorism|terrorist|bomb\s+making|poison)\b/gi,
      /\b(threat|threatening|intimidation|harassment|stalking)\b/gi,
    ],
    action: "block",
    message:
      "I cannot assist with any violent or threatening content. I'm here to help with eCommerce questions. How can I assist you today?",
  },
  // Gambling
  {
    id: "illegal_7",
    name: "Illegal gambling",
    patterns: [
      /\b(illegal\s+gambling|betting\s+rig|fixed\s+matches|gambling\s+fraud)\b/gi,
    ],
    action: "block",
    message:
      "I cannot assist with illegal gambling activities. I'm here to help with your eCommerce business. What would you like to know?",
  },
  // Personal information requests
  {
    id: "privacy_1",
    name: "Personal information requests",
    patterns: [
      /\b(how\s+to\s+get\s+someone's\s+personal|steal\s+identity|identity\s+theft|social\s+security\s+number)\b/gi,
    ],
    action: "block",
    message:
      "I cannot assist with obtaining personal information about others. Privacy is important. I'm here to help with your eCommerce needs.",
  },
];

// ==================== CONTENT FILTER FUNCTION ====================

export interface FilterResult {
  isBlocked: boolean;
  rule?: ContentFilterRule;
  message: string;
}

export function filterContent(input: string): FilterResult {
  const normalizedInput = input.toLowerCase().trim();

  for (const rule of contentFilterRules) {
    for (const pattern of rule.patterns) {
      // Reset regex lastIndex for global patterns
      pattern.lastIndex = 0;
      if (pattern.test(normalizedInput)) {
        return {
          isBlocked: true,
          rule,
          message: rule.message,
        };
      }
    }
  }

  return {
    isBlocked: false,
    message: "",
  };
}

// ==================== TOPIC CLASSIFICATION ====================

export function classifyTopic(input: string): ChatCategory {
  const normalizedInput = input.toLowerCase();

  const categoryPatterns: { category: ChatCategory; patterns: RegExp[] }[] = [
    {
      category: "products",
      patterns: [
        /\b(product|products|listing|listings|catalog|sku|barcode|brand|category|categories)\b/i,
        /\b(add\s+product|edit\s+product|delete\s+product|product\s+details|product\s+info)\b/i,
      ],
    },
    {
      category: "orders",
      patterns: [
        /\b(order|orders|purchase|purchases|checkout|buying)\b/i,
        /\b(order\s+status|track\s+order|cancel\s+order|order\s+history)\b/i,
      ],
    },
    {
      category: "inventory",
      patterns: [
        /\b(inventory|stock|stocks|warehouse|warehouses|reorder|stockout|out\s+of\s+stock)\b/i,
        /\b(inventory\s+management|stock\s+levels|inventory\s+tracking)\b/i,
      ],
    },
    {
      category: "pricing",
      patterns: [
        /\b(price|pricing|cost|margin|margins|profit|discount|discounts|promotion)\b/i,
        /\b(pricing\s+strategy|competitive\s+pricing|dynamic\s+pricing|price\s+optimization)\b/i,
        /\b(how\s+much|charge|fee|fees|rate|rates|subscription|plan)\b/i,
      ],
    },
    {
      category: "analytics",
      patterns: [
        /\b(analytics|analytics|report|reports|statistics|metrics|dashboard|insights)\b/i,
        /\b(sales\s+report|revenue|performance|trend|trends)\b/i,
      ],
    },
    {
      category: "integrations",
      patterns: [
        /\b(integration|integrations|connect|api|sync|synchronization)\b/i,
        /\b(amazon\s+api|ebay\s+api|marketplace\s+integration)\b/i,
      ],
    },
    {
      category: "shipping",
      patterns: [
        /\b(shipping|ship|shipped|delivery|deliver|carrier|carriers|tracking|logistics)\b/i,
        /\b(fba|fbm|fulfillment|fulfill|usps|ups|fedex|dhl)\b/i,
      ],
    },
    {
      category: "returns",
      patterns: [
        /\b(return|returns|refund|refunds|exchange| exchanges|rma|return\s+policy)\b/i,
      ],
    },
    {
      category: "marketplace_amazon",
      patterns: [
        /\b(amazon|fba|fulfillment\s+by\s+amazon|amazon\s+seller|amazon\s+prime|amazon\s+listing)\b/i,
        /\b(sp-api|selling\s+partner|brand\s+registry|amazon\s+advertising)\b/i,
      ],
    },
    {
      category: "marketplace_ebay",
      patterns: [
        /\b(ebay|ebay\s+seller|ebay\s+listing|ebay\s+store|ebay\s+premium)\b/i,
        /\b(good\s+til\s+canceled|buy\s+it\s+now|auction|ebay\s+fees)\b/i,
      ],
    },
    {
      category: "account",
      patterns: [
        /\b(update\s+profile|change\s+password|enable\s+2fa|manage\s+notifications|account\s+settings|user\s+settings)\b/i,
        /\b(team|members|roles|permissions|invite\s+member)\b/i,
      ],
    },
    {
      category: "billing",
      patterns: [
        /\b(billing|payment|invoice|invoices|subscription|plan|plans|upgrade)\b/i,
        /\b(credit\s+card|charge|refund|cancel\s+subscription)\b/i,
      ],
    },
    {
      category: "technical",
      patterns: [
        /\b(error|bug|issue|problem|not\s+working|broken|fix|troubleshoot)\b/i,
        /\b(slow|loading|performance|crash|crashes|update|version)\b/i,
      ],
    },
    {
      category: "compliance",
      patterns: [
        /\b(compliance|policy|policies|rules|regulations|tax|taxes|legal|law)\b/i,
        /\b(vat|gst|sales\s+tax|import|export|customs)\b/i,
      ],
    },
  ];

  for (const { category, patterns } of categoryPatterns) {
    for (const pattern of patterns) {
      if (pattern.test(normalizedInput)) {
        return category;
      }
    }
  }

  return "general";
}
