import { redirect } from "next/navigation";
import {
  Activity,
  BadgeIndianRupee,
  FileText,
  Handshake,
  TrendingUp,
  UserCheck,
} from "lucide-react";

import { getCurrentUser } from "@/lib/current-user";
import {
  getOperationAnalytics,
  type OperationAnalyticsFilter as OperationAnalyticsFilterType,
} from "@/actions/operations/get-operation-analytics";

import OperationAnalyticsFilter from "@/components/operations/operation-analytics-filter";
import OperationLineChart from "@/components/operations/operation-line-chart";

import { DepartmentType, Role } from "@/constants/enums";

// ============================================================================
// MAIN PAGE COMPONENT
// ============================================================================

export default async function OperationAnalyticsPage({
  searchParams,
}: {
  searchParams?: Promise<{
    filter?: OperationAnalyticsFilterType;
  }>;
}) {
  const params = await searchParams;

  const filter = params?.filter ?? "7_DAYS";

  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  if (user.role !== Role.EMPLOYEE) {
    redirect("/unauthorized");
  }

  if (!user.department || user.department.type !== DepartmentType.OPERATIONS) {
    redirect("/employee");
  }

  const analytics = await getOperationAnalytics(filter);

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-[1400px] flex-col gap-4 px-4 py-8 pt-20 sm:gap-6 sm:px-5 sm:py-12 md:pt-24 lg:gap-8 lg:px-6">
      
      {/* ========================================== */}
      {/* HEADER SECTION                             */}
      {/* ========================================== */}
      <header className="flex flex-col gap-4 rounded-xl border border-[var(--border)] bg-[var(--card)] p-4 shadow-sm sm:gap-5 sm:p-5 md:flex-row md:items-start md:justify-between">
        <div className="flex min-w-0 flex-1 flex-col items-start gap-1.5">
          <div className="inline-flex items-center gap-1.5 rounded-md bg-[var(--primary)]/10 px-2 py-0.5 text-[10px] font-medium text-[var(--primary)] sm:text-xs">
            <Activity className="h-3 w-3 shrink-0" />
            <span>Operations Analytics</span>
          </div>

          <h1 className="text-xl font-semibold tracking-tight text-[var(--foreground)] sm:text-2xl">
            Performance Analysis
          </h1>

          <p className="max-w-2xl text-sm text-[var(--muted-foreground)]">
            Analyze your query generation, deals done, tutor assignment and submission performance.
          </p>
        </div>

        {/* Filter Widget - Stacks full width on mobile, auto width on md+ */}
        <div className="w-full shrink-0 md:w-auto">
          <OperationAnalyticsFilter activeFilter={filter} />
        </div>
      </header>

      {/* ========================================== */}
      {/* TOTALS GRID                                */}
      {/* ========================================== */}
      <section className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <AnalyticsCard
          title="Total Queries"
          value={analytics.totals.queryGenerated}
          icon={FileText}
          tone="blue"
        />
        <AnalyticsCard
          title="Deals Done"
          value={analytics.totals.dealsDone}
          icon={Handshake}
          tone="emerald"
        />
        <AnalyticsCard
          title="Tutor Assigned"
          value={analytics.totals.tutorAssigned}
          icon={UserCheck}
          tone="purple"
        />
        {/*
        <AnalyticsCard
          title="Deals Amount"
          value={`₹${analytics.totals.dealsDoneAmount.toLocaleString("en-IN")}`}
          icon={BadgeIndianRupee}
          tone="amber"
        />
        */}
      </section>

      {/* ========================================== */}
      {/* AVERAGES GRID                              */}
      {/* ========================================== */}
      <section className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
        <MiniCard
          title="Average Queries"
          value={analytics.average.queryGenerated}
        />
        <MiniCard
          title="Average Deals"
          value={analytics.average.dealsDone}
        />
        <MiniCard
          title="Avg Tutor Assigned"
          value={analytics.average.tutorAssigned}
        />
      </section>

      {/* ========================================== */}
      {/* CHARTS SECTION                             */}
      {/* ========================================== */}
      <div className="flex flex-col gap-4 sm:gap-6 lg:gap-8">
        <OperationLineChart
          title="Query Generated Trend"
          description="Daily trend of queries generated in the selected period."
          data={analytics.chartData}
          dataKey="queryGenerated"
        />
        <OperationLineChart
          title="Deals Done Trend"
          description="Daily trend of deals completed in the selected period."
          data={analytics.chartData}
          dataKey="dealsDone"
        />
        <OperationLineChart
          title="Tutor Assigned Trend"
          description="Daily trend of tutors assigned in the selected period."
          data={analytics.chartData}
          dataKey="tutorAssigned"
        />
      </div>

      {/* ========================================== */}
      {/* SUBMISSION SUMMARY                         */}
      {/* ========================================== */}
      <section className="flex flex-col gap-4 rounded-xl border border-[var(--border)] bg-[var(--card)] p-4 shadow-sm sm:p-5">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-[var(--primary)]/10 text-[var(--primary)]">
            <Activity className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-[var(--foreground)] sm:text-lg">
              Submission Summary
            </h2>
            <p className="mt-0.5 text-xs text-[var(--muted-foreground)] sm:text-sm">
              Report status summary for the selected period.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-5 sm:gap-3 lg:gap-4">
          <StatusBox label="Draft" value={analytics.totals.draft} />
          <StatusBox label="Submitted" value={analytics.totals.submitted} />
          <StatusBox label="Approved" value={analytics.totals.approved} />
          <StatusBox label="Rejected" value={analytics.totals.rejected} />
          <StatusBox
            label="Correction"
            value={analytics.totals.correctionRequired}
            className="col-span-2 sm:col-span-1"
          />
        </div>
      </section>

    </div>
  );
}

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

