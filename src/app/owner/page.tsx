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
  Activity,
  Clock,
  MoreVertical
} from "lucide-react";

import { getOwnerDashboardStats } from "@/actions/owner/get-dashboard-stats";

export default async function OwnerDashboard() {
  // Fetch data on the server
  const stats = await getOwnerDashboardStats();

  return (
    // FIXED: Added pt-28 lg:pt-32 to safely clear the top navbar
    <div className="min-h-screen bg-[var(--background)] px-6 pt-28 pb-16 lg:pt-32 lg:px-12 max-w-[1600px] mx-auto">
      
      {/* ========================================== */}
      {/* HEADER SECTION                             */}
      {/* ========================================== */}
      <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[var(--border)]/50 pb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-5 rounded-full bg-[var(--primary)]/10 border border-[var(--primary)]/20 shadow-inner">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--primary)] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--primary)]"></span>
            </span>
            <span className="text-[11px] font-extrabold tracking-widest uppercase text-[var(--primary)]">
              Global Command Center
            </span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-black text-[var(--foreground)] tracking-tight leading-none mb-3">
            System Overview
          </h1>
          <p className="text-[var(--muted-foreground)] text-base font-medium max-w-2xl">
            Monitor real-time operations, manage hierarchy access, and track global workspace metrics.
          </p>
        </div>

        {/* Status Indicator */}
        <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-[var(--card)] border border-[var(--border)] shadow-sm">
          <Clock className="w-4 h-4 text-[var(--muted-foreground)]" />
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-[var(--muted-foreground)] uppercase tracking-wider">Status</span>
            <span className="text-xs font-semibold text-[var(--foreground)]">Live & Synced</span>
          </div>
        </div>
      </header>

      {/* ========================================== */}
      {/* STATS GRID                                 */}
      {/* ========================================== */}
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-5 mb-16">
        <StatCard
          title="Departments"
          value={stats.totalDepartments}
          icon={Building2}
          glowColor="rgba(59,130,246,0.5)" // Blue
          accentClass="text-blue-500 bg-blue-500/10 border-blue-500/20"
        />
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          icon={Users}
          glowColor="rgba(99,102,241,0.5)" // Indigo
          accentClass="text-indigo-500 bg-indigo-500/10 border-indigo-500/20"
        />
        <StatCard
          title="Employees"
          value={stats.totalEmployees}
          icon={UserCheck}
          glowColor="rgba(16,185,129,0.5)" // Emerald
          accentClass="text-emerald-500 bg-emerald-500/10 border-emerald-500/20"
        />
        <StatCard
          title="Incharges"
          value={stats.totalIncharges}
          icon={UserCog}
          glowColor="rgba(168,85,247,0.5)" // Purple
          accentClass="text-purple-500 bg-purple-500/10 border-purple-500/20"
        />
        <StatCard
          title="Pending Approvals"
          value={stats.pendingApprovals}
          icon={AlertCircle}
          glowColor="rgba(245,158,11,0.6)" // Amber/Warning
          accentClass="text-amber-500 bg-amber-500/10 border-amber-500/30"
          isAlert={stats.pendingApprovals > 0} 
        />
      </div>

      {/* ========================================== */}
      {/* ADMINISTRATIVE MODULES                     */}
      {/* ========================================== */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-extrabold text-[var(--foreground)] flex items-center gap-2">
            Administrative Modules
          </h2>
        </div>
        
        <div className="grid gap-6 md:grid-cols-3">
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
// SUB-COMPONENTS (Pure CSS Interactive Elements)
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
    <div className={`group relative overflow-hidden rounded-[24px] bg-[var(--card)] border backdrop-blur-xl p-6 transition-all duration-500 hover:-translate-y-1.5 ${
      isAlert 
        ? "border-amber-500/50 shadow-[0_10px_40px_-10px_rgba(245,158,11,0.25)]" 
        : "border-[var(--border)] hover:border-[var(--primary)]/40 hover:shadow-[0_10px_40px_-10px_rgba(0,102,255,0.15)]"
    }`}>
      
      {/* Dynamic Hover Glow effect */}
      <div 
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[120%] h-32 opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-[50px] pointer-events-none"
        style={{ background: `radial-gradient(ellipse at top, ${glowColor}, transparent 70%)` }}
      />

      <div className="flex flex-col gap-5 relative z-10">
        <div className="flex justify-between items-start">
          <div className={`w-12 h-12 rounded-[1rem] flex items-center justify-center border shadow-sm transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3 ${accentClass}`}>
            <Icon className="w-6 h-6" />
          </div>
          <button className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors opacity-0 group-hover:opacity-100">
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>
        
        <div>
          <h2 className="text-4xl lg:text-5xl font-black text-[var(--foreground)] tracking-tighter mb-1">
            {value}
          </h2>
          <p className="text-xs font-bold text-[var(--muted-foreground)] uppercase tracking-widest">
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
      className="group relative flex flex-col rounded-[28px] border border-[var(--border)] bg-gradient-to-b from-[var(--card)] to-[var(--background)] p-8 transition-all duration-500 hover:border-[var(--primary)]/50 hover:shadow-[0_20px_40px_-15px_rgba(0,102,255,0.15)] overflow-hidden outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] hover:-translate-y-1"
    >
      {/* Background Mesh/Dot Pattern for "Module" feel */}
      <div className="absolute inset-0 bg-[radial-gradient(var(--border)_1px,transparent_1px)] [background-size:20px_20px] opacity-[0.15] group-hover:opacity-[0.25] transition-opacity" />

      <div className="relative z-10 flex flex-col h-full">
        <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-[1.25rem] bg-[var(--primary)]/10 text-[var(--primary)] ring-1 ring-[var(--primary)]/20 group-hover:scale-110 group-hover:bg-[var(--primary)] group-hover:text-white transition-all duration-500 shadow-sm">
          <Icon className="h-7 w-7" />
        </div>

        <h3 className="mb-2.5 text-2xl font-extrabold text-[var(--foreground)] group-hover:text-[var(--primary)] transition-colors duration-300 tracking-tight">
          {title}
        </h3>

        <p className="text-[14px] text-[var(--muted-foreground)] leading-relaxed mb-8 flex-1 font-medium">
          {description}
        </p>

        <div className="mt-auto flex items-center pt-5 border-t border-[var(--border)]/60 text-sm font-bold text-[var(--foreground)] group-hover:text-[var(--primary)] transition-colors duration-300">
          <span className="tracking-wide">Launch Module</span>
          <div className="ml-auto flex h-8 w-8 items-center justify-center rounded-full bg-[var(--primary)]/10 group-hover:bg-[var(--primary)] group-hover:text-white transition-all duration-300 translate-x-[-10px] opacity-0 group-hover:translate-x-0 group-hover:opacity-100">
            <ArrowRight className="h-4 w-4" />
          </div>
        </div>
      </div>

      {/* Shine Sweep Effect */}
      <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/5 to-transparent group-hover:animate-[shimmer_2s_infinite]" />
    </Link>
  );
}