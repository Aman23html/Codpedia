"use client";

import React from "react";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

// Added imageSrc to the data structure for your logos.
// Replace "/placeholder-logo.png" with your actual logo paths (e.g., "/logos/tutor4study.png")
const brands = [
  {
    title: "Tutor4Study",
    desc: "Live online tutoring for Classes 6–12 across all subjects.",
    imageSrc: "/tts.png", 
    accent: "#3b82f6",
    href:"https://www.tutor4study.com/",
    accentRgb: "59, 130, 246",
  },
  {
    title: "Assignments Wallah",
    desc: "Assignment help and research assistance for Master's and PhD students.",
    imageSrc: "/aslogo.png",
    accent: "#f97316",
    href:"https://www.assignmentswallah.com/",
    accentRgb: "249, 115, 22",
  },
  {
    title: "Grades Buddy",
    desc: "Work on real-world projects across research, technology, engineering, management and more.",
    imageSrc: "/grades.webp",
    accent: "#2dd4bf",
    href:"https://gradesbuddy.com/",
    accentRgb: "45, 212, 191",
  },
  {
    title: "Infinite Solutionss",
    desc: "Job support, resume building, interview preparation and upskilling for professionals.",
    imageSrc: "/ifss.png",
    accent: "#60a5fa",
    href:"https://www.assignmentswallah.com/job-support",
    accentRgb: "96, 165, 250",
  },
  {
    title: "Gandharva School Of Music",
    desc: "Inspiring musical journeys through expert online learning.",
    imageSrc: "/gan.png",
    accent: "#a855f7",
    href:"https://www.gandharvaschoolofmusic.com/",
    accentRgb: "168, 85, 247",
  },
];

