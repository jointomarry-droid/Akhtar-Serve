import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata = {
  title: "Terms of Service - Akhtar Serve",
  description: "Terms of Service for Akhtar Serve - Rules and guidelines for using our platform.",
};

export default function TermsOfServicePage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">Terms of Service</CardTitle>
          <p className="text-muted-foreground">
            Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
          </p>
        </CardHeader>
        <CardContent className="prose prose-slate dark:prose-invert max-w-none space-y-6">
          <section>
            <h2 className="text-2xl font-semibold">1. Acceptance of Terms</h2>
            <p>
              By accessing and using Akhtar Serve (&quot;the Service&quot;), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to these terms, please do not use the Service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold">2. Description of Service</h2>
            <p>
              Akhtar Serve is a multi-channel eCommerce management platform that enables sellers to manage their Amazon and eBay businesses. Our services include:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Product listing management</li>
              <li>Inventory tracking and synchronization</li>
              <li>Order processing and fulfillment</li>
              <li>Pricing intelligence and automation</li>
              <li>Analytics and reporting</li>
              <li>Marketplace integration (Amazon SP-API, eBay API)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold">3. User Accounts</h2>
            <p>To use the Service, you must create an account. You agree to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Provide accurate, current, and complete information</li>
              <li>Maintain the security of your password and account</li>
              <li>Promptly update your account information if it changes</li>
              <li>Accept responsibility for all activities that occur under your account</li>
              <li>Notify us immediately of any unauthorized use of your account</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold">4. Acceptable Use</h2>
            <p>You agree not to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Use the Service for any unlawful purpose</li>
              <li>Attempt to gain unauthorized access to any portion of the Service</li>
              <li>Interfere with or disrupt the Service or servers</li>
              <li>Use automated systems to access the Service without permission</li>
              <li>Violate any applicable local, state, national, or international law</li>
              <li>Transmit any harmful code, malware, or viruses</li>
              <li>Impersonate any person or entity</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold">5. Marketplace Integrations</h2>
            <p>
              By connecting your Amazon or eBay accounts, you authorize us to access and manage your marketplace data on your behalf. You acknowledge that:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>You are responsible for complying with Amazon and eBay policies</li>
              <li>We are not liable for any actions taken on your marketplace accounts</li>
              <li>You can revoke integration access at any time</li>
              <li>Marketplace API usage is subject to their respective terms</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold">6. Intellectual Property</h2>
            <p>
              The Service and its original content, features, and functionality are owned by Akhtar Serve and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold">7. Payment Terms</h2>
            <p>
              Some features of the Service require payment. You agree to pay all fees associated with your selected plan. Fees are non-refundable except as required by law or as expressly stated in these Terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold">8. Data and Privacy</h2>
            <p>
              Your use of the Service is also governed by our <a href="/privacy" className="text-primary hover:underline">Privacy Policy</a>. By using the Service, you consent to the collection and use of information as described in the Privacy Policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold">9. Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by law, Akhtar Serve shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold">10. Indemnification</h2>
            <p>
              You agree to indemnify, defend, and hold harmless Akhtar Serve and its officers, directors, employees, agents, and affiliates from any claims, liabilities, damages, losses, and expenses, including reasonable attorneys&apos; fees, arising out of or in any way connected with your use of the Service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold">11. Termination</h2>
            <p>
              We may terminate or suspend your account and access to the Service immediately, without prior notice or liability, for any reason, including breach of these Terms. Upon termination, your right to use the Service will immediately cease.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold">12. Governing Law</h2>
            <p>
              These Terms shall be governed by and construed in accordance with the laws of the United States, without regard to its conflict of law provisions. Any disputes arising under these Terms shall be resolved in the courts of competent jurisdiction.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold">13. Changes to Terms</h2>
            <p>
              We reserve the right to modify these Terms at any time. We will notify you of any changes by posting the new Terms on this page and updating the &quot;Last updated&quot; date. Your continued use of the Service after any such changes constitutes your acceptance of the new Terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold">14. Contact Us</h2>
            <p>If you have any questions about these Terms, please contact us:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Email: legal@akhtarserve.com</li>
              <li>Website: <a href="https://akhtarserve.com" className="text-primary hover:underline">akhtarserve.com</a></li>
            </ul>
          </section>
        </CardContent>
      </Card>
    </div>
  );
}
