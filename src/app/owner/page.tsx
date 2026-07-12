import Link from "next/link";
import { 
  Building2, 
  Users, 
  UserCheck, 
  UserCog, 
  AlertCircle,
  ArrowRight,
  ShieldAlert,
  LineChart,
  Clock,
  MoreVertical
} from "lucide-react";

import { getOwnerDashboardStats } from "@/actions/owner/get-dashboard-stats";

export default async function OwnerDashboard() {
  // Fetch data on the server
  const stats = await getOwnerDashboardStats();

  return (
    <div className="min-h-screen bg-[var(--background)] px-4 pt-24 pb-12 md:px-6 lg:px-8 max-w-[1600px] mx-auto flex flex-col gap-8">
      
      {/* ========================================== */}
      {/* HEADER SECTION                             */}
      {/* ========================================== */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm lg:p-8">
        <div>
          <div className="mb-4 inline-flex items-center gap-2 rounded-md bg-[var(--primary)]/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[var(--primary)] shadow-sm ring-1 ring-[var(--primary)]/20">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--primary)] opacity-75"></span>
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[var(--primary)]"></span>
            </span>
            Global Command Center
          </div>
          
          <h1 className="mb-1 text-2xl font-bold tracking-tight text-[var(--foreground)] lg:text-3xl">
            System Overview
          </h1>
          <p className="text-sm text-[var(--muted-foreground)] max-w-2xl">
            Monitor real-time operations, manage hierarchy access, and track global workspace metrics.
          </p>
        </div>

        {/* Status Indicator */}
        <div className="flex shrink-0 items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-2.5 shadow-sm">
          <Clock className="h-4 w-4 text-[var(--muted-foreground)]" />
          <div className="flex flex-col">
            <span className="text-[9px] font-bold uppercase tracking-wider text-[var(--muted-foreground)]">Status</span>
            <span className="text-xs font-semibold text-[var(--foreground)]">Live & Synced</span>
          </div>
        </div>
      </header>

      {/* ========================================== */}
      {/* STATS GRID                                 */}
      {/* ========================================== */}
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <StatCard
          title="Departments"
          value={stats.totalDepartments}
          icon={Building2}
          glowColor="rgba(59,130,246,0.25)"
          accentClass="text-blue-600 bg-blue-500/10 border-blue-500/20 dark:text-blue-400"
        />
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          icon={Users}
          glowColor="rgba(99,102,241,0.25)"
          accentClass="text-indigo-600 bg-indigo-500/10 border-indigo-500/20 dark:text-indigo-400"
        />
        <StatCard
          title="Employees"
          value={stats.totalEmployees}
          icon={UserCheck}
          glowColor="rgba(16,185,129,0.25)"
          accentClass="text-emerald-600 bg-emerald-500/10 border-emerald-500/20 dark:text-emerald-400"
        />
        <StatCard
          title="Incharges"
          value={stats.totalIncharges}
          icon={UserCog}
          glowColor="rgba(168,85,247,0.25)"
          accentClass="text-purple-600 bg-purple-500/10 border-purple-500/20 dark:text-purple-400"
        />
        <StatCard
          title="Pending Approvals"
          value={stats.pendingApprovals}
          icon={AlertCircle}
          glowColor="rgba(245,158,11,0.3)"
          accentClass="text-amber-600 bg-amber-500/10 border-amber-500/30 dark:text-amber-400"
          isAlert={stats.pendingApprovals > 0} 
        />
      </section>

      {/* ========================================== */}
      {/* ADMINISTRATIVE MODULES                     */}
      {/* ========================================== */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-[var(--foreground)] flex items-center gap-2">
            Administrative Modules
          </h2>
        </div>
        
        <div className="grid gap-4 md:grid-cols-3">
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
  glowColor,
  accentClass,
  isAlert = false,
}: {
  title: string;
  value: number;
  icon: React.ElementType;
  glowColor: string;
  accentClass: string;
  isAlert?: boolean;
}) {
  return (
    <div className={`group relative overflow-hidden rounded-xl bg-[var(--card)] border p-5 transition-all duration-300 hover:-translate-y-0.5 shadow-sm ${
      isAlert 
        ? "border-amber-500/40 shadow-[0_4px_20px_-10px_rgba(245,158,11,0.2)]" 
        : "border-[var(--border)] hover:border-[var(--primary)]/30 hover:shadow-[0_4px_20px_-10px_rgba(0,102,255,0.1)]"
    }`}>
      
      {/* Dynamic Hover Glow effect */}
      <div 
        className="absolute -top-10 left-1/2 -translate-x-1/2 w-[120%] h-24 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-[40px] pointer-events-none"
        style={{ background: `radial-gradient(circle at center, ${glowColor}, transparent 70%)` }}
      />

      <div className="flex flex-col gap-4 relative z-10">
        <div className="flex justify-between items-start">
          <div className={`flex h-10 w-10 items-center justify-center rounded-lg border transition-transform duration-300 group-hover:scale-105 ${accentClass}`}>
            <Icon className="h-5 w-5" />
          </div>
          <button className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors opacity-0 group-hover:opacity-100">
            <MoreVertical className="h-4 w-4" />
          </button>
        </div>
        
        <div>
          <h2 className="text-2xl font-bold text-[var(--foreground)] tracking-tight mb-0.5">
            {value}
          </h2>
          <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--muted-foreground)]">
            {title}
          </p>
        </div>
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
      className="group relative flex flex-col rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 transition-all duration-300 hover:border-[var(--primary)]/40 hover:shadow-md hover:-translate-y-0.5 overflow-hidden outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]"
    >
      {/* Subtle Background Mesh Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(var(--border)_1px,transparent_1px)] [background-size:16px_16px] opacity-10 group-hover:opacity-20 transition-opacity" />

      <div className="relative z-10 flex flex-col h-full">
        <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-[var(--primary)]/10 text-[var(--primary)] ring-1 ring-[var(--primary)]/20 transition-all duration-300 group-hover:bg-[var(--primary)] group-hover:text-white shadow-sm">
          <Icon className="h-6 w-6" />
        </div>

        <h3 className="mb-2 text-base font-bold text-[var(--foreground)] group-hover:text-[var(--primary)] transition-colors duration-200">
          {title}
        </h3>

        <p className="text-sm text-[var(--muted-foreground)] leading-relaxed mb-6 flex-1">
          {description}
        </p>

        <div className="mt-auto flex items-center pt-4 border-t border-[var(--border)]/60 text-xs font-bold uppercase tracking-wider text-[var(--foreground)] group-hover:text-[var(--primary)] transition-colors duration-200">
          <span>Launch Module</span>
          <div className="ml-auto flex h-7 w-7 items-center justify-center rounded-md bg-[var(--primary)]/10 text-[var(--primary)] transition-all duration-300 -translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 group-hover:bg-[var(--primary)] group-hover:text-white">
            <ArrowRight className="h-3.5 w-3.5" />
          </div>
        </div>
      </div>

      {/* Shine Sweep Effect */}
      <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/5 to-transparent group-hover:animate-[shimmer_2s_infinite]" />
    </Link>
  );
}