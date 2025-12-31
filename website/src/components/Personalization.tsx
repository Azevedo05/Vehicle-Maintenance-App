import { motion } from "framer-motion";
import { Settings, List, Bell } from "lucide-react";
import { useTranslation } from "react-i18next";

export const Personalization = () => {
  const { t } = useTranslation();

  const items = [
    {
      title: t("personalization.items.viewControl.title"),
      description: t("personalization.items.viewControl.desc"),
      image: "/mockups/customization_view.jpg",
      icon: Settings,
    },
    {
      title: t("personalization.items.reorder.title"),
      description: t("personalization.items.reorder.desc"),
      image: "/mockups/customization_order.jpg",
      icon: List,
    },
    {
      title: t("personalization.items.notifications.title"),
      description: t("personalization.items.notifications.desc"),
      image: "/mockups/customization_notifications.jpg",
      icon: Bell,
    },
  ];

  return (
    <section
      className="py-12 md:py-24 bg-transparent overflow-hidden relative"
      id="personalization"
    >
      {/* Background Gradient */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent via-neutral-900/40 to-transparent opacity-80 z-0" />

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="bg-blue-500/10 border border-blue-500/20 text-blue-400 px-4 py-1.5 rounded-full text-sm font-semibold w-fit mx-auto mb-6">
            {t("personalization.badge")}
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
            {t("personalization.title")}
          </h2>
          <p className="text-xl text-neutral-400 max-w-2xl mx-auto leading-relaxed">
            {t("personalization.subtitle")}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-16 max-w-7xl mx-auto">
          {items.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={index}
                className="flex flex-col items-center text-center group"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
              >
                {/* Phone Frame Mockup - Showcase Style */}
                <div className="relative group/phone">
                  <div className="relative w-[180px] xs:w-[220px] md:w-[260px] max-w-full aspect-[9/19] rounded-[0.5rem] border-[3px] border-neutral-800 bg-black overflow-hidden shadow-2xl mb-8 group-hover:-translate-y-2 transition-transform duration-500">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />

                    {/* Premium Shimmer Effect */}
                    <motion.div
                      className="absolute inset-0 z-20 bg-gradient-to-tr from-transparent via-white/10 to-transparent -skew-x-12"
                      initial={{ x: "-100%" }}
                      whileInView={{ x: "200%" }}
                      transition={{
                        duration: 1.5,
                        ease: "easeInOut",
                        delay: 0.2 + index * 0.2,
                      }}
                      viewport={{ once: true }}
                    />

                    {/* Static Gloss */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent pointer-events-none" />
                  </div>
                </div>

                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
                    <Icon size={20} />
                  </div>
                  <h3 className="text-2xl font-bold text-white">
                    {item.title}
                  </h3>
                </div>

                <p className="text-neutral-400 leading-relaxed max-w-xs">
                  {item.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
