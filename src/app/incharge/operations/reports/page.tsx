import { redirect } from "next/navigation";
import {
  BadgeIndianRupee,
  CheckCircle2,
  FileText,
  Handshake,
  RotateCcw,
  UserCheck,
  XCircle,
  TrendingUp,
  Users,
} from "lucide-react";

import { getCurrentUser } from "@/lib/current-user";
import { getOperationReviewReports } from "@/actions/incharge/operations/get-operation-review-reports";

import OperationReviewFilter from "@/components/incharge/operations/operation-review-filter";
import OperationReviewTable from "@/components/incharge/operations/operation-review-table";

import { DepartmentType, Role } from "@/constants/enums";

// ============================================================================
// MAIN PAGE COMPONENT
// ============================================================================

export default async function InchargeOperationReportsPage({
  searchParams,
}: {
  searchParams?: Promise<{
    search?: string;
    status?: string;
    from?: string;
    to?: string;
  }>;
}) {
  const params = await searchParams;
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    redirect("/login");
  }

  if (currentUser.role !== Role.INCHARGE) {
    redirect("/unauthorized");
  }

  if (
    !currentUser.department ||
    currentUser.department.type !== DepartmentType.OPERATIONS
  ) {
    redirect("/incharge");
  }

  const data = await getOperationReviewReports({
    search: params?.search,
    status: params?.status ?? "SUBMITTED",
    from: params?.from,
    to: params?.to,
  });

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-[1400px] flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
      
      {/* ========================================== */}
      {/* HEADER SECTION                             */}
      {/* ========================================== */}
      <header className="flex flex-col items-start justify-between gap-4 border-b border-[var(--border)] pb-6 md:flex-row md:items-end">
        <div className="flex flex-col gap-1.5">
          <div className="mb-1 flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--primary)]/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-[var(--primary)]">
              <FileText className="h-3 w-3" />
              Operations Reports
            </span>
            <span className="inline-flex items-center rounded-full border border-[var(--border)] bg-[var(--background)] px-2.5 py-1 text-[10px] font-medium text-[var(--muted-foreground)]">
              {currentUser.department.name} Dept.
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--foreground)] sm:text-3xl">
            Employee Submission Review
          </h1>
          <p className="max-w-2xl text-sm text-[var(--muted-foreground)]">
            Review, approve, or request corrections on operational data submitted by your team.
          </p>
        </div>
      </header>

      {/* ========================================== */}
      {/* INLINE STATUS BAR (Saves Vertical Space)   */}
      {/* ========================================== */}
      <section className="flex flex-wrap items-center gap-x-6 gap-y-3 rounded-lg border border-[var(--border)] bg-[var(--card)] px-5 py-3.5 shadow-sm">
        <span className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
          Report Status
        </span>
        <div className="hidden h-5 w-px bg-[var(--border)] sm:block" />
        
        <StatusItem icon={FileText} label="Total" value={data.totals.totalReports} tone="blue" />
        <StatusItem icon={UserCheck} label="Pending" value={data.totals.submitted} tone="amber" />
        <StatusItem icon={CheckCircle2} label="Approved" value={data.totals.approved} tone="emerald" />
        <StatusItem icon={XCircle} label="Rejected" value={data.totals.rejected} tone="red" />
        <StatusItem icon={RotateCcw} label="Correction" value={data.totals.correctionRequired} tone="purple" />
      </section>

      {/* ========================================== */}
      {/* OPERATIONAL KPIs (Premium Dashboard Cards) */}
      {/* ========================================== */}
      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <MetricCard 
          title="Total Deals Value" 
          value={`₹${data.totals.dealsDoneAmount.toLocaleString("en-IN")}`} 
          icon={BadgeIndianRupee}
          tone="emerald"
        />
        <MetricCard 
          title="Deals Done" 
          value={data.totals.dealsDone} 
          icon={Handshake}
          tone="blue"
        />
        <MetricCard 
          title="Queries Generated" 
          value={data.totals.queryGenerated} 
          icon={TrendingUp}
          tone="purple"
        />
        <MetricCard 
          title="Tutors Assigned" 
          value={data.totals.tutorAssigned} 
          icon={Users}
          tone="amber"
        />
      </section>

      {/* ========================================== */}
      {/* DATA TABLE & FILTERS                       */}
      {/* ========================================== */}
      <section className="mt-2 flex flex-col gap-4 rounded-xl border border-[var(--border)] bg-[var(--card)] p-4 shadow-sm sm:p-5">
        <div className="flex items-center justify-between border-b border-[var(--border)] pb-4">
          <h2 className="text-base font-semibold text-[var(--foreground)]">Submissions Directory</h2>
        </div>
        
        <div className="flex flex-col gap-4 pt-1">
          <OperationReviewFilter
            search={params?.search}
            status={params?.status ?? "SUBMITTED"}
            from={params?.from}
            to={params?.to}
          />
          <div className="min-w-0">
            <OperationReviewTable reports={data.reports} />
          </div>
        </div>
      </section>
      
    </div>
  );
}

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

/**
 * Compact inline status item for the report workflow
 */
function StatusItem({
  label,
  value,
  icon: Icon,
  tone,
}: {
  label: string;
  value: string | number;
  icon: any;
  tone: "blue" | "amber" | "emerald" | "red" | "purple" | "muted";
}) {
  const styles = {
    blue: "text-blue-600 dark:text-blue-400 bg-blue-500/10",
    amber: "text-amber-600 dark:text-amber-400 bg-amber-500/10",
    emerald: "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10",
    red: "text-red-600 dark:text-red-400 bg-red-500/10",
    purple: "text-purple-600 dark:text-purple-400 bg-purple-500/10",
    muted: "text-[var(--muted-foreground)] bg-[var(--muted)]",
  };

  return (
    <div className="flex items-center gap-2">
      <div className={`flex h-6 w-6 items-center justify-center rounded-md ${styles[tone]}`}>
        <Icon className="h-3.5 w-3.5" />
      </div>
      <div className="flex items-baseline gap-1.5">
        <span className="text-sm font-medium text-[var(--foreground)]">{value}</span>
        <span className="text-xs text-[var(--muted-foreground)]">{label}</span>
      </div>
    </div>
  );
}

/**
 * Premium dashboard card for primary KPIs
 */
function MetricCard({
  title,
  value,
  icon: Icon,
  tone,
}: {
  title: string;
  value: string | number;
  icon: any;
  tone: "blue" | "amber" | "emerald" | "purple";
}) {
  const styles = {
    blue: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    amber: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    emerald: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    purple: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
  };

  return (
    <div className="group flex flex-col justify-between overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--card)] p-4 shadow-sm transition-all hover:shadow-md sm:p-5">
      <div className="mb-4 flex items-start justify-between">
        <p className="text-xs font-medium text-[var(--muted-foreground)] sm:text-sm">
          {title}
        </p>
        <div className={`flex h-8 w-8 items-center justify-center rounded-lg transition-transform group-hover:scale-110 sm:h-9 sm:w-9 ${styles[tone]}`}>
          <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
        </div>
      </div>
      <h3 className="truncate text-xl font-bold tracking-tight text-[var(--foreground)] sm:text-2xl">
        {value}
      </h3>
    </div>
  );
}