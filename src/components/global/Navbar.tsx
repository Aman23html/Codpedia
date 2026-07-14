"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Menu, X, BookOpen, GraduationCap, Languages, Briefcase, Music } from "lucide-react";
import { usePathname } from "next/navigation";
import ThemeToggle from "@/components/shared/theme-toggle"; 
import Logo from "./Logo";

const ecosystemBrands = [
  { name: "Tutor4Study", icon: BookOpen, href: "https://www.tutor4study.com/" },
  { name: "Assignments wallah", icon: GraduationCap, href: "https://www.assignmentswallah.com/" },
  { name: "Grades Buddy", icon: Languages, href: "https://www.assignmentswallah.com/branch/languages-homework-help" },
  { name: "Infinte Solution", icon: Briefcase, href: "https://www.assignmentswallah.com/job-support" },
  { name: "Gandharva School Of Music", icon: Music, href: "https://www.gandharvaschoolofmusic.com/" },
];

// Reusable glowing flare component for the active/hover state
const NavGlow = ({ isActive }: { isActive: boolean }) => (
  <span
    className={` absolute -bottom-1.5 left-1/2 w-full -translate-x-1/2 flex items-center justify-center transition-all duration-300 pointer-events-none ${
      isActive ? "opacity-100 animate-pulse" : "opacity-0 group-hover:opacity-100 "
    }`}
  >
    {/* Soft wide gradient fade */}
    <span className="absolute h-[1px] w-[140%] bg-gradient-to-r from-transparent via-[var(--secondary)] to-transparent opacity-80" />
    {/* Intense bright center core */}
    <span className="absolute h-[1px] w-[40%] bg-[var(--secondary)] shadow-[0_0_15px_3px_var(--secondary)] rounded-full " />
  </span>
);

export default function Navbar() {
  const pathname = usePathname();
  const [activeDropdown, setActiveDropdown] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [scrolled, setScrolled] = useState(false);

  // Add a subtle bottom border when scrolling (Enterprise standard)
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Prevent background scrolling when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [mobileMenuOpen]);

  // Helper to determine link styles
  const getLinkClasses = (path: string) => {
    const isActive = pathname === path;
    return `relative group flex items-center text-sm font-medium transition-colors py-1 whitespace-nowrap ${
      isActive ? "text-[var(--foreground)]" : "text-[var(--foreground)]/80 hover:text-[var(--foreground)]"
    }`;
  };

  return (
    <nav 
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled 
          ? "bg-[var(--background)]/90 backdrop-blur-md border-b border-[var(--border)] shadow-sm py-2 sm:py-3" 
          : "bg-transparent py-4 sm:py-5"
      }`}
    >
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12 flex items-center justify-between">
        
        {/* 1. Logo Section */}
        <a href="/">
          <div className="flex-shrink-0 cursor-pointer z-50">
          <Logo />
        </div>
        </a>

        {/* 2. Desktop Navigation Links */}
        <div className="hidden lg:flex items-center justify-center space-x-8 xl:space-x-12 flex-1 px-4">
          
          <a href="/" className={getLinkClasses("/")}>
            Home
            <NavGlow isActive={pathname === "/"} />
          </a>
          
          <a href="/about" className={getLinkClasses("/about")}>
            About
            <NavGlow isActive={pathname === "/about"} />
          </a>

          {/* Clean Dropdown Trigger */}
          <div 
            className="relative"
            onMouseEnter={() => setActiveDropdown(true)}
            onMouseLeave={() => setActiveDropdown(false)}
          >
            <button className={`relative group flex items-center gap-1.5 text-sm font-medium transition-colors py-1 whitespace-nowrap ${activeDropdown ? "text-[var(--foreground)]" : "text-[var(--foreground)]/80 hover:text-[var(--foreground)]"}`}>
              Our Brands 
              <motion.div
                animate={{ rotate: activeDropdown ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown className="w-3.5 h-3.5 opacity-70" />
              </motion.div>
              <NavGlow isActive={activeDropdown} />
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
                         target="_blank"
                        rel="noopener noreferrer"
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

          <a href="/careers" className={getLinkClasses("/careers")}>
            Careers
            <NavGlow isActive={pathname === "/careers"} />
          </a>
          
          <a href="/contact" className={getLinkClasses("/contact")}>
            Contact
            <NavGlow isActive={pathname === "/contact"} />
          </a>
        </div>

        {/* 3. Right Action Area (Theme Toggle, Workspace & CTA) */}
        <div className="hidden lg:flex items-center gap-3 xl:gap-5 flex-shrink-0">
          <ThemeToggle />
          
          {/* Desktop Workspace Link */}
          <a
            href="/login"
            className="
              px-5 xl:px-6 py-2.5
              rounded-full
              text-sm font-semibold 
              bg-[var(--foreground)] text-[var(--background)]
              hover:opacity-90 hover:scale-[1.02]
              active:scale-[0.98]
              transition-all duration-200
              shadow-md
              whitespace-nowrap
            "
          >
            Codpedia Workspace
          </a>
          
         
        </div>

        {/* Mobile Menu Toggle */}
        <div className="lg:hidden flex items-center gap-3 sm:gap-4 z-50">
          <ThemeToggle />
          <button 
            className="p-2 -mr-2 text-[var(--foreground)] focus:outline-none"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="lg:hidden absolute top-full left-0 w-full bg-[var(--background)] border-b border-[var(--border)] shadow-xl max-h-[calc(100vh-4rem)] overflow-y-auto"
          >
            <div className="px-4 sm:px-6 py-6 flex flex-col gap-6 pb-8">
              <a href="/" onClick={() => setMobileMenuOpen(false)} className={`text-lg font-medium ${pathname === "/" ? "text-[var(--secondary)]" : ""}`}>Home</a>
              <a href="/about" onClick={() => setMobileMenuOpen(false)} className={`text-lg font-medium ${pathname === "/about" ? "text-[var(--secondary)]" : ""}`}>About</a>
              
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
              
              <a href="/careers" onClick={() => setMobileMenuOpen(false)} className={`text-lg font-medium ${pathname === "/careers" ? "text-[var(--secondary)]" : ""}`}>Careers</a>
              <a href="/contact" onClick={() => setMobileMenuOpen(false)} className={`text-lg font-medium ${pathname === "/contact" ? "text-[var(--secondary)]" : ""}`}>Contact</a>
              
              {/* Mobile Primary Actions Stack */}
              <div className="flex flex-col gap-3 mt-2">
                <a 
                  href="/login" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-3 rounded-xl text-center text-base font-semibold border border-[var(--border)] text-[var(--foreground)] hover:bg-[var(--foreground)]/[0.03] transition-colors"
                >
                  Codpedia Workspace
                </a>
                
                
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}