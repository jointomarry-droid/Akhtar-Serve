export default function SchemaOrg() {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Akhtar Serve",
    description: "Akhtar Serve is a professional eCommerce solutions company providing complete Amazon, eBay, Walmart, Shopify, Etsy, TikTok Shop, and multi-channel marketplace management services.",
    url: "https://www.akhtarserve.com",
    logo: "https://www.akhtarserve.com/logo.png",
    image: "https://www.akhtarserve.com/og-image.png",
    email: "support@akhtarserve.com",
    telephone: "+1-555-AKHTAR-SERVE",
    foundingDate: "2020",
    numberOfEmployees: {
      "@type": "QuantitativeValue",
      minValue: 10,
      maxValue: 50,
    },
    address: {
      "@type": "PostalAddress",
      addressCountry: "US",
      addressRegion: "California",
      addressLocality: "Los Angeles",
    },
    founder: {
      "@type": "Person",
      name: "Shoaib Akhtar",
      jobTitle: "Founder & CEO",
      url: "https://www.akhtarserve.com/about",
    },
    sameAs: [
      "https://www.facebook.com/akhtarserve",
      "https://www.instagram.com/akhtarserve",
      "https://www.linkedin.com/company/akhtarserve",
      "https://twitter.com/akhtarserve",
      "https://www.youtube.com/@akhtarserve",
      "https://github.com/akhtarserve",
      "https://www.trustpilot.com/review/akhtarserve.com",
    ],
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "customer service",
        availableLanguage: ["English"],
        email: "support@akhtarserve.com",
      },
      {
        "@type": "ContactPoint",
        contactType: "sales",
        availableLanguage: ["English"],
        email: "sales@akhtarserve.com",
      },
    ],
    areaServed: {
      "@type": "Worldwide",
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "eCommerce Services",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Amazon Account Management",
            description: "Complete Amazon seller account management including FBA, FBM, PPC, SEO, and product listing optimization.",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "eBay Store Management",
            description: "Professional eBay store management including listing optimization, SEO, marketing, and store design.",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Walmart Marketplace",
            description: "Walmart marketplace setup, product listing, optimization, and advertising management.",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Shopify Development",
            description: "Custom Shopify store development, theme customization, and app integration.",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Product Research",
            description: "AI-powered product research and market analysis for profitable product opportunities.",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Product Sourcing",
            description: "Reliable supplier sourcing from Alibaba, AliExpress, and verified manufacturers worldwide.",
          },
        },
      ],
    },
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Akhtar Serve",
    url: "https://www.akhtarserve.com",
    description: "Enterprise-grade multi-channel eCommerce management platform for Amazon and eBay sellers.",
    publisher: {
      "@type": "Organization",
      name: "Akhtar Serve",
    },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: "https://www.akhtarserve.com/search?q={search_term_string}",
      },
      "query-input": "required name=search_term_string",
    },
  };

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: "Akhtar Serve",
    description: "Professional eCommerce solutions company providing Amazon, eBay, Walmart, and Shopify services.",
    url: "https://www.akhtarserve.com",
    telephone: "+1-555-AKHTAR-SERVE",
    email: "support@akhtarserve.com",
    address: {
      "@type": "PostalAddress",
      addressCountry: "US",
      addressRegion: "California",
      addressLocality: "Los Angeles",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 34.0522,
      longitude: -118.2437,
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      opens: "00:00",
      closes: "23:59",
    },
    priceRange: "$$",
    image: "https://www.akhtarserve.com/logo.png",
  };

  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Shoaib Akhtar",
    jobTitle: "Founder & CEO",
    worksFor: {
      "@type": "Organization",
      name: "Akhtar Serve",
    },
    url: "https://www.akhtarserve.com/about",
    sameAs: [
      "https://www.linkedin.com/in/shoaibakhtar",
      "https://twitter.com/shoaibakhtar",
    ],
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is Akhtar Serve?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Akhtar Serve is an enterprise-grade multi-channel eCommerce management platform that helps sellers manage their Amazon, eBay, Walmart, Shopify, and other marketplace businesses from one powerful dashboard.",
        },
      },
      {
        "@type": "Question",
        name: "How does the multi-channel inventory sync work?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Our real-time inventory sync connects to Amazon SP-API, eBay Trading API, and other marketplace APIs. When a sale happens on any channel, inventory is automatically updated across all connected stores within seconds.",
        },
      },
      {
        "@type": "Question",
        name: "What marketplaces do you support?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "We support Amazon (US, UK, DE, FR, ES, IT, CA, JP, AU), eBay (all global sites), Walmart Marketplace, Shopify, Etsy, TikTok Shop, and WooCommerce.",
        },
      },
      {
        "@type": "Question",
        name: "How much does Akhtar Serve cost?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "We offer flexible pricing plans starting from $29/month for small sellers up to custom enterprise plans. All plans include a 14-day free trial with no credit card required.",
        },
      },
      {
        "@type": "Question",
        name: "Can I try Akhtar Serve before committing?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes! We offer a 14-day free trial on all plans. No credit card required. You get full access to all features in your chosen plan.",
        },
      },
      {
        "@type": "Question",
        name: "Is my business data secure?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Absolutely. We use bank-level AES-256 encryption, SOC 2 Type II compliance, GDPR adherence, and regular third-party security audits.",
        },
      },
    ],
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: "eCommerce Management Platform",
    provider: {
      "@type": "Organization",
      name: "Akhtar Serve",
    },
    areaServed: {
      "@type": "Worldwide",
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "eCommerce Services",
      itemListElement: [
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Amazon Account Management" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "eBay Store Management" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Walmart Marketplace" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Shopify Development" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Product Research" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Product Sourcing" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Listing Optimization" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "PPC Advertising" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "SEO Services" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Inventory Management" } },
      ],
    },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://www.akhtarserve.com" },
      { "@type": "ListItem", position: 2, name: "About", item: "https://www.akhtarserve.com/about" },
      { "@type": "ListItem", position: 3, name: "Services", item: "https://www.akhtarserve.com/dashboard" },
      { "@type": "ListItem", position: 4, name: "Pricing", item: "https://www.akhtarserve.com/register" },
      { "@type": "ListItem", position: 5, name: "Contact", item: "https://www.akhtarserve.com/contact" },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
    </>
  );
}