"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Menu, X, BookOpen, GraduationCap, Languages, Briefcase } from "lucide-react";
import ThemeToggle from "@/components/shared/theme-toggle"; 
import Logo from "./Logo";

const ecosystemBrands = [
  { name: "Assignment Wallah", icon: BookOpen, href: "#k12" },
  { name: "Grades Buddy", icon: GraduationCap, href: "#research" },
  { name: "ZenZlearn", icon: Languages, href: "#language" },
  { name: "Career Growth", icon: Briefcase, href: "#career" },
];

export default function Navbar() {
  const [activeDropdown, setActiveDropdown] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [scrolled, setScrolled] = useState(false);

  // Add a subtle bottom border when scrolling (Enterprise standard)
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav 
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled 
          ? "bg-[var(--background)]/90 backdrop-blur-md border-b border-[var(--border)] shadow-sm py-3" 
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 flex items-center justify-between">
        
        {/* 1. Logo Section */}
        <div className="flex-shrink-0 cursor-pointer">
          <Logo />
        </div>

        {/* 2. Desktop Navigation Links (Centered, clean spacing) */}
        <div className="hidden lg:flex items-center justify-center space-x-10 flex-1">
          <a href="#home" className="text-sm font-medium text-[var(--foreground)]/80 hover:text-[var(--foreground)] transition-colors">Home</a>
          
          <a href="#about" className="text-sm font-medium text-[var(--foreground)]/80 hover:text-[var(--foreground)] transition-colors">About</a>

          {/* Clean Dropdown Trigger */}
          <div 
            className="relative"
            onMouseEnter={() => setActiveDropdown(true)}
            onMouseLeave={() => setActiveDropdown(false)}
          >
            <button className="flex items-center gap-1.5 text-sm font-medium text-[var(--foreground)]/80 hover:text-[var(--foreground)] transition-colors py-2">
              Our Brands 
              <motion.div
                animate={{ rotate: activeDropdown ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown className="w-3.5 h-3.5 opacity-70" />
              </motion.div>
            </button>

            {/* Minimalist Dropdown Menu */}
            <AnimatePresence>
              {activeDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                  transition={{ duration: 0.15 }}
                  className="absolute left-1/2 -translate-x-1/2 mt-1 w-[280px] bg-[var(--card)] border border-[var(--border)] rounded-xl shadow-xl overflow-hidden py-2"
                >
                  {ecosystemBrands.map((brand, idx) => {
                    const Icon = brand.icon;
                    return (
                      <a
                        key={idx}
                        href={brand.href}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-[var(--foreground)]/5 group transition-colors"
                      >
                        <div className="flex items-center justify-center w-8 h-8 rounded-md bg-[var(--foreground)]/5 group-hover:bg-[var(--primary)]/10 group-hover:text-[var(--primary)] text-[var(--foreground)]/60 transition-colors">
                            <Icon className="w-4 h-4" />
                        </div>
                        <span className="text-sm font-medium text-[var(--foreground)]/80 group-hover:text-[var(--foreground)] transition-colors">
                            {brand.name}
                        </span>
                      </a>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <a href="/careers" className="text-sm font-medium text-[var(--foreground)]/80 hover:text-[var(--foreground)] transition-colors">Careers</a>
          <a href="#contact" className="text-sm font-medium text-[var(--foreground)]/80 hover:text-[var(--foreground)] transition-colors">Contact</a>
        </div>

        {/* 3. Right Action Area (Theme Toggle & CTA) */}
        <div className="hidden lg:flex items-center gap-6 flex-shrink-0">
          <ThemeToggle />
          
          <button
            className="
              px-6 py-2.5
              rounded-full
              text-sm font-semibold 
              bg-[var(--foreground)] text-[var(--background)]
              hover:opacity-90 hover:scale-[1.02]
              active:scale-[0.98]
              transition-all duration-200
              shadow-md
            "
          >
            Partner With Us
          </button>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="lg:hidden flex items-center gap-4">
          <ThemeToggle />
          <button 
            className="p-2 -mr-2 text-[var(--foreground)]"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer (Clean styling) */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="lg:hidden absolute top-full left-0 w-full bg-[var(--background)] border-b border-[var(--border)] shadow-xl"
          >
            <div className="px-6 py-6 flex flex-col gap-6">
              <a href="#home" onClick={() => setMobileMenuOpen(false)} className="text-lg font-medium">Home</a>
              <a href="#about" onClick={() => setMobileMenuOpen(false)} className="text-lg font-medium">About</a>
              
              <div className="flex flex-col gap-3">
                <span className="text-sm font-semibold text-[var(--foreground)]/50 uppercase tracking-wider">Our Brands</span>
                <div className="flex flex-col gap-4 pl-4 border-l-2 border-[var(--border)]">
                  {ecosystemBrands.map((brand, idx) => (
                    <a key={idx} href={brand.href} onClick={() => setMobileMenuOpen(false)} className="text-base font-medium flex items-center gap-3">
                      <brand.icon className="w-4 h-4 text-[var(--primary)]" />
                      {brand.name}
                    </a>
                  ))}
                </div>
              </div>
              
              <a href="/careers" onClick={() => setMobileMenuOpen(false)} className="text-lg font-medium">Careers</a>
              <a href="#contact" onClick={() => setMobileMenuOpen(false)} className="text-lg font-medium">Contact</a>
              
              <button className="w-full mt-4 py-3.5 rounded-xl text-base font-semibold bg-[var(--foreground)] text-[var(--background)]">
                Partner With Us
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}