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
  Sun,
  Moon,
} from "lucide-react";

import { DepartmentType } from "@/constants/enums";
import LogoutButton from "@/components/auth/logout-button";

// ============================================================================
// TYPES & HELPER FUNCTIONS (UNCHANGED LOGIC)
// ============================================================================

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

// ============================================================================
// MAIN SIDEBAR COMPONENT
// ============================================================================

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
    <aside className="flex h-full w-full shrink-0 flex-col border-r border-[var(--border)] bg-[var(--background)] md:w-64">
      
      {/* Header / Brand Area */}
      <div className="flex h-14 shrink-0 items-center justify-between border-b border-[var(--border)] px-4 sm:h-16 sm:px-5">
        <div className="flex min-w-0 items-center gap-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--primary)]/10 text-[var(--primary)]">
            <ShieldCheck className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <h2 className="truncate text-sm font-semibold tracking-tight text-[var(--foreground)]">
              Codepedia EMS
            </h2>
            <p className="truncate text-[10px] font-medium uppercase tracking-wider text-[var(--muted-foreground)]">
              Incharge Console
            </p>
          </div>
        </div>

        {/* Theme Toggle */}
        <button
          type="button"
          onClick={() => setTheme(isDark ? "light" : "dark")}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-[var(--border)] bg-[var(--background)] text-[var(--muted-foreground)] shadow-sm transition-colors hover:bg-[var(--accent)] hover:text-[var(--foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]"
          aria-label="Toggle theme"
          title="Change theme"
        >
          {mounted && isDark ? (
            <Sun className="h-3.5 w-3.5" />
          ) : (
            <Moon className="h-3.5 w-3.5" />
          )}
        </button>
      </div>

      {/* Department Status Pill */}
      <div className="shrink-0 px-4 py-3 sm:px-5">
        <div className="inline-flex items-center gap-1.5 rounded-md border border-[var(--border)] bg-[var(--card)] px-2.5 py-1 shadow-sm">
          <span className="relative flex h-1.5 w-1.5 shrink-0">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
          </span>
          <p className="truncate text-[10px] font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
            {formatDepartmentName(department)}
          </p>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 space-y-6 overflow-y-auto px-3 pb-4 sm:px-4">
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
      <div className="shrink-0 border-t border-[var(--border)] p-3 sm:p-4">
        <LogoutButton />
      </div>
    </aside>
  );
}

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

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
    <div className="flex flex-col">
      <h3 className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
        {title}
      </h3>

      <div className="space-y-0.5">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = isRouteActive(pathname, link.href);

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`group flex items-center justify-between rounded-md px-2.5 py-2 text-sm font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] ${
                isActive
                  ? "bg-[var(--primary)]/10 text-[var(--primary)]"
                  : "text-[var(--muted-foreground)] hover:bg-[var(--accent)] hover:text-[var(--foreground)]"
              }`}
            >
              <div className="flex min-w-0 items-center gap-2.5">
                <Icon
                  className={`h-4 w-4 shrink-0 transition-colors ${
                    isActive
                      ? "text-[var(--primary)]"
                      : "text-[var(--muted-foreground)] group-hover:text-[var(--foreground)]"
                  }`}
                />
                <span className="truncate">{link.name}</span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}