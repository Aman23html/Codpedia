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
  
  const encodedStatus = encodeURIComponent(status);
  const encodedSearch = encodeURIComponent(search);

  return (
    <div className="min-h-screen bg-[var(--background)] max-w-[1400px] mx-auto px-4 sm:px-5 lg:px-6 py-5 sm:py-6 lg:py-8 space-y-6 text-[var(--foreground)]">
      {/* PAGE HEADER */}
      <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b border-[var(--border)] pb-5">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Link
              href="/owner/analytics"
              className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-[var(--muted-foreground)] hover:text-[var(--primary)] transition-colors"
            >
              <ArrowLeft className="h-3 w-3" /> Back to Analytics
            </Link>
            <span className="text-[var(--muted-foreground)]">/</span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--primary)] bg-[var(--primary)]/10 px-2 py-0.5 rounded">
              Owner Analytics
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-[var(--foreground)]">
            Operations Department Performance
          </h1>
          <p className="text-xs sm:text-sm text-[var(--muted-foreground)] mt-0.5 max-w-2xl">
            View owner-level operations performance across all employees, queries, deals, tutor assignment, and amount flow.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <HeaderMetric title="Employees" value={data.totalEmployees} icon={Users} />
          <HeaderMetric title="Reports" value={data.totalReports} icon={FileText} />
          <HeaderMetric title="Approval" value={`${data.approvalRate}%`} icon={TrendingUp} />
        </div>
      </header>

      {/* COMPACT TOOLBAR */}
      <section className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between rounded-xl border border-[var(--border)] bg-[var(--card)]/40 p-3 shadow-sm backdrop-blur-xl">
        <div className="flex flex-wrap items-center gap-1.5">
          {filters.map((item) => (
            <Link
              key={item}
              href={`/owner/analytics/operations?filter=${item}&status=${encodedStatus}&search=${encodedSearch}`}
              className={`inline-flex items-center h-8 px-3 rounded-lg text-[10px] font-bold uppercase tracking-wider transition ${
                filter === item
                  ? "bg-[var(--primary)] text-white shadow-sm"
                  : "bg-[var(--background)] border border-[var(--border)] text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
              }`}
            >
              {item.replace("_", " ")}
            </Link>
          ))}
        </div>

        <form
          method="GET"
          className="flex flex-col gap-2 sm:flex-row sm:items-center w-full lg:w-auto"
        >
          <input type="hidden" name="filter" value={filter} />

          <div className="relative flex-1 sm:flex-none">
            <Filter className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[var(--muted-foreground)]" />
            <select
              name="status"
              defaultValue={status}
              className="h-8 w-full appearance-none rounded-lg border border-[var(--border)] bg-[var(--background)] pl-8 pr-8 text-xs font-semibold outline-none transition focus:border-[var(--primary)] sm:w-[150px] cursor-pointer"
            >
              <option value="ALL">All Status</option>
              <option value="APPROVED">Approved</option>
              <option value="PENDING">Pending</option>
              <option value="REJECTED">Rejected</option>
              <option value="DRAFT">Draft</option>
            </select>
            <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-[var(--muted-foreground)]">
              ▼
            </span>
          </div>

          <div className="relative flex-1 sm:flex-none">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[var(--muted-foreground)]" />
            <input
              type="text"
              name="search"
              defaultValue={search}
              placeholder="Search employee..."
              className="h-8 w-full rounded-lg border border-[var(--border)] bg-[var(--background)] pl-8 pr-3 text-xs font-semibold outline-none transition focus:border-[var(--primary)] sm:w-[220px]"
            />
          </div>

          <button
            type="submit"
            className="inline-flex h-8 items-center justify-center rounded-lg bg-[var(--primary)] px-4 text-xs font-bold text-white transition hover:opacity-90"
          >
            Apply
          </button>
        </form>
      </section>

      {/* KPI CARDS GRID */}
      <section className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6">
        <KPICard title="Reports" value={data.totalReports} icon={FileText} tone="blue" />
        <KPICard title="Approved" value={data.approvedReports} icon={CheckCircle2} tone="emerald" />
        <KPICard title="Pending" value={data.pendingReports} icon={Clock} tone="amber" />
        <KPICard title="Rejected" value={data.rejectedReports} icon={XCircle} tone="red" />
        <KPICard title="Queries" value={data.totalQueryGenerated} icon={Target} tone="purple" />
        <KPICard title="Deals" value={data.totalDealsDone} icon={TrendingUp} tone="indigo" />
      </section>

      {/* METRIC SECTIONS */}
      <section className="grid gap-4 lg:grid-cols-2">
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
            formatAsCurrency
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

      {/* DATA TABLE CONTAINER */}
      <section className="rounded-xl border border-[var(--border)] bg-[var(--card)]/40 shadow-sm backdrop-blur-xl overflow-hidden">
        <div className="border-b border-[var(--border)] p-4 sm:p-5">
          <h2 className="flex items-center gap-2 text-sm sm:text-base font-semibold text-[var(--foreground)]">
            <Database className="h-4 w-4 text-[var(--primary)]" />
            Employee-wise Operations Summary
          </h2>
          <p className="text-xs text-[var(--muted-foreground)] mt-0.5">
            Owner view of each operations employee’s report output.
          </p>
        </div>

        <div>
          {data.employees.length === 0 ? (
            <div className="p-8 sm:p-12 text-center text-xs font-semibold text-[var(--muted-foreground)]">
              No operations reports found.
            </div>
          ) : (
            <>
              {/* DESKTOP TABLE */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full min-w-[1000px] text-left border-collapse">
                  <thead className="border-b border-[var(--border)] bg-[var(--background)]/50">
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
                    {data.employees.map((employee: any) => {
                      const employeeKey = employee.employeeCode || employee.userId || employee.email;
                      const employeeCode = employee.employeeCode || "Not Generated";
                      const initials = employee.fullName?.substring(0, 2).toUpperCase() || "NA";
                      const lastReportDate = employee.lastReportDate
                        ? new Date(employee.lastReportDate).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })
                        : "No report yet";

                      return (
                        <tr key={employeeKey} className="transition-colors hover:bg-[var(--background)]/60 text-xs">
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="flex items-center gap-3">
                              <div className="relative flex h-8 w-8 items-center justify-center overflow-hidden rounded-md border border-[var(--border)] bg-[var(--background)] text-xs font-bold text-[var(--foreground)]">
                                {initials}
                              </div>
                              <div>
                                {employee.userId ? (
                                  <Link
                                    href={`/owner/analytics/operations/${employee.userId}`}
                                    className="font-semibold text-[var(--foreground)] transition hover:text-[var(--primary)]"
                                  >
                                    {employee.fullName}
                                  </Link>
                                ) : (
                                  <span className="font-semibold text-[var(--foreground)]">
                                    {employee.fullName}
                                  </span>
                                )}
                                <div className="flex items-center gap-1.5 mt-0.5">
                                  <p className="text-[10px] text-[var(--muted-foreground)] truncate max-w-[150px]">
                                    {employee.email}
                                  </p>
                                  <span className="text-[10px] text-[var(--muted-foreground)]">&bull;</span>
                                  <p className="text-[9px] font-mono font-bold uppercase tracking-wider text-[var(--primary)]/80">
                                    {employeeCode}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-[var(--muted-foreground)] font-medium">
                            {lastReportDate}
                          </td>
                          <TableValue value={employee.queryGenerated} />
                          <TableValue value={employee.dealsDone} />
                          <TableValue value={employee.tutorAssigned} />
                          <TableValue value={`₹${employee.dealsDoneAmount}`} />
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="flex items-center gap-1">
                              <StatusMini label="A" value={employee.approved || 0} tone="emerald" />
                              <StatusMini label="P" value={employee.pending || 0} tone="amber" />
                              <StatusMini label="R" value={employee.rejected || 0} tone="red" />
                            </div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-right">
                            <span className="inline-flex rounded border border-blue-500/20 bg-blue-500/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-blue-500">
                              {employee.totalReports || 0} Entries
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* MOBILE CARDS VIEW */}
              <div className="block lg:hidden divide-y divide-[var(--border)]">
                {data.employees.map((employee: any) => {
                  const employeeKey = employee.employeeCode || employee.userId || employee.email;
                  const employeeCode = employee.employeeCode || "Not Generated";
                  const initials = employee.fullName?.substring(0, 2).toUpperCase() || "NA";
                  const lastReportDate = employee.lastReportDate
                    ? new Date(employee.lastReportDate).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })
                    : "No report yet";

                  return (
                    <div key={employeeKey} className="p-4 bg-[var(--background)]/30 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="relative flex h-8 w-8 items-center justify-center overflow-hidden rounded-md border border-[var(--border)] bg-[var(--background)] text-xs font-bold">
                            {initials}
                          </div>
                          <div>
                            {employee.userId ? (
                              <Link
                                href={`/owner/analytics/operations/${employee.userId}`}
                                className="text-xs font-semibold text-[var(--foreground)] hover:text-[var(--primary)]"
                              >
                                {employee.fullName}
                              </Link>
                            ) : (
                              <span className="text-xs font-semibold text-[var(--foreground)]">
                                {employee.fullName}
                              </span>
                            )}
                            <p className="text-[10px] font-mono text-[var(--muted-foreground)]">
                              {employeeCode}
                            </p>
                          </div>
                        </div>

                        <span className="inline-flex rounded border border-blue-500/20 bg-blue-500/10 px-1.5 py-0.5 text-[10px] font-bold text-blue-500">
                          {employee.totalReports || 0} Rep
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 justify-end">
                        <StatusMini label="A" value={employee.approved || 0} tone="emerald" />
                        <StatusMini label="P" value={employee.pending || 0} tone="amber" />
                        <StatusMini label="R" value={employee.rejected || 0} tone="red" />
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-[11px] bg-[var(--background)]/60 rounded-md border border-[var(--border)] p-2.5">
                        <div>
                          <span className="block text-[var(--muted-foreground)] mb-0.5">Last Report</span>
                          <span className="font-medium">{lastReportDate}</span>
                        </div>
                        <div className="text-right">
                          <span className="block text-[var(--muted-foreground)] mb-0.5">Q / D / T / Amt</span>
                          <span className="font-semibold">
                            {employee.queryGenerated} / {employee.dealsDone} / {employee.tutorAssigned} / ₹{employee.dealsDoneAmount}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* SUB-COMPONENTS                                                             */
/* -------------------------------------------------------------------------- */

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
    <div className="flex items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--card)]/60 px-3 py-1.5 shadow-sm">
      <Icon className="h-3.5 w-3.5 text-[var(--primary)]" />
      <div>
        <div className="text-xs font-bold text-[var(--foreground)]">{value}</div>
        <div className="text-[9px] font-bold uppercase tracking-wider text-[var(--muted-foreground)]">
          {title}
        </div>
      </div>
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
    <div className="rounded-xl border border-[var(--border)] bg-[var(--card)]/40 p-3.5 shadow-sm backdrop-blur-xl transition hover:border-[var(--primary)]/30">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--muted-foreground)]">
          {title}
        </span>
        <div className={`rounded-md border p-1.5 ${styles[tone]}`}>
          <Icon className="h-3.5 w-3.5" />
        </div>
      </div>
      <p className="text-xl font-bold tracking-tight text-[var(--foreground)]">{value}</p>
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
    <div className="rounded-xl border border-[var(--border)] bg-[var(--card)]/40 p-4 sm:p-5 shadow-sm backdrop-blur-xl">
      <div className="flex items-center gap-3 mb-4">
        <div className="rounded-lg bg-[var(--primary)]/10 p-2 text-[var(--primary)]">
          <Icon className="h-4 w-4" />
        </div>
        <div>
          <h2 className="text-sm sm:text-base font-semibold text-[var(--foreground)]">
            {title}
          </h2>
          <p className="text-xs text-[var(--muted-foreground)]">
            {description}
          </p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">{children}</div>
    </div>
  );
}

function MiniCard({
  title,
  value,
  icon: Icon,
  formatAsCurrency = false,
}: {
  title: string;
  value: number;
  icon?: React.ElementType;
  formatAsCurrency?: boolean;
}) {
  const displayValue = formatAsCurrency ? `₹${value}` : value;

  return (
    <div className="rounded-lg border border-[var(--border)] bg-[var(--background)]/70 p-3 shadow-sm text-center flex flex-col items-center justify-center">
      {Icon && <Icon className="mb-1.5 h-3.5 w-3.5 text-[var(--primary)]" />}
      <p className="text-lg font-bold text-[var(--foreground)] tracking-tight">{displayValue}</p>
      <p className="mt-0.5 text-[9px] font-bold uppercase tracking-wider text-[var(--muted-foreground)]">
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
      className={`px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-[var(--muted-foreground)] whitespace-nowrap ${
        alignRight ? "text-right" : "text-left"
      }`}
    >
      {children}
    </th>
  );
}

function TableValue({ value }: { value: string | number }) {
  return (
    <td className="px-4 py-3 whitespace-nowrap text-xs font-semibold text-[var(--foreground)]">
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
      className={`inline-flex items-center rounded border px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${styles[tone]}`}
    >
      {label}:{value}
    </span>
  );
}