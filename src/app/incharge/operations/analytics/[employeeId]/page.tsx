import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import {
  ArrowLeft,
  BadgeIndianRupee,
  FileText,
  Handshake,
  Percent,
  TrendingUp,
  UserCheck,
} from "lucide-react";

import { getCurrentUser } from "@/lib/current-user";
import { getOperationEmployeeAnalytics } from "@/actions/incharge/operations/get-operation-employee-analytics";

import OperationAnalyticsLineChart from "@/components/incharge/operations/operation-analytics-line-chart";
import OperationEmployeeAnalyticsFilter from "@/components/incharge/operations/operation-employee-analytics-filter";

import { DepartmentType, Role } from "@/constants/enums";

export default async function OperationEmployeeAnalyticsPage({
  params,
  searchParams,
}: {
  params: Promise<{
    employeeId: string;
  }>;
  searchParams?: Promise<{
    status?: string;
    from?: string;
    to?: string;
  }>;
}) {
  const { employeeId } = await params;
  const query = await searchParams;

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

  const data = await getOperationEmployeeAnalytics(employeeId, {
    status: query?.status,
    from: query?.from,
    to: query?.to,
  });

  if (!data) {
    notFound();
  }

  const empIdFallback = data.employee.id || data.employee._id;
  const shortEmpId = `EMP-${String(empIdFallback).substring(0, 6).toUpperCase()}`;

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-[1400px] flex-col gap-4 px-4 py-5 pt-20 sm:gap-5 sm:px-5 md:pt-24 lg:px-6">
      
      {/* ========================================== */}
      {/* 1. COMPACT HEADER                          */}
      {/* ========================================== */}
      <header className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div className="flex min-w-0 flex-1 flex-col items-start gap-1">
          <Link
            href="/incharge/operations/analytics"
            className="mb-1 inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-[var(--muted-foreground)] transition-colors hover:text-[var(--foreground)]"
          >
            <ArrowLeft className="h-3 w-3" />
            Back to Analytics
          </Link>
          
          <h1 className="truncate text-xl font-semibold tracking-tight text-[var(--foreground)] sm:text-2xl">
            {data.employee.fullName}
          </h1>
          
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="truncate font-mono text-[12px] font-medium text-[var(--muted-foreground)]">
              {data.employee.employeeCode || shortEmpId}
            </span>
            <span className="h-[3px] w-[3px] shrink-0 rounded-full bg-[var(--border)]"></span>
            <span className="truncate text-[12px] text-[var(--muted-foreground)]">
              {data.employee.email}
            </span>
            <span className="h-[3px] w-[3px] shrink-0 rounded-full bg-[var(--border)]"></span>
            <span className="truncate text-[12px] text-[var(--muted-foreground)]">
              {data.employee.phone || "No phone"}
            </span>
          </div>
        </div>

        <div className="mt-2 flex w-full shrink-0 flex-col sm:w-auto md:mt-0">
          <OperationEmployeeAnalyticsFilter
            status={query?.status}
            from={query?.from}
            to={query?.to}
            resetHref={`/incharge/operations/analytics/${employeeId}`}
          />
        </div>
      </header>

      {/* ========================================== */}
      {/* 2. DENSE KPI GRID (TOTALS)                 */}
      {/* ========================================== */}
      <section className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6 mt-1">
        <SummaryCard title="Reports" value={data.totals.totalReports} icon={FileText} tone="blue" />
        <SummaryCard title="Queries" value={data.totals.queryGenerated} icon={FileText} tone="purple" />
        <SummaryCard title="Deals" value={data.totals.dealsDone} icon={Handshake} tone="emerald" />
        <SummaryCard title="Tutors" value={data.totals.tutorAssigned} icon={UserCheck} tone="amber" />
        <SummaryCard title="Amount" value={`₹${data.totals.dealsDoneAmount.toLocaleString("en-IN")}`} icon={BadgeIndianRupee} tone="emerald" />
        <SummaryCard title="Approval Rate" value={`${data.approvalRate}%`} icon={Percent} tone="blue" />
      </section>

      {/* ========================================== */}
      {/* 3. AVERAGES METRICS GRID                   */}
      {/* ========================================== */}
      <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <AverageCard title="Avg Queries" value={data.average.queryGenerated} />
        <AverageCard title="Avg Deals" value={data.average.dealsDone} />
        <AverageCard title="Avg Tutors" value={data.average.tutorAssigned} />
        <AverageCard title="Avg Amount" value={`₹${data.average.dealsDoneAmount.toLocaleString("en-IN")}`} />
      </section>

      {/* ========================================== */}
      {/* 4. COMPACT STATUS SUMMARY                  */}
      {/* ========================================== */}
      <section className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4 shadow-sm sm:p-5">
        <h2 className="mb-3 text-[13px] font-semibold text-[var(--foreground)]">
          Document Status Summary
        </h2>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-5 sm:gap-3">
          <StatusBox label="Draft" value={data.totals.draft} />
          <StatusBox label="Submitted" value={data.totals.submitted} />
          <StatusBox label="Approved" value={data.totals.approved} />
          <StatusBox label="Rejected" value={data.totals.rejected} />
          <StatusBox label="Correction" value={data.totals.correctionRequired} />
        </div>
      </section>

      {/* ========================================== */}
      {/* 5. CHARTS GRID (2 COLUMNS)                 */}
      {/* ========================================== */}
      <section className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <OperationAnalyticsLineChart
          title="Query Generated Trend"
          description="Daily query generation trend for this employee."
          data={data.chartData}
          dataKey="queryGenerated"
        />
        <OperationAnalyticsLineChart
          title="Deals Done Trend"
          description="Daily deals completed by this employee."
          data={data.chartData}
          dataKey="dealsDone"
        />
        <OperationAnalyticsLineChart
          title="Tutor Assigned Trend"
          description="Daily tutor assignment trend for this employee."
          data={data.chartData}
          dataKey="tutorAssigned"
        />
        <OperationAnalyticsLineChart
          title="Deals Amount Trend"
          description="Daily deal amount generated by this employee."
          data={data.chartData}
          dataKey="dealsDoneAmount"
          prefix="₹"
        />
      </section>
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
  icon: any; // Using explicit lucide icon prop
  tone: "blue" | "purple" | "emerald" | "amber";
}) {
  const styles = {
    blue: "bg-blue-500/10 text-blue-600 border-blue-500/20 dark:text-blue-400",
    purple: "bg-purple-500/10 text-purple-600 border-purple-500/20 dark:text-purple-400",
    emerald: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:text-emerald-400",
    amber: "bg-amber-500/10 text-amber-600 border-amber-500/20 dark:text-amber-400",
  };

  return (
    <div className="flex h-[72px] items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 py-3 shadow-sm transition-colors hover:bg-[var(--accent)]/50">
      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border ${styles[tone]}`}>
        <Icon className="h-4 w-4" />
      </div>
      <div className="flex min-w-0 flex-col">
        <p className="truncate text-[10px] font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
          {title}
        </p>
        <h3 className="mt-0.5 truncate text-[19px] font-bold leading-none tracking-tight text-[var(--foreground)]">
          {value}
        </h3>
      </div>
    </div>
  );
}

function AverageCard({
  title,
  value,
}: {
  title: string;
  value: string | number;
}) {
  return (
    <div className="flex h-[64px] items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--card)] px-3 py-2 shadow-sm transition-colors hover:bg-[var(--accent)]/50 sm:px-4">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-[var(--primary)]/10 text-[var(--primary)]">
        <TrendingUp className="h-4 w-4" />
      </div>
      <div className="flex min-w-0 flex-col">
        <p className="truncate text-[9px] font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
          {title}
        </p>
        <h3 className="mt-0.5 truncate text-[15px] font-bold tracking-tight text-[var(--foreground)]">
          {value}
        </h3>
      </div>
    </div>
  );
}

function StatusBox({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="flex flex-col justify-center rounded-lg border border-[var(--border)] bg-[var(--background)]/60 p-2.5 shadow-sm sm:p-3">
      <p className="text-[9px] font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
        {label}
      </p>
      <h3 className="mt-1 text-base font-bold leading-none text-[var(--foreground)] sm:text-lg">
        {value}
      </h3>
    </div>
  );
}