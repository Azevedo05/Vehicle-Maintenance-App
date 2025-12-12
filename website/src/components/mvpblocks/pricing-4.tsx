import { Button } from "@/components/ui/button";
import { Coffee, Pizza, Fuel } from "lucide-react";
import { motion } from "framer-motion";

const supportTiers = [
  {
    name: "Coffee",
    price: 2,
    icon: Coffee,
    description: "Buy me a coffee to fuel late-night coding sessions.",
    color: "from-amber-500 to-orange-500",
    paymentLink: "https://buy.stripe.com/aFadRagqrg8V0eabfAcs800",
  },
  {
    name: "Snack",
    price: 5,
    icon: Pizza,
    description: "Keep me fed and focused on the next update.",
    color: "from-pink-500 to-rose-500",
    paymentLink: "https://buy.stripe.com/dRmaEY2zBbSF8KG0AWcs801",
  },
  {
    name: "Fuel",
    price: 15,
    icon: Fuel,
    description: "Help with the tank and keep development moving!",
    color: "from-emerald-500 to-teal-500",
    paymentLink: "https://buy.stripe.com/eVq14o1vx9Kxf94abwcs802",
  },
];

export default function SupportSection() {
  return (
    <section id="support" className="relative w-full bg-black py-16 md:py-32">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="bg-primary/10 absolute -top-[10%] left-[50%] h-[40%] w-[60%] -translate-x-1/2 rounded-full blur-3xl opacity-20" />
        <div className="bg-primary/5 absolute -right-[10%] -bottom-[10%] h-[40%] w-[40%] rounded-full blur-3xl opacity-20" />
        <div className="bg-primary/5 absolute -bottom-[10%] -left-[10%] h-[40%] w-[40%] rounded-full blur-3xl opacity-20" />
      </div>

      <div className="mx-auto max-w-5xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-extrabold text-balance md:text-4xl lg:text-5xl text-white">
              Support the Project
            </h2>
            <p className="text-gray-400 mt-4 text-lg">
              Shift is free and always will be. If you find it useful, consider
              supporting development with a small contribution.
            </p>
          </motion.div>
        </div>

        <div className="mt-10 md:mt-16 grid gap-6 md:grid-cols-3">
          {supportTiers.map((tier, index) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              className="bg-zinc-900/50 relative rounded-2xl border border-white/10 p-6 shadow-lg backdrop-blur-sm transition-colors"
            >
              <div
                className={`inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br ${tier.color} mb-4`}
              >
                <tier.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white">{tier.name}</h3>
              <p className="text-gray-400 mt-2 text-sm">{tier.description}</p>
              <span className="text-white mt-4 inline-block text-3xl font-extrabold">
                €{tier.price}
              </span>
              <div className="mt-4">
                <Button
                  asChild
                  size="lg"
                  className="w-full shadow-md bg-white text-black hover:bg-gray-200 border-none"
                >
                  <a
                    href={tier.paymentLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Support
                  </a>
                </Button>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="text-zinc-500 mt-10 text-center text-sm"
        >
          Payments processed securely via Stripe. Thank you for your support! ❤️
        </motion.p>
      </div>
    </section>
  );
}
