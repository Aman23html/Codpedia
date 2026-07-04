"use client";

import React from "react";
import { motion, Variants } from "framer-motion"; 
import { ArrowRight, Users, GraduationCap, Library, Globe2 } from "lucide-react";
import Heroleft from "./Heroleft";

const metrics = [
  { value: "20+", label: "Countries Served", icon: <Globe2 className="w-7 h-7 text-[var(--primary)]" /> },
  { value: "10K+", label: "Learners Supported", icon: <GraduationCap className="w-7 h-7 text-[var(--primary)]" /> },
  { value: "Multiple", label: "Specialized Brands", icon: <Library className="w-7 h-7 text-[var(--primary)]" /> },
  { value: "Expertise", label: "Academic & Professional", icon: <Users className="w-7 h-7 text-[var(--primary)]" /> },
];

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.1 } },
};

const springUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 80, damping: 15 } },
};

export default function Hero() {
  return (
    <section className="relative min-h-screen w-full bg-[var(--background)] text-[var(--foreground)] pt-32 pb-16 overflow-hidden flex flex-col justify-center transition-colors duration-500">
      
      {/* 1. Volumetric Lighting Background */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        
        {/* Dynamic Mesh Grid: Very faint gray in light mode, faint white in dark mode */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#88888815_1px,transparent_1px),linear-gradient(to_bottom,#88888815_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)] transition-colors duration-500" />

        {/* Primary Blue Glow: Soft pastel in light mode, intense screen glow in dark mode */}
        <motion.div 
          animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.4, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 right-[10%] -translate-y-1/2 w-[600px] h-[600px] bg-[var(--primary)]/10 dark:bg-[var(--primary)]/30 rounded-full blur-[100px] dark:blur-[150px] mix-blend-normal dark:mix-blend-screen transition-all duration-500" 
        />
        
        {/* Secondary Orange Glow: Soft pastel in light mode, intense screen glow in dark mode */}
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.4, 0.3] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-10 right-[20%] w-[400px] h-[400px] bg-[var(--secondary)]/10 dark:bg-[var(--secondary)]/20 rounded-full blur-[100px] dark:blur-[120px] mix-blend-normal dark:mix-blend-screen transition-all duration-500" 
        />
        
        {/* Text backdrop glow */}
        <div className="absolute top-[20%] left-[-10%] w-[500px] h-[500px] bg-[var(--primary)]/5 dark:bg-[var(--primary)]/20 rounded-full blur-[120px] transition-all duration-500" />
      </div>

      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 relative z-10 w-full">
        
        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center min-h-[50vh]"
        >
          
          {/* Left Side: Typography and CTAs */}
          <div className="flex flex-col space-y-8 col-span-1 lg:col-span-7 xl:col-span-6 z-20">
            

            <motion.h1 variants={springUp} className="text-5xl md:text-6xl lg:text-[64px] font-bold tracking-tight leading-[1.1] transition-colors duration-500">
              Empowering Learning, <br className="hidden md:block"/> Research & Professional <br className="hidden md:block"/>
              Growth <span className="text-[var(--secondary)] dark:drop-shadow-[0_0_20px_rgba(255,153,0,0.4)]">Worldwide</span>
            </motion.h1>
            
            <motion.p variants={springUp} className="text-lg text-[var(--foreground)]/70 max-w-xl leading-relaxed font-light transition-colors duration-500">
              Codepedia Solutions is a registered <strong className="text-[var(--primary)] dark:drop-shadow-[0_0_10px_rgba(0,102,255,0.3)] font-semibold transition-colors duration-500">Education & Knowledge Services</strong> company operating multiple specialized brands that support students, researchers, and professionals globally.
            </motion.p>
            
            <motion.div variants={springUp} className="flex flex-wrap items-center gap-5 pt-2">
              {/* Primary Button */}
              <a href="#ourbrands">
                <button className="group relative flex items-center gap-2.5 px-8 py-3.5 rounded-xl text-sm font-semibold bg-[var(--primary)] text-white overflow-hidden shadow-lg dark:shadow-[0_0_30px_rgba(0,102,255,0.4)] hover:opacity-90 transition-all duration-300 hover:-translate-y-0.5">
                <span className="relative z-10 flex items-center gap-2">
                  Explore Our Brands <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
              </button>
              </a>
              
              {/* Secondary Button */}
              <button className="flex items-center gap-2.5 px-8 py-3.5 rounded-xl text-sm font-semibold border border-[var(--border)] text-[var(--foreground)]/80 hover:bg-[var(--foreground)]/5 hover:border-[var(--foreground)]/30 transition-all duration-300 hover:-translate-y-0.5">
                Partner With Us <Users className="w-4 h-4 text-[var(--foreground)]/60 group-hover:text-[var(--foreground)] transition-colors" />
              </button>
            </motion.div>
          </div>

          {/* Right Side: Heroleft */}
          <motion.div 
            variants={springUp}
            className="col-span-1 lg:col-span-5 xl:col-span-6 flex justify-center lg:justify-end relative w-full h-full mt-10 lg:mt-0"
          >
            <div className="w-full max-w-[1000px] lg:max-w-none xl:translate-x-10">
              <Heroleft />
            </div>
          </motion.div>

        </motion.div>

        {/* Bottom Global Metrics Bar */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
          className="relative z-10 w-full mt-24"
        >
          {/* Theme-aware Card Background */}
          <div className="bg-[var(--card)]/90 backdrop-blur-2xl border border-[var(--border)] rounded-2xl p-6 lg:p-8 shadow-xl  grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 divide-y sm:divide-y-0 sm:divide-x divide-[var(--border)] relative overflow-hidden transition-colors duration-500">
             
             {/* Subtle internal gradient */}
             <div className="absolute inset-0 bg-gradient-to-r from-[var(--primary)]/5 via-transparent to-[var(--secondary)]/5 pointer-events-none transition-colors duration-500" />

            {metrics.map((metric, index) => (
              <div 
                key={index} 
                className={`group flex items-center gap-4 ${index !== 0 && index !== 2 ? 'sm:pl-6 lg:pl-8' : ''} ${index === 2 ? 'lg:pl-8' : ''} pt-6 sm:pt-0 hover:-translate-y-1 transition-transform duration-300 relative z-10`}
              >
                <div className="p-3.5 rounded-xl bg-[var(--background)] border border-[var(--border)] shadow-sm dark:shadow-[inset_0_0_15px_rgba(0,102,255,0.1)] group-hover:border-[var(--primary)]/40 transition-all duration-300">
                  {metric.icon}
                </div>
                <div className="flex flex-col">
                  <span className="text-3xl font-extrabold tracking-tight text-[var(--foreground)] group-hover:text-[var(--primary)] transition-colors duration-300">{metric.value}</span>
                  <span className="text-[11px] font-semibold text-[var(--foreground)]/60 mt-1 uppercase tracking-wider transition-colors duration-300">{metric.label}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
        
      </div>
    </section>
  );
}