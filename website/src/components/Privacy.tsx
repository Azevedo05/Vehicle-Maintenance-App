import Header1 from "./mvpblocks/header-1";
import Footer4Col from "./mvpblocks/footer-4col";
import { useTranslation } from "react-i18next";

export default function Privacy() {
  const { t } = useTranslation();

  return (
    <div className="bg-background min-h-screen">
      <Header1 />
      <main className="container mx-auto max-w-4xl px-4 py-32">
        <h1 className="text-4xl font-bold mb-8">{t("privacy.title")}</h1>
        <p className="text-muted-foreground mb-4">
          {t("privacy.updated")}: {new Date().toLocaleDateString()}
        </p>

        <div className="prose prose-invert max-w-none space-y-6">
          <section>
            <h2 className="text-2xl font-semibold mb-3">
              {t("privacy.s1Title")}
            </h2>
            <p className="text-secondary-foreground/80">
              {t("privacy.s1Text")}
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">
              {t("privacy.s2Title")}
            </h2>
            <p className="text-secondary-foreground/80">
              {t("privacy.s2Text1")}
            </p>
            <p className="text-secondary-foreground/80 mt-2">
              {t("privacy.s2Text2")}
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">
              {t("privacy.s3Title")}
            </h2>
            <div className="text-secondary-foreground/80">
              {t("privacy.s3Text")}
              <ul className="list-disc ml-6 mt-2">
                <li>{t("privacy.s3Item1")}</li>
                <li>{t("privacy.s3Item2")}</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">
              {t("privacy.s4Title")}
            </h2>
            <p className="text-secondary-foreground/80">
              {t("privacy.s4Text")}
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">
              {t("privacy.s5Title")}
            </h2>
            <p className="text-secondary-foreground/80">
              {t("privacy.s5Text")}{" "}
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
