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
    title: "Online Interview",
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
    transition: { staggerChildren: 0.25, delayChildren: 0.2 },
  },
};

const lineVariants: Variants = {
  hidden: { width: "0%", opacity: 0 },
  visible: {
    width: "100%",
    opacity: 1,
    transition: { duration: 1.5, ease: "easeInOut" },
  },
};

const stepVariants: Variants = {
  hidden: { opacity: 0, y: 40, scale: 0.8 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 100, damping: 15, bounce: 0.4 },
  },
};

const nodeVariants: Variants = {
  hidden: { opacity: 0, scale: 0 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

export default function HiringProcess() {
  return (
    <section className="relative w-full overflow-hidden bg-[var(--background)] py-24 font-sans transition-colors duration-500">
      
      {/* Ambient Background Lighting (Theme Aware) */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* Subtle Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#88888810_1px,transparent_1px),linear-gradient(to_bottom,#88888810_1px,transparent_1px)] bg-[size:40px_40px]" />
        
        <div className="absolute -left-[10%] top-[20%] h-[500px] w-[500px] rounded-full bg-[var(--primary)]/10 blur-[150px] mix-blend-normal dark:mix-blend-screen transition-colors duration-500" />
        <div className="absolute -right-[10%] top-[40%] h-[400px] w-[400px] rounded-full bg-[var(--secondary)]/10 blur-[150px] mix-blend-normal dark:mix-blend-screen transition-colors duration-500" />
        <div className="absolute left-1/2 top-0 h-[300px] w-[600px] -translate-x-1/2 rounded-full bg-[var(--primary)]/5 blur-[120px] mix-blend-normal dark:mix-blend-screen transition-colors duration-500" />
      </div>

      <div className="relative z-10 mx-auto max-w-[1400px] px-6 lg:px-12">
        
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="mb-24 flex flex-col items-center text-center"
        >
          {/* Top Label */}
          <div className="mb-6 flex items-center gap-4">
            <div className="h-[2px] w-12 rounded-full bg-gradient-to-r from-transparent to-[var(--secondary)] opacity-70" />
            <span className="text-[20px] font-black uppercase tracking-[0.25em] text-[var(--secondary)] transition-colors duration-500">
              Our Hiring Process
            </span>
            <div className="h-[2px] w-12 rounded-full bg-gradient-to-l from-transparent to-[var(--secondary)] opacity-70" />
          </div>

          <h2 className="mb-4 text-4xl md:text-5xl lg:text-[54px] font-black tracking-tight text-[var(--foreground)] transition-colors duration-500">
            Your Journey to <span className="bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] bg-clip-text text-transparent">Codepedia</span>
          </h2>

          <p className="text-base md:text-lg font-medium text-[var(--muted-foreground)] transition-colors duration-500">
            A simple, transparent and people-first hiring experience.
          </p>
        </motion.div>

        {/* Timeline Section */}
        <div className="relative mt-16">
          
          {/* Connecting Line (Desktop Only) */}
          <div className="absolute left-[10%] top-[64px] hidden h-[2px] w-[80%] md:block">
            {/* Base faded line */}
            <div className="absolute inset-0 bg-[var(--border)] transition-colors duration-500" />
            
            {/* Animated gradient line */}
            <motion.div
              variants={lineVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="absolute inset-0 origin-left bg-gradient-to-r from-[var(--primary)] via-[var(--primary)] to-[var(--secondary)] opacity-80"
            />
            
            {/* Intersecting Glowing Nodes */}
            <motion.div variants={nodeVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ delay: 0.8 }} className="absolute left-[33%] top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-[var(--primary)] shadow-[0_0_12px_var(--primary)] dark:shadow-none" />
            <motion.div variants={nodeVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ delay: 1.1 }} className="absolute left-[66%] top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-[var(--primary)] shadow-[0_0_12px_var(--primary)] dark:shadow-none" />
          </div>

          {/* Connecting Line (Mobile Only - Vertical) */}
          <div className="absolute left-8 top-0 hidden h-full w-[2px] bg-[var(--border)] max-md:block transition-colors duration-500">
             <motion.div
              variants={lineVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="absolute inset-0 origin-top bg-gradient-to-b from-[var(--primary)] via-[var(--primary)] to-[var(--secondary)] opacity-80"
              style={{ width: '100%', height: '100%' }}
            />
          </div>

          {/* Steps Grid */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 gap-12 md:grid-cols-4 md:gap-6"
          >
            {steps.map((step) => {
              const Icon = step.icon;
              const isPrimary = step.type === "primary";
              
              // Dynamic Theme Variables mapping based on step type
              const textColorClass = isPrimary ? "text-[var(--primary)]" : "text-[var(--secondary)]";
              const bgColorClass = isPrimary ? "bg-[var(--primary)]" : "bg-[var(--secondary)]";
              const hoverBorderClass = isPrimary ? "group-hover:border-[var(--primary)]/50" : "group-hover:border-[var(--secondary)]/50";

              return (
                <motion.div
                  key={step.id}
                  variants={stepVariants}
                  className="group relative flex flex-col items-center text-center max-md:flex-row max-md:text-left max-md:pl-20"
                >
                  {/* Circle Graphic */}
                  <div className="relative z-10 mb-8 flex shrink-0 items-center justify-center max-md:absolute max-md:left-0 max-md:top-0">
                    
                    {/* Floating Number Badge */}
                    <div className={`absolute -left-3 -top-1 z-20 flex h-7 w-7 items-center justify-center rounded-full text-sm font-bold text-white shadow-md transition-transform duration-500 group-hover:scale-110 ${bgColorClass}`}>
                      {step.id}
                    </div>

                    {/* Glow Pseudo-layer (Theme Adaptive) */}
                    <div className={`absolute inset-0 rounded-full blur-[20px] opacity-0 transition-opacity duration-500 group-hover:opacity-30 dark:group-hover:opacity-20 ${bgColorClass}`} />

                    {/* Main Glass Circle */}
                    <div 
                      className={`relative flex h-[128px] w-[128px] items-center justify-center rounded-full border border-[var(--border)] bg-[var(--card)] backdrop-blur-md transition-all duration-500 group-hover:scale-105 ${hoverBorderClass} shadow-md dark:shadow-none`}
                    >
                      {/* Inner Shine (Visible primarily in dark mode) */}
                      <div className="absolute inset-2 rounded-full border border-white/5 bg-gradient-to-br from-white/10 to-transparent opacity-0 dark:opacity-50 transition-opacity" />
                      
                      {/* Icon */}
                      <Icon 
                        size={44} 
                        strokeWidth={1.5} 
                        className={`relative z-10 transition-transform duration-500 group-hover:scale-110 ${textColorClass}`} 
                      />
                    </div>
                  </div>

                  {/* Text Content */}
                  <div className="w-full">
                    <h3 className="mb-3 text-[22px] font-bold tracking-tight text-[var(--foreground)] transition-colors duration-500">
                      {step.title}
                    </h3>
                    <p className="mx-auto max-w-[240px] text-sm font-medium leading-relaxed text-[var(--muted-foreground)] transition-colors duration-500 max-md:mx-0">
                      {step.desc}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

        </div>
        <div className="mt-20 flex justify-center">
            <Link
                href="/contact"
                className="group inline-flex items-center justify-center gap-3 rounded-2xl bg-[var(--primary)] px-8 py-4 text-sm font-black uppercase tracking-widest text-white shadow-xl shadow-[var(--primary)]/20 transition hover:-translate-y-0.5 hover:opacity-90"
            >
                Apply Now
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/15 transition group-hover:translate-x-1">
                <FileEdit className="h-4 w-4" />
                </span>
            </Link>
            </div>
      </div>
    </section>
  );
}