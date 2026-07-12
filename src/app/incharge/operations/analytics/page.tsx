import { redirect } from "next/navigation";
import {
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
    <div className="min-h-screen bg-[var(--background)] px-6 pt-12 pb-24 lg:px-12 max-w-[1700px] mx-auto space-y-8">
      <section className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="mb-2 text-[11px] font-black uppercase tracking-widest text-[var(--primary)]">
            Operations Analytics
          </p>

          <h1 className="text-4xl font-black tracking-tight text-[var(--foreground)]">
            Department Performance Analysis
          </h1>

          <p className="mt-2 text-sm font-medium text-[var(--muted-foreground)]">
            Analyze operations performance across queries, deals, tutors and
            deal amount.
          </p>
        </div>

        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)]/40 px-5 py-3 text-sm font-black text-[var(--foreground)]">
          {currentUser.department.name} Department
        </div>
      </section>

      <section className="grid grid-cols-2 gap-6 md:grid-cols-3 xl:grid-cols-6">
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

      <section className="grid grid-cols-2 gap-6 md:grid-cols-5">
        <StatusCard title="Submitted" value={analytics.totals.submitted} />
        <StatusCard title="Approved" value={analytics.totals.approved} />
        <StatusCard title="Rejected" value={analytics.totals.rejected} />
        <StatusCard
          title="Correction"
          value={analytics.totals.correctionRequired}
        />
        <StatusCard title="Draft" value={analytics.totals.draft} />
      </section>

      <OperationAnalyticsFilter
        search={params?.search}
        status={params?.status}
        from={params?.from}
        to={params?.to}
        resetHref="/incharge/operations/analytics"
      />

      <div className="grid gap-8">
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

      <OperationAnalyticsEmployeeTable employees={analytics.employees} />
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

function StatusCard({ title, value }: { title: string; value: number }) {
  return (
    <div className="rounded-[24px] border border-[var(--border)] bg-[var(--card)]/40 p-6 shadow-sm backdrop-blur-xl">
      <div className="mb-3 flex items-center gap-2 text-[var(--primary)]">
        <CheckCircle2 className="h-5 w-5" />
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