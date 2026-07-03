"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { logout } from "@/actions/auth/logout";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LayoutDashboard, 
  Building2, 
  Users, 
  LineChart, 
  ShieldAlert,
  LogOut,
  Loader2,
  Sparkles,
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

// Smooth staggered entry for sidebar items
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1, 
    transition: { staggerChildren: 0.08, delayChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, x: -15 },
  visible: { 
    opacity: 1, 
    x: 0, 
    transition: { type: "spring" as const, stiffness: 120, damping: 14 } 
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
    <aside className="sticky top-0 left-0 hidden lg:flex flex-col w-[280px] h-screen bg-[var(--background)] backdrop-blur-2xl border-r border-[var(--border)]/50 flex-shrink-0 transition-colors duration-500 z-30 pt-20 lg:pt-24 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
      
      {/* Subtle Ambient Glow */}
      <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-br from-[var(--primary)]/5 to-transparent blur-[80px] pointer-events-none -z-10" />

      {/* ========================================== */}
      {/* HEADER / LOGO AREA                         */}
      {/* ========================================== */}
      <div className="px-6 pb-6 relative z-10">
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-11 h-11 rounded-2xl bg-gradient-to-br from-[var(--primary)] to-blue-600 shadow-lg shadow-[var(--primary)]/20 text-white transition-transform hover:scale-105 duration-300 ring-1 ring-white/10">
            <ShieldAlert className="w-5 h-5" />
            {/* Pulsing indicator */}
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white/80"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-white border-2 border-[var(--primary)]"></span>
            </span>
          </div>
          <div className="flex flex-col">
            <h2 className="text-[19px] font-black text-[var(--foreground)] tracking-tight leading-tight">
              Codepedia <span className="text-[var(--primary)]">EMS</span>
            </h2>
            <div className="flex items-center gap-1.5 mt-0.5">
              {/* <Sparkles className="w-3 h-3 text-[var(--primary)]" /> */}
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--muted-foreground)]">
                Owner Panel
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="px-6 mb-4">
        <div className="h-px w-full bg-gradient-to-r from-[var(--border)] via-[var(--border)] to-transparent opacity-50" />
      </div>

      {/* ========================================== */}
      {/* MAIN NAVIGATION                            */}
      {/* ========================================== */}
      <div className="flex-1 overflow-y-auto px-4 py-2 scrollbar-hide relative z-10">
        <p className="px-4 text-[10px] font-bold text-[var(--muted-foreground)] uppercase tracking-widest mb-3">
          Main Menu
        </p>

        <motion.nav 
          variants={containerVariants} 
          initial="hidden" 
          animate="visible"
          className="space-y-1"
        >
          <AnimatePresence>
            {links.map((link) => {
              // Exact match for the root dashboard, prefix match for sub-pages
              const active = pathname === link.href || (link.href !== "/owner" && pathname.startsWith(link.href));

              return (
                <motion.div key={link.href} variants={itemVariants}>
                  <Link href={link.href} className="relative block group outline-none">
                    
                    {/* Advanced Animated Pill Background */}
                    {active && (
                      <motion.div
                        layoutId="active-nav-pill"
                        className="absolute inset-0 bg-[var(--primary)]/10 border border-[var(--primary)]/20 rounded-xl"
                        initial={false}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}

                    {/* Active vertical line indicator */}
                    {active && (
                      <motion.div 
                        layoutId="active-nav-line"
                        className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-[var(--primary)] rounded-r-full shadow-[0_0_10px_var(--primary)]"
                        initial={false}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}

                    <div className={`relative z-10 flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300 ${
                      active 
                        ? "text-[var(--primary)] font-bold" 
                        : "text-[var(--muted-foreground)] font-semibold hover:bg-[var(--muted)]/50 hover:text-[var(--foreground)]"
                    }`}>
                      <div className="flex items-center gap-3">
                        <link.icon className={`w-4 h-4 transition-all duration-300 ${
                          active ? "text-[var(--primary)] scale-110" : "text-[var(--muted-foreground)] group-hover:text-[var(--foreground)] group-hover:scale-110"
                        }`} />
                        <span className={`text-[13px] tracking-wide transition-transform duration-300 ${!active && "group-hover:translate-x-1"}`}>
                          {link.name}
                        </span>
                      </div>
                      
                      {/* Active indicator arrow */}
                      {active && (
                        <ChevronRight className="w-4 h-4 opacity-70" />
                      )}
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.nav>

        {/* System & Settings Section */}
        <div className="mt-8">
          <p className="px-4 text-[10px] font-bold text-[var(--muted-foreground)] uppercase tracking-widest mb-3">
            System
          </p>
          <Link href="/owner/settings" className="relative block group outline-none">
            <div className="relative z-10 flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 text-[var(--muted-foreground)] font-semibold hover:bg-[var(--muted)]/50 hover:text-[var(--foreground)]">
              <Settings className="w-4 h-4 transition-transform duration-300 group-hover:text-[var(--foreground)] group-hover:rotate-90" />
              <span className="text-[13px] tracking-wide transition-transform duration-300 group-hover:translate-x-1">
                Settings
              </span>
            </div>
          </Link>
        </div>
      </div>

      {/* ========================================== */}
      {/* BOTTOM PROFILE WIDGET                      */}
      {/* ========================================== */}
      <div className="p-4 mt-auto relative z-10 border-t border-[var(--border)]/40 bg-[var(--card)]/10">
        <div className="flex items-center justify-between p-3 rounded-2xl bg-[var(--background)] border border-[var(--border)]/60 hover:border-[var(--primary)]/30 hover:shadow-md transition-all duration-300 group">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-9 h-9 rounded-[10px] bg-gradient-to-tr from-[var(--primary)] to-blue-700 flex items-center justify-center text-white font-black text-xs shadow-inner group-hover:scale-105 transition-transform duration-300">
                OM
              </div>
              {/* Online Status Dot */}
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-[var(--background)] rounded-full" />
            </div>
            <div className="flex flex-col">
              <span className="text-[13px] font-bold text-[var(--foreground)] leading-tight">System Owner</span>
              <span className="text-[10px] font-semibold text-emerald-500 uppercase tracking-wider mt-0.5">Online</span>
            </div>
          </div>
          
          <button
            type="button"
            onClick={handleLogout}
            disabled={isPending}
            title="Logout"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--muted-foreground)] transition-colors duration-300 hover:bg-rose-500/10 hover:text-rose-500 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
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