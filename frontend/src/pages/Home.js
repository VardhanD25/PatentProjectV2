// src/pages/Home.jsx
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import profile from "./pic.jpg";
import Footer from '../components/Footer';

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.2
    }
  }
};

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-950 font-quicksand text-slate-200 relative">
      {/* Primary Background with Grid */}
      <div className="fixed inset-0 bg-gradient-to-b from-slate-950 to-slate-900">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <motion.div
          animate={{
            opacity: [0.3, 0.5, 0.3],
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 8, repeat: Infinity }}
          className="fixed inset-0 bg-gradient-to-r from-slate-950/0 via-slate-100/5 to-slate-950/0"
        />
      </div>

      {/* Content Container */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />

        {/* Main Content */}
        <main className="flex-grow">
          {/* Hero Section */}
          <motion.section 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="relative min-h-screen flex items-center justify-center overflow-hidden py-20"
          >
            <div className="relative z-10 max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="text-left"
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-sm font-semibold text-slate-400 tracking-wider mb-2"
                >
                  MATERIAL SCIENCE INNOVATION
                </motion.div>
                <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
                  Optimize Your
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-slate-200 via-slate-100 to-slate-300">
                    Material Selection
                  </span>
                </h1>
                <p className="text-xl text-slate-400 mb-8 max-w-xl">
                  Revolutionize your engineering decisions with our advanced Compactness Calculator
                </p>
                <motion.div
                  className="flex gap-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <motion.a
                    href="/userinput"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-8 py-4 bg-slate-200 text-slate-900 font-semibold rounded-lg hover:bg-slate-100 transition-all duration-300"
                  >
                    Get Started →
                  </motion.a>
                  
                </motion.div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="relative"
              >
                <div className="aspect-square w-full max-w-md mx-auto relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-slate-200/10 to-transparent rounded-full animate-pulse"></div>
                  <div className="absolute inset-4 bg-gradient-to-br from-slate-800 to-slate-900 rounded-full"></div>
                  <motion.div
                    animate={{ 
                      rotate: 360,
                      scale: [1, 1.02, 1]
                    }}
                    transition={{ 
                      rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                      scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                    }}
                    className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_50%)]"
                  />
                </div>
              </motion.div>
            </div>
          </motion.section>

          {/* Features Section - Now with transparent background */}
          <section className="relative py-32">
            <motion.div 
              variants={stagger}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              className="max-w-7xl mx-auto px-4 space-y-32"
            >
              {/* Features Grid */}
              <motion.div variants={fadeIn} className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  {
                    title: "Intuitive Interface",
                    description: "Seamless user experience with real-time calculations and instant feedback",
                    icon: "⚡"
                  },
                  {
                    title: "Precise Analytics",
                    description: "Advanced algorithms ensuring accurate results for your material analysis",
                    icon: "📊"
                  },
                  {
                    title: "Smart Integration",
                    description: "Easily integrate with existing workflows and engineering processes",
                    icon: "🔄"
                  }
                ].map((feature, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ y: -10 }}
                    className="group p-8 bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 hover:border-slate-600 shadow-lg hover:shadow-slate-700/20 transition-all duration-300"
                  >
                    <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">{feature.icon}</div>
                    <h3 className="text-xl font-semibold mb-2 text-slate-200">{feature.title}</h3>
                    <p className="text-slate-400">{feature.description}</p>
                  </motion.div>
                ))}
              </motion.div>

              {/* About Section */}
              <motion.div
                variants={fadeIn}
                className="flex flex-col md:flex-row-reverse items-center gap-12 p-8 rounded-2xl bg-slate-800/30 backdrop-blur-sm border border-slate-700/50"
              >
                <div className="md:w-1/2">
                  <h2 className="text-4xl font-bold mb-6">
                    Meet the <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-200 to-white">Innovator</span>
                  </h2>
                  <p className="text-slate-400 leading-relaxed">
                    Mangesh Patwardhan brings years of expertise in material science to create this revolutionary tool. 
                    His vision combines practical engineering needs with cutting-edge technology.
                  </p>
                </div>
                <motion.div 
                  className="md:w-1/2"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="rounded-2xl overflow-hidden border-2 border-slate-700/50 shadow-2xl">
                    <img 
                      src={profile} 
                      alt="Mangesh Patwardhan"
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" 
                    />
                  </div>
                </motion.div>
              </motion.div>

              {/* CTA Section */}
              <motion.div
                variants={fadeIn}
                className="relative overflow-hidden rounded-3xl bg-slate-800/30 backdrop-blur-sm p-12 text-center border border-slate-700/50"
              >
                <motion.div
                  animate={{ 
                    scale: [1, 1.2, 1],
                    rotate: [0, 180, 360] 
                  }}
                  transition={{ duration: 20, repeat: Infinity }}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-slate-200/5 rounded-full"
                />
                <div className="relative z-10">
                  <h2 className="text-5xl font-bold text-white mb-6">
                    Ready to Transform Your Process?
                  </h2>
                  <p className="text-xl text-slate-300 mb-8">
                    Join the future of material engineering today.
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-4 bg-slate-200 text-slate-900 font-semibold rounded-lg shadow-lg hover:bg-white transition-all duration-300"
                  >
                    Get Started Now →
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          </section>
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
};

export default Home;