export default function EcosystemSection() {
  return (
    <section className="relative w-full overflow-hidden bg-[var(--background)] py-16 sm:py-20 lg:py-24 font-sans text-[var(--foreground)] transition-colors duration-500">
      
      {/* Background Effects */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-[size:48px_48px] sm:bg-[size:72px_72px] opacity-[0.14]" />
        <div
          className="absolute inset-0 opacity-[0.08] dark:opacity-30"
          style={{
            backgroundImage: "url('https://www.transparenttextures.com/patterns/stardust.png')",
            backgroundSize: "400px",
          }}
        />

        {/* Ambient Glows */}
        <div id="open-roles" className="absolute -top-[10%] left-[10%] h-[300px] w-[300px] sm:h-[500px] sm:w-[500px] rounded-full bg-[var(--primary)]/10 blur-[90px] sm:blur-[120px]" />
        <div className="absolute right-[10%] top-[5%] h-[250px] w-[250px] sm:h-[400px] sm:w-[400px] rounded-full bg-orange-500/10 blur-[90px] sm:blur-[120px]" />
        <div className="absolute bottom-0 left-1/2 h-[200px] w-[300px] sm:h-[300px] sm:w-[600px] -translate-x-1/2 rounded-full bg-blue-500/10 blur-[100px] sm:blur-[150px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        
        {/* Header Area */}
        <div className="mb-12 flex flex-col items-center text-center sm:mb-16 lg:mb-20">
          <p className="mb-3 text-[14px] sm:text-[16px] lg:text-[20px] font-bold uppercase tracking-[0.2em] sm:tracking-[0.25em] text-orange-500">
            Our Education Ecosystem
          </p>

          <h2 className="mb-4 text-3xl font-black leading-tight tracking-tight text-[var(--foreground)] sm:mb-5 sm:text-4xl md:text-5xl lg:text-6xl">
            Work Across Our <br className="hidden md:block" />
            <span className="bg-gradient-to-r from-[var(--primary)] via-cyan-500 to-blue-500 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(96,165,250,0.2)]">
              Education Ecosystem
            </span>
          </h2>

          <p className="mx-auto max-w-2xl text-sm font-medium leading-relaxed text-[var(--muted-foreground)] sm:text-base">
            Be part of a group of specialized online education brands, each
            dedicated to delivering excellence and transforming lives.
          </p>

          {/* Decorative Divider */}
          <div className="mt-6 flex h-[2px] w-16 sm:mt-8 sm:w-24 overflow-hidden rounded-full opacity-80">
            <div className="h-full w-1/2 bg-[var(--primary)] shadow-[0_0_12px_var(--primary)]" />
            <div className="h-full w-1/2 bg-orange-500 shadow-[0_0_12px_#f97316]" />
          </div>
        </div>

        {/* Brands Grid - Fully Responsive */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 xl:gap-6">
          {brands.map((brand, index) => (
            <div
              key={index}
              className="group relative flex h-full min-h-[340px] sm:min-h-[380px] w-full flex-col rounded-[24px] p-[1.5px] transition-all duration-500 hover:-translate-y-2 sm:hover:-translate-y-3"
              style={{
                "--card-accent": brand.accent,
                "--card-accent-rgb": brand.accentRgb,
              } as React.CSSProperties}
            >
              
              {/* Drop shadow on hover */}
              <div
                className="pointer-events-none absolute inset-0 rounded-[24px] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                style={{
                  boxShadow: "0 15px 40px -10px rgba(var(--card-accent-rgb), 0.4)",
                }}
              />

              {/* Static Border */}
              <div
                className="absolute inset-0 rounded-[24px] transition-opacity duration-500 group-hover:opacity-0"
                style={{
                  border: "1px solid rgba(var(--card-accent-rgb), 0.3)",
                }}
              />

              {/* Spinning Conic Gradient Border Effect */}
              <div className="absolute inset-0 overflow-hidden rounded-[24px] opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                <div
                  className="absolute left-1/2 top-1/2 aspect-square w-[200%] -translate-x-1/2 -translate-y-1/2 animate-[spin_3s_linear_infinite] sm:animate-[spin_1s_linear_infinite]"
                  style={{
                    background: "conic-gradient(from 90deg at 50% 50%, transparent 60%, var(--card-accent) 100%)",
                  }}
                />
              </div>

              {/* Card Inner Content */}
              <div className="relative flex h-full w-full flex-1 flex-col items-center overflow-hidden rounded-[23px] border border-[var(--border)] bg-[var(--card)] px-5 py-7 sm:px-6 sm:py-9 shadow-sm">
                
                {/* Inner Ambient Glow */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 transition-opacity duration-700 group-hover:opacity-100 dark:from-white/5" />

                <div className="flex w-full flex-col items-center">
                  
                  {/* Logo Container */}
                  <div
                    className="relative mb-5 flex h-[64px] w-[64px] sm:mb-6 sm:h-[72px] sm:w-[72px] items-center justify-center overflow-hidden rounded-full transition-all duration-500 group-hover:scale-105 sm:group-hover:scale-110"
                    style={{
                      border: "1px solid rgba(var(--card-accent-rgb), 0.5)",
                      backgroundColor: "rgba(var(--card-accent-rgb), 0.05)",
                      boxShadow: "0 0 20px rgba(var(--card-accent-rgb), 0.15), inset 0 0 15px rgba(var(--card-accent-rgb), 0.1)",
                    }}
                  >
                    {/* The Image replacing the Icon */}
                    <div className="relative h-8 w-8 sm:h-10 sm:w-10">
                      <Image
                        src={brand.imageSrc}
                        alt={`${brand.title} logo`}
                        fill
                        className="object-contain relative z-10 transition-transform duration-500 scale-180 group-hover:scale-110 drop-shadow-sm"
                      />
                    </div>
                  </div>

                  <h3 className="text-center text-base sm:text-lg font-bold tracking-wide text-[var(--foreground)]">
                    {brand.title}
                  </h3>

                  {/* Expanding Underline */}
                  <div
                    className="my-3 sm:my-4 h-[2px] w-6 transition-all duration-500 group-hover:w-12"
                    style={{
                      backgroundColor: "var(--card-accent)",
                      boxShadow: "0 0 8px var(--card-accent)",
                    }}
                  />
                </div>

                {/* Description & Link */}
                <div className="flex w-full flex-1 flex-col items-center justify-between">
                  <p className="mb-5 text-center text-xs sm:text-[13px] font-medium leading-relaxed text-[var(--muted-foreground)]">
                    {brand.desc}
                  </p>

                  <a
                    href={brand.href}
                    className="inline-flex items-center gap-1.5 text-xs sm:text-[13px] font-semibold transition-all duration-300 hover:opacity-80 mt-auto"
                    style={{ color: "var(--card-accent)" }}
                  >
                    Learn More
                    <ArrowRight
                      size={14}
                      className="transition-transform duration-300 group-hover:translate-x-1.5"
                    />
                  </a>
                </div>

              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}