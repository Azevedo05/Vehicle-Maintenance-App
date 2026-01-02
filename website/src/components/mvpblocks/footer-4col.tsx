import { Github, Globe } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";

export default function Footer4Col() {
  const { t, i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === "en" ? "pt" : "en";
    i18n.changeLanguage(newLang);
  };

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
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 items-stretch">
          <div className="flex flex-col">
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

            <ul className="mt-auto flex justify-center gap-6 pt-8 sm:justify-start md:gap-8">
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

            <div className="text-center sm:text-left lg:text-right flex flex-col">
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

              {/* Language Switcher Toggle - Aligned with Portfolio/Social icons */}
              <div className="mt-auto flex justify-center pt-8 sm:justify-start lg:justify-end">
                <button
                  onClick={toggleLanguage}
                  className="group relative flex h-9 w-20 items-center rounded-full bg-white/5 p-1 transition-colors hover:bg-white/10"
                  aria-label="Toggle Language"
                >
                  <motion.div
                    className="flex h-7 w-[46%] items-center justify-center rounded-full bg-blue-600 shadow-lg"
                    animate={{
                      x: i18n.language === "en" ? 0 : 38,
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 500,
                      damping: 30,
                    }}
                  >
                    <span className="text-xs font-bold text-white uppercase">
                      {i18n.language}
                    </span>
                  </motion.div>
                  <div className="absolute inset-0 flex items-center justify-between px-3 text-[10px] font-medium text-white/40 pointer-events-none">
                    <span
                      className={
                        i18n.language === "en" ? "opacity-0" : "opacity-100"
                      }
                    >
                      EN
                    </span>
                    <span
                      className={
                        i18n.language === "pt" ? "opacity-0" : "opacity-100"
                      }
                    >
                      PT
                    </span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-6">
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
