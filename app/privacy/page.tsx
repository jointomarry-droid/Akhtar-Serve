import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata = {
  title: "Privacy Policy - Akhtar Serve",
  description: "Privacy Policy for Akhtar Serve - How we collect, use, and protect your information.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">Privacy Policy</CardTitle>
          <p className="text-muted-foreground">
            Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
          </p>
        </CardHeader>
        <CardContent className="prose prose-slate dark:prose-invert max-w-none space-y-6">
          <section>
            <h2 className="text-2xl font-semibold">1. Introduction</h2>
            <p>
              Welcome to Akhtar Serve (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;). We are committed to protecting your personal information and your right to privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our web application and services.
            </p>
            <p>
              By using our service, you agree to the collection and use of information in accordance with this policy. If you do not agree with the terms of this privacy policy, please do not access the application.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold">2. Information We Collect</h2>
            
            <h3 className="text-xl font-medium">Personal Information</h3>
            <p>We may collect personal information that you voluntarily provide to us when you:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Register for an account</li>
              <li>Sign up for our newsletter</li>
              <li>Fill out a form</li>
              <li>Contact us for support</li>
              <li>Use our marketplace integration features</li>
            </ul>
            <p>This information may include:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Name and email address</li>
              <li>Phone number</li>
              <li>Business information (company name, tax ID)</li>
              <li>Payment information (processed securely via third-party providers)</li>
              <li>Amazon and eBay seller credentials (for marketplace integration)</li>
            </ul>

            <h3 className="text-xl font-medium">Automatically Collected Information</h3>
            <p>When you access the application, we may automatically collect:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Device information (browser type, operating system)</li>
              <li>IP address</li>
              <li>Usage data (pages visited, time spent)</li>
              <li>Referring website</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold">3. How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Provide, operate, and maintain our services</li>
              <li>Process your transactions and send related information</li>
              <li>Send administrative information (updates, security alerts)</li>
              <li>Respond to your inquiries and provide customer support</li>
              <li>Send marketing and promotional communications (with your consent)</li>
              <li>Improve and personalize our services</li>
              <li>Analyze usage patterns and trends</li>
              <li>Detect, prevent, and address technical issues</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold">4. Information Sharing</h2>
            <p>We do not sell your personal information. We may share your information with:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Service Providers:</strong> Third parties who perform services on our behalf (hosting, analytics, payment processing)</li>
              <li><strong>Marketplace Partners:</strong> Amazon and eBay, as necessary to provide integration services</li>
              <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
              <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold">5. Data Security</h2>
            <p>
              We implement appropriate technical and organizational security measures to protect your personal information. However, no method of transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold">6. Data Retention</h2>
            <p>
              We retain your personal information only for as long as necessary to provide our services and fulfill the purposes described in this policy. When you delete your account, we will delete or anonymize your personal information, except where required by law.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold">7. Your Rights</h2>
            <p>Depending on your location, you may have the right to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Access the personal information we hold about you</li>
              <li>Correct inaccurate personal information</li>
              <li>Request deletion of your personal information</li>
              <li>Object to processing of your personal information</li>
              <li>Data portability</li>
              <li>Withdraw consent at any time</li>
            </ul>
            <p>
              To exercise these rights, please contact us at privacy@akhtarserve.com.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold">8. Cookies</h2>
            <p>
              We use cookies and similar tracking technologies to track activity on our service and hold certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
            </p>
            <p>
              For more details, please see our <a href="/cookies" className="text-primary hover:underline">Cookie Policy</a>.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold">9. Children&apos;s Privacy</h2>
            <p>
              Our services are not intended for use by children under the age of 13. We do not knowingly collect personal information from children under 13. If you become aware that a child has provided us with personal information, please contact us.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold">10. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the &quot;Last updated&quot; date. You are advised to review this policy periodically for any changes.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold">11. Contact Us</h2>
            <p>If you have any questions about this Privacy Policy, please contact us:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Email: privacy@akhtarserve.com</li>
              <li>Website: <a href="https://akhtarserve.com" className="text-primary hover:underline">akhtarserve.com</a></li>
            </ul>
          </section>
        </CardContent>
      </Card>
    </div>
  );
}
