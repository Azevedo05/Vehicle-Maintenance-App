import { motion } from "framer-motion";

const features = [
  {
    title: "Unified Garage Management",
    description:
      "Effortlessly manage your entire fleet from a single, intuitive interface. Whether it's personal cars or work vehicles, get a comprehensive snapshot of your automotive life in seconds.",
    image: "/mockups/dashboard.jpg",
    color: "from-blue-500/20 to-cyan-500/20",
  },
  {
    title: "Precision Vehicle Insights",
    description:
      "Dive deep into every detail. From tracking real-time mileage to managing specific fuel types, access a granular view of your vehicle's health and specifications with elegance and ease.",
    image: "/mockups/details.jpg",
    color: "from-purple-500/20 to-indigo-500/20",
  },
  {
    title: "Intelligent Care Reminders",
    description:
      "Shift transforms maintenance from a chore into a seamless habit. Our proactive alert system ensures you're always ahead of essential services, extending the lifespan of your investment.",
    image: "/mockups/maintenance.jpg",
    color: "from-emerald-500/20 to-teal-500/20",
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
      } items-center gap-16 lg:gap-32`}
    >
      {/* Image Side - Slide In Animation */}
      <motion.div
        className="flex-1 w-full flex justify-center relative group"
        initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-20%" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="relative z-10">
          <div
            className={`relative w-[280px] md:w-[320px] aspect-[9/19] rounded-[0.5rem] border-[6px] border-neutral-800 bg-black overflow-hidden shadow-2xl`}
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

        {/* Elegant Atmospheric Glow */}
        <div
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[80%] bg-gradient-to-r ${feature.color} blur-[100px] -z-10 opacity-20`}
        />
      </motion.div>

      {/* Text Side */}
      <motion.div
        className="flex-1 text-center lg:text-left"
        initial={{ opacity: 0, x: index % 2 === 0 ? 50 : -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-20%" }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
      >
        <h3 className="text-3xl md:text-5xl font-bold text-white mb-8 tracking-tight">
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
    <section className="py-32 bg-black relative overflow-hidden" id="showcase">
      <div className="container mx-auto px-6 md:px-12">
        <motion.div
          className="text-center mb-40"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <h2 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-white/50 mb-8 tracking-tight">
            Designed for Simplicity
          </h2>
          <p className="text-xl text-neutral-400 max-w-2xl mx-auto leading-relaxed">
            Experience a fluid interface that puts control back in your hands.
            Every interaction is crafted for speed, clarity, and precision.
          </p>
        </motion.div>

        <div className="space-y-40">
          {features.map((feature, index) => (
            <FeatureItem key={index} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};
