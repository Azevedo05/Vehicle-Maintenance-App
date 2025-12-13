import { motion } from "framer-motion";

const features = [
  {
    title: "Unified Garage Management",
    description:
      "Effortlessly manage your entire fleet from a single, intuitive interface. Whether it's personal cars or work vehicles, get a comprehensive snapshot of your automotive life in seconds.",
    image: "/mockups/dashboard.jpg",
    glowColor: "0_0_30px_rgba(59,130,246,0.25),0_0_60px_rgba(59,130,246,0.12)",
  },
  {
    title: "Precision Vehicle Insights",
    description:
      "Dive deep into every detail. From tracking real-time mileage to managing specific fuel types, access a granular view of your vehicle's health and specifications with elegance and ease.",
    image: "/mockups/details.jpg",
    glowColor: "0_0_30px_rgba(147,51,234,0.25),0_0_60px_rgba(147,51,234,0.12)",
  },
  {
    title: "Intelligent Care Reminders",
    description:
      "Shift transforms maintenance from a chore into a seamless habit. Our proactive alert system ensures you're always ahead of essential services, extending the lifespan of your investment.",
    image: "/mockups/customization_notifications.jpg",
    glowColor: "0_0_30px_rgba(234,88,12,0.25),0_0_60px_rgba(234,88,12,0.12)",
  },
  {
    title: "Financial Analytics & Trends",
    description:
      "Take control of your budget with deep insights. Visualize spending habits, track costs per kilometer, and get a clear breakdown of expenses across your entire fleet.",
    image: "/mockups/statistics.jpg",
    glowColor: "0_0_30px_rgba(225,29,72,0.25),0_0_60px_rgba(225,29,72,0.12)",
  },
];

const FeatureItem = ({
  feature,
  index,
}: {
  feature: (typeof features)[0];
  index: number;
}) => {
  return (
    <div
      className={`flex flex-col ${
        index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
      } items-center gap-12 lg:gap-32`}
    >
      {/* Image Side - Slide In Animation */}
      <motion.div
        className="flex-1 w-full flex justify-center relative group"
        initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-10%" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="relative z-10">
          <div
            className="relative w-[260px] xs:w-[280px] md:w-[320px] max-w-full aspect-[9/19] rounded-[0.5rem] border-[6px] border-neutral-800 bg-black overflow-hidden group-hover:-translate-y-2 transition-all duration-500"
            style={{
              boxShadow: feature.glowColor
                .split(",")
                .map((s) => s.trim().replace(/_/g, " "))
                .join(", "),
            }}
          >
            {/* Screen Content */}
            <img
              src={feature.image}
              alt={feature.title}
              className="w-full h-full object-cover"
            />

            {/* Premium Shimmer Effect */}
            <motion.div
              className="absolute inset-0 z-20 bg-gradient-to-tr from-transparent via-white/10 to-transparent -skew-x-12"
              initial={{ x: "-100%" }}
              whileInView={{ x: "200%" }}
              transition={{ duration: 1.5, ease: "easeInOut", delay: 0.2 }}
              viewport={{ once: true }}
            />

            {/* Static Gloss */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent pointer-events-none" />
          </div>
        </div>
      </motion.div>

      {/* Text Side */}
      <motion.div
        className="flex-1 text-center lg:text-left"
        initial={{ opacity: 0, x: index % 2 === 0 ? 50 : -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-20%" }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
      >
        <h3 className="text-3xl md:text-5xl font-bold text-white mb-8 tracking-tight pb-2">
          {feature.title}
        </h3>
        <p className="text-lg md:text-xl text-neutral-400 leading-relaxed font-light">
          {feature.description}
        </p>
      </motion.div>
    </div>
  );
};

export const Showcase = () => {
  return (
    <section
      className="py-16 md:py-24 lg:py-32 bg-transparent relative"
      id="showcase"
    >
      <div className="container mx-auto px-6 md:px-12">
        <motion.div
          className="text-center mb-24 lg:mb-40"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <h2 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-white/50 mb-8 tracking-tight pb-4">
            Designed for Simplicity
          </h2>
          <p className="text-xl text-neutral-400 max-w-2xl mx-auto leading-relaxed">
            Experience a fluid interface that puts control back in your hands.
            Every interaction is crafted for speed, clarity, and precision.
          </p>
        </motion.div>

        <div className="space-y-24 lg:space-y-40">
          {features.map((feature, index) => (
            <FeatureItem key={index} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};
