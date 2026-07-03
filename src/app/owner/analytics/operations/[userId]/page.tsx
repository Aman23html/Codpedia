import Link from "next/link";
import { notFound } from "next/navigation";

import {
  Activity,
  ArrowLeft,
  BarChart3,
  CheckCircle2,
  Clock,
  Database,
  FileText,
  IndianRupee,
  LineChart,
  Mail,
  Phone,
  Target,
  TrendingUp,
  User,
  UserCheck,
  Users,
  XCircle,
} from "lucide-react";

import OperationsLineChart from "@/components/operations/analytics/OperationsLineChart";
import { getOwnerOperationsUserAnalytics } from "@/actions/owner/get-owner-operations-user-analytics";

export default async function OwnerOperationsUserAnalyticsPage({
  params,
  searchParams,
}: {
  params: Promise<{ userId: string }>;
  searchParams?: Promise<{
    filter?: string;
    status?: string;
    startDate?: string;
    endDate?: string;
  }>;
}) {
  const { userId } = await params;
  const query = await searchParams;

  const filter = query?.filter ?? "ALL";
  const status = query?.status ?? "ALL";
  const startDate = query?.startDate ?? "";
const endDate = query?.endDate ?? "";
const hasCustomDate = Boolean(startDate || endDate);

  const data = await getOwnerOperationsUserAnalytics({
    userId,
    filter,
    status,
    startDate,
  endDate,
  });

  if (!data) {
    notFound();
  }

  const filters = ["TODAY", "7_DAYS", "30_DAYS", "ALL"];

  return (
    <div className="min-h-screen bg-[var(--background)] px-6 pt-28 pb-20 lg:pt-32 lg:px-12 max-w-[1700px] mx-auto space-y-10">
      <header className="relative overflow-hidden rounded-[36px] border border-[var(--border)] bg-[var(--card)]/45 p-8 shadow-sm backdrop-blur-xl lg:p-10">
        <div className="pointer-events-none absolute right-[-140px] top-[-140px] h-[380px] w-[380px] rounded-full bg-[var(--primary)]/10 blur-[90px]" />
        <div className="pointer-events-none absolute bottom-[-150px] left-[25%] h-[320px] w-[320px] rounded-full bg-purple-500/10 blur-[90px]" />

        <div className="relative z-10">
          <Link
            href="/owner/analytics/operations"
            className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-[var(--muted-foreground)] transition hover:text-[var(--foreground)]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Operations Analytics
          </Link>

          <div className="flex flex-col gap-8 xl:flex-row xl:items-end xl:justify-between">
            <div>
              <div className="mb-6 flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-[var(--border)] bg-[var(--background)] text-xl font-black text-[var(--foreground)]">
                  {data.employee.fullName.substring(0, 2).toUpperCase()}
                </div>

                <div>
                  <h1 className="text-4xl font-black tracking-tight text-[var(--foreground)] lg:text-5xl">
                    {data.employee.fullName}
                  </h1>

                  <p className="mt-2 text-sm font-semibold text-[var(--muted-foreground)]">
                    Owner view of individual operations performance.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <InfoPill icon={Mail} label={data.employee.email} />
                <InfoPill
                  icon={User}
                  label={data.employee.username ?? "No username"}
                />
                <InfoPill
                  icon={Phone}
                  label={data.employee.phone ?? "No phone"}
                />
                <InfoPill
                  icon={Activity}
                  label={data.employee.department?.name ?? "Operations"}
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <HeaderMetric
                title="Reports"
                value={data.summary.totalReports}
                icon={FileText}
              />

              <HeaderMetric
                title="Verified"
                value={`${data.approvalRate}%`}
                icon={CheckCircle2}
              />

              <HeaderMetric
                title="Amount"
                value={`₹${data.summary.dealsDoneAmount}`}
                icon={IndianRupee}
              />
            </div>
          </div>
        </div>
      </header>

      <section className="rounded-[30px] border border-[var(--border)] bg-[var(--card)]/40 p-5 shadow-sm backdrop-blur-xl">
  <div className="space-y-5">
    <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
      <div className="flex flex-wrap items-center gap-2">
        {filters.map((item) => (
          <Link
            key={item}
            href={`/owner/analytics/operations/${userId}?filter=${item}&status=${status}`}
            className={`rounded-2xl px-5 py-3 text-xs font-black uppercase tracking-widest transition ${
              !hasCustomDate && filter === item
                ? "bg-[var(--primary)] text-white shadow-lg"
                : "text-[var(--muted-foreground)] hover:bg-[var(--background)] hover:text-[var(--foreground)]"
            }`}
          >
            {item.replace("_", " ")}
          </Link>
        ))}
      </div>

      <form method="GET" className="flex flex-col gap-3 sm:flex-row">
        <input type="hidden" name="filter" value={filter} />

        <select
          name="status"
          defaultValue={status}
          className="rounded-2xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-sm font-bold outline-none focus:border-[var(--primary)]"
        >
          <option value="ALL">All Status</option>
          <option value="VERIFIED">Verified</option>
          <option value="PENDING">Pending</option>
          <option value="REJECTED">Rejected</option>
          <option value="DRAFT">Draft</option>
        </select>

        <button
          type="submit"
          className="rounded-2xl bg-[var(--primary)] px-6 py-3 text-xs font-black uppercase tracking-widest text-white transition hover:opacity-90"
        >
          Apply Status
        </button>
      </form>
    </div>

    <div className="rounded-[24px] border border-[var(--border)] bg-[var(--background)]/60 p-5">
      <div className="mb-4 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h3 className="text-sm font-black uppercase tracking-widest text-[var(--foreground)]">
            Custom Date Filter
          </h3>

          <p className="mt-1 text-xs font-semibold text-[var(--muted-foreground)]">
            Select one date or a date range to filter this employee’s operations analytics.
          </p>
        </div>

        {hasCustomDate && (
          <span className="rounded-xl border border-[var(--primary)]/20 bg-[var(--primary)]/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-[var(--primary)]">
            Custom Date Active
          </span>
        )}
      </div>

      <form method="GET" className="grid gap-4 md:grid-cols-[1fr_1fr_180px_130px]">
        <input type="hidden" name="filter" value="CUSTOM" />
        <input type="hidden" name="status" value={status} />

        <div>
          <label className="mb-2 block text-[10px] font-black uppercase tracking-widest text-[var(--muted-foreground)]">
            Start Date
          </label>

          <input
            type="date"
            name="startDate"
            defaultValue={startDate}
            className="w-full rounded-2xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-sm font-bold text-[var(--foreground)] outline-none focus:border-[var(--primary)]"
          />
        </div>

        <div>
          <label className="mb-2 block text-[10px] font-black uppercase tracking-widest text-[var(--muted-foreground)]">
            End Date
          </label>

          <input
            type="date"
            name="endDate"
            defaultValue={endDate}
            className="w-full rounded-2xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-sm font-bold text-[var(--foreground)] outline-none focus:border-[var(--primary)]"
          />
        </div>

        <div className="flex items-end">
          <button
            type="submit"
            className="w-full rounded-2xl bg-[var(--primary)] px-6 py-3 text-xs font-black uppercase tracking-widest text-white transition hover:opacity-90"
          >
            Apply Date
          </button>
        </div>

        <div className="flex items-end">
          <Link
            href={`/owner/analytics/operations/${userId}?filter=ALL&status=${status}`}
            className="flex w-full items-center justify-center rounded-2xl border border-[var(--border)] bg-[var(--card)] px-6 py-3 text-xs font-black uppercase tracking-widest text-[var(--muted-foreground)] transition hover:text-[var(--foreground)]"
          >
            Clear
          </Link>
        </div>
      </form>
    </div>
  </div>
</section>

      <section className="grid grid-cols-2 gap-5 md:grid-cols-4 xl:grid-cols-8">
        <SummaryCard
          title="Reports"
          value={data.summary.totalReports}
          icon={FileText}
          tone="blue"
        />

        <SummaryCard
          title="Queries"
          value={data.summary.queryGenerated}
          icon={Target}
          tone="purple"
        />

        <SummaryCard
          title="Deals"
          value={data.summary.dealsDone}
          icon={TrendingUp}
          tone="emerald"
        />

        <SummaryCard
          title="Tutor"
          value={data.summary.tutorAssigned}
          icon={UserCheck}
          tone="amber"
        />

        <SummaryCard
          title="Amount"
          value={data.summary.dealsDoneAmount}
          icon={IndianRupee}
          tone="indigo"
          prefix="₹"
        />

        <SummaryCard
          title="Verified"
          value={data.summary.verified}
          icon={CheckCircle2}
          tone="emerald"
        />

        <SummaryCard
          title="Pending"
          value={data.summary.pending}
          icon={Clock}
          tone="amber"
        />

        <SummaryCard
          title="Rejected"
          value={data.summary.rejected}
          icon={XCircle}
          tone="red"
        />
      </section>

      <section className="grid gap-8 lg:grid-cols-12">
        <div className="rounded-[34px] border border-[var(--border)] bg-[var(--card)]/40 p-8 shadow-sm backdrop-blur-xl lg:col-span-8">
          <div className="mb-8">
            <h2 className="flex items-center gap-3 text-2xl font-black text-[var(--foreground)]">
              <LineChart className="h-6 w-6 text-[var(--primary)]" />
              Employee Operations Trend
            </h2>

            <p className="mt-2 text-sm font-medium text-[var(--muted-foreground)]">
              Day-wise operations progress for this employee.
            </p>
          </div>

          <div className="grid gap-8 xl:grid-cols-2">
            <ChartCard title="Query Generated">
              <OperationsLineChart
                data={data.chartData}
                dataKey="queryGenerated"
                label="Query Generated"
              />
            </ChartCard>

            <ChartCard title="Deals Done">
              <OperationsLineChart
                data={data.chartData}
                dataKey="dealsDone"
                label="Deals Done"
              />
            </ChartCard>

            <ChartCard title="Tutor Assigned">
              <OperationsLineChart
                data={data.chartData}
                dataKey="tutorAssigned"
                label="Tutor Assigned"
              />
            </ChartCard>

            <ChartCard title="Deals Done Amount">
              <OperationsLineChart
                data={data.chartData}
                dataKey="dealsDoneAmount"
                label="Deals Done Amount"
                prefix="₹"
              />
            </ChartCard>
          </div>
        </div>

        <div className="rounded-[34px] border border-[var(--border)] bg-[var(--card)]/40 p-8 shadow-sm backdrop-blur-xl lg:col-span-4">
          <h2 className="mb-6 flex items-center gap-3 text-2xl font-black text-[var(--foreground)]">
            <BarChart3 className="h-6 w-6 text-[var(--primary)]" />
            Status Summary
          </h2>

          <div className="space-y-4">
            {data.statusRows.map((row) => (
              <div
                key={row.status}
                className="rounded-2xl border border-[var(--border)] bg-[var(--background)] p-5"
              >
                <div className="mb-3 flex items-center justify-between">
                  <p className="font-black text-[var(--foreground)]">
                    {row.label}
                  </p>

                  <StatusBadge status={row.status} />
                </div>

                <p className="text-3xl font-black text-[var(--foreground)]">
                  {row.value}
                </p>

                <p className="mt-1 text-[10px] font-black uppercase tracking-widest text-[var(--muted-foreground)]">
                  Reports
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-8 lg:grid-cols-4">
        <OutputCard
          title="Query Generated"
          value={data.summary.queryGenerated}
          icon={Target}
        />

        <OutputCard
          title="Deals Done"
          value={data.summary.dealsDone}
          icon={TrendingUp}
        />

        <OutputCard
          title="Tutor Assigned"
          value={data.summary.tutorAssigned}
          icon={UserCheck}
        />

        <OutputCard
          title="Deals Amount"
          value={`₹${data.summary.dealsDoneAmount}`}
          icon={IndianRupee}
        />
      </section>

      <section className="overflow-hidden rounded-[34px] border border-[var(--border)] bg-[var(--card)]/40 shadow-sm backdrop-blur-xl">
        <div className="border-b border-[var(--border)]/60 px-8 py-6">
          <h2 className="flex items-center gap-3 text-2xl font-black text-[var(--foreground)]">
            <Database className="h-6 w-6 text-[var(--primary)]" />
            Detailed Operations Ledger
          </h2>

          <p className="mt-2 text-sm font-medium text-[var(--muted-foreground)]">
            Complete report history for this operations employee.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1250px] text-left">
            <thead className="border-b border-[var(--border)]/60 bg-[var(--background)]/50">
              <tr>
                <TableHead>Date</TableHead>
                <TableHead>Queries</TableHead>
                <TableHead>Deals</TableHead>
                <TableHead>Tutor</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Submitted</TableHead>
              </tr>
            </thead>

            <tbody className="divide-y divide-[var(--border)]/50">
              {data.reports.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-8 py-16 text-center text-sm font-semibold text-[var(--muted-foreground)]"
                  >
                    No operations reports found.
                  </td>
                </tr>
              ) : (
                data.reports.map((report) => (
                  <tr
                    key={report.id}
                    className="transition hover:bg-[var(--background)]/60"
                  >
                    <td className="whitespace-nowrap px-8 py-5 font-bold text-[var(--foreground)]">
                      {new Date(report.reportDate).toLocaleDateString(
                        "en-IN",
                        {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        }
                      )}
                    </td>

                    <TableValue value={report.queryGenerated ?? 0} />
                    <TableValue value={report.dealsDone ?? 0} />
                    <TableValue value={report.tutorAssigned ?? 0} />
                    <TableValue value={`₹${report.dealsDoneAmount ?? 0}`} />

                    <td className="whitespace-nowrap px-8 py-5">
                      <StatusBadge status={report.status} />
                    </td>

                    <td className="whitespace-nowrap px-8 py-5 text-sm font-semibold text-[var(--muted-foreground)]">
                      {report.submittedAt
                        ? new Date(report.submittedAt).toLocaleString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "-"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function InfoPill({
  icon: Icon,
  label,
}: {
  icon: React.ElementType;
  label: string;
}) {
  return (
    <span className="inline-flex items-center gap-2 rounded-2xl border border-[var(--border)] bg-[var(--background)] px-4 py-2 text-xs font-bold text-[var(--muted-foreground)]">
      <Icon className="h-4 w-4 text-[var(--primary)]" />
      {label}
    </span>
  );
}

function HeaderMetric({
  title,
  value,
  icon: Icon,
}: {
  title: string;
  value: string | number;
  icon: React.ElementType;
}) {
  return (
    <div className="min-w-[125px] rounded-2xl border border-[var(--border)] bg-[var(--background)]/70 p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <Icon className="h-4 w-4 text-[var(--primary)]" />

        <span className="text-[10px] font-black uppercase tracking-widest text-[var(--muted-foreground)]">
          Live
        </span>
      </div>

      <p className="text-2xl font-black text-[var(--foreground)]">{value}</p>

      <p className="mt-1 text-[10px] font-black uppercase tracking-widest text-[var(--muted-foreground)]">
        {title}
      </p>
    </div>
  );
}

function SummaryCard({
  title,
  value,
  icon: Icon,
  tone,
  prefix = "",
}: {
  title: string;
  value: number;
  icon: React.ElementType;
  tone: "blue" | "purple" | "emerald" | "amber" | "red" | "indigo";
  prefix?: string;
}) {
  const styles = {
    blue: "border-blue-500/20 bg-blue-500/10 text-blue-500",
    purple: "border-purple-500/20 bg-purple-500/10 text-purple-500",
    emerald: "border-emerald-500/20 bg-emerald-500/10 text-emerald-500",
    amber: "border-amber-500/20 bg-amber-500/10 text-amber-500",
    red: "border-red-500/20 bg-red-500/10 text-red-500",
    indigo: "border-indigo-500/20 bg-indigo-500/10 text-indigo-500",
  };

  return (
    <div className="rounded-[24px] border border-[var(--border)] bg-[var(--card)]/40 p-5 shadow-sm backdrop-blur-xl transition hover:-translate-y-1 hover:border-[var(--primary)]/30">
      <div className={`mb-4 w-fit rounded-2xl border p-3 ${styles[tone]}`}>
        <Icon className="h-5 w-5" />
      </div>

      <p className="text-3xl font-black text-[var(--foreground)]">
        {prefix}
        {value}
      </p>

      <p className="mt-1 text-[9px] font-black uppercase tracking-widest text-[var(--muted-foreground)]">
        {title}
      </p>
    </div>
  );
}

function ChartCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-[28px] border border-[var(--border)] bg-[var(--background)]/60 p-6">
      <h3 className="mb-5 text-lg font-black text-[var(--foreground)]">
        {title}
      </h3>

      {children}
    </div>
  );
}

function OutputCard({
  title,
  value,
  icon: Icon,
}: {
  title: string;
  value: string | number;
  icon: React.ElementType;
}) {
  return (
    <div className="rounded-[30px] border border-[var(--border)] bg-[var(--card)]/40 p-7 shadow-sm backdrop-blur-xl">
      <div className="mb-6 flex items-center gap-4">
        <div className="rounded-2xl bg-[var(--primary)]/10 p-3 text-[var(--primary)]">
          <Icon className="h-5 w-5" />
        </div>

        <div>
          <h3 className="text-xl font-black text-[var(--foreground)]">
            {title}
          </h3>

          <p className="text-sm font-medium text-[var(--muted-foreground)]">
            Operations output summary
          </p>
        </div>
      </div>

      <p className="text-4xl font-black text-[var(--foreground)]">{value}</p>
    </div>
  );
}

function TableHead({ children }: { children: React.ReactNode }) {
  return (
    <th className="whitespace-nowrap px-8 py-4 text-[10px] font-black uppercase tracking-widest text-[var(--muted-foreground)]">
      {children}
    </th>
  );
}

function TableValue({ value }: { value: string | number }) {
  return (
    <td className="whitespace-nowrap px-8 py-5 text-sm font-black text-[var(--foreground)]">
      {value}
    </td>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    VERIFIED: "border-emerald-500/20 bg-emerald-500/10 text-emerald-500",
    PENDING: "border-amber-500/20 bg-amber-500/10 text-amber-500",
    REJECTED: "border-red-500/20 bg-red-500/10 text-red-500",
    DRAFT: "border-slate-500/20 bg-slate-500/10 text-slate-500",
  };

  return (
    <span
      className={`inline-flex rounded-xl border px-3 py-1.5 text-[10px] font-black uppercase tracking-widest ${
        styles[status] ??
        "border-[var(--border)] bg-[var(--background)] text-[var(--muted-foreground)]"
      }`}
    >
      {status.replaceAll("_", " ")}
    </span>
  );
}