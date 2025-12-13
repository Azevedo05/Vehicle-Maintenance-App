import { motion } from "framer-motion";
import { Github, Globe, Linkedin } from "lucide-react";
import Header1 from "./mvpblocks/header-1";
import Footer4Col from "./mvpblocks/footer-4col";

const Developers = () => {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-blue-500/30">
      <Header1 />

      <main className="pt-32 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-20"
          >
            <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-emerald-400 mb-6">
              Meet the Creator
            </h1>
            <p className="text-xl text-neutral-400 max-w-2xl mx-auto leading-relaxed">
              The mind behind Shift. Combining passion for automotive
              engineering with cutting-edge software development.
            </p>
          </motion.div>

          {/* Developer Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative group"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-emerald-500 rounded-2xl opacity-20 group-hover:opacity-40 blur transition duration-500"></div>
            <div className="relative bg-neutral-900 border border-white/10 rounded-2xl p-8 md:p-12 overflow-hidden">
              <div className="flex flex-col items-center text-center">
                <h2 className="text-4xl font-bold text-white mb-3">
                  Gonçalo Azevedo
                </h2>
                <p className="text-blue-400 font-medium mb-8 text-lg">
                  Lead Developer & Designer
                </p>

                <p className="text-neutral-300 leading-relaxed mb-10 max-w-2xl text-lg">
                  Passionate about building intuitive and beautiful user
                  experiences. Shift was born from a desire to simplify
                  vehicle maintenance management for everyone. With a
                  background in modern web technologies and a love for cars,
                  I'm dedicated to making Shift the best companion for your
                  garage.
                </p>

                {/* Social Links */}
                <div className="flex flex-wrap justify-center gap-4">
                  <a
                    href="https://github.com/Azevedo05"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-6 py-3 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-colors font-medium hover:scale-105 active:scale-95"
                  >
                    <Github size={20} />
                    <span>GitHub</span>
                  </a>
                  <a
                    href="https://www.linkedin.com/in/gon%C3%A7alo-azevedo-41770b38b/"
                    className="flex items-center gap-2 px-6 py-3 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-colors font-medium hover:scale-105 active:scale-95"
                  >
                    <Linkedin size={20} />
                    <span>LinkedIn</span>
                  </a>
                  <a
                    href="https://goncalo-portfolio.vercel.app"
                    className="flex items-center gap-2 px-6 py-3 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-colors font-medium hover:scale-105 active:scale-95"
                  >
                    <Globe size={20} />
                    <span>Portfolio</span>
                  </a>
                </div>
              </div>

              {/* Decorative Elements */}
              <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
              <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer4Col />
    </div>
  );
};

export default Developers;
