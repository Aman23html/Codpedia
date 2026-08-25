"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { logout } from "@/actions/auth/logout";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { 
  LayoutDashboard, 
  Building2, 
  Users, 
  LineChart, 
  ShieldAlert,
  LogOut,
  Loader2,
  Settings,
  ChevronRight
} from "lucide-react";

// Contextual icons mapped to your routes
const links = [
  {
    name: "Dashboard",
    href: "/owner",
    icon: LayoutDashboard,
  },
  {
    name: "Departments",
    href: "/owner/departments",
    icon: Building2,
  },
  {
    name: "Users",
    href: "/owner/users",
    icon: Users,
  },
  {
    name: "Analytics",
    href: "/owner/analytics",
    icon: LineChart,
  },
];

// Smooth, fast entry for sidebar items
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1, 
    transition: { staggerChildren: 0.05, delayChildren: 0.05 }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, x: -10 },
  visible: { 
    opacity: 1, 
    x: 0, 
    transition: { type: "tween", ease: "easeOut", duration: 0.2 } 
  }
};

export default function OwnerSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const handleLogout = () => {
    startTransition(() => {
      logout().then(() => {
        router.push("/login");
        router.refresh();
      });
    });
  };

  return (
    <aside className="relative z-30 flex h-full w-full shrink-0 flex-col border-r border-[var(--border)] bg-[var(--background)] transition-colors duration-300 md:w-[260px]">
      
      {/* ========================================== */}
      {/* 1. COMPACT HEADER / LOGO                   */}
      {/* ========================================== */}
      <div className="px-4 pb-4 pt-5 sm:px-5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--primary)] text-white shadow-sm">
            <ShieldAlert className="h-4 w-4" />
          </div>
          <div className="flex flex-col min-w-0">
            <h2 className="truncate text-[14px] font-bold leading-tight tracking-tight text-[var(--foreground)]">
              Codepedia <span className="text-[var(--primary)]">EMS</span>
            </h2>
            <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
              Owner Panel
            </p>
          </div>
        </div>
      </div>

      {/* ========================================== */}
      {/* 2. MAIN NAVIGATION                         */}
      {/* ========================================== */}
      <div className="flex-1 overflow-y-auto px-3 py-2 scrollbar-hide">
        <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
          Main Menu
        </p>

        <motion.nav 
          variants={containerVariants} 
          initial="hidden" 
          animate="visible"
          className="flex flex-col gap-0.5"
        >
          <AnimatePresence>
            {links.map((link) => {
              // Exact match for the root dashboard, prefix match for sub-pages
              const active = pathname === link.href || (link.href !== "/owner" && pathname.startsWith(link.href));

              return (
                <motion.div key={link.href} variants={itemVariants}>
                  <Link href={link.href} className="group relative block outline-none">
                    
                    {/* Subtle Active Background */}
                    {active && (
                      <motion.div
                        layoutId="active-nav-bg"
                        className="absolute inset-0 rounded-lg bg-[var(--accent)]/80 border border-[var(--border)]/50"
                        initial={false}
                        transition={{ type: "spring", stiffness: 400, damping: 40 }}
                      />
                    )}

                    {/* Active vertical indicator */}
                    {active && (
                      <motion.div 
                        layoutId="active-nav-indicator"
                        className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r-full bg-[var(--primary)]"
                        initial={false}
                        transition={{ type: "spring", stiffness: 400, damping: 40 }}
                      />
                    )}

                    <div className={`relative z-10 flex items-center justify-between rounded-lg px-3 py-2 transition-colors duration-200 ${
                      active 
                        ? "text-[var(--foreground)] font-semibold" 
                        : "text-[var(--muted-foreground)] font-medium hover:bg-[var(--accent)] hover:text-[var(--foreground)]"
                    }`}>
                      <div className="flex items-center gap-2.5">
                        <link.icon className={`h-4 w-4 shrink-0 transition-colors duration-200 ${
                          active ? "text-[var(--primary)]" : "text-[var(--muted-foreground)] group-hover:text-[var(--foreground)]"
                        }`} />
                        <span className="text-[13px] tracking-tight">
                          {link.name}
                        </span>
                      </div>
                      
                      {active && (
                        <ChevronRight className="h-3.5 w-3.5 text-[var(--muted-foreground)]" />
                      )}
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.nav>

        {/* System Settings */}
        <div className="mt-6">
          <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
            System
          </p>
          <Link href="/owner/settings" className="group relative block outline-none">
            <div className="relative z-10 flex items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] font-medium text-[var(--muted-foreground)] transition-colors duration-200 hover:bg-[var(--accent)] hover:text-[var(--foreground)]">
              <Settings className="h-4 w-4 shrink-0 transition-transform duration-300 group-hover:rotate-45" />
              <span className="tracking-tight">Settings</span>
            </div>
          </Link>
        </div>
      </div>

      {/* ========================================== */}
      {/* 3. BOTTOM PROFILE WIDGET                   */}
      {/* ========================================== */}
      <div className="mt-auto border-t border-[var(--border)]/60 bg-[var(--background)] p-3">
        <div className="group flex items-center justify-between rounded-lg p-2 transition-colors hover:bg-[var(--accent)]">
          <div className="flex min-w-0 items-center gap-2.5">
            <div className="relative shrink-0">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[var(--primary)]/10 text-[10px] font-bold text-[var(--primary)] shadow-sm">
                OM
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-[var(--background)] bg-emerald-500" />
            </div>
            
            <div className="flex flex-col min-w-0">
              <span className="truncate text-[13px] font-semibold leading-tight text-[var(--foreground)]">
                System Owner
              </span>
              <span className="truncate text-[10px] font-medium uppercase tracking-wider text-[var(--muted-foreground)]">
                Online
              </span>
            </div>
          </div>
          
          <button
            type="button"
            onClick={handleLogout}
            disabled={isPending}
            title="Logout"
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-[var(--muted-foreground)] transition-colors hover:bg-[var(--background)] hover:text-rose-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 disabled:cursor-not-allowed disabled:opacity-50 shadow-sm border border-transparent hover:border-border"
          >
            {isPending ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <LogOut className="h-3.5 w-3.5" />
            )}
          </button>
        </div>
      </div>
      
    </aside>
  );
}