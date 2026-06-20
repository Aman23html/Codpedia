"use client";

import React from 'react';
import { motion, Variants } from 'framer-motion';
import { Globe, ShieldCheck, Users, Lightbulb } from 'lucide-react';
import { useTheme } from "next-themes";
import { themeAssets } from "@/lib/theme-assets";

const WhoWeAre: React.FC = () => {
   const { resolvedTheme } = useTheme();
  
    const assets =
      resolvedTheme === "dark"
        ? themeAssets.dark
        : themeAssets.light;
  const features = [
    {
      icon: <Globe className="w-7 h-7 text-[var(--primary)] transition-colors duration-500" strokeWidth={1.5} />,
      title: "Global",
      subtitle: "Perspective",
    },
    {
      icon: <ShieldCheck className="w-7 h-7 text-[var(--primary)] transition-colors duration-500" strokeWidth={1.5} />,
      title: "Trusted &",
      subtitle: "Registered",
    },
    {
      icon: <Users className="w-7 h-7 text-[var(--primary)] transition-colors duration-500" strokeWidth={1.5} />,
      title: "Learner",
      subtitle: "Focused",
    },
    {
      icon: <Lightbulb className="w-7 h-7 text-[var(--primary)] transition-colors duration-500" strokeWidth={1.5} />,
      title: "Innovation",
      subtitle: "Driven",
    },
  ];

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
    },
  };

  const lineVariants: Variants = {
    hidden: { width: 0 },
    visible: {
      width: "32px",
      transition: { duration: 0.8, delay: 0.5, ease: "easeInOut" },
    },
  };

  return (
    // Base background controlled entirely by globals.css variables
    <section className="relative min-h-screen bg-[var(--background)] flex items-center justify-center py-24 px-6 md:px-12 lg:px-24 font-sans overflow-hidden z-0 transition-colors duration-500">
      
      {/* Background Ambient Light Effects - Theme Aware Blend Modes */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <motion.div 
          animate={{ opacity: [0.15, 0.25, 0.15], scale: [1, 1.05, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-[20%] -left-[10%] w-[500px] h-[500px] bg-[var(--primary)]/10 dark:bg-[var(--primary)]/20 blur-[120px] rounded-full mix-blend-normal dark:mix-blend-screen transition-all duration-500"
        />
        <motion.div 
          animate={{ opacity: [0.1, 0.15, 0.1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-[var(--secondary)]/10 dark:bg-[var(--secondary)]/20 blur-[150px] rounded-full mix-blend-normal dark:mix-blend-screen transition-all duration-500"
        />
      </div>

      <div className="max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center z-10">
        
        {/* Left Column - Content */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="flex flex-col"
        >
          {/* Section Subtitle */}
          <motion.div variants={itemVariants} className="mb-8">
            <h3 className="text-[var(--primary)] text-sm md:text-xs font-bold tracking-[0.25em] uppercase mb-3 transition-colors duration-500">
              Who We Are
            </h3>
            <motion.div variants={lineVariants} className="h-[2px] bg-[var(--secondary)] rounded-full transition-colors duration-500" />
          </motion.div>

          {/* Main Heading */}
          <motion.h2 
            variants={itemVariants}
            className="text-4xl md:text-5xl lg:text-[56px] font-bold text-[var(--foreground)] leading-[1.15] mb-8 tracking-tight transition-colors duration-500"
          >
            Building a Global <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--primary)] to-blue-700 dark:to-blue-400 transition-colors duration-500">
              Education & Knowledge
            </span> <br />
            Ecosystem
          </motion.h2>

          {/* Description Paragraphs */}
          <motion.div variants={itemVariants} className="space-y-6 text-[var(--foreground)]/70 text-base md:text-lg leading-relaxed max-w-xl font-light transition-colors duration-500">
            <p>
              Codepedia Solutions is a registered Education & Knowledge Services company operating multiple specialized brands that support learners, researchers and professionals across the world.
            </p>
            <p>
              We are committed to delivering high-quality, accessible and innovative learning, research and professional development solutions.
            </p>
          </motion.div>

          {/* Feature Icons Grid */}
          <div className="grid grid-cols-4 gap-4 mt-16 max-w-lg">
            {features.map((feature, index) => (
              <motion.div 
                key={index} 
                variants={itemVariants}
                whileHover={{ y: -5 }}
                className="flex flex-col items-center text-center group cursor-pointer"
              >
                <div className="relative mb-4 p-4 rounded-2xl bg-[var(--card)]/80 dark:bg-[var(--card)]/50 border border-[var(--border)] group-hover:border-[var(--primary)]/50 group-hover:bg-[var(--primary)]/5 dark:group-hover:bg-[var(--primary)]/10 shadow-sm dark:shadow-none transition-all duration-300 overflow-hidden">
                  <div className="absolute inset-0 bg-[var(--primary)]/10 dark:bg-[var(--primary)]/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative z-10">
                    {feature.icon}
                  </div>
                </div>
                <span className="text-xs md:text-sm text-[var(--foreground)]/90 font-medium tracking-wide transition-colors duration-500">
                  {feature.title} <br /> 
                  <span className="text-[var(--foreground)]/50 group-hover:text-[var(--foreground)] transition-colors">{feature.subtitle}</span>
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Right Column - Image / Visuals */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, x: 20 }}
          whileInView={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
          viewport={{ once: true }}
          className="relative w-full h-[400px] lg:h-[500px] rounded-2xl z-10 group perspective-1000"
        >
          {/* Animated Glow Border Frame */}
          <div className="absolute -inset-0.5 bg-gradient-to-br from-[var(--primary)]/20 via-transparent to-[var(--secondary)]/10 rounded-2xl blur-sm opacity-50 group-hover:opacity-100 transition-opacity duration-700" />
          
          {/* Main Image Container */}
          <div className="relative w-full h-full rounded-2xl border border-[var(--border)] bg-[var(--card)] overflow-hidden flex items-center justify-center shadow-xl dark:shadow-2xl transition-colors duration-500">
            <motion.img 
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              src={assets.whoWeAreImage} 
              alt="Codepedia Solutions Global Network" 
              className="w-full h-full object-cover object-center"
            />
            
            {/* Fade overlay that seamlessly blends into the background color */}
            <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[var(--background)] to-transparent opacity-80 dark:opacity-60 transition-colors duration-500" />
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default WhoWeAre;