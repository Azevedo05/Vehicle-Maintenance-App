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

// Define the feature item type
type FeatureItem = {
  icon: LucideIcon;
  title: string;
  description: string;
  position?: "left" | "right";
  cornerStyle?: string;
};

// Create feature data arrays for left and right columns
const leftFeatures: FeatureItem[] = [
  {
    icon: CarFront,
    title: "Vehicle History",
    description:
      "Keep a detailed digital log of every service, repair, and modification for all your vehicles.",
    position: "left",
    cornerStyle: "sm:translate-x-4 sm:rounded-br-[2px]",
  },
  {
    icon: BellRing,
    title: "Smart Reminders",
    description:
      "Never miss an oil change again. Intelligent notifications based on date and mileage usage.",
    position: "left",
    cornerStyle: "sm:-translate-x-4 sm:rounded-br-[2px]",
  },
  {
    icon: Warehouse,
    title: "Unlimited Garage",
    description:
      "Track as many cars as you own. Manage your daily driver, project car, or family fleet all in one place.",
    position: "left",
    cornerStyle: "sm:translate-x-4 sm:rounded-tr-[2px]",
  },
];

const rightFeatures: FeatureItem[] = [
  {
    icon: ShieldCheck,
    title: "100% Private",
    description:
      "Your data stays on your device. No cloud tracking, no accounts, complete privacy.",
    position: "right",
    cornerStyle: "sm:-translate-x-4 sm:rounded-bl-[2px]",
  },
  {
    icon: Fuel,
    title: "Fuel & Costs",
    description:
      "Track fuel consumption and visualize your running costs with beautiful charts.",
    position: "right",
    cornerStyle: "sm:translate-x-4 sm:rounded-bl-[2px]",
  },
  {
    icon: Download,
    title: "Data Freedom",
    description:
      "Export your vehicle data anytime. Your maintenance logs are yours to keep, share, or backup.",
    position: "right",
    cornerStyle: "sm:-translate-x-4 sm:rounded-tl-[2px]",
  },
];

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
  return (
    <section className="pt-24 pb-16 overflow-hidden" id="features">
      <div className="mx-6 max-w-[1280px] pt-8 pb-16 max-[300px]:mx-4 min-[1150px]:mx-auto">
        <div className="flex flex-col-reverse gap-16 lg:gap-24 md:grid md:grid-cols-3 items-center">
          {/* Left column */}
          <div className="flex flex-col gap-8 justify-center">
            {leftFeatures.map((feature, index) => (
              <FeatureCard key={`left-feature-${index}`} feature={feature} />
            ))}
          </div>

          {/* Center column */}
          <div className="order-[1] mb-12 self-center sm:order-[0] md:mb-0 flex flex-col items-center text-center">
            <div className="bg-white/5 text-blue-100 border border-blue-500/20 relative mx-auto mb-6 w-fit rounded-full rounded-bl-[2px] px-4 py-2 text-sm">
              <span className="relative z-1 flex items-center gap-2 font-semibold tracking-wide">
                Features
              </span>
              <span className="from-blue-500/0 via-blue-500 to-blue-500/0 absolute -bottom-px left-1/2 h-px w-2/5 -translate-x-1/2 bg-gradient-to-r"></span>
              <span className="absolute inset-0 bg-[radial-gradient(30%_40%_at_50%_100%,rgba(59,130,246,0.2)_0%,transparent_100%)]"></span>
            </div>
            <h2 className="text-foreground mb-6 text-center text-4xl font-extrabold sm:mb-6 md:text-5xl tracking-tight">
              Everything you need
            </h2>
            <p className="text-muted-foreground mx-auto max-w-[22rem] text-center text-lg leading-relaxed">
              Premium tools packed into a simple, elegant interface designed for
              true enthusiasts.
            </p>
          </div>

          {/* Right column */}
          <div className="flex flex-col gap-8 justify-center">
            {rightFeatures.map((feature, index) => (
              <FeatureCard key={`right-feature-${index}`} feature={feature} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
