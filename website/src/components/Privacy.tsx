import Header1 from "./mvpblocks/header-1";
import Footer4Col from "./mvpblocks/footer-4col";

export default function Privacy() {
  return (
    <div className="bg-background min-h-screen">
      <Header1 />
      <main className="container mx-auto max-w-4xl px-4 py-32">
        <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
        <p className="text-muted-foreground mb-4">
          Last updated: {new Date().toLocaleDateString()}
        </p>

        <div className="prose prose-invert max-w-none space-y-6">
          <section>
            <h2 className="text-2xl font-semibold mb-3">1. Introduction</h2>
            <p className="text-secondary-foreground/80">
              Welcome to Shift ("we," "our," or "us"). This Privacy Policy
              explains how we handle your data when you use our mobile
              application. Our philosophy is simple:{" "}
              <strong>your data belongs to you</strong>. Shift is an
              offline-first application, and we do not collect, store, or
              transmit your personal vehicle data to any cloud servers.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">
              2. Data Collection and Storage
            </h2>
            <p className="text-secondary-foreground/80">
              <strong>Local Storage Only:</strong> All data you enter into Shift
              (including vehicle details, maintenance logs, fuel records, and
              images) is stored locally on your device. We do not have access to
              this data.
            </p>
            <p className="text-secondary-foreground/80 mt-2">
              <strong>No Account Required:</strong> You do not need to create an
              account to use the application. There are no login credentials to
              manage.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">3. App Permissions</h2>
            <p className="text-secondary-foreground/80">
              The application may request access to certain device features to
              function correctly:
              <ul className="list-disc ml-6 mt-2">
                <li>
                  <strong>Camera/Gallery:</strong> To allow you to add photos of
                  your vehicles or maintenance receipts. These images remain on
                  your device.
                </li>
                <li>
                  <strong>Notifications:</strong> To send you local reminders
                  for upcoming maintenance or scheduled services.
                </li>
              </ul>
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">4. Data Security</h2>
            <p className="text-secondary-foreground/80">
              Since your data is stored locally, its security depends on the
              security of your device. We recommend keeping your device updated
              and securing it with a passcode or biometrics to protect your
              Shift data.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">5. Contact Us</h2>
            <p className="text-secondary-foreground/80">
              If you have any questions about this privacy policy, please
              contact us at:{" "}
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
