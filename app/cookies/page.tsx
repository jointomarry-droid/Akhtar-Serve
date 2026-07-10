import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata = {
  title: "Cookie Policy - Akhtar Serve",
  description: "Cookie Policy for Akhtar Serve - How we use cookies and tracking technologies.",
};

export default function CookiePolicyPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">Cookie Policy</CardTitle>
          <p className="text-muted-foreground">
            Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
          </p>
        </CardHeader>
        <CardContent className="prose prose-slate dark:prose-invert max-w-none space-y-6">
          <section>
            <h2 className="text-2xl font-semibold">1. What Are Cookies</h2>
            <p>
              Cookies are small text files that are placed on your computer or mobile device when you visit a website. They are widely used to make websites work more efficiently and to provide information to website owners.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold">2. How We Use Cookies</h2>
            <p>We use cookies for the following purposes:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Essential Cookies:</strong> Required for the Service to function properly (authentication, security, session management)</li>
              <li><strong>Functional Cookies:</strong> Remember your preferences and settings</li>
              <li><strong>Analytics Cookies:</strong> Help us understand how visitors interact with our website</li>
              <li><strong>Marketing Cookies:</strong> Used to deliver relevant advertisements and track campaign performance</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold">3. Types of Cookies We Use</h2>
            
            <h3 className="text-xl font-medium">Strictly Necessary Cookies</h3>
            <p>These cookies are essential for the Service to function. They enable core functionality such as:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>User authentication and session management</li>
              <li>Security features (CSRF protection)</li>
              <li>Load balancing</li>
              <li>Remembering your login status</li>
            </ul>

            <h3 className="text-xl font-medium">Performance and Analytics Cookies</h3>
            <p>These cookies collect information about how you use our Service:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Pages visited and time spent on each page</li>
              <li>Error messages encountered</li>
              <li>Browser and device information</li>
              <li>Referring website</li>
            </ul>

            <h3 className="text-xl font-medium">Functionality Cookies</h3>
            <p>These cookies allow us to remember choices you make:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Language preferences</li>
              <li>Theme settings (dark/light mode)</li>
              <li>Dashboard layout preferences</li>
            </ul>

            <h3 className="text-xl font-medium">Marketing and Advertising Cookies</h3>
            <p>These cookies are used to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Deliver relevant advertisements</li>
              <li>Track campaign performance</li>
              <li>Limit the number of times you see an advertisement</li>
              <li>Measure the effectiveness of advertising campaigns</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold">4. Third-Party Cookies</h2>
            <p>We may use cookies from third-party services, including:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Google Analytics:</strong> To analyze website traffic and usage patterns</li>
              <li><strong>Google AdSense:</strong> To serve advertisements</li>
              <li><strong>Firebase:</strong> For authentication and analytics</li>
              <li><strong>Hotjar:</strong> For user behavior analytics (if enabled)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold">5. Managing Cookies</h2>
            <p>You can control and manage cookies in several ways:</p>
            
            <h3 className="text-xl font-medium">Browser Settings</h3>
            <p>Most browsers allow you to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>View what cookies are stored and delete them individually</li>
              <li>Block third-party cookies</li>
              <li>Block all cookies</li>
              <li>Delete all cookies when you close your browser</li>
            </ul>

            <h3 className="text-xl font-medium">Opt-Out Links</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Google Analytics: <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Google Analytics Opt-out</a></li>
              <li>Google AdSense: <a href="https://adssettings.google.com/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Google Ad Settings</a></li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold">6. Impact of Disabling Cookies</h2>
            <p>If you disable or refuse cookies, some parts of the Service may become inaccessible or not function properly. For example:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>You may not be able to log in to your account</li>
              <li>Some features may not work as expected</li>
              <li>We may not be able to remember your preferences</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold">7. Updates to This Policy</h2>
            <p>
              We may update this Cookie Policy from time to time to reflect changes in technology or legislation. We will notify you of any material changes by posting the new policy on this page.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold">8. Contact Us</h2>
            <p>If you have any questions about our use of cookies, please contact us:</p>
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
