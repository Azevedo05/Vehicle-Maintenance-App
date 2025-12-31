"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { MinusIcon, PlusIcon } from "lucide-react";
import { useTranslation } from "react-i18next";

interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: "general" | "pricing" | "technical" | "support";
}

export default function Faq2() {
  const { t } = useTranslation();
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const faqItems: FaqItem[] = [
    {
      id: "1",
      question: t("faq.items.q1"),
      answer: t("faq.items.a1"),
      category: "general",
    },
    {
      id: "2",
      question: t("faq.items.q2"),
      answer: t("faq.items.a2"),
      category: "technical",
    },
    {
      id: "3",
      question: t("faq.items.q3"),
      answer: t("faq.items.a3"),
      category: "technical",
    },
    {
      id: "4",
      question: t("faq.items.q4"),
      answer: t("faq.items.a4"),
      category: "general",
    },
    {
      id: "5",
      question: t("faq.items.q5"),
      answer: t("faq.items.a5"),
      category: "technical",
    },
    {
      id: "6",
      question: t("faq.items.q6"),
      answer: t("faq.items.a6"),
      category: "technical",
    },
    {
      id: "7",
      question: t("faq.items.q7"),
      answer: t("faq.items.a7"),
      category: "technical",
    },
    {
      id: "8",
      question: t("faq.items.q8"),
      answer: t("faq.items.a8"),
      category: "general",
    },
  ];

  const categories = [
    { id: "all", label: t("faq.categories.all") },
    { id: "general", label: t("faq.categories.general") },
    { id: "technical", label: t("faq.categories.technical") },
  ];

  const filteredFaqs =
    activeCategory === "all"
      ? faqItems
      : faqItems.filter((item) => item.category === activeCategory);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <section className="bg-black py-24" id="faq">
      <div className="container mx-auto max-w-6xl px-4 md:px-6">
        <div className="mb-12 flex flex-col items-center">
          <div className="bg-blue-500/10 border border-blue-500/20 text-blue-400 px-4 py-1.5 rounded-full text-sm font-semibold w-fit mx-auto mb-6">
            {t("faq.badge")}
          </div>

          <h2 className="text-white mb-6 text-center text-4xl font-bold tracking-tight md:text-5xl">
            {t("faq.title")}
          </h2>

          <p className="text-neutral-400 max-w-2xl text-center text-lg">
            {t("faq.subtitle")}
          </p>
        </div>

        {/* Category Tabs */}
        <div className="mb-10 flex flex-wrap justify-center gap-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-medium transition-all",
                activeCategory === category.id
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-500/25"
                  : "bg-white/5 text-neutral-400 hover:bg-white/10 hover:text-white"
              )}
            >
              {category.label}
            </button>
          ))}
        </div>

        {/* FAQ Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <AnimatePresence mode="popLayout">
            {filteredFaqs.map((faq) => (
              <motion.div
                layout
                key={faq.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
                className={cn(
                  "border border-white/10 h-fit overflow-hidden rounded-xl transition-colors",
                  expandedId === faq.id
                    ? "bg-white/10 shadow-xl"
                    : "bg-white/5 hover:bg-white/10"
                )}
                style={{ minHeight: "88px" }}
              >
                <button
                  onClick={() => toggleExpand(faq.id)}
                  className="flex w-full items-center justify-between p-6 text-left"
                >
                  <h3 className="text-white text-lg font-medium pr-4">
                    {faq.question}
                  </h3>
                  <div className="ml-4 flex-shrink-0">
                    {expandedId === faq.id ? (
                      <MinusIcon className="text-blue-400 h-5 w-5" />
                    ) : (
                      <PlusIcon className="text-blue-400 h-5 w-5" />
                    )}
                  </div>
                </button>

                <AnimatePresence>
                  {expandedId === faq.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="border-white/10 border-t px-6 pt-2 pb-6">
                        <p className="text-neutral-400 leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Contact CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="mt-20 text-center"
        >
          <p className="text-neutral-400 mb-6 text-lg">{t("faq.cta")}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href="mailto:shift.app.help@gmail.com"
              className="bg-white text-black hover:bg-neutral-200 inline-flex items-center justify-center rounded-lg px-8 py-3 font-bold transition-all hover:scale-105"
            >
              {t("faq.contact")}
            </a>
            <a
              href="https://github.com/Azevedo05/Vehicle-Maintenance-App/releases/download/v1.0.0/Shift.apk"
              rel="noopener noreferrer"
              className="border border-white/20 text-white hover:bg-white/10 inline-flex items-center justify-center rounded-lg px-8 py-3 font-bold transition-all hover:scale-105"
            >
              {t("faq.download")}
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
