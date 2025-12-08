import Header1 from "./mvpblocks/header-1";
import Footer4Col from "./mvpblocks/footer-4col";

export default function Terms() {
  return (
    <div className="bg-background min-h-screen">
      <Header1 />
      <main className="container mx-auto max-w-4xl px-4 py-32">
        <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
        <p className="text-muted-foreground mb-4">
          Last updated: {new Date().toLocaleDateString()}
        </p>

        <div className="prose prose-invert max-w-none space-y-6">
          <section>
            <h2 className="text-2xl font-semibold mb-3">
              1. Agreement to Terms
            </h2>
            <p className="text-secondary-foreground/80">
              By downloading or using the Shift application, these terms will
              automatically apply to you. You should make sure therefore that
              you read them carefully before using the app.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">
              2. Intellectual Property
            </h2>
            <p className="text-secondary-foreground/80">
              The Service and its original content (excluding content provided
              by you), features and functionality are and will remain the
              exclusive property of Shift and its licensors. The application is
              protected by copyright, trademark, and other laws of both Portugal
              and foreign countries.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">
              3. Use of the Application
            </h2>
            <p className="text-secondary-foreground/80">
              Shift is designed to help you track vehicle maintenance locally on
              your device. You agree that you will not:
              <ul className="list-disc ml-6 mt-2">
                <li>Attempt to reverse engineer the app.</li>
                <li>Use the app for any illegal or unauthorized purpose.</li>
                <li>Violate any laws in your jurisdiction.</li>
              </ul>
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">
              4. Disclaimer and Liability
            </h2>
            <p className="text-secondary-foreground/80">
              The application is provided "as is". While we strive to ensure the
              app is useful and accurate, we cannot guarantee that it will
              always be error-free.
              <br />
              <br />
              <strong>Data Loss:</strong> Since Shift stores data locally on
              your device, you are responsible for maintaining backups of your
              device. We are not liable for any loss of data due to device
              failure, app uninstallation, or other causes.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">5. Governing Law</h2>
            <p className="text-secondary-foreground/80">
              These Terms shall be governed and construed in accordance with the
              laws of Portugal, without regard to its conflict of law
              provisions.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">6. Changes</h2>
            <p className="text-secondary-foreground/80">
              We reserve the right, at our sole discretion, to modify or replace
              these Terms at any time. We will indicate that terms have changed
              by updating the "Last updated" date at the top of this document.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">7. Contact Us</h2>
            <p className="text-secondary-foreground/80">
              If you have any questions about these Terms, please contact us at:
              <a
                href="mailto:shift.app.help@gmail.com"
                className="text-blue-500 hover:underline"
              >
                shift.app.help@gmail.com
              </a>
            </p>
          </section>
        </div>
      </main>
      <Footer4Col />
    </div>
  );
}
