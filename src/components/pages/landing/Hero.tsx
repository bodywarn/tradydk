import React from "react";
import { motion } from "framer-motion";
import { Edit3, Award, DollarSign, Smile } from "lucide-react";

const Hero: React.FC = () => {
  const features = [
    {
      icon: Edit3,
      title: "Dit eget design",
      showOnMobile: false
    },
    {
      icon: Award,
      title: "Høj kvalitet",
      showOnMobile: true
    },
    {
      icon: DollarSign,
      title: "Billige priser",
      showOnMobile: false
    },
    {
      icon: Smile,
      title: "God service",
      showOnMobile: false
    },
    {
      icon: Smile, // skift til det rigtige ikon for Gratis Tryk
      title: "Gratis Tryk",
      showOnMobile: true
    }
  ];

  return (
    <section aria-label="Hero section">
      <div className="relative w-full h-125 sm:h-150 lg:h-175">
        <figure className="absolute inset-0 m-0">
          <img
            src="images/landing/hero/banner.png"
            alt="TRADY premium hoodie kollektion med tilpasset design"
            className="w-full h-full object-cover object-[center_35%]"
            loading="eager"
            fetchPriority="high"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/30 to-transparent" aria-hidden="true" />
        </figure>

        <div className="relative z-10 h-full max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-start">
          <div className="text-white max-w-2xl">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 leading-tight"
            >
              Design Dit Eget Tøj
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-lg sm:text-xl text-white/90 mb-6"
            >
              Premium kvalitet til konkurrencedygtige priser. Start med at designe din egen kollektion i dag.
            </motion.p>
            <motion.a
              href="/produkter"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-block bg-[#c9b8a3] hover:bg-[#b5a087] text-white font-medium px-8 py-3 rounded-lg transition-colors duration-300"
              aria-label="Start med at designe dit eget tøj"
            >
              Start Design
            </motion.a>
          </div>
        </div>
      </div>

      <div className="bg-[#c9b8a3] w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
                  className={`flex items-center justify-center space-x-2 text-white ${
                    feature.showOnMobile ? "flex" : "hidden sm:flex"
                  }`}
                >
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center shrink-0" aria-hidden="true">
                    <IconComponent className="w-5 h-5" aria-hidden="true" />
                  </div>
                  <span className="text-sm sm:text-base font-medium">{feature.title}</span>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;