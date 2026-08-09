import Link from "next/link";
import {
  Building2,
  Users,
  UserCheck,
  UserCog,
  AlertCircle,
  Clock,
  MoreVertical,
  ShieldAlert,
  LineChart,
} from "lucide-react";

import { getOwnerDashboardStats } from "@/actions/owner/get-dashboard-stats";

export default async function OwnerDashboard() {
  // Fetch data on the server
  const stats = await getOwnerDashboardStats();

  return (
    <div className="flex w-full flex-col gap-6 p-4 sm:p-6 md:p-8 lg:max-w-7xl lg:mx-auto">
      {/* ========================================== */}
      {/* HEADER SECTION                             */}
      {/* ========================================== */}
      <header className="flex flex-col gap-4 rounded-xl border border-[var(--border)] bg-[var(--card)] p-4 shadow-sm sm:p-5 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col items-start gap-1.5">
          <div className="inline-flex items-center gap-1.5 rounded-md bg-[var(--primary)]/10 px-2 py-0.5 text-[10px] font-medium text-[var(--primary)] sm:text-xs">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--primary)] opacity-75"></span>
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[var(--primary)]"></span>
            </span>
            Global Command Center
          </div>

          <h1 className="text-xl font-semibold tracking-tight text-[var(--foreground)] sm:text-2xl">
            System Overview
          </h1>
          <p className="max-w-2xl text-sm text-[var(--muted-foreground)]">
            Monitor real-time operations, manage hierarchy access, and track global workspace metrics.
          </p>
        </div>

        {/* Compact Status Indicator */}
        <div className="inline-flex items-center gap-2.5 self-start rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 shadow-sm md:self-auto">
          <Clock className="h-4 w-4 text-[var(--muted-foreground)]" />
          <div className="flex flex-col text-left">
            <span className="text-[9px] font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
              Status
            </span>
            <span className="mt-0.5 text-xs font-semibold leading-none text-[var(--foreground)]">
              Live & Synced
            </span>
          </div>
        </div>
      </header>

      {/* ========================================== */}
      {/* STATS GRID                                 */}
      {/* ========================================== */}
      <section className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-5">
        <StatCard
          title="Departments"
          value={stats.totalDepartments}
          icon={Building2}
          accentClass="text-blue-600 bg-blue-500/10 border-blue-500/20 dark:text-blue-400"
        />
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          icon={Users}
          accentClass="text-indigo-600 bg-indigo-500/10 border-indigo-500/20 dark:text-indigo-400"
        />
        <StatCard
          title="Employees"
          value={stats.totalEmployees}
          icon={UserCheck}
          accentClass="text-emerald-600 bg-emerald-500/10 border-emerald-500/20 dark:text-emerald-400"
        />
        <StatCard
          title="Incharges"
          value={stats.totalIncharges}
          icon={UserCog}
          accentClass="text-purple-600 bg-purple-500/10 border-purple-500/20 dark:text-purple-400"
        />
        <StatCard
          title="Pending Approvals"
          value={stats.pendingApprovals}
          icon={AlertCircle}
          accentClass="text-amber-600 bg-amber-500/10 border-amber-500/30 dark:text-amber-400"
          isAlert={stats.pendingApprovals > 0}
        />
      </section>

      {/* ========================================== */}
      {/* ADMINISTRATIVE MODULES                     */}
      {/* ========================================== */}
      <section className="mt-2 flex flex-col gap-3 sm:mt-4 sm:gap-4">
        <header>
          <h2 className="text-base font-semibold text-[var(--foreground)] sm:text-lg">
            Administrative Modules
          </h2>
          <p className="mt-0.5 text-xs text-[var(--muted-foreground)] sm:text-sm">
            Manage users, departments, and perform workspace audits.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
          <ActionCard
            href="/owner/users"
            title="User Management"
            description="Control user access, assign hierarchy roles, and audit employee records across all branches."
            icon={ShieldAlert}
          />
          <ActionCard
            href="/owner/departments"
            title="Departments"
            description="Create, structure, and oversee regional and operational departments within the workspace."
            icon={Building2}
          />
          <ActionCard
            href="/owner/analytics"
            title="Global Analytics"
            description="View deep insights into throughput, task completion, and system health in real-time."
            icon={LineChart}
          />
        </div>
      </section>
    </div>
  );
}

// --------------------------------------------------------
// SUB-COMPONENTS
// --------------------------------------------------------

function StatCard({
  title,
  value,
  icon: Icon,
  accentClass,
  isAlert = false,
}: {
  title: string;
  value: number;
  icon: React.ElementType;
  accentClass: string;
  isAlert?: boolean;
}) {
  return (
    <div
      className={`group relative flex min-w-0 flex-col rounded-xl border bg-[var(--card)] p-3.5 transition-all duration-200 hover:-translate-y-[1px] hover:shadow-sm sm:p-4 ${
        isAlert
          ? "border-amber-500/40 bg-amber-500/[0.02]"
          : "border-[var(--border)] hover:border-[var(--primary)]/30"
      }`}
    >
      {/* Top row */}
      <div className="flex items-start justify-between">
        {/* Icon */}
        <div
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-md border sm:h-9 sm:w-9 ${accentClass}`}
        >
          <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
        </div>

        {/* More button */}
        <button
          type="button"
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-[var(--muted-foreground)] opacity-0 outline-none transition-all hover:bg-[var(--primary)]/10 hover:text-[var(--primary)] focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:opacity-100 group-hover:opacity-100"
          aria-label={`More options for ${title}`}
        >
          <MoreVertical className="h-4 w-4" />
        </button>
      </div>

      {/* Value */}
      <div className="mt-4">
        <h2 className="text-xl font-semibold leading-tight text-[var(--foreground)] sm:text-2xl">
          {value}
        </h2>
        <p className="mt-0.5 text-xs font-medium text-[var(--muted-foreground)] sm:text-sm">
          {title}
        </p>
      </div>
    </div>
  );
}

function ActionCard({
  href,
  title,
  description,
  icon: Icon,
}: {
  href: string;
  title: string;
  description: string;
  icon: React.ElementType;
}) {
  return (
    <Link
      href={href}
      className="group flex flex-col gap-3 rounded-xl border border-[var(--border)] bg-[var(--card)] p-4 transition-all duration-200 hover:-translate-y-[1px] hover:border-[var(--primary)]/30 hover:shadow-sm sm:p-5"
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[var(--primary)]/10 text-[var(--primary)] transition-colors group-hover:bg-[var(--primary)] group-hover:text-primary-foreground">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <h3 className="text-sm font-semibold text-[var(--foreground)] transition-colors duration-200 group-hover:text-[var(--primary)] sm:text-base">
          {title}
        </h3>
        <p className="mt-1.5 max-w-[48ch] text-xs leading-relaxed text-[var(--muted-foreground)] sm:text-sm">
          {description}
        </p>
      </div>
    </Link>
  );
}