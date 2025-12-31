import {
  CarFront,
  BellRing,
  ShieldCheck,
  Fuel,
  Warehouse,
  Download,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

// Define the feature item type
type FeatureItem = {
  icon: LucideIcon;
  title: string;
  description: string;
  position?: "left" | "right";
  cornerStyle?: string;
};

// Feature card component
const FeatureCard = ({ feature }: { feature: FeatureItem }) => {
  const Icon = feature.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <div
        className={cn(
          "relative rounded-2xl px-6 py-6 text-sm font-medium",
          "bg-white/5 border border-white/10 transition-all hover:bg-white/10 hover:border-blue-500/30",
          feature.cornerStyle
        )}
      >
        <div className="text-blue-500 mb-4 text-[2rem]">
          <Icon size={32} strokeWidth={1.5} />
        </div>
        <h2 className="text-foreground mb-3 text-lg font-bold">
          {feature.title}
        </h2>
        <p className="text-muted-foreground text-sm leading-relaxed text-pretty">
          {feature.description}
        </p>
        {/* Decorative elements */}
        <span className="from-blue-500/0 via-blue-500 to-blue-500/0 absolute -bottom-px left-1/2 h-px w-1/2 -translate-x-1/2 bg-gradient-to-r opacity-40"></span>
        <span className="absolute inset-0 bg-[radial-gradient(40%_20%_at_50%_100%,rgba(59,130,246,0.15)_0%,transparent_100%)] opacity-60"></span>
      </div>
    </motion.div>
  );
};

export const Features = () => {
  const { t } = useTranslation();

  // Create feature data arrays for left and right columns
  const leftFeatures: FeatureItem[] = [
    {
      icon: CarFront,
      title: t("features.history.title"),
      description: t("features.history.desc"),
      position: "left",
      cornerStyle: "sm:translate-x-4 sm:rounded-br-[2px]",
    },
    {
      icon: BellRing,
      title: t("features.reminders.title"),
      description: t("features.reminders.desc"),
      position: "left",
      cornerStyle: "sm:-translate-x-4 sm:rounded-br-[2px]",
    },
    {
      icon: Warehouse,
      title: t("features.garage.title"),
      description: t("features.garage.desc"),
      position: "left",
      cornerStyle: "sm:translate-x-4 sm:rounded-tr-[2px]",
    },
  ];

  const rightFeatures: FeatureItem[] = [
    {
      icon: ShieldCheck,
      title: t("features.privacy.title"),
      description: t("features.privacy.desc"),
      position: "right",
      cornerStyle: "sm:-translate-x-4 sm:rounded-bl-[2px]",
    },
    {
      icon: Fuel,
      title: t("features.fuel.title"),
      description: t("features.fuel.desc"),
      position: "right",
      cornerStyle: "sm:translate-x-4 sm:rounded-bl-[2px]",
    },
    {
      icon: Download,
      title: t("features.dataFreedom.title"),
      description: t("features.dataFreedom.desc"),
      position: "right",
      cornerStyle: "sm:-translate-x-4 sm:rounded-tl-[2px]",
    },
  ];

  return (
    <section className="pt-24 pb-16 overflow-hidden" id="features">
      <div className="mx-6 max-w-[1280px] pt-8 pb-16 max-[300px]:mx-4 min-[1150px]:mx-auto">
        <div className="flex flex-col gap-8 lg:gap-24 md:grid md:grid-cols-2 lg:grid-cols-3 items-center">
          {/* Header/Title column - First on Mobile, Last on Tablet/Desktop */}
          <div className="order-1 flex flex-col items-center text-center justify-center md:order-last md:col-span-2 lg:order-2 lg:col-span-1 md:mb-16 lg:mb-0">
            <div className="bg-white/5 text-blue-100 border border-blue-500/20 relative mx-auto mb-6 w-fit rounded-full rounded-bl-[2px] px-4 py-2 text-sm">
              <span className="relative z-1 flex items-center gap-2 font-semibold tracking-wide">
                {t("features.badge")}
              </span>
              <span className="from-blue-500/0 via-blue-500 to-blue-500/0 absolute -bottom-px left-1/2 h-px w-2/5 -translate-x-1/2 bg-gradient-to-r"></span>
              <span className="absolute inset-0 bg-[radial-gradient(30%_40%_at_50%_100%,rgba(59,130,246,0.2)_0%,transparent_100%)]"></span>
            </div>
            <h2 className="text-foreground mb-6 text-center text-3xl md:text-4xl lg:text-5xl font-extrabold sm:mb-6 tracking-tight">
              {t("features.title")}
            </h2>
            <p className="text-muted-foreground mx-auto max-w-[22rem] text-center text-lg leading-relaxed">
              {t("features.subtitle")}
            </p>
          </div>

          {/* Left column - Second on Mobile */}
          <div className="flex flex-col gap-8 justify-center order-2 md:order-1">
            {leftFeatures.map((feature, index) => (
              <FeatureCard key={`left-feature-${index}`} feature={feature} />
            ))}
          </div>

          {/* Right column - Third on Mobile */}
          <div className="flex flex-col gap-8 justify-center order-3 md:order-2 lg:order-3">
            {rightFeatures.map((feature, index) => (
              <FeatureCard key={`right-feature-${index}`} feature={feature} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
