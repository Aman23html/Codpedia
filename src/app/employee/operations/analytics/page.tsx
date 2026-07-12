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
    <div className="min-h-screen bg-[var(--background)] px-6 pt-32 pb-24 lg:px-12 max-w-[1600px] mx-auto space-y-8">
      <section className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="mb-2 text-[11px] font-black uppercase tracking-widest text-[var(--primary)]">
            Operations Analytics
          </p>

          <h1 className="text-4xl font-black tracking-tight text-[var(--foreground)]">
            Performance Analysis
          </h1>

          <p className="mt-2 text-sm font-medium text-[var(--muted-foreground)]">
            Analyze your query generation, deals done, tutor assignment and
            submission performance.
          </p>
        </div>

        <OperationAnalyticsFilter activeFilter={filter} />
      </section>

      <section className="grid grid-cols-2 gap-6 md:grid-cols-4">
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

      <section className="grid gap-6 md:grid-cols-3">
        <MiniCard
          title="Average Queries"
          value={analytics.average.queryGenerated}
        />

        <MiniCard
          title="Average Deals"
          value={analytics.average.dealsDone}
        />

        <MiniCard
          title="Average Tutor Assigned"
          value={analytics.average.tutorAssigned}
        />
      </section>

      <div className="grid gap-8">
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

      <section className="rounded-[32px] border border-[var(--border)] bg-[var(--card)]/40 p-8 shadow-sm backdrop-blur-xl">
        <div className="mb-6 flex items-center gap-3">
          <div className="rounded-2xl bg-[var(--primary)]/10 p-3 text-[var(--primary)]">
            <Activity className="h-5 w-5" />
          </div>

          <div>
            <h2 className="text-xl font-black text-[var(--foreground)]">
              Submission Summary
            </h2>

            <p className="text-sm text-[var(--muted-foreground)]">
              Report status summary for the selected period.
            </p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-5">
          <StatusBox label="Draft" value={analytics.totals.draft} />
          <StatusBox label="Submitted" value={analytics.totals.submitted} />
          <StatusBox label="Approved" value={analytics.totals.approved} />
          <StatusBox label="Rejected" value={analytics.totals.rejected} />
          <StatusBox
            label="Correction"
            value={analytics.totals.correctionRequired}
          />
        </div>
      </section>
    </div>
  );
}

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
    blue: "bg-blue-500/10 text-blue-500",
    emerald: "bg-emerald-500/10 text-emerald-500",
    purple: "bg-purple-500/10 text-purple-500",
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

function MiniCard({ title, value }: { title: string; value: number }) {
  return (
    <div className="rounded-[24px] border border-[var(--border)] bg-[var(--card)]/40 p-6 shadow-sm backdrop-blur-xl">
      <div className="mb-3 flex items-center gap-2 text-[var(--primary)]">
        <TrendingUp className="h-5 w-5" />
        <p className="text-[10px] font-black uppercase tracking-widest">
          {title}
        </p>
      </div>

      <h3 className="text-3xl font-black text-[var(--foreground)]">{value}</h3>
    </div>
  );
}

function StatusBox({ label, value }: { label: string; value: number }) {
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