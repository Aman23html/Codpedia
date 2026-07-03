"use client";

import React from "react";
import {
  GraduationCap,
  BookOpen,
  MessageSquareText,
  BriefcaseBusiness,
  Music4,
  ArrowRight,
} from "lucide-react";

const brands = [
  {
    title: "Tutor4Study",
    desc: "Live online tutoring for Classes 6–12 across all subjects.",
    icon: GraduationCap,
    accent: "#3b82f6",
    accentRgb: "59, 130, 246",
  },
  {
    title: "Assignment Wallah",
    desc: "Assignment help and research assistance for Master's and PhD students.",
    icon: BookOpen,
    accent: "#f97316",
    accentRgb: "249, 115, 22",
  },
  {
    title: "Language Education",
    desc: "English, IELTS and global language learning programs.",
    icon: MessageSquareText,
    accent: "#2dd4bf",
    accentRgb: "45, 212, 191",
  },
  {
    title: "Infinite Solution",
    desc: "Job support, resume building, interview preparation and upskilling for professionals.",
    icon: BriefcaseBusiness,
    accent: "#60a5fa",
    accentRgb: "96, 165, 250",
  },
  {
    title: "Gandharva School Of Music",
    desc: "Inspiring musical journeys through expert online learning.",
    icon: Music4,
    accent: "#a855f7",
    accentRgb: "168, 85, 247",
  },
];

export default function EcosystemSection() {
  return (
    <section className="relative w-full overflow-hidden bg-[var(--background)] py-24 font-sans text-[var(--foreground)] transition-colors duration-500">
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-[size:72px_72px] opacity-[0.14]" />
        <div
          className="absolute inset-0 opacity-[0.08] dark:opacity-30"
          style={{
            backgroundImage:
              "url('https://www.transparenttextures.com/patterns/stardust.png')",
            backgroundSize: "400px",
          }}
        />

        <div id="open-roles" className="absolute -top-[10%] left-[10%] h-[500px] w-[500px] rounded-full bg-[var(--primary)]/10 blur-[120px]" />
        <div className="absolute right-[10%] top-[5%] h-[400px] w-[400px] rounded-full bg-orange-500/10 blur-[120px]" />
        <div className="absolute bottom-0 left-1/2 h-[300px] w-[600px] -translate-x-1/2 rounded-full bg-blue-500/10 blur-[150px]" />
      </div>

      <div  className="relative z-10 mx-auto max-w-[1440px] px-6 lg:px-8">
        <div className="mb-20 flex flex-col items-center text-center">
          <p className="mb-5 text-[20px] font-bold uppercase tracking-[0.25em] text-orange-500">
            Our Education Ecosystem
          </p>

          <h2 className="mb-5 text-4xl font-black leading-tight tracking-tight text-[var(--foreground)] md:text-5xl lg:text-6xl">
            Work Across Our <br className="hidden md:block" />
            <span className="bg-gradient-to-r from-[var(--primary)] via-cyan-500 to-blue-500 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(96,165,250,0.2)]">
              Education Ecosystem
            </span>
          </h2>

          <p className="mx-auto max-w-2xl text-base font-medium leading-relaxed text-[var(--muted-foreground)]">
            Be part of a group of specialized online education brands, each
            dedicated to delivering excellence and transforming lives.
          </p>

          <div className="mt-8 flex h-[2px] w-24 overflow-hidden rounded-full opacity-80">
            <div className="h-full w-1/2 bg-[var(--primary)] shadow-[0_0_12px_var(--primary)]" />
            <div className="h-full w-1/2 bg-orange-500 shadow-[0_0_12px_#f97316]" />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-5 xl:gap-8">
          {brands.map((brand, index) => (
            <div
              key={index}
              className="group relative flex h-[380px] w-full flex-col rounded-[24px] p-[1.5px] transition-all duration-500 hover:-translate-y-3"
              style={
                {
                  "--card-accent": brand.accent,
                  "--card-accent-rgb": brand.accentRgb,
                } as React.CSSProperties
              }
            >
              <div
                className="pointer-events-none absolute inset-0 rounded-[24px] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                style={{
                  boxShadow:
                    "0 15px 40px -10px rgba(var(--card-accent-rgb), 0.4)",
                }}
              />

              <div
                className="absolute inset-0 rounded-[24px] transition-opacity duration-500 group-hover:opacity-0"
                style={{
                  border: "1px solid rgba(var(--card-accent-rgb), 0.3)",
                }}
              />

              <div className="absolute inset-0 overflow-hidden rounded-[24px] opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                <div
                  className="absolute left-1/2 top-1/2 aspect-square w-[200%] -translate-x-1/2 -translate-y-1/2 animate-[spin_1
                  s_linear_infinite]"
                  style={{
                    background:
                      "conic-gradient(from 90deg at 50% 50%, transparent 60%, var(--card-accent) 100%)",
                  }}
                />
              </div>

              <div className="relative flex h-full w-full flex-col items-center justify-between overflow-hidden rounded-[23px] border border-[var(--border)] bg-[var(--card)] px-6 py-9 shadow-sm">
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 transition-opacity duration-700 group-hover:opacity-100 dark:from-white/5" />

                <div className="flex w-full flex-col items-center">
                  <div
                    className="relative mb-6 flex h-[72px] w-[72px] items-center justify-center rounded-full transition-all duration-500 group-hover:scale-110"
                    style={{
                      border: "1px solid rgba(var(--card-accent-rgb), 0.5)",
                      backgroundColor: "rgba(var(--card-accent-rgb), 0.05)",
                      boxShadow:
                        "0 0 20px rgba(var(--card-accent-rgb), 0.15), inset 0 0 15px rgba(var(--card-accent-rgb), 0.1)",
                    }}
                  >
                    <brand.icon
                      size={30}
                      style={{ color: "var(--card-accent)" }}
                      className="relative z-10 transition-transform duration-500 group-hover:animate-pulse"
                    />
                  </div>

                  <h3 className="text-center text-lg font-bold tracking-wide text-[var(--foreground)]">
                    {brand.title}
                  </h3>

                  <div
                    className="my-4 h-[2px] w-6 transition-all duration-500 group-hover:w-12"
                    style={{
                      backgroundColor: "var(--card-accent)",
                      boxShadow: "0 0 8px var(--card-accent)",
                    }}
                  />
                </div>

                <div className="flex w-full flex-col items-center">
                  <p className="mb-6 text-center text-[13px] font-medium leading-relaxed text-[var(--muted-foreground)]">
                    {brand.desc}
                  </p>

                  <a
                    href="#"
                    className="inline-flex items-center gap-1.5 text-[13px] font-semibold transition-all duration-300 hover:opacity-80"
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