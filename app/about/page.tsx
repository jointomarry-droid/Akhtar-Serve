import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const metadata = {
  title: "About Us - Akhtar Serve",
  description: "Learn about Akhtar Serve - Your trusted partner for Amazon and eBay marketplace management.",
};

export default function AboutPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">About Akhtar Serve</CardTitle>
        </CardHeader>
        <CardContent className="prose prose-slate dark:prose-invert max-w-none space-y-6">
          <section>
            <h2 className="text-2xl font-semibold">Our Mission</h2>
            <p>
              Akhtar Serve is a professional eCommerce service provider specializing in marketplace management, digital commerce solutions, and business growth strategies. We empower entrepreneurs, brands, wholesalers, and enterprises to build successful online businesses across the world&apos;s leading marketplaces.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold">What We Do</h2>
            <p>
              We combine industry expertise, advanced technology, automation, and data-driven decision-making to deliver measurable results. Whether launching a new business or scaling an established brand, we provide end-to-end solutions tailored to each client&apos;s goals.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold">Our Values</h2>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-lg border p-4">
                <h3 className="text-lg font-semibold">Professionalism</h3>
                <p className="text-sm text-muted-foreground">
                  We maintain the highest standards of professionalism in every interaction.
                </p>
              </div>
              <div className="rounded-lg border p-4">
                <h3 className="text-lg font-semibold">Transparency</h3>
                <p className="text-sm text-muted-foreground">
                  We believe in open communication and honest business practices.
                </p>
              </div>
              <div className="rounded-lg border p-4">
                <h3 className="text-lg font-semibold">Innovation</h3>
                <p className="text-sm text-muted-foreground">
                  We continuously improve our tools and services to stay ahead.
                </p>
              </div>
              <div className="rounded-lg border p-4">
                <h3 className="text-lg font-semibold">Success</h3>
                <p className="text-sm text-muted-foreground">
                  Your success is our success. We are committed to your growth.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold">Our Platform</h2>
            <p>
              Akhtar Serve is an enterprise-grade web application that helps Amazon and eBay sellers manage their multi-channel eCommerce operations. Our platform offers:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Unified product catalog management</li>
              <li>Real-time inventory synchronization</li>
              <li>Automated order processing</li>
              <li>Dynamic pricing intelligence</li>
              <li>Advanced analytics and reporting</li>
              <li>Seamless marketplace integrations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold">Contact Us</h2>
            <p>Ready to grow your eCommerce business? Get in touch with us:</p>
            <div className="flex gap-4 mt-4">
              <Link href="/contact">
                <Button>Contact Us</Button>
              </Link>
              <Link href="/register">
                <Button variant="outline">Start Free Trial</Button>
              </Link>
            </div>
          </section>
        </CardContent>
      </Card>
    </div>
  );
}
