"use client";

import React from "react";
import { motion, Variants } from "framer-motion";
import { FileEdit, UserRoundSearch, MonitorPlay, Users } from "lucide-react";
import Link from "next/link";

const steps = [
  {
    id: 1,
    title: "Apply Online",
    desc: "Submit your application through our career portal.",
    icon: FileEdit,
    type: "primary",
  },
  {
    id: 2,
    title: "Profile Review",
    desc: "Our team reviews your profile and experience.",
    icon: UserRoundSearch,
    type: "primary",
  },
  {
    id: 3,
    title: "Office Interview",
    desc: "Connect with our team for a virtual interview.",
    icon: MonitorPlay,
    type: "primary",
  },
  {
    id: 4,
    title: "Join Codepedia",
    desc: "Welcome aboard! Start making an impact.",
    icon: Users,
    type: "secondary",
  },
];

// Animation Variants
const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.2, delayChildren: 0.1 },
  },
};

const desktopLineVariants: Variants = {
  hidden: { width: "0%", opacity: 0 },
  visible: {
    width: "80%",
    opacity: 1,
    transition: { duration: 1.2, ease: "easeInOut" },
  },
};

const mobileLineVariants: Variants = {
  hidden: { height: "0%", opacity: 0 },
  visible: {
    height: "100%",
    opacity: 1,
    transition: { duration: 1.5, ease: "easeInOut" },
  },
};

const stepVariants: Variants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 90, damping: 14 },
  },
};

