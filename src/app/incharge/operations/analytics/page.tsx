import { redirect } from "next/navigation";
import {
  Activity,
  BadgeIndianRupee,
  CheckCircle2,
  FileText,
  Handshake,
  Percent,
  UserCheck,
} from "lucide-react";

import { getCurrentUser } from "@/lib/current-user";
import { getInchargeOperationAnalytics } from "@/actions/incharge/operations/get-operation-analytics";

import OperationAnalyticsFilter from "@/components/incharge/operations/operation-analytics-filter";
import OperationAnalyticsLineChart from "@/components/incharge/operations/operation-analytics-line-chart";
import OperationAnalyticsEmployeeTable from "@/components/incharge/operations/operation-analytics-employee-table";

import { DepartmentType, Role } from "@/constants/enums";

// ============================================================================
// MAIN PAGE COMPONENT
// ============================================================================

export default async function InchargeOperationAnalyticsPage({
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

  const analytics = await getInchargeOperationAnalytics({
    search: params?.search,
    status: params?.status,
    from: params?.from,
    to: params?.to,
  });

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-[1400px] flex-col gap-4 px-4 py-8 pt-20 sm:gap-6 sm:px-5 sm:py-12 md:pt-24 lg:gap-8 lg:px-6">
      
      {/* ========================================== */}
      {/* HEADER SECTION                             */}
      {/* ========================================== */}
      <header className="flex flex-col gap-3 rounded-xl border border-[var(--border)] bg-[var(--card)] p-4 shadow-sm sm:gap-4 sm:p-5 md:flex-row md:items-start md:justify-between">
        <div className="flex min-w-0 flex-1 flex-col items-start gap-1.5">
          <div className="inline-flex items-center gap-1.5 rounded-md bg-[var(--primary)]/10 px-2 py-0.5 text-[10px] font-medium text-[var(--primary)] sm:text-xs">
            <Activity className="h-3 w-3 shrink-0" />
            <span>Operations Analytics</span>
          </div>

          <h1 className="text-xl font-semibold tracking-tight text-[var(--foreground)] sm:text-2xl">
            Department Performance Analysis
          </h1>

          <p className="max-w-2xl text-xs text-[var(--muted-foreground)] sm:text-sm">
            Analyze operations performance across queries, deals, tutors and deal amount.
          </p>
        </div>

        <div className="inline-flex shrink-0 items-center justify-center rounded-md border border-[var(--border)] bg-[var(--background)] px-2.5 py-1.5 text-[11px] font-semibold text-[var(--foreground)] shadow-sm md:self-start sm:px-3 sm:text-xs">
          {currentUser.department.name} Department
        </div>
      </header>

      {/* ========================================== */}
      {/* METRICS & PIPELINE GRID                    */}
      {/* ========================================== */}
      <section className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 xl:grid-cols-6">
        <SummaryCard
          title="Reports"
          value={analytics.totals.totalReports}
          icon={FileText}
          tone="blue"
        />
        <SummaryCard
          title="Queries"
          value={analytics.totals.queryGenerated}
          icon={FileText}
          tone="purple"
        />
        <SummaryCard
          title="Deals"
          value={analytics.totals.dealsDone}
          icon={Handshake}
          tone="emerald"
        />
        <SummaryCard
          title="Tutors"
          value={analytics.totals.tutorAssigned}
          icon={UserCheck}
          tone="amber"
        />
        <SummaryCard
          title="Amount"
          value={`₹${analytics.totals.dealsDoneAmount.toLocaleString("en-IN")}`}
          icon={BadgeIndianRupee}
          tone="emerald"
        />
        <SummaryCard
          title="Approval Rate"
          value={`${analytics.approvalRate}%`}
          icon={Percent}
          tone="blue"
        />
      </section>

      {/* ========================================== */}
      {/* STATUS BREAKDOWN GRID                      */}
      {/* ========================================== */}
      <section className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 lg:grid-cols-5">
        <StatusCard title="Submitted" value={analytics.totals.submitted} />
        <StatusCard title="Approved" value={analytics.totals.approved} />
        <StatusCard title="Rejected" value={analytics.totals.rejected} />
        <StatusCard title="Correction" value={analytics.totals.correctionRequired} />
        <StatusCard title="Draft" value={analytics.totals.draft} className="col-span-2 sm:col-span-1 lg:col-span-1" />
      </section>

      {/* ========================================== */}
      {/* FILTERS                                    */}
      {/* ========================================== */}
      <div className="w-full">
        <OperationAnalyticsFilter
          search={params?.search}
          status={params?.status}
          from={params?.from}
          to={params?.to}
          resetHref="/incharge/operations/analytics"
        />
      </div>

      {/* ========================================== */}
      {/* CHARTS GRID                                */}
      {/* ========================================== */}
      <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-2">
        <OperationAnalyticsLineChart
          title="Query Generated Trend"
          description="Daily total query generation across operations employees."
          data={analytics.chartData}
          dataKey="queryGenerated"
        />

        <OperationAnalyticsLineChart
          title="Deals Done Trend"
          description="Daily completed deals across the operations department."
          data={analytics.chartData}
          dataKey="dealsDone"
        />

        <OperationAnalyticsLineChart
          title="Tutor Assigned Trend"
          description="Daily tutor assignment performance across employees."
          data={analytics.chartData}
          dataKey="tutorAssigned"
        />

        <OperationAnalyticsLineChart
          title="Deals Amount Trend"
          description="Daily deal amount generated by operations employees."
          data={analytics.chartData}
          dataKey="dealsDoneAmount"
          prefix="₹"
        />
      </div>

      {/* ========================================== */}
      {/* EMPLOYEE DATA TABLE                        */}
      {/* ========================================== */}
      <div className="min-w-0">
        <OperationAnalyticsEmployeeTable employees={analytics.employees} />
      </div>

    </div>
  );
}

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

