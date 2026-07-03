"use client";

import React from "react";
import {
  ArrowRight,
  Users,
  ShieldCheck,
  GraduationCap,
  BrainCircuit,
  Sparkles,
} from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative w-full overflow-hidden bg-[var(--background)] py-20 text-[var(--foreground)] transition-colors duration-500 lg:py-32">
      {/* Background Textures & Glows */}
      <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-[size:72px_72px] opacity-[0.14]" />
      <div className="absolute left-[-12%] top-[10%] h-[520px] w-[520px] rounded-full bg-[var(--primary)]/15 blur-[140px]" />
      <div className="absolute right-[-10%] top-[25%] h-[520px] w-[520px] rounded-full bg-orange-500/10 blur-[150px]" />

      <div className="relative z-10 mx-auto max-w-[1320px] px-6 lg:px-12">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          
          {/* Left Content Area (Text & CTAs) */}
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-[var(--primary)]/20 bg-[var(--primary)]/10 px-4 py-2 text-[11px] font-black uppercase tracking-widest text-[var(--primary)] backdrop-blur-sm">
              {/* <Sparkles className="h-3.5 w-3.5" /> */}
              Careers at Codepedia Solutions
            </div>

            <h1 className="text-5xl font-black leading-[1.05] tracking-tight md:text-7xl">
              Shape the Future of{" "}
              <span className="bg-gradient-to-r from-[var(--primary)] via-cyan-500 to-orange-500 bg-clip-text text-transparent">
                Online Learning
              </span>
            </h1>

            <p className="max-w-xl text-lg font-medium leading-8 text-[var(--muted-foreground)]">
              Join Codepedia Solutions and become part of a global team
              empowering students, researchers, professionals, and lifelong
              learners through innovative online education brands.
            </p>

            <div className="flex flex-wrap gap-4">
              <a
                href="#open-roles"
                className="group inline-flex items-center gap-2 rounded-2xl bg-[var(--primary)] px-8 py-4 text-sm font-black uppercase tracking-widest text-white shadow-xl shadow-[var(--primary)]/20 transition-all hover:-translate-y-1 hover:shadow-[var(--primary)]/30"
              >
                View Opportunities
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </a>

              <a
                href="#talent-network"
                className="group inline-flex items-center gap-2 rounded-2xl border border-[var(--border)] bg-[var(--card)] px-8 py-4 text-sm font-black uppercase tracking-widest text-[var(--muted-foreground)] transition-all hover:-translate-y-1 hover:border-[var(--primary)]/50 hover:text-[var(--foreground)]"
              >
                Join Talent Network
                <Users className="h-4 w-4 transition-transform group-hover:scale-110" />
              </a>
            </div>

            <div className="grid gap-5 border-t border-[var(--border)] pt-8 sm:grid-cols-2">
              <div className="flex items-center gap-4 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 shadow-sm transition-colors hover:border-[var(--primary)]/30">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[var(--primary)]/10 text-[var(--primary)]">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <div>
                  <div className="text-sm font-black text-[var(--foreground)]">
                    Government Registered
                  </div>
                  <div className="mt-1 text-[10px] font-bold uppercase tracking-widest text-[var(--muted-foreground)]">
                    Trusted Company
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 shadow-sm transition-colors hover:border-[var(--primary)]/30">
                <div className="text-3xl font-black text-[var(--primary)]">
                  5+
                </div>
                <div className="mt-1 text-[10px] font-bold uppercase tracking-widest text-[var(--muted-foreground)]">
                  Online Education Brands
                </div>
              </div>
            </div>
          </div>

          {/* Right Visual Area (Advanced Image Grid) */}
          <div className="relative hidden h-[600px] w-full lg:block">
            {/* Soft backdrop glow specifically for the grid */}
            <div className="absolute inset-0 top-1/2 left-1/2 h-[80%] w-[80%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--primary)]/10 blur-[100px]" />

            {/* Advanced Glassmorphic Frame */}
            <div className="relative h-full w-full rounded-[2.5rem] border border-[var(--border)] bg-[var(--card)]/40 p-4 shadow-2xl backdrop-blur-xl">
              
              {/* Asymmetric CSS Grid Layout */}
              <div className="grid h-full w-full grid-cols-12 grid-rows-2 gap-4">
                
                {/* Main Large Image (Left Side of Grid) */}
                <div className="group relative col-span-7 row-span-2 overflow-hidden rounded-[1.75rem] border border-[var(--border)] bg-[var(--muted)]/50">
                  {/* Replace src with your image */}
                  <img
                    src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop"
                    alt="Team collaboration"
                    className="h-full w-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-105"
                  />
                  {/* Subtle overlay gradient for professional depth */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                </div>

                {/* Top Right Smaller Image */}
                <div className="group relative col-span-5 row-span-1 overflow-hidden rounded-[1.5rem] border border-[var(--border)] bg-[var(--muted)]/50">
                  {/* Replace src with your image */}
                  <img
                    src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070&auto=format&fit=crop"
                    alt="Online learning"
                    className="h-full w-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-105"
                  />
                </div>

                {/* Bottom Right Smaller Image */}
                <div className="group relative col-span-5 row-span-1 overflow-hidden rounded-[1.5rem] border border-[var(--border)] bg-[var(--muted)]/50">
                  {/* Replace src with your image */}
                  <img
                    src="https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=2070&auto=format&fit=crop"
                    alt="Technology focus"
                    className="h-full w-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-105"
                  />
                </div>
              </div>

              {/* Floating UI Badges (Kept for design depth, repositioned for grid) */}
              <div className="absolute -left-6 top-12 flex items-center gap-3 rounded-2xl border border-[var(--border)] bg-[var(--background)]/90 p-3.5 shadow-2xl backdrop-blur-xl transition-transform hover:-translate-y-1">
                <div className="rounded-xl bg-[var(--primary)]/10 p-2 text-[var(--primary)]">
                  <GraduationCap className="h-5 w-5" />
                </div>
                <div className="pr-2 text-[10px] font-black uppercase tracking-widest text-[var(--foreground)]">
                  Online
                  <br />
                  Learning
                </div>
              </div>

              <div className="absolute -right-6 bottom-24 flex items-center gap-3 rounded-2xl border border-[var(--border)] bg-[var(--background)]/90 p-3.5 shadow-2xl backdrop-blur-xl transition-transform hover:-translate-y-1">
                <div className="rounded-xl bg-orange-500/10 p-2 text-orange-500">
                  <BrainCircuit className="h-5 w-5" />
                </div>
                <div className="pr-2 text-[10px] font-black uppercase tracking-widest text-[var(--foreground)]">
                  Powered
                  <br />
                  Learning
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}