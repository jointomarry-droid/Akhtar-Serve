import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Akhtar Serve - Amazon & eBay Service Provider | Enterprise eCommerce Platform",
    template: "%s | Akhtar Serve",
  },
  description: "Akhtar Serve is a professional eCommerce solutions company providing complete Amazon, eBay, Walmart, Shopify, Etsy, TikTok Shop, and multi-channel marketplace management services. Account setup, product research, listing optimization, PPC, SEO, inventory management, and business growth solutions.",
  keywords: [
    "Amazon management", "eBay store", "eCommerce services", "marketplace management",
    "Amazon FBA", "Amazon PPC", "eBay SEO", "product research", "inventory management",
    "Walmart marketplace", "Shopify development", "multi-channel selling",
    "eCommerce consulting", "digital marketing", "virtual assistant",
    "product sourcing", "listing optimization", "Amazon account management",
  ],
  authors: [{ name: "Shoaib Akhtar" }],
  creator: "Akhtar Serve",
  publisher: "Akhtar Serve",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://www.akhtarserve.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.akhtarserve.com",
    title: "Akhtar Serve - Enterprise eCommerce Management Platform",
    description: "Manage your Amazon and eBay businesses from one powerful dashboard. Automate listings, track inventory, process orders, and maximize profits.",
    siteName: "Akhtar Serve",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Akhtar Serve - eCommerce Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Akhtar Serve - Enterprise eCommerce Platform",
    description: "Manage your Amazon and eBay businesses from one powerful dashboard.",
    images: ["/og-image.png"],
    creator: "@akhtarserve",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#0f172a" />
      </head>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}