function AnalyticsCard({
  title,
  value,
  icon: Icon,
  tone,
}: {
  title: string;
  value: string | number;
  icon: any;
  tone: "blue" | "emerald" | "purple" | "amber";
}) {
  const styles = {
    blue: "bg-blue-500/10 text-blue-600 border-blue-500/20 dark:text-blue-400",
    emerald: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:text-emerald-400",
    purple: "bg-purple-500/10 text-purple-600 border-purple-500/20 dark:text-purple-400",
    amber: "bg-amber-500/10 text-amber-600 border-amber-500/20 dark:text-amber-400",
  };

  return (
    <div className="flex flex-col rounded-xl border border-[var(--border)] bg-[var(--card)] p-3.5 shadow-sm sm:p-5">
      <div className="mb-3 flex items-start justify-between sm:mb-4">
        <p className="pr-2 text-[10px] font-semibold uppercase tracking-wider text-[var(--muted-foreground)] line-clamp-2">
          {title}
        </p>
        <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-md border sm:h-9 sm:w-9 ${styles[tone]}`}>
          <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
        </div>
      </div>

      <h3 className="mt-auto text-xl font-semibold text-[var(--foreground)] sm:text-2xl">
        {value}
      </h3>
    </div>
  );
}

function MiniCard({ title, value }: { title: string; value: number }) {
  return (
    <div className="flex flex-col rounded-xl border border-[var(--border)] bg-[var(--card)] p-3.5 shadow-sm sm:p-4">
      <div className="mb-2 flex items-center gap-1.5 text-[var(--primary)]">
        <TrendingUp className="h-4 w-4 shrink-0" />
        <p className="truncate text-[10px] font-semibold uppercase tracking-wider">
          {title}
        </p>
      </div>

      <h3 className="text-lg font-semibold text-[var(--foreground)] sm:text-xl">
        {value}
      </h3>
    </div>
  );
}

function StatusBox({ 
  label, 
  value, 
  className = "" 
}: { 
  label: string; 
  value: number;
  className?: string;
}) {
  return (
    <div className={`flex flex-col items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--background)] py-2.5 px-3 shadow-sm sm:py-3 ${className}`}>
      <p className="text-[9px] font-medium uppercase tracking-wider text-[var(--muted-foreground)] sm:text-[10px]">
        {label}
      </p>
      <h3 className="mt-0.5 text-lg font-semibold text-[var(--foreground)] sm:text-xl">
        {value}
      </h3>
    </div>
  );
}