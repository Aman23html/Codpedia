import { redirect } from "next/navigation";
import {
  BadgeIndianRupee,
  CheckCircle2,
  FileText,
  Handshake,
  RotateCcw,
  UserCheck,
  XCircle,
} from "lucide-react";

import { getCurrentUser } from "@/lib/current-user";
import { getOperationReviewReports } from "@/actions/incharge/operations/get-operation-review-reports";

import OperationReviewFilter from "@/components/incharge/operations/operation-review-filter";
import OperationReviewTable from "@/components/incharge/operations/operation-review-table";

import { DepartmentType, Role } from "@prisma/client";

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
    <div className="min-h-screen bg-[var(--background)] px-6 pt-12 pb-24 lg:px-12 max-w-[1700px] mx-auto space-y-8">
      <section className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="mb-2 text-[11px] font-black uppercase tracking-widest text-[var(--primary)]">
            Operations Reports
          </p>

          <h1 className="text-4xl font-black tracking-tight text-[var(--foreground)]">
            Employee Submission Review
          </h1>

          <p className="mt-2 text-sm font-medium text-[var(--muted-foreground)]">
            Review employee submitted operations data and approve, reject, or request correction.
          </p>
        </div>

        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)]/40 px-5 py-3 text-sm font-black text-[var(--foreground)]">
          {currentUser.department.name} Department
        </div>
      </section>

      <section className="grid grid-cols-2 gap-6 md:grid-cols-3 xl:grid-cols-6">
        <SummaryCard
          title="Reports"
          value={data.totals.totalReports}
          icon={FileText}
          tone="blue"
        />

        <SummaryCard
          title="Pending"
          value={data.totals.submitted}
          icon={UserCheck}
          tone="amber"
        />

        <SummaryCard
          title="Approved"
          value={data.totals.approved}
          icon={CheckCircle2}
          tone="emerald"
        />

        <SummaryCard
          title="Rejected"
          value={data.totals.rejected}
          icon={XCircle}
          tone="red"
        />

        <SummaryCard
          title="Correction"
          value={data.totals.correctionRequired}
          icon={RotateCcw}
          tone="purple"
        />

        <SummaryCard
          title="Amount"
          value={`₹${data.totals.dealsDoneAmount.toLocaleString("en-IN")}`}
          icon={BadgeIndianRupee}
          tone="emerald"
        />
      </section>

      <section className="grid grid-cols-2 gap-6 md:grid-cols-4">
        <MetricCard title="Query Generated" value={data.totals.queryGenerated} />
        <MetricCard title="Deals Done" value={data.totals.dealsDone} />
        <MetricCard title="Tutor Assigned" value={data.totals.tutorAssigned} />
        <MetricCard title="Deals Amount" value={`₹${data.totals.dealsDoneAmount.toLocaleString("en-IN")}`} />
      </section>

      <OperationReviewFilter
        search={params?.search}
        status={params?.status ?? "SUBMITTED"}
        from={params?.from}
        to={params?.to}
      />

      <OperationReviewTable reports={data.reports} />
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
  tone: "blue" | "amber" | "emerald" | "red" | "purple";
}) {
  const styles = {
    blue: "bg-blue-500/10 text-blue-500",
    amber: "bg-amber-500/10 text-amber-500",
    emerald: "bg-emerald-500/10 text-emerald-500",
    red: "bg-red-500/10 text-red-500",
    purple: "bg-purple-500/10 text-purple-500",
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

function MetricCard({
  title,
  value,
}: {
  title: string;
  value: string | number;
}) {
  return (
    <div className="rounded-[24px] border border-[var(--border)] bg-[var(--card)]/40 p-6 shadow-sm backdrop-blur-xl">
      <p className="text-[10px] font-black uppercase tracking-widest text-[var(--muted-foreground)]">
        {title}
      </p>

      <h3 className="mt-4 text-3xl font-black text-[var(--foreground)]">
        {value}
      </h3>
    </div>
  );
}