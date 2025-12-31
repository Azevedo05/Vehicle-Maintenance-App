import Header1 from "./mvpblocks/header-1";
import Footer4Col from "./mvpblocks/footer-4col";
import { useTranslation } from "react-i18next";

export default function Terms() {
  const { t } = useTranslation();

  return (
    <div className="bg-background min-h-screen">
      <Header1 />
      <main className="container mx-auto max-w-4xl px-4 py-32">
        <h1 className="text-4xl font-bold mb-8">{t("terms.title")}</h1>
        <p className="text-muted-foreground mb-4">
          {t("terms.updated")}: {new Date().toLocaleDateString()}
        </p>

        <div className="prose prose-invert max-w-none space-y-6">
          <section>
            <h2 className="text-2xl font-semibold mb-3">
              {t("terms.s1Title")}
            </h2>
            <p className="text-secondary-foreground/80">{t("terms.s1Text")}</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">
              {t("terms.s2Title")}
            </h2>
            <p className="text-secondary-foreground/80">{t("terms.s2Text")}</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">
              {t("terms.s3Title")}
            </h2>
            <div className="text-secondary-foreground/80">
              {t("terms.s3Text")}
              <ul className="list-disc ml-6 mt-2">
                <li>{t("terms.s3Item1")}</li>
                <li>{t("terms.s3Item2")}</li>
                <li>{t("terms.s3Item3")}</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">
              {t("terms.s4Title")}
            </h2>
            <p className="text-secondary-foreground/80">
              {t("terms.s4Text")}
              <br />
              <br />
              {t("terms.s4Text2")}
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">
              {t("terms.s5Title")}
            </h2>
            <p className="text-secondary-foreground/80">{t("terms.s5Text")}</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">
              {t("terms.s6Title")}
            </h2>
            <p className="text-secondary-foreground/80">{t("terms.s6Text")}</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">
              {t("terms.s7Title")}
            </h2>
            <p className="text-secondary-foreground/80">
              {t("terms.s7Text")}
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
