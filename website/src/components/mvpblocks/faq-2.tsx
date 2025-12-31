"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

import { MinusIcon, PlusIcon } from "lucide-react";

interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: "general" | "pricing" | "technical" | "support";
}

const faqItems: FaqItem[] = [
  {
    id: "1",
    question: "Is Shift really free?",
    answer:
      "Yes! Shift is primarily free to use. We believe essential vehicle maintenance should be accessible to everyone. We may introduce premium features in the future, but the core experience will always be free.",
    category: "general",
  },
  {
    id: "2",
    question: "Is my data safe?",
    answer:
      'Absolutely. Shift is built with a strictly "Local-First" architecture. Your vehicle data stays on your device and is never sent to cloud servers unless you explicitly choose to backup or export it.',
    category: "technical",
  },
  {
    id: "3",
    question: "Can I export my data?",
    answer:
      "Yes, you have total data freedom. You can export your entire maintenance history to CSV/PDF formats at any time for your own records or to share with a mechanic.",
    category: "technical",
  },
  {
    id: "4",
    question: "When is the iOS version coming?",
    answer:
      "We are currently focusing on perfecting the Android experience. An iOS version is in our roadmap and will be released once we're satisfied with the stability and feature set of the core app.",
    category: "general",
  },
  {
    id: "5",
    question: "Does it support multiple vehicles?",
    answer:
      'Yes, you can add and manage an unlimited number of vehicles in your "Garage". Each vehicle tracks its own maintenance schedule, fuel history, and statistics independently.',
    category: "technical",
  },
  {
    id: "6",
    question: "How do reminders work?",
    answer:
      "Notifications are primarily date-based to ensure you never miss a deadline. Mileage intervals serve as a visual reference to help you plan your next service based on your usage.",
    category: "technical",
  },
  {
    id: "7",
    question: "Can I customize maintenance intervals?",
    answer:
      "Yes! You have full control. You can set custom time and mileage intervals for every single maintenance item to match your vehicle's specific requirements.",
    category: "technical",
  },
  {
    id: "8",
    question: "Does the app work offline?",
    answer:
      "Yes. Since Shift follows a 'Local-First' philosophy, you have full access to all features and data even without an internet connection.",
    category: "general",
  },
];

const categories = [
  { id: "all", label: "All" },
  { id: "general", label: "General" },
  { id: "technical", label: "Technical" },
];

export default function Faq2() {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);

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
            Support
          </div>

          <h2 className="text-white mb-6 text-center text-4xl font-bold tracking-tight md:text-5xl">
            Frequently Asked Questions
          </h2>

          <p className="text-neutral-400 max-w-2xl text-center text-lg">
            Everything you need to know about Shift and how it helps you manage
            your vehicles.
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
          <p className="text-neutral-400 mb-6 text-lg">
            Still have questions? We're here to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href="mailto:shift.app.help@gmail.com"
              className="bg-white text-black hover:bg-neutral-200 inline-flex items-center justify-center rounded-lg px-8 py-3 font-bold transition-all hover:scale-105"
            >
              Contact Support
            </a>
            <a
              href="https://github.com/Azevedo05/Vehicle-Maintenance-App/releases/latest/download/Shift.apk"
              download
              className="border border-white/20 text-white hover:bg-white/10 inline-flex items-center justify-center rounded-lg px-8 py-3 font-bold transition-all hover:scale-105"
            >
              Download App
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
