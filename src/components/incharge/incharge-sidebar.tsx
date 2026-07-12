"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import {
  LayoutDashboard,
  Users,
  CalendarDays,
  ClipboardCheck,
  BarChart3,
  UserCheck,
  ShieldCheck,
  Megaphone,
  Activity,
  Wallet,
  BookOpen,
  Globe,
  User,
  Sparkles,
  ChevronRight,
  Sun,
  Moon,
} from "lucide-react";

import { DepartmentType } from "@/constants/enums";
import LogoutButton from "@/components/auth/logout-button";

interface InchargeSidebarProps {
  department: string;
}

type SidebarLink = {
  name: string;
  href: string;
  icon: any;
};

function getDepartmentWorkspaceLinks(department: string): SidebarLink[] {
  switch (department) {
    case DepartmentType.MARKETING:
      return [
        {
          name: "Marketing Reports",
          href: "/incharge/reports",
          icon: Megaphone,
        },
        {
          name: "Marketing Analytics",
          href: "/incharge/analytics",
          icon: BarChart3,
        },
      ];

    case DepartmentType.OPERATIONS:
      return [
        {
          name: "Operations Reports",
          href: "/incharge/operations/reports",
          icon: Activity,
        },
        {
          name: "Operations Analytics",
          href: "/incharge/operations/analytics",
          icon: BarChart3,
        },
      ];

    case DepartmentType.ACCOUNTS:
      return [
        {
          name: "Accounts Reports",
          href: "/incharge/accounts/reports",
          icon: Wallet,
        },
        {
          name: "Accounts Analytics",
          href: "/incharge/accounts/analytics",
          icon: BarChart3,
        },
      ];

    case DepartmentType.TUTOR:
      return [
        {
          name: "Tutor Reports",
          href: "/incharge/tutor/reports",
          icon: BookOpen,
        },
        {
          name: "Tutor Analytics",
          href: "/incharge/tutor/analytics",
          icon: BarChart3,
        },
      ];

    case DepartmentType.DIGITAL_MARKETING:
      return [
        {
          name: "Digital Reports",
          href: "/incharge/digital-marketing/reports",
          icon: Globe,
        },
        {
          name: "Digital Analytics",
          href: "/incharge/digital-marketing/analytics",
          icon: BarChart3,
        },
      ];

    default:
      return [];
  }
}

function formatDepartmentName(department: string) {
  return department.replaceAll("_", " ");
}

