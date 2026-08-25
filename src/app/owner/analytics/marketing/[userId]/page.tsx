import Link from "next/link";
import { notFound } from "next/navigation";

import {
  Activity,
  ArrowLeft,
  CheckCircle2,
  Clock,
  Database,
  FileText,
  Globe2,
  Key,
  LineChart,
  Mail,
  MessageCircle,
  Phone,
  Send,
  Trash2,
  User,
  Users,
  XCircle,
  Filter,
} from "lucide-react";

import EmployeeMarketingLineChart from "@/components/marketing/analytics/EmployeeMarketingLineChart";
import { getOwnerMarketingUserAnalytics } from "@/actions/owner/get-owner-marketing-user-analytics";

export default async function OwnerMarketingUserAnalyticsPage({
  params,
  searchParams,
}: {
  params: Promise<{ userId: string }>;
  searchParams?: Promise<{
    filter?: string;
    status?: string;
  }>;
}) {
  const { userId } = await params;
  const query = await searchParams;

  const filter = query?.filter ?? "ALL";
  const status = query?.status ?? "ALL";

  const data = await getOwnerMarketingUserAnalytics({
    userId,
    filter,
    status,
  });

  if (!data) {
    notFound();
  }

  const filters = ["TODAY", "7_DAYS", "30_DAYS", "ALL"];
  const initials = data.employee.fullName?.substring(0, 2).toUpperCase() || "NA";

  return (
    <div className="min-h-screen bg-[var(--background)] max-w-[1400px] mx-auto px-4 sm:px-5 lg:px-6 py-5 sm:py-6 lg:py-8 space-y-5 text-[var(--foreground)]">
      {/* PAGE HEADER */}
      <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b border-[var(--border)] pb-5">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Link
              href="/owner/analytics/marketing"
              className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-[var(--muted-foreground)] hover:text-[var(--primary)] transition-colors"
            >
              <ArrowLeft className="h-3 w-3" /> Back to Marketing Analytics
            </Link>
            <span className="text-[var(--muted-foreground)]">/</span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--primary)] bg-[var(--primary)]/10 px-2 py-0.5 rounded">
              Employee Performance
            </span>
          </div>
          
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 mt-3">
            <div className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-md border border-[var(--border)] bg-[var(--background)] text-sm font-bold text-[var(--foreground)] shadow-sm">
              {data.employee.profileImageUrl ? (
                <img
                  src={data.employee.profileImageUrl}
                  alt={data.employee.fullName}
                  className="h-full w-full object-cover"
                />
              ) : (
                initials
              )}
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-[var(--foreground)]">
                {data.employee.fullName}
              </h1>
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] font-medium text-[var(--muted-foreground)] mt-0.5">
                <span className="flex items-center gap-1"><Mail className="h-3 w-3" /> {data.employee.email}</span>
                <span>&bull;</span>
                <span className="flex items-center gap-1"><User className="h-3 w-3" /> {data.employee.username ?? "No username"}</span>
                <span>&bull;</span>
                <span className="flex items-center gap-1"><Phone className="h-3 w-3" /> {data.employee.phone ?? "No phone"}</span>
                <span>&bull;</span>
                <span className="flex items-center gap-1"><Globe2 className="h-3 w-3" /> {data.employee.department?.name ?? "Marketing"}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <HeaderMetric title="Reports" value={data.summary.totalReports} icon={FileText} />
          <HeaderMetric title="Approval" value={`${data.approvalRate}%`} icon={CheckCircle2} />
          <HeaderMetric title="Output" value={data.summary.totalGroups + data.summary.totalPosts} icon={Activity} />
        </div>
      </header>

      {/* COMPACT TOOLBAR */}
      <section className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between rounded-xl border border-[var(--border)] bg-[var(--card)]/40 p-3 shadow-sm backdrop-blur-xl">
        <div className="flex flex-wrap items-center gap-1.5">
          {filters.map((item) => (
            <Link
              key={item}
              href={`/owner/analytics/marketing/${userId}?filter=${item}&status=${status}`}
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

        <form method="GET" className="flex flex-col sm:flex-row sm:items-center gap-2 w-full lg:w-auto">
          <input type="hidden" name="filter" value={filter} />
          
          <div className="relative flex-1 sm:flex-none">
            <Filter className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[var(--muted-foreground)]" />
            <select
              name="status"
              defaultValue={status}
              className="h-8 w-full appearance-none rounded-lg border border-[var(--border)] bg-[var(--background)] pl-8 pr-8 text-xs font-semibold outline-none transition focus:border-[var(--primary)] sm:w-[160px] cursor-pointer"
            >
              <option value="ALL">All Status</option>
              <option value="APPROVED">Approved</option>
              <option value="PENDING">Pending</option>
              <option value="REJECTED">Rejected</option>
            </select>
            <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-[var(--muted-foreground)]">
              ▼
            </span>
          </div>

          <button
            type="submit"
            className="inline-flex h-8 items-center justify-center rounded-lg bg-[var(--primary)] px-4 text-xs font-bold text-white transition hover:opacity-90"
          >
            Apply Filters
          </button>
        </form>
      </section>

      {/* SUMMARY KPI GRID */}
      <section className="grid grid-cols-2 gap-3 sm:grid-cols-4 xl:grid-cols-8">
        <SummaryCard title="Reports" value={data.summary.totalReports} icon={FileText} tone="blue" />
        <SummaryCard title="Groups" value={data.summary.totalGroups} icon={Users} tone="purple" />
        <SummaryCard title="Posts" value={data.summary.totalPosts} icon={Send} tone="emerald" />
        <SummaryCard title="Login" value={data.summary.resourceLogin} icon={Key} tone="amber" />
        <SummaryCard title="Clean" value={data.summary.accountClean} icon={Trash2} tone="red" />
        <SummaryCard title="Approved" value={data.summary.approved} icon={CheckCircle2} tone="emerald" />
        <SummaryCard title="Pending" value={data.summary.pending} icon={Clock} tone="amber" />
        <SummaryCard title="Rejected" value={data.summary.rejected} icon={XCircle} tone="red" />
      </section>

      {/* PLATFORM ACTIVITY (Top-level instead of buried) */}
      <section className="grid gap-3 sm:grid-cols-3">
        <PlatformCard title="WhatsApp" groups={data.summary.whatsappGroups} posts={data.summary.whatsappPosts} />
        <PlatformCard title="Telegram" groups={data.summary.telegramGroups} posts={data.summary.telegramPosts} />
        <PlatformCard title="Facebook" groups={data.summary.facebookGroups} posts={data.summary.facebookPosts} />
      </section>

      {/* CHARTS & COUNTRY GRID */}
      <section className="grid gap-5 lg:grid-cols-12 items-start">
        {/* Charts Container */}
        <div className="rounded-xl border border-[var(--border)] bg-[var(--card)]/40 p-4 sm:p-5 shadow-sm backdrop-blur-xl lg:col-span-8">
          <div className="mb-4 flex items-center gap-2">
            <LineChart className="h-4 w-4 text-[var(--primary)]" />
            <div>
              <h2 className="text-sm sm:text-base font-semibold text-[var(--foreground)]">Employee Progress Trend</h2>
              <p className="text-[11px] text-[var(--muted-foreground)] mt-0.5">Day-wise marketing progress metrics.</p>
            </div>
          </div>

          <div className="grid min-w-0 gap-3 sm:grid-cols-2">
            <ChartCard title="Groups Joined">
              <EmployeeMarketingLineChart data={data.chartData} dataKey="totalGroups" label="Total Groups" />
            </ChartCard>
            <ChartCard title="Posts Done">
              <EmployeeMarketingLineChart data={data.chartData} dataKey="totalPosts" label="Total Posts" />
            </ChartCard>
            <ChartCard title="Resource Login">
              <EmployeeMarketingLineChart data={data.chartData} dataKey="resourceLogin" label="Resource Login" />
            </ChartCard>
            <ChartCard title="Account Clean">
              <EmployeeMarketingLineChart data={data.chartData} dataKey="accountClean" label="Account Clean" />
            </ChartCard>
          </div>
        </div>

        {/* Country Summary */}
        <div className="rounded-xl border border-[var(--border)] bg-[var(--card)]/40 p-4 sm:p-5 shadow-sm backdrop-blur-xl lg:col-span-4 flex flex-col">
          <div className="mb-4 flex items-center gap-2">
            <Globe2 className="h-4 w-4 text-[var(--primary)]" />
            <h2 className="text-sm sm:text-base font-semibold text-[var(--foreground)]">Country Summary</h2>
          </div>

          <div className="flex-1 space-y-2.5 overflow-y-auto pr-1">
            {data.countries.length === 0 ? (
              <p className="text-xs text-center text-[var(--muted-foreground)] py-8 border border-dashed rounded-lg">No country data found.</p>
            ) : (
              data.countries.map((country: any) => (
                <div
                  key={country.country}
                  className="rounded-lg border border-[var(--border)] bg-[var(--background)]/70 p-3 sm:p-4"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <p className="font-semibold text-xs text-[var(--foreground)]">{country.countryLabel}</p>
                    <span className="rounded bg-blue-500/10 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-blue-500">
                      {country.totalReports} Rep
                    </span>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    <MiniBox label="Grp" value={country.groups} />
                    <MiniBox label="Pst" value={country.posts} />
                    <MiniBox label="Log" value={country.login} />
                    <MiniBox label="Cln" value={country.clean} />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* LEDGER TABLE */}
      <section className="rounded-xl border border-[var(--border)] bg-[var(--card)]/40 shadow-sm backdrop-blur-xl overflow-hidden">
        <div className="border-b border-[var(--border)] p-4 sm:p-5">
          <h2 className="flex items-center gap-2 text-sm sm:text-base font-semibold text-[var(--foreground)]">
            <Database className="h-4 w-4 text-[var(--primary)]" />
            Detailed Report Ledger
          </h2>
          <p className="text-xs text-[var(--muted-foreground)] mt-0.5">
            Complete submission history for the selected filters.
          </p>
        </div>

        <div>
          {data.reports.length === 0 ? (
            <div className="p-8 sm:p-12 text-center text-xs font-semibold text-[var(--muted-foreground)]">
              No reports found.
            </div>
          ) : (
            <>
              {/* DESKTOP TABLE */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full min-w-[900px] text-left border-collapse">
                  <thead className="border-b border-[var(--border)] bg-[var(--background)]/50">
                    <tr>
                      <TableHead>Date</TableHead>
                      <TableHead>Country</TableHead>
                      <TableHead>Groups</TableHead>
                      <TableHead>Posts</TableHead>
                      <TableHead>Login</TableHead>
                      <TableHead>Clean</TableHead>
                      <TableHead>Status</TableHead>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border)]/50">
                    {data.reports.map((report: any) => (
                      <tr key={report.id} className="transition-colors hover:bg-[var(--background)]/60 text-xs">
                        <td className="whitespace-nowrap px-4 py-3 font-medium text-[var(--foreground)]">
                          {new Date(report.reportDate).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-[var(--muted-foreground)]">
                          {report.countryLabel}
                        </td>
                        <TableValue value={report.totalGroups} />
                        <TableValue value={report.totalPosts} />
                        <TableValue value={report.resourceLogin} />
                        <TableValue value={report.accountClean} />
                        <td className="whitespace-nowrap px-4 py-3">
                          <StatusBadge status={report.status} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* MOBILE CARDS VIEW */}
              <div className="block lg:hidden divide-y divide-[var(--border)]">
                {data.reports.map((report: any) => (
                  <div key={report.id} className="p-4 bg-[var(--background)]/30 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-[var(--foreground)]">
                        {new Date(report.reportDate).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                      <StatusBadge status={report.status} />
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-[11px] border border-[var(--border)] bg-[var(--background)]/60 rounded-md p-2.5">
                      <div>
                        <span className="block text-[var(--muted-foreground)] mb-0.5">Country</span>
                        <span className="font-medium text-[var(--foreground)]">{report.countryLabel}</span>
                      </div>
                      <div className="text-right">
                        <span className="block text-[var(--muted-foreground)] mb-0.5">G / P / L / C</span>
                        <span className="font-semibold text-[var(--foreground)]">
                          {report.totalGroups} / {report.totalPosts} / {report.resourceLogin} / {report.accountClean}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
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

function HeaderMetric({ title, value, icon: Icon }: { title: string; value: string | number; icon: React.ElementType }) {
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

function SummaryCard({
  title,
  value,
  icon: Icon,
  tone,
}: {
  title: string;
  value: number;
  icon: React.ElementType;
  tone: "blue" | "purple" | "emerald" | "amber" | "red";
}) {
  const styles = {
    blue: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    purple: "bg-purple-500/10 text-purple-500 border-purple-500/20",
    emerald: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    amber: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    red: "bg-red-500/10 text-red-500 border-red-500/20",
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

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex min-h-0 min-w-0 flex-col rounded-lg border border-[var(--border)] bg-[var(--background)]/60 p-3">
      <h3 className="mb-3 text-[11px] font-bold uppercase tracking-wider text-[var(--muted-foreground)]">{title}</h3>
      <div className="h-[240px] min-h-0 w-full">{children}</div>
    </div>
  );
}

function MiniBox({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-md border border-[var(--border)] bg-[var(--background)]/50 p-2 text-center">
      <p className="text-xs font-bold text-[var(--foreground)]">{value}</p>
      <p className="mt-0.5 text-[9px] font-bold uppercase tracking-wider text-[var(--muted-foreground)]">{label}</p>
    </div>
  );
}

function PlatformCard({ title, groups, posts }: { title: string; groups: number; posts: number }) {
  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--card)]/40 p-4 shadow-sm backdrop-blur-xl">
      <div className="mb-3 flex items-center gap-2">
        <div className="rounded-md bg-[var(--primary)]/10 p-1.5 text-[var(--primary)]">
          <MessageCircle className="h-4 w-4" />
        </div>
        <h3 className="text-sm font-semibold text-[var(--foreground)]">{title}</h3>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-lg border border-[var(--border)] bg-[var(--background)]/70 p-2.5">
          <p className="text-lg font-bold text-[var(--foreground)] tracking-tight">{groups}</p>
          <p className="text-[9px] font-bold uppercase tracking-wider text-[var(--muted-foreground)]">Groups</p>
        </div>
        <div className="rounded-lg border border-[var(--border)] bg-[var(--background)]/70 p-2.5">
          <p className="text-lg font-bold text-[var(--foreground)] tracking-tight">{posts}</p>
          <p className="text-[9px] font-bold uppercase tracking-wider text-[var(--muted-foreground)]">Posts</p>
        </div>
      </div>
    </div>
  );
}

function TableHead({ children }: { children: React.ReactNode }) {
  return (
    <th className="whitespace-nowrap px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-[var(--muted-foreground)]">
      {children}
    </th>
  );
}

function TableValue({ value }: { value: number }) {
  return (
    <td className="whitespace-nowrap px-4 py-3 text-xs font-semibold text-[var(--foreground)]">
      {value}
    </td>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    APPROVED: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    PENDING: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    REJECTED: "bg-red-500/10 text-red-500 border-red-500/20",
  };

  return (
    <span
      className={`inline-flex rounded border px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
        styles[status] ?? "bg-[var(--background)] border-[var(--border)] text-[var(--muted-foreground)]"
      }`}
    >
      {status}
    </span>
  );
}