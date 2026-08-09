"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";

import OwnerSidebar from "@/components/owner/owner-sidebar";

export default function MobileOwnerSidebar() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  // Prevent hydration mismatch: only render the portal on the client-side
  useEffect(() => {
    setMounted(true);
  }, []);

  // Close the mobile sidebar when a link is clicked
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Prevent background scrolling when the drawer is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [open]);

  return (
    <>
      {/* ========================================== */}
      {/* MENU BUTTON (Stays inside the Header)      */}
      {/* ========================================== */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open navigation menu"
        aria-expanded={open}
        className="
          flex h-9 w-9 shrink-0
          items-center justify-center
          rounded-md
          text-[var(--muted-foreground)]
          transition-colors
          hover:bg-[var(--card)]
          hover:text-[var(--foreground)]
          focus-visible:outline-none
          focus-visible:ring-2
          focus-visible:ring-[var(--primary)]
        "
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* ========================================== */}
      {/* PORTAL DRAWER (Teleports to document body) */}
      {/* ========================================== */}
      {mounted &&
        createPortal(
          <AnimatePresence>
            {open && (
              // Wrapper with extreme z-index to guarantee it's on top
              <div className="fixed inset-0 z-[99999] md:hidden">
                
                {/* Overlay */}
                <motion.button
                  type="button"
                  aria-label="Close navigation menu"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => setOpen(false)}
                  className="
                    fixed inset-0 z-[1]
                    cursor-default
                    bg-black/60
                    backdrop-blur-sm
                    w-full h-full
                  "
                />

                {/* Drawer */}
                <motion.aside
                  initial={{ x: "-100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "-100%" }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 30,
                  }}
                  className="
                    fixed
                    inset-y-0
                    left-0
                    z-[2]
                    w-[280px]
                    max-w-[85vw]
                    bg-[var(--background)]
                    shadow-2xl
                  "
                >
                  {/* Close button */}
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    aria-label="Close navigation menu"
                    className="
                      absolute
                      right-3
                      top-3
                      z-50
                      flex
                      h-9
                      w-9
                      items-center
                      justify-center
                      rounded-lg
                      border
                      border-[var(--border)]
                      bg-[var(--card)]
                      text-[var(--muted-foreground)]
                      transition-colors
                      hover:bg-[var(--muted)]
                      hover:text-[var(--foreground)]
                      focus-visible:outline-none
                      focus-visible:ring-2
                      focus-visible:ring-[var(--primary)]
                    "
                  >
                    <X className="h-4 w-4" />
                  </button>

                  {/* Sidebar Content */}
                  <div className="h-full w-full">
                    <OwnerSidebar />
                  </div>
                </motion.aside>
              </div>
            )}
          </AnimatePresence>,
          document.body // This renders the drawer entirely outside of your layout constraints!
        )}
    </>
  );
}