function isRouteActive(pathname: string, href: string) {
  if (href === "/incharge") {
    return pathname === "/incharge";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function InchargeSidebar({
  department,
}: InchargeSidebarProps) {
  const pathname = usePathname();
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && resolvedTheme === "dark";

  const commonLinks: SidebarLink[] = [
    {
      name: "Dashboard",
      href: "/incharge",
      icon: LayoutDashboard,
    },
    {
      name: "Employees",
      href: "/incharge/employees",
      icon: Users,
    },
  ];

  const departmentLinks = getDepartmentWorkspaceLinks(department);

  const workLinks: SidebarLink[] = [
    {
      name: "Attendance",
      href: "/incharge/attendance",
      icon: CalendarDays,
    },
    {
      name: "Leaves",
      href: "/incharge/leaves",
      icon: ClipboardCheck,
    },
    {
      name: "Approvals",
      href: "/incharge/pending-employees",
      icon: UserCheck,
    },
    {
      name: "Profile",
      href: "/incharge/profile",
      icon: User,
    },
  ];

  return (
    <aside className="fixed left-0 top-0 z-50 flex h-screen w-72 flex-col overflow-hidden border-r border-[var(--border)]/70 bg-[var(--background)]/90 text-[var(--foreground)] shadow-[18px_0_60px_rgba(0,0,0,0.08)] backdrop-blur-2xl">
      {/* Premium Ambient Background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(var(--border)_1px,transparent_1px)] [background-size:28px_28px] opacity-[0.14]" />
        <div className="absolute -left-24 -top-24 h-64 w-64 rounded-full bg-[var(--primary)]/15 blur-3xl" />
        <div className="absolute -bottom-20 left-8 h-52 w-52 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="absolute right-[-90px] top-1/3 h-44 w-44 rounded-full bg-amber-400/10 blur-3xl" />
      </div>

      {/* Brand Area */}
      <div className="relative border-b border-[var(--border)]/70 px-5 py-5">
        <div className="rounded-[1.5rem] border border-[var(--border)] bg-[var(--card)]/75 p-4 shadow-sm backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--primary)] via-cyan-500 to-blue-700 text-white shadow-lg shadow-[var(--primary)]/25">
              <ShieldCheck className="h-6 w-6" />
            </div>

            <div className="min-w-0 flex-1">
              <h2 className="truncate text-lg font-black tracking-tight text-[var(--foreground)]">
                Codepedia EMS
              </h2>
              <p className="mt-0.5 text-[10px] font-black uppercase tracking-[0.22em] text-[var(--primary)]">
                Incharge Panel
              </p>
            </div>

            {/* Theme Toggle */}
            <button
              type="button"
              onClick={() => setTheme(isDark ? "light" : "dark")}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-[var(--border)] bg-[var(--background)]/70 text-[var(--muted-foreground)] shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-[var(--primary)]/40 hover:bg-[var(--primary)]/10 hover:text-[var(--primary)]"
              aria-label="Toggle theme"
              title="Change theme"
            >
              {mounted && isDark ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </button>
          </div>

          <div className="mt-4 rounded-2xl border border-[var(--border)] bg-[var(--background)]/65 px-3 py-2.5">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5 shrink-0">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
              </span>

              <p className="truncate text-[11px] font-bold uppercase tracking-[0.16em] text-[var(--muted-foreground)]">
                {formatDepartmentName(department)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="relative flex-1 space-y-2 overflow-y-auto px-4 py-5">
        <SidebarGroup title="Main" links={commonLinks} pathname={pathname} />

        <SidebarGroup
          title="Department Workspace"
          links={departmentLinks}
          pathname={pathname}
        />

        <SidebarGroup
          title="Management"
          links={workLinks}
          pathname={pathname}
        />
      </nav>

      {/* Bottom Panel */}
      <div className="relative border-t border-[var(--border)]/70 p-4">
       

        <div className="rounded-[1rem]  border border-[var(--border)] bg-[var(--card)]/70 p-3 shadow-sm backdrop-blur-xl">
          <LogoutButton />
        </div>
      </div>
    </aside>
  );
}

function SidebarGroup({
  title,
  links,
  pathname,
}: {
  title: string;
  links: SidebarLink[];
  pathname: string;
}) {
  if (links.length === 0) return null;

  return (
    <div className="mb-7">
      <h3 className="mb-3 px-3 text-[10px] font-black uppercase tracking-[0.22em] text-[var(--muted-foreground)]">
        {title}
      </h3>

      <div className="space-y-1.5">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = isRouteActive(pathname, link.href);

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`group relative flex items-center gap-3 overflow-hidden rounded-2xl px-4 py-3 text-[14px] font-bold transition-all duration-300 ${
                isActive
                  ? "bg-[var(--primary)] text-white shadow-lg shadow-[var(--primary)]/25"
                  : "text-[var(--muted-foreground)] hover:bg-[var(--card)]/85 hover:text-[var(--foreground)] hover:shadow-sm"
              }`}
            >
              {isActive && (
                <>
                  <span className="absolute inset-0 bg-gradient-to-r from-white/16 via-white/5 to-transparent" />
                  <span className="absolute left-0 top-1/2 h-8 w-1 -translate-y-1/2 rounded-r-full bg-white/80" />
                </>
              )}

              {!isActive && (
                <span className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <span className="absolute -right-8 -top-8 h-20 w-20 rounded-full bg-[var(--primary)]/10 blur-2xl" />
                </span>
              )}

              <span
                className={`relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-all duration-300 ${
                  isActive
                    ? "bg-white/18 text-white ring-1 ring-white/20"
                    : "bg-[var(--muted)]/45 text-[var(--muted-foreground)] ring-1 ring-[var(--border)] group-hover:bg-[var(--primary)]/10 group-hover:text-[var(--primary)] group-hover:ring-[var(--primary)]/20"
                }`}
              >
                <Icon size={18} />
              </span>

              <span className="relative min-w-0 flex-1 truncate">
                {link.name}
              </span>

              <ChevronRight
                size={15}
                className={`relative shrink-0 transition-all duration-300 ${
                  isActive
                    ? "translate-x-0 text-white/85"
                    : "-translate-x-1 text-[var(--muted-foreground)]/0 group-hover:translate-x-0 group-hover:text-[var(--primary)]"
                }`}
              />
            </Link>
          );
        })}
      </div>
    </div>
  );
}