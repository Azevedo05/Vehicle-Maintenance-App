import { Github, Globe } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function Footer4Col() {
  const { t } = useTranslation();

  const data = {
    facebookLink: "#",
    githubLink: "https://github.com/Azevedo05",
    legal: {
      privacy: "/privacy",
      terms: "/terms",
    },
    help: {
      support: "mailto:shift.app.help@gmail.com",
      faq: "/faq",
    },
    contact: {
      email: "shift.app.help@gmail.com",
    },
    company: {
      name: "Shift",
      description: t("hero.description"),
      logo: "/favicon.png",
    },
  };

  const socialLinks = [
    { icon: Github, label: "GitHub", href: data.githubLink },
    {
      icon: Globe,
      label: "Portfolio",
      href: "https://goncalo-portfolio.vercel.app/",
    },
  ];

  const legalLinks = [
    { text: t("footer.privacy"), href: data.legal.privacy },
    { text: t("footer.terms"), href: data.legal.terms },
  ];

  const companyLinks = [
    { text: t("footer.about"), href: "/about" },
    { text: t("footer.developers"), href: "/developers" },
  ];

  return (
    <footer className="bg-black border-t border-white/10 mt-16 w-full place-self-end rounded-t-xl">
      <div className="mx-auto max-w-screen-xl px-4 pt-16 pb-6 sm:px-6 lg:px-8 lg:pt-24">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          <div>
            <div className="text-primary flex justify-center gap-2 sm:justify-start">
              <img
                src={data.company.logo || "/placeholder.svg"}
                alt="logo"
                className="h-8 w-8 rounded-full"
              />
              <span className="text-2xl font-semibold">
                {data.company.name}
              </span>
            </div>

            <p className="text-foreground/50 mt-6 max-w-md text-center leading-relaxed sm:max-w-xs sm:text-left">
              {data.company.description}
            </p>

            <ul className="mt-8 flex justify-center gap-6 sm:justify-start md:gap-8">
              {socialLinks.map(({ icon: Icon, label, href }) => (
                <li key={label}>
                  <a
                    href={href}
                    className="text-primary hover:text-primary/80 transition"
                  >
                    <span className="sr-only">{label}</span>
                    <Icon className="size-6" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:col-span-2 lg:mt-0 lg:flex lg:justify-end lg:gap-16">
            <div className="text-center sm:text-left lg:text-right">
              <p className="text-lg font-medium">{t("footer.company")}</p>
              <ul className="mt-8 space-y-4 text-sm">
                {companyLinks.map(({ text, href }) => (
                  <li key={text}>
                    <Link
                      className="text-secondary-foreground/70 transition"
                      to={href}
                    >
                      {text}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="text-center sm:text-left lg:text-right">
              <p className="text-lg font-medium">{t("footer.legal")}</p>
              <ul className="mt-8 space-y-4 text-sm">
                {legalLinks.map(({ text, href }) => (
                  <li key={text}>
                    <Link
                      className="text-secondary-foreground/70 transition"
                      to={href}
                    >
                      {text}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t pt-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-center sm:text-left">
            <div className="flex flex-col sm:flex-row gap-2 text-sm text-secondary-foreground/70">
              <p>&copy; 2025-2026 {data.company.name}</p>
              <span className="hidden sm:inline">&middot;</span>
              <p>{t("footer.rights")}</p>
            </div>

            <p className="text-xs text-secondary-foreground/40 sm:text-right">
              {t("footer.note")}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