function SummaryCard({
  title,
  value,
  icon: Icon,
  tone,
}: {
  title: string;
  value: string | number;
  icon: any;
  tone: "blue" | "purple" | "emerald" | "amber";
}) {
  const styles = {
    blue: "bg-blue-500/10 text-blue-600 border-blue-500/20 dark:text-blue-400",
    purple: "bg-purple-500/10 text-purple-600 border-purple-500/20 dark:text-purple-400",
    emerald: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:text-emerald-400",
    amber: "bg-amber-500/10 text-amber-600 border-amber-500/20 dark:text-amber-400",
  };

  return (
    <div className="flex flex-col rounded-xl border border-[var(--border)] bg-[var(--card)] p-3 shadow-sm sm:p-4">
      <div className="mb-2 flex items-start justify-between sm:mb-3">
        <p className="pr-2 text-[9px] font-semibold uppercase tracking-wider text-[var(--muted-foreground)] line-clamp-2 sm:text-[10px]">
          {title}
        </p>
        <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md border sm:h-8 sm:w-8 ${styles[tone]}`}>
          <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
        </div>
      </div>

      <h3 className="mt-auto truncate text-lg font-semibold text-[var(--foreground)] sm:text-xl">
        {value}
      </h3>
    </div>
  );
}

function StatusCard({ 
  title, 
  value,
  className = "" 
}: { 
  title: string; 
  value: number;
  className?: string; 
}) {
  return (
    <div className={`flex flex-col justify-center rounded-xl border border-[var(--border)] bg-[var(--card)] p-3 shadow-sm sm:p-4 ${className}`}>
      <div className="mb-1.5 flex items-center gap-1.5 text-[var(--primary)] sm:mb-2">
        <CheckCircle2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
        <p className="truncate text-[9px] font-semibold uppercase tracking-wider sm:text-[10px]">
          {title}
        </p>
      </div>

      <h3 className="truncate text-lg font-semibold text-[var(--foreground)] sm:text-xl">
        {value}
      </h3>
    </div>
  );
}