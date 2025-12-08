import { motion } from "framer-motion";
import { TextReveal } from "@/components/ui/text-reveal";

export const Hero = () => {
  return (
    <section
      className="relative min-h-[90vh] flex items-center justify-center pt-20"
      id="download"
    >
      {/* Background Gradients */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 h-96 w-96 rounded-full bg-blue-500/20 blur-[100px]" />
        <div className="absolute bottom-0 right-1/4 h-96 w-96 rounded-full bg-purple-500/20 blur-[100px]" />
      </div>

      <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center relative z-10">
        {/* Text Content (Left) */}
        <div className="order-1 lg:order-1 flex flex-col items-start text-left">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6 inline-flex items-center rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-sm text-blue-400"
          >
            <span className="mr-2 inline-block h-2 w-2 animate-pulse rounded-full bg-blue-500"></span>
            New Release
          </motion.div>

          <div className="mb-2">
            <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-7xl mb-4">
              Your Vehicle's
            </h1>
            <TextReveal className="text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#2f95dc] to-[#3B82F6] sm:text-7xl pb-2">
              Best Friend
            </TextReveal>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-8 max-w-lg text-lg text-gray-400"
          >
            Meticulous tracking. Intelligent notifications. Total privacy. Keep
            your vehicle in perfect condition with the most premium maintenance
            app.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="flex flex-col gap-4">
              <div className="flex flex-wrap gap-4">
                <button
                  className="flex items-center gap-3 rounded-lg bg-white px-6 py-3 text-black transition-transform hover:scale-105 disabled:opacity-70 disabled:cursor-not-allowed"
                  disabled
                >
                  <svg
                    viewBox="0 0 384 512"
                    fill="currentColor"
                    className="h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 52.3-11.4 69.5-34.3z" />
                  </svg>
                  <div className="flex flex-col items-start leading-none">
                    <span className="text-[10px] uppercase">
                      Download on the
                    </span>
                    <span className="font-bold text-lg">App Store</span>
                  </div>
                </button>
                <button
                  className="flex items-center gap-3 rounded-lg border border-white/20 bg-white/5 px-6 py-3 text-white transition-transform hover:scale-105 hover:bg-white/10 disabled:opacity-70 disabled:cursor-not-allowed"
                  disabled
                >
                  <svg
                    viewBox="0 0 512 512"
                    fill="currentColor"
                    className="h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1zM47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3l256.6-256L47 0zm425.2 225.6l-58.9-34.1-65.7 64.5 65.7 64.5 60.1-34.1c18-14.3 18-46.5-1.2-60.8zM104.6 499l280.8-161.2-60.1-60.1L104.6 499z" />
                  </svg>
                  <div className="flex flex-col items-start leading-none">
                    <span className="text-[10px] uppercase">Get it on</span>
                    <span className="font-bold text-lg">Google Play</span>
                  </div>
                </button>
              </div>
              <p className="text-sm text-yellow-400/80 bg-yellow-400/10 px-3 py-1.5 rounded-md self-start border border-yellow-400/20 backdrop-blur-sm">
                🚧 Coming Soon - App currently in private beta
              </p>
            </div>
          </motion.div>
        </div>

        {/* Visual Content (Right) */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative order-2 lg:order-2 flex justify-center"
        >
          <div className="relative">
            <div className="relative w-[280px] md:w-[320px] aspect-[9/19] border-[6px] border-neutral-800 rounded-[0.5rem] bg-black shadow-2xl overflow-hidden z-10">
              <div className="w-full h-full bg-neutral-900">
                <img
                  src="/hero-app.jpg"
                  alt="Shift App Interface"
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Gloss */}
              <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent pointer-events-none" />
            </div>
            {/* Glow Effect behind phone */}
            <div className="absolute -inset-4 bg-blue-500/30 blur-3xl -z-10 rounded-full opacity-50"></div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
