"use client";

const companies = [
  { name: "Amazon", logo: "🛒", color: "#FF9900" },
  { name: "eBay", logo: "🏷️", color: "#E53238" },
  { name: "Walmart", logo: "🏪", color: "#0071DC" },
  { name: "Shopify", logo: "🛍️", color: "#96BF48" },
  { name: "Etsy", logo: "🎨", color: "#F56400" },
  { name: "Target", logo: "🎯", color: "#CC0000" },
  { name: "Best Buy", logo: "💻", color: "#0046BE" },
  { name: "Costco", logo: "📦", color: "#E31837" },
  { name: "Wayfair", logo: "🏠", color: "#7B2D8E" },
  { name: "Overstock", logo: "🔥", color: "#FF6600" },
  { name: "Newegg", logo: "🥚", color: "#F68B1E" },
  { name: "Alibaba", logo: "🌏", color: "#FF6A00" },
];

export default function TrustedCompaniesSection() {
  return (
    <section className="py-24 border-t">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-2">Trusted by Leading Sellers</h2>
          <p className="text-muted-foreground">
            Join 10,000+ sellers managing $500M+ in annual revenue
          </p>
        </div>

        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {companies.map((company) => (
            <div
              key={company.name}
              className="group flex flex-col items-center justify-center rounded-xl border bg-card p-6 shadow-sm transition-all hover:shadow-md hover:border-primary/50 hover:scale-105"
            >
              <span className="text-4xl mb-2 group-hover:scale-110 transition-transform">
                {company.logo}
              </span>
              <span className="text-sm font-medium text-muted-foreground group-hover:text-primary transition-colors">
                {company.name}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🏆</span>
            <span>Inc. 5000 Company</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🔒</span>
            <span>SOC 2 Certified</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">✅</span>
            <span>Amazon SP-API Partner</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🛡️</span>
            <span>GDPR Compliant</span>
          </div>
        </div>
      </div>
    </section>
  );
}