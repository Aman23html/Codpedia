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

import { DepartmentType, Role } from "@prisma/client";

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

  return (
    <div className="min-h-screen bg-[var(--background)] px-6 pt-12 pb-24 lg:px-12 max-w-[1700px] mx-auto space-y-8">
      <section className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <Link
            href="/incharge/operations/analytics"
            className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to analytics
          </Link>

          <p className="mb-2 text-[11px] font-black uppercase tracking-widest text-[var(--primary)]">
            Employee Operations Analytics
          </p>

          <h1 className="text-4xl font-black tracking-tight text-[var(--foreground)]">
            {data.employee.fullName}
          </h1>

          <p className="mt-2 text-sm font-medium text-[var(--muted-foreground)]">
            EMP-{data.employee.id.substring(0, 6).toUpperCase()} •{" "}
            {data.employee.email} • {data.employee.phone || "No phone"}
          </p>
        </div>

        <OperationEmployeeAnalyticsFilter
          status={query?.status}
          from={query?.from}
          to={query?.to}
          resetHref={`/incharge/operations/analytics/${employeeId}`}
        />
      </section>

      <section className="grid grid-cols-2 gap-6 md:grid-cols-3 xl:grid-cols-6">
        <SummaryCard
          title="Reports"
          value={data.totals.totalReports}
          icon={FileText}
          tone="blue"
        />

        <SummaryCard
          title="Queries"
          value={data.totals.queryGenerated}
          icon={FileText}
          tone="purple"
        />

        <SummaryCard
          title="Deals"
          value={data.totals.dealsDone}
          icon={Handshake}
          tone="emerald"
        />

        <SummaryCard
          title="Tutors"
          value={data.totals.tutorAssigned}
          icon={UserCheck}
          tone="amber"
        />

        <SummaryCard
          title="Amount"
          value={`₹${data.totals.dealsDoneAmount.toLocaleString("en-IN")}`}
          icon={BadgeIndianRupee}
          tone="emerald"
        />

        <SummaryCard
          title="Approval Rate"
          value={`${data.approvalRate}%`}
          icon={Percent}
          tone="blue"
        />
      </section>

      <section className="grid grid-cols-2 gap-6 md:grid-cols-4">
        <AverageCard title="Avg Queries" value={data.average.queryGenerated} />
        <AverageCard title="Avg Deals" value={data.average.dealsDone} />
        <AverageCard title="Avg Tutors" value={data.average.tutorAssigned} />
        <AverageCard
          title="Avg Amount"
          value={`₹${data.average.dealsDoneAmount.toLocaleString("en-IN")}`}
        />
      </section>

      <div className="grid gap-8">
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
      </div>

      <section className="rounded-[32px] border border-[var(--border)] bg-[var(--card)]/40 p-8 shadow-sm backdrop-blur-xl">
        <h2 className="mb-6 text-2xl font-black text-[var(--foreground)]">
          Status Summary
        </h2>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
          <StatusBox label="Draft" value={data.totals.draft} />
          <StatusBox label="Submitted" value={data.totals.submitted} />
          <StatusBox label="Approved" value={data.totals.approved} />
          <StatusBox label="Rejected" value={data.totals.rejected} />
          <StatusBox
            label="Correction"
            value={data.totals.correctionRequired}
          />
        </div>
      </section>
    </div>
  );
}

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
    blue: "bg-blue-500/10 text-blue-500",
    purple: "bg-purple-500/10 text-purple-500",
    emerald: "bg-emerald-500/10 text-emerald-500",
    amber: "bg-amber-500/10 text-amber-500",
  };

  return (
    <div className="rounded-[24px] border border-[var(--border)] bg-[var(--card)]/40 p-6 shadow-sm backdrop-blur-xl">
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-black uppercase tracking-widest text-[var(--muted-foreground)]">
          {title}
        </p>

        <div className={`rounded-2xl p-3 ${styles[tone]}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>

      <h3 className="mt-5 text-3xl font-black text-[var(--foreground)]">
        {value}
      </h3>
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
    <div className="rounded-[24px] border border-[var(--border)] bg-[var(--card)]/40 p-6 shadow-sm backdrop-blur-xl">
      <div className="mb-3 flex items-center gap-2 text-[var(--primary)]">
        <TrendingUp className="h-5 w-5" />
        <p className="text-[10px] font-black uppercase tracking-widest">
          {title}
        </p>
      </div>

      <h3 className="text-3xl font-black text-[var(--foreground)]">
        {value}
      </h3>
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
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--background)] p-5">
      <p className="text-[10px] font-black uppercase tracking-widest text-[var(--muted-foreground)]">
        {label}
      </p>

      <h3 className="mt-3 text-2xl font-black text-[var(--foreground)]">
        {value}
      </h3>
    </div>
  );
}