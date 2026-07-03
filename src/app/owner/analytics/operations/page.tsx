import Link from "next/link";
import {
  ArrowLeft,
  BarChart3,
  CheckCircle2,
  Clock,
  Database,
  FileText,
  Filter,
  IndianRupee,
  Search,
  Target,
  TrendingUp,
  UserCheck,
  Users,
  XCircle,
} from "lucide-react";

import { getOwnerOperationsAnalytics } from "@/actions/owner/get-owner-operations-analytics";

export default async function OwnerOperationsAnalyticsPage({
  searchParams,
}: {
  searchParams?: Promise<{
    filter?: string;
    status?: string;
    search?: string;
  }>;
}) {
  const params = await searchParams;

  const filter = params?.filter ?? "ALL";
  const status = params?.status ?? "ALL";
  const search = params?.search ?? "";

  const data = await getOwnerOperationsAnalytics({
    filter,
    status,
    search,
  });

  const filters = ["TODAY", "7_DAYS", "30_DAYS", "ALL"];

  return (
    <div className="min-h-screen bg-[var(--background)] px-6 pt-28 pb-20 lg:pt-32 lg:px-12 max-w-[1700px] mx-auto space-y-10">
      <header className="relative overflow-hidden rounded-[36px] border border-[var(--border)] bg-[var(--card)]/45 p-8 shadow-sm backdrop-blur-xl lg:p-10">
        <div className="pointer-events-none absolute right-[-140px] top-[-140px] h-[380px] w-[380px] rounded-full bg-[var(--primary)]/10 blur-[90px]" />
        <div className="pointer-events-none absolute bottom-[-150px] left-[25%] h-[320px] w-[320px] rounded-full bg-purple-500/10 blur-[90px]" />

        <div className="relative z-10">
          <Link
            href="/owner/analytics"
            className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-[var(--muted-foreground)] transition hover:text-[var(--foreground)]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Owner Analytics
          </Link>

          <div className="flex flex-col gap-8 xl:flex-row xl:items-end xl:justify-between">
            <div>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[var(--primary)]/20 bg-[var(--primary)]/10 px-4 py-2 text-[11px] font-black uppercase tracking-widest text-[var(--primary)]">
                <BarChart3 className="h-3.5 w-3.5" />
                Owner Operations Analytics
              </div>

              <h1 className="mb-4 text-4xl font-black tracking-tight text-[var(--foreground)] lg:text-5xl">
                Operations Department Performance
              </h1>

              <p className="max-w-3xl text-base font-medium leading-7 text-[var(--muted-foreground)]">
                View owner-level operations performance across all operations
                employees, queries, deals, tutor assignment, and amount flow.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <HeaderMetric
                title="Employees"
                value={data.totalEmployees}
                icon={Users}
              />

              <HeaderMetric
                title="Reports"
                value={data.totalReports}
                icon={FileText}
              />

              <HeaderMetric
                title="Approval"
                value={`${data.approvalRate}%`}
                icon={TrendingUp}
              />
            </div>
          </div>
        </div>
      </header>

      <section className="rounded-[30px] border border-[var(--border)] bg-[var(--card)]/40 p-5 shadow-sm backdrop-blur-xl">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            {filters.map((item) => (
              <Link
                key={item}
                href={`/owner/analytics/operations?filter=${item}&status=${status}&search=${search}`}
                className={`rounded-2xl px-5 py-3 text-xs font-black uppercase tracking-widest transition ${
                  filter === item
                    ? "bg-[var(--primary)] text-white shadow-lg"
                    : "text-[var(--muted-foreground)] hover:bg-[var(--background)] hover:text-[var(--foreground)]"
                }`}
              >
                {item.replace("_", " ")}
              </Link>
            ))}
          </div>

          <form
            method="GET"
            className="flex flex-col gap-3 sm:flex-row sm:items-center"
          >
            <input type="hidden" name="filter" value={filter} />

            <div className="relative">
              <Filter className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--primary)]" />

              <select
                name="status"
                defaultValue={status}
                className="w-full appearance-none rounded-2xl border border-[var(--border)] bg-[var(--background)] py-3 pl-11 pr-10 text-sm font-bold outline-none focus:border-[var(--primary)] sm:w-[180px]"
              >
                <option value="ALL">All Status</option>
                <option value="APPROVED">Approved</option>
                <option value="PENDING">Pending</option>
                <option value="REJECTED">Rejected</option>
                <option value="DRAFT">Draft</option>
              </select>
            </div>

            <div className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted-foreground)]" />

              <input
                type="text"
                name="search"
                defaultValue={search}
                placeholder="Search employee..."
                className="w-full rounded-2xl border border-[var(--border)] bg-[var(--background)] py-3 pl-11 pr-4 text-sm font-bold outline-none focus:border-[var(--primary)] sm:w-[280px]"
              />
            </div>

            <button
              type="submit"
              className="rounded-2xl bg-[var(--primary)] px-6 py-3 text-xs font-black uppercase tracking-widest text-white transition hover:opacity-90"
            >
              Apply
            </button>
          </form>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-5 md:grid-cols-3 xl:grid-cols-6">
        <KPICard title="Reports" value={data.totalReports} icon={FileText} tone="blue" />
        <KPICard title="Approved" value={data.approvedReports} icon={CheckCircle2} tone="emerald" />
        <KPICard title="Pending" value={data.pendingReports} icon={Clock} tone="amber" />
        <KPICard title="Rejected" value={data.rejectedReports} icon={XCircle} tone="red" />
        <KPICard title="Queries" value={data.totalQueryGenerated} icon={Target} tone="purple" />
        <KPICard title="Deals" value={data.totalDealsDone} icon={TrendingUp} tone="indigo" />
      </section>

      <section className="grid gap-8 lg:grid-cols-2">
        <MetricSection
          title="Operations Work Output"
          description="Combined work completed by all operations employees."
          icon={Target}
        >
          <MiniCard title="Query Generated" value={data.totalQueryGenerated} />
          <MiniCard title="Deals Done" value={data.totalDealsDone} />
          <MiniCard title="Tutor Assigned" value={data.totalTutorAssigned} />
          <MiniCard
            title="Deals Amount"
            value={data.totalDealsDoneAmount}
            icon={IndianRupee}
          />
        </MetricSection>

        <MetricSection
          title="Approval Status"
          description="Status distribution of operations reports."
          icon={CheckCircle2}
        >
          <MiniCard title="Approved" value={data.approvedReports} />
          <MiniCard title="Pending" value={data.pendingReports} />
          <MiniCard title="Rejected" value={data.rejectedReports} />
          <MiniCard title="Draft" value={data.draftReports} />
        </MetricSection>
      </section>

      <section className="overflow-hidden rounded-[34px] border border-[var(--border)] bg-[var(--card)]/40 shadow-sm backdrop-blur-xl">
        <div className="flex flex-col gap-3 border-b border-[var(--border)]/60 px-8 py-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="flex items-center gap-3 text-2xl font-black text-[var(--foreground)]">
              <Database className="h-6 w-6 text-[var(--primary)]" />
              Employee-wise Operations Summary
            </h2>

            <p className="mt-2 text-sm font-medium text-[var(--muted-foreground)]">
              Owner view of each operations employee’s report output.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1250px] text-left">
            <thead className="border-b border-[var(--border)]/60 bg-[var(--background)]/50">
              <tr>
                <TableHead>Employee</TableHead>
                <TableHead>Last Report</TableHead>
                <TableHead>Queries</TableHead>
                <TableHead>Deals</TableHead>
                <TableHead>Tutor</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead alignRight>Reports</TableHead>
              </tr>
            </thead>

            <tbody className="divide-y divide-[var(--border)]/50">
              {data.employees.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-8 py-16 text-center text-sm font-semibold text-[var(--muted-foreground)]"
                  >
                    No operations reports found.
                  </td>
                </tr>
              ) : (
                data.employees.map((employee: any) => (
                  <tr
                    key={employee.employeeCode ||  "Not Generated"}
                    className="transition hover:bg-[var(--background)]/60"
                  >
                    <td className="whitespace-nowrap px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[var(--border)] bg-[var(--background)] text-sm font-black text-[var(--foreground)]">
                          {employee.fullName.substring(0, 2).toUpperCase()}
                        </div>

                        <div>
                          <Link
                            href={`/owner/analytics/operations/${employee.userId}`}
                            className="font-black text-[var(--foreground)] transition hover:text-[var(--primary)]"
                          >
                            {employee.fullName}
                          </Link>

                          <p className="mt-1 text-xs font-semibold text-[var(--muted-foreground)]">
                            {employee.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="whitespace-nowrap px-8 py-5 text-sm font-semibold text-[var(--muted-foreground)]">
                      {new Date(employee.lastReportDate).toLocaleDateString(
                        "en-IN",
                        {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        }
                      )}
                    </td>

                    <TableValue value={employee.queryGenerated} />
                    <TableValue value={employee.dealsDone} />
                    <TableValue value={employee.tutorAssigned} />
                    <TableValue value={`₹${employee.dealsDoneAmount}`} />

                    <td className="whitespace-nowrap px-8 py-5">
                      <div className="flex flex-wrap gap-2">
                        <StatusMini label="A" value={employee.approved} tone="emerald" />
                        <StatusMini label="P" value={employee.pending} tone="amber" />
                        <StatusMini label="R" value={employee.rejected} tone="red" />
                      </div>
                    </td>

                    <td className="whitespace-nowrap px-8 py-5 text-right">
                      <span className="inline-flex rounded-xl border border-blue-500/20 bg-blue-500/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-blue-500">
                        {employee.totalReports} Entries
                      </span>
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

function KPICard({
  title,
  value,
  icon: Icon,
  tone,
}: {
  title: string;
  value: number;
  icon: React.ElementType;
  tone: "blue" | "emerald" | "amber" | "red" | "purple" | "indigo";
}) {
  const styles = {
    blue: "border-blue-500/20 bg-blue-500/10 text-blue-500",
    emerald: "border-emerald-500/20 bg-emerald-500/10 text-emerald-500",
    amber: "border-amber-500/20 bg-amber-500/10 text-amber-500",
    red: "border-red-500/20 bg-red-500/10 text-red-500",
    purple: "border-purple-500/20 bg-purple-500/10 text-purple-500",
    indigo: "border-indigo-500/20 bg-indigo-500/10 text-indigo-500",
  };

  return (
    <div className="rounded-[24px] border border-[var(--border)] bg-[var(--card)]/40 p-6 shadow-sm backdrop-blur-xl transition hover:-translate-y-1 hover:border-[var(--primary)]/30">
      <div className={`mb-5 w-fit rounded-2xl border p-3 ${styles[tone]}`}>
        <Icon className="h-5 w-5" />
      </div>

      <p className="text-3xl font-black text-[var(--foreground)]">{value}</p>

      <p className="mt-1 text-[10px] font-black uppercase tracking-widest text-[var(--muted-foreground)]">
        {title}
      </p>
    </div>
  );
}

function MetricSection({
  title,
  description,
  icon: Icon,
  children,
}: {
  title: string;
  description: string;
  icon: React.ElementType;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-[30px] border border-[var(--border)] bg-[var(--card)]/40 p-7 shadow-sm backdrop-blur-xl">
      <div className="mb-6 flex items-start gap-4">
        <div className="rounded-2xl bg-[var(--primary)]/10 p-3 text-[var(--primary)]">
          <Icon className="h-5 w-5" />
        </div>

        <div>
          <h2 className="text-xl font-black text-[var(--foreground)]">
            {title}
          </h2>

          <p className="mt-1 text-sm font-medium text-[var(--muted-foreground)]">
            {description}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">{children}</div>
    </div>
  );
}

function MiniCard({
  title,
  value,
  icon: Icon,
}: {
  title: string;
  value: number;
  icon?: React.ElementType;
}) {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--background)]/70 p-5 shadow-sm">
      {Icon && <Icon className="mb-3 h-4 w-4 text-[var(--primary)]" />}

      <p className="text-2xl font-black text-[var(--foreground)]">{value}</p>

      <p className="mt-1 text-[9px] font-black uppercase tracking-widest text-[var(--muted-foreground)]">
        {title}
      </p>
    </div>
  );
}

function TableHead({
  children,
  alignRight,
}: {
  children: React.ReactNode;
  alignRight?: boolean;
}) {
  return (
    <th
      className={`whitespace-nowrap px-8 py-4 text-[10px] font-black uppercase tracking-widest text-[var(--muted-foreground)] ${
        alignRight ? "text-right" : "text-left"
      }`}
    >
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

function StatusMini({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: "emerald" | "amber" | "red";
}) {
  const styles = {
    emerald: "border-emerald-500/20 bg-emerald-500/10 text-emerald-500",
    amber: "border-amber-500/20 bg-amber-500/10 text-amber-500",
    red: "border-red-500/20 bg-red-500/10 text-red-500",
  };

  return (
    <span
      className={`inline-flex rounded-lg border px-2.5 py-1 text-[10px] font-black uppercase tracking-widest ${styles[tone]}`}
    >
      {label}: {value}
    </span>
  );
}