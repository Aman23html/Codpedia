"use client";

import React from 'react';
import { motion } from "framer-motion";
import { GraduationCap, Library, PenTool, Music4 } from "lucide-react";

import { useTheme } from "next-themes";
import { themeAssets } from "@/lib/theme-assets";



export default function Heroleft() {
  const { resolvedTheme } = useTheme();

  const assets =
    resolvedTheme === "dark"
      ? themeAssets.dark
      : themeAssets.light;
  return (
    <div className="hidden lg:flex relative w-full h-full min-h-[200px] items-center justify-center overflow-visible z-10">
      
      {/* Deep Ambient Background Glow (Theme Aware) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0">
        <div className="w-[600px] h-[600px] rounded-full bg-[var(--primary)]/10 dark:bg-[var(--primary)]/15 blur-[130px] mix-blend-normal dark:mix-blend-screen transition-colors duration-500" />
      </div>

      {/* ========================================== */}
      {/* MAIN VIDEO DISPLAY CONTAINER               */}
      {/* ========================================== */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1.3, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="relative w-full max-w-[800px] aspect-[16/9] z-10 flex items-center justify-center pointer-events-none"
      >
        {/* Using a CSS mask to feather the edges so the video seamlessly merges into the background without any frame */}
        <div 
          className="relative w-full h-full"
          style={{
            WebkitMaskImage: 'radial-gradient(ellipse at center, black 40%, transparent 80%)',
            maskImage: 'radial-gradient(ellipse at center, black 40%, transparent 80%)'
          }}
        >
          <video 
            src={assets.heroVideo}
            autoPlay 
            loop 
            muted 
            playsInline
            // Switches from multiply (light mode) to screen (dark mode)
            className="w-full h-full object-cover opacity-60 dark:opacity-90 mix-blend-multiply dark:mix-blend-screen transition-all duration-500"
          ></video>
        </div>
      </motion.div>

      {/* ========================================== */}
      {/* FLOATING UI ICONS (Theme Aware)            */}
      {/* ========================================== */}
      
      {/* Floating Graduation Cap (Top Right) */}
      <motion.div
        animate={{ y: [0, -12, 0], rotate: [-5, 4, -5] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[10%] -right-[5%] z-30"
      >
        <div className="p-3.5 bg-white/80 dark:bg-[var(--card)]/80 border border-slate-200 dark:border-[var(--border)] backdrop-blur-md rounded-[18px] shadow-xl dark:shadow-2xl transition-colors duration-500">
          <GraduationCap className="w-8 h-8 text-blue-600 dark:text-[var(--primary)] transition-colors duration-500" strokeWidth={1.5} />
        </div>
      </motion.div>

      {/* Floating Stack of Books (Bottom Right) */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-[15%] -right-[2%] z-30"
      >
        <div className="p-3 bg-white/80 dark:bg-[var(--card)]/80 border border-slate-200 dark:border-[var(--border)] backdrop-blur-md rounded-2xl shadow-xl dark:shadow-2xl transition-colors duration-500">
          <Library className="w-6 h-6 text-orange-500 dark:text-[var(--secondary)] transition-colors duration-500" strokeWidth={1.5} />
        </div>
      </motion.div>

      {/* Floating Pen (Bottom Left) */}
      <motion.div
        animate={{ y: [0, -8, 0], x: [0, 4, 0] }}
        transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        className="absolute bottom-[20%] -left-[5%] z-30"
      >
        <div className="p-3.5 bg-white/80 dark:bg-[var(--card)]/80 border border-slate-200 dark:border-[var(--border)] backdrop-blur-md rounded-2xl shadow-xl dark:shadow-2xl transition-colors duration-500">
          <PenTool className="w-7 h-7 text-cyan-500 dark:text-cyan-400 transition-colors duration-500" strokeWidth={1.5} />
        </div>
      </motion.div>

      {/* Floating Music Note (Top Left) */}
      <motion.div
        animate={{
          y: [0, -15, 0],
          rotate: [-8, 6, -8],
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.8,
        }}
        className="absolute top-[12%] -left-[4%] z-30"
      >
        <div className="p-3.5 bg-white/80 dark:bg-[var(--card)]/80 border border-slate-200 dark:border-[var(--border)] backdrop-blur-md rounded-2xl shadow-xl dark:shadow-2xl transition-colors duration-500">
          <Music4
            className="w-7 h-7 text-pink-500 dark:text-pink-400 transition-colors duration-500"
            strokeWidth={1.5}
          />
        </div>
      </motion.div>

    </div>
  );
}