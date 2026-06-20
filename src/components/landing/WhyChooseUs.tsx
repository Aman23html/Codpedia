"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  GraduationCap, 
  Globe2, 
  FileSearch, 
  Briefcase, 
  Layers, 
  ShieldCheck 
} from 'lucide-react';

const WhyChooseUs: React.FC = () => {
  // Track which card is hovered to dynamically update the right-side visual
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Notice: Icons now use var(--primary) to automatically switch between Light/Dark blue
  const features = [
    {
      title: "Multi-disciplinary Expertise",
      description: "A diverse team of academic and industry experts delivering high-quality solutions across multiple domains.",
      icon: <GraduationCap className="w-6 h-6 text-[var(--primary)]" strokeWidth={1.5} />,
      gradient: "from-blue-500/20 to-transparent",
    },
    {
      title: "International Student Support",
      description: "Dedicated support for international learners across different time zones and educational systems.",
      icon: <Globe2 className="w-6 h-6 text-[var(--primary)]" strokeWidth={1.5} />,
      gradient: "from-cyan-500/20 to-transparent",
    },
    {
      title: "Research & Academic Specialists",
      description: "Subject matter experts with advanced degrees providing accurate, reliable and original academic support.",
      icon: <FileSearch className="w-6 h-6 text-[var(--primary)]" strokeWidth={1.5} />,
      gradient: "from-emerald-500/20 to-transparent",
    },
    {
      title: "Career-focused Learning",
      description: "Programs and support services designed to help learners achieve academic and professional success.",
      icon: <Briefcase className="w-6 h-6 text-[var(--primary)]" strokeWidth={1.5} />,
      gradient: "from-orange-500/20 to-transparent",
    },
    {
      title: "Scalable & Flexible Solutions",
      description: "Customizable solutions for students, institutions and businesses—designed to scale with your needs.",
      icon: <Layers className="w-6 h-6 text-[var(--primary)]" strokeWidth={1.5} />,
      gradient: "from-purple-500/20 to-transparent",
    },
    {
      title: "Quality, Integrity & Confidentiality",
      description: "We maintain the highest standards of quality, academic integrity and data security in everything we do.",
      icon: <ShieldCheck className="w-6 h-6 text-[var(--primary)]" strokeWidth={1.5} />,
      gradient: "from-rose-500/20 to-transparent",
    }
  ];

  return (
    // Background uses var(--background)
    <section className="relative py-24 bg-[var(--background)] px-6 md:px-12 lg:px-24 font-sans overflow-hidden transition-colors duration-500">
      
      {/* Background Ambient Glow - Theme Aware */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-[var(--primary)]/10 dark:bg-[var(--primary)]/20 blur-[120px] rounded-full pointer-events-none -z-10 mix-blend-normal dark:mix-blend-screen transition-colors duration-500" />

      <div className="max-w-[1300px] mx-auto">
        
        {/* Header Section */}
        <div className="text-center mb-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex flex-col items-center"
          >
            <h4 className="text-[var(--secondary)] text-xs font-bold tracking-[0.2em] uppercase mb-4 transition-colors duration-500">
              Why Choose Us
            </h4>
            <h2 className="text-4xl md:text-5xl font-bold text-[var(--foreground)] mb-6 tracking-tight transition-colors duration-500">
              Why Choose <span className="text-[var(--primary)]">Our Ecosystem?</span>
            </h2>
            <p className="text-[var(--muted-foreground)] max-w-2xl mx-auto text-base md:text-lg transition-colors duration-500">
              We combine academic excellence, professional expertise and innovative solutions to help learners, researchers and professionals succeed.
            </p>
          </motion.div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Left Side - Feature Cards (Spans 7 columns) */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                // Card backgrounds and borders are theme-aware
                className="group relative p-6 rounded-2xl bg-[var(--card)] border border-[var(--border)] shadow-md hover:shadow-xl dark:shadow-none hover:border-[var(--primary)]/40 transition-all duration-500 cursor-pointer overflow-hidden"
              >
                {/* Dynamic Background Hover Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                
                <div className="relative z-10">
                  {/* Icon Box */}
                  <div className="w-12 h-12 rounded-xl bg-[var(--background)] border border-[var(--border)] flex items-center justify-center mb-5 group-hover:scale-110 group-hover:border-[var(--primary)]/50 transition-all duration-300 shadow-sm dark:shadow-[inset_0_0_15px_rgba(0,102,255,0.1)]">
                    {feature.icon}
                  </div>
                  
                  {/* Text Content */}
                  <h3 className="text-lg font-bold text-[var(--card-foreground)] mb-2 group-hover:text-[var(--primary)] transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-[var(--muted-foreground)] leading-relaxed group-hover:text-[var(--foreground)]/90 transition-colors duration-300 line-clamp-4">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Right Side - Visual Image (Spans 5 columns) */}
          <div className="lg:col-span-5 lg:sticky lg:top-32 relative h-[450px] lg:h-[600px] w-full rounded-3xl overflow-hidden group">
            
            {/* Animated Glow Behind Image Container */}
            <div className="absolute -inset-0.5 bg-gradient-to-b from-[var(--primary)]/30 via-transparent to-[var(--secondary)]/20 rounded-3xl blur-md opacity-60 transition-colors duration-500" />
            
            {/* Image Wrapper */}
            <div className="relative w-full h-full rounded-3xl bg-[var(--card)] border border-[var(--border)] overflow-hidden flex items-center justify-center shadow-xl dark:shadow-2xl transition-colors duration-500">
              
              <motion.img 
                src="/Wcu.png" 
                alt="Codepedia Ecosystem Platform" 
                className="w-full h-full object-cover opacity-90 dark:opacity-80"
                animate={{ 
                  scale: hoveredIndex !== null ? 1.05 : 1,
                  opacity: hoveredIndex !== null ? 1 : 0.9
                }}
                transition={{ duration: 0.7, ease: "easeOut" }}
              />

              {/* Dynamic Overlay that subtly shifts color based on which card is hovered */}
              <AnimatePresence>
                {hoveredIndex !== null && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    // Use normal blend in light mode, overlay in dark mode to prevent washing out
                    className={`absolute inset-0 bg-gradient-to-t ${features[hoveredIndex].gradient} mix-blend-normal dark:mix-blend-overlay`}
                  />
                )}
              </AnimatePresence>

              {/* Permanent Bottom Fade - Uses var(--card) to seamlessly blend into its own container
              <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[var(--card)] to-transparent opacity-100 transition-colors duration-500" /> */}
              
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;