const nodeVariants: Variants = {
  hidden: { opacity: 0, scale: 0 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

export default function HiringProcess() {
  return (
    <section className="relative w-full overflow-hidden bg-[var(--background)] py-16 sm:py-24 font-sans transition-colors duration-500">
      
      {/* Ambient Background Lighting (Theme Aware) */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* Subtle Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#88888810_1px,transparent_1px),linear-gradient(to_bottom,#88888810_1px,transparent_1px)] bg-[size:40px_40px]" />
        
        <div className="absolute -left-[10%] top-[20%] h-[300px] sm:h-[500px] w-[300px] sm:w-[500px] rounded-full bg-[var(--primary)]/10 blur-[100px] sm:blur-[150px] transition-colors duration-500" />
        <div className="absolute -right-[10%] top-[40%] h-[250px] sm:h-[400px] w-[250px] sm:w-[400px] rounded-full bg-[var(--secondary)]/10 blur-[100px] sm:blur-[150px] transition-colors duration-500" />
      </div>

      <div className="relative z-10 mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-12">
        
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mb-16 sm:mb-24 flex flex-col items-center text-center"
        >
          {/* Top Label */}
          <div className="mb-4 sm:mb-6 flex items-center gap-3 sm:gap-4">
            <div className="h-[2px] w-8 sm:w-12 rounded-full bg-gradient-to-r from-transparent to-[var(--secondary)] opacity-70" />
            <span className="text-sm sm:text-[20px] font-black uppercase tracking-[0.25em] text-[var(--secondary)] transition-colors duration-500">
              Our Hiring Process
            </span>
            <div className="h-[2px] w-8 sm:w-12 rounded-full bg-gradient-to-l from-transparent to-[var(--secondary)] opacity-70" />
          </div>

          <h2 className="mb-4 text-3xl sm:text-4xl md:text-5xl lg:text-[54px] font-black tracking-tight text-[var(--foreground)] transition-colors duration-500 leading-tight">
            Your Journey to <span className="bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] bg-clip-text text-transparent">Codepedia</span>
          </h2>

          <p className="max-w-2xl text-sm sm:text-base md:text-lg font-medium text-[var(--muted-foreground)] transition-colors duration-500 px-2">
            A simple, transparent and people-first hiring experience.
          </p>
        </motion.div>

        {/* Timeline Section */}
        <div className="relative mt-8 sm:mt-16">
          
          {/* Connecting Line (Desktop Only - md and up) */}
          <div className="absolute left-[10%] top-[64px] hidden h-[2px] w-[80%] md:block">
            <div className="absolute inset-0 bg-[var(--border)] transition-colors duration-500" />
            <motion.div
              variants={desktopLineVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="absolute inset-0 origin-left bg-gradient-to-r from-[var(--primary)] via-[var(--primary)] to-[var(--secondary)] opacity-80"
            />
            {/* Intersecting Glowing Nodes */}
            <motion.div variants={nodeVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ delay: 0.5 }} className="absolute left-[29.3%] top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-[var(--primary)] shadow-[0_0_12px_var(--primary)]" />
            <motion.div variants={nodeVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ delay: 0.7 }} className="absolute left-[58.6%] top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-[var(--primary)] shadow-[0_0_12px_var(--primary)]" />
          </div>

          {/* Connecting Line (Mobile/Tablet Only - Vertical under md) */}
          <div className="absolute left-10 sm:left-12 top-0 h-full w-[2px] bg-[var(--border)] md:hidden transition-colors duration-500">
            <motion.div
              variants={mobileLineVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="absolute inset-0 origin-top bg-gradient-to-b from-[var(--primary)] via-[var(--primary)] to-[var(--secondary)] opacity-80"
            />
          </div>

          {/* Steps Container */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-1 gap-10 md:grid-cols-4 md:gap-4 lg:gap-8"
          >
            {steps.map((step) => {
              const Icon = step.icon;
              const isPrimary = step.type === "primary";
              
              const textColorClass = isPrimary ? "text-[var(--primary)]" : "text-[var(--secondary)]";
              const bgColorClass = isPrimary ? "bg-[var(--primary)]" : "bg-[var(--secondary)]";
              const hoverBorderClass = isPrimary ? "group-hover:border-[var(--primary)]/50" : "group-hover:border-[var(--secondary)]/50";

              return (
                <motion.div
                  key={step.id}
                  variants={stepVariants}
                  className="group relative flex flex-col items-center text-center md:items-center md:text-center max-md:flex-row max-md:items-start max-md:text-left max-md:pl-24 sm:max-md:pl-28"
                >
                  {/* Circle Graphic */}
                  <div className="relative z-10 flex shrink-0 items-center justify-center mb-6 md:mb-8 max-md:absolute max-md:left-0 max-md:top-0">
                    
                    {/* Floating Number Badge */}
                    <div className={`absolute -left-2 -top-1 sm:-left-3 sm:-top-1 z-20 flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-full text-xs sm:text-sm font-bold text-white shadow-md transition-transform duration-500 group-hover:scale-110 ${bgColorClass}`}>
                      {step.id}
                    </div>

                    {/* Glow Effect */}
                    <div className={`absolute inset-0 rounded-full blur-[15px] opacity-0 transition-opacity duration-500 group-hover:opacity-25 ${bgColorClass}`} />

                    {/* Main Glass Circle */}
                    <div 
                      className={`relative flex h-20 w-20 sm:h-24 sm:w-24 md:h-[128px] md:w-[128px] items-center justify-center rounded-full border border-[var(--border)] bg-[var(--card)] backdrop-blur-md transition-all duration-500 group-hover:scale-105 ${hoverBorderClass} shadow-sm`}
                    >
                      <div className="absolute inset-1.5 rounded-full border border-white/5 bg-gradient-to-br from-white/10 to-transparent opacity-0 dark:opacity-40 transition-opacity" />
                      
                      <Icon 
                        className={`relative z-10 w-8 h-8 sm:w-10 sm:h-10 md:w-[44px] md:h-[44px] transition-transform duration-500 group-hover:scale-110 ${textColorClass}`} 
                        strokeWidth={1.5} 
                      />
                    </div>
                  </div>

                  {/* Text Content */}
                  <div className="w-full max-md:pt-1 sm:max-md:pt-2">
                    <h3 className="mb-2 md:mb-3 text-lg sm:text-xl md:text-[22px] font-bold tracking-tight text-[var(--foreground)] transition-colors duration-500">
                      {step.title}
                    </h3>
                    <p className="mx-auto max-w-[240px] text-xs sm:text-sm font-medium leading-relaxed text-[var(--muted-foreground)] transition-colors duration-500 max-md:mx-0">
                      {step.desc}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>

        {/* CTA Button Block */}
        <div className="mt-16 sm:mt-20 flex justify-center">
          <Link
            href="/contact"
            className="group inline-flex items-center justify-center gap-3 rounded-xl sm:rounded-2xl bg-[var(--primary)] px-6 sm:px-8 py-3.5 sm:py-4 text-xs sm:text-sm font-black uppercase tracking-widest text-white shadow-xl shadow-[var(--primary)]/20 transition-all duration-200 hover:-translate-y-0.5 hover:opacity-95 active:translate-y-0"
          >
            Apply Now
            <span className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-lg sm:rounded-xl bg-white/15 transition-transform duration-200 group-hover:translate-x-1">
              <FileEdit className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}