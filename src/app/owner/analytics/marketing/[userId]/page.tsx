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

  return (
    <div className="min-h-screen bg-[var(--background)] px-4 pt-24 pb-12 md:px-6 lg:px-8 max-w-[1600px] mx-auto flex flex-col gap-6">
      
      {/* Header Section */}
      <header className="relative overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm lg:p-8">
        <div className="pointer-events-none absolute right-0 top-0 h-full w-1/2 bg-gradient-to-l from-[var(--primary)]/5 to-transparent opacity-50" />

        <div className="relative z-10">
          <Link
            href="/owner/analytics/marketing"
            className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-[var(--muted-foreground)] transition hover:text-[var(--foreground)]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Marketing Analytics
          </Link>

          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="flex-1">
              <div className="mb-5 flex items-center gap-4">
                <div className="flex h-14 w-14 overflow-hidden items-center justify-center rounded-full border border-[var(--border)] bg-[var(--background)] text-lg font-bold text-[var(--foreground)] shadow-sm">
                  {data.employee.profileImageUrl ? (
                    <img
                      src={data.employee.profileImageUrl}
                      alt={data.employee.fullName || "Employee"}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    data.employee.fullName.substring(0, 2).toUpperCase()
                  )}
                </div>

                <div>
                  <h1 className="text-2xl font-bold tracking-tight text-[var(--foreground)] lg:text-3xl">
                    {data.employee.fullName}
                  </h1>
                  <p className="text-sm text-[var(--muted-foreground)]">
                    Owner view of individual marketing performance.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <InfoPill icon={Mail} label={data.employee.email} />
                <InfoPill icon={User} label={data.employee.username ?? "No username"} />
                <InfoPill icon={Phone} label={data.employee.phone ?? "No phone"} />
                <InfoPill
                  icon={Globe2}
                  label={data.employee.department?.name ?? "Marketing"}
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 w-full lg:w-auto">
              <HeaderMetric title="Reports" value={data.summary.totalReports} icon={FileText} />
              <HeaderMetric title="Approval" value={`${data.approvalRate}%`} icon={CheckCircle2} />
              <HeaderMetric title="Output" value={data.summary.totalGroups + data.summary.totalPosts} icon={Activity} />
            </div>
          </div>
        </div>
      </header>

      {/* Filters Section */}
      <section className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          {filters.map((item) => (
            <Link
              key={item}
              href={`/owner/analytics/marketing/${userId}?filter=${item}&status=${status}`}
              className={`rounded-lg px-4 py-2 text-xs font-bold uppercase tracking-wider transition-colors ${
                filter === item
                  ? "bg-[var(--primary)] text-white shadow-md"
                  : "bg-[var(--background)] text-[var(--muted-foreground)] hover:bg-[var(--border)] hover:text-[var(--foreground)]"
              }`}
            >
              {item.replace("_", " ")}
            </Link>
          ))}
        </div>

        <form method="GET" className="flex items-center gap-3">
          <input type="hidden" name="filter" value={filter} />
          
          <select
            name="status"
            defaultValue={status}
            className="h-10 rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 text-sm font-medium outline-none focus:ring-2 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)] transition-all"
          >
            <option value="ALL">All Status</option>
            <option value="APPROVED">Approved</option>
            <option value="PENDING">Pending</option>
            <option value="REJECTED">Rejected</option>
          </select>

          <button
            type="submit"
            className="h-10 rounded-lg bg-[var(--primary)] px-5 text-xs font-bold uppercase tracking-wider text-white shadow-sm hover:opacity-90 transition-opacity"
          >
            Apply
          </button>
        </form>
      </section>

      {/* Summary KPI Grid */}
      <section className="grid grid-cols-2 gap-4 md:grid-cols-4 xl:grid-cols-8">
        <SummaryCard title="Reports" value={data.summary.totalReports} icon={FileText} tone="blue" />
        <SummaryCard title="Groups" value={data.summary.totalGroups} icon={Users} tone="purple" />
        <SummaryCard title="Posts" value={data.summary.totalPosts} icon={Send} tone="emerald" />
        <SummaryCard title="Login" value={data.summary.resourceLogin} icon={Key} tone="amber" />
        <SummaryCard title="Clean" value={data.summary.accountClean} icon={Trash2} tone="red" />
        <SummaryCard title="Approved" value={data.summary.approved} icon={CheckCircle2} tone="emerald" />
        <SummaryCard title="Pending" value={data.summary.pending} icon={Clock} tone="amber" />
        <SummaryCard title="Rejected" value={data.summary.rejected} icon={XCircle} tone="red" />
      </section>

      {/* Main Content Grid */}
      <section className="grid gap-6 lg:grid-cols-12">
        
        {/* Charts Container */}
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm lg:col-span-8">
          <div className="mb-6 flex items-center gap-2">
            <LineChart className="h-5 w-5 text-[var(--primary)]" />
            <div>
              <h2 className="text-lg font-bold text-[var(--foreground)]">Employee Progress Trend</h2>
              <p className="text-xs text-[var(--muted-foreground)]">Day-wise marketing progress metrics.</p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
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
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm lg:col-span-4 flex flex-col">
          <div className="mb-6 flex items-center gap-2">
            <Globe2 className="h-5 w-5 text-[var(--primary)]" />
            <h2 className="text-lg font-bold text-[var(--foreground)]">Country Summary</h2>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto pr-1">
            {data.countries.length === 0 ? (
              <p className="text-sm text-[var(--muted-foreground)]">No country data found.</p>
            ) : (
              data.countries.map((country: any) => (
                <div
                  key={country.country}
                  className="rounded-xl border border-[var(--border)] bg-[var(--background)] p-4 transition-colors hover:border-[var(--primary)]/40"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <p className="font-semibold text-sm text-[var(--foreground)]">{country.countryLabel}</p>
                    <span className="rounded-md bg-blue-500/10 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
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

      {/* Platform Activity */}
      <section className="grid gap-6 sm:grid-cols-3">
        <PlatformCard title="WhatsApp" groups={data.summary.whatsappGroups} posts={data.summary.whatsappPosts} />
        <PlatformCard title="Telegram" groups={data.summary.telegramGroups} posts={data.summary.telegramPosts} />
        <PlatformCard title="Facebook" groups={data.summary.facebookGroups} posts={data.summary.facebookPosts} />
      </section>

      {/* Ledger Table */}
      <section className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-sm">
        <div className="border-b border-[var(--border)] p-6 flex items-center gap-2">
          <Database className="h-5 w-5 text-[var(--primary)]" />
          <div>
            <h2 className="text-lg font-bold text-[var(--foreground)]">Detailed Report Ledger</h2>
            <p className="text-xs text-[var(--muted-foreground)]">Complete submission history.</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[var(--background)]">
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
            <tbody className="divide-y divide-[var(--border)]">
              {data.reports.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-[var(--muted-foreground)]">
                    No reports found.
                  </td>
                </tr>
              ) : (
                data.reports.map((report: any) => (
                  <tr key={report.id} className="transition-colors hover:bg-[var(--background)]/50">
                    <td className="whitespace-nowrap px-6 py-3 font-medium text-[var(--foreground)]">
                      {new Date(report.reportDate).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="whitespace-nowrap px-6 py-3 text-[var(--muted-foreground)]">
                      {report.countryLabel}
                    </td>
                    <TableValue value={report.totalGroups} />
                    <TableValue value={report.totalPosts} />
                    <TableValue value={report.resourceLogin} />
                    <TableValue value={report.accountClean} />
                    <td className="whitespace-nowrap px-6 py-3">
                      <StatusBadge status={report.status} />
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

/* -------------------------------------------------------------------------- */
/* SUB-COMPONENTS                                 */
/* -------------------------------------------------------------------------- */

function InfoPill({ icon: Icon, label }: { icon: React.ElementType; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-1.5 text-xs font-medium text-[var(--muted-foreground)]">
      <Icon className="h-3.5 w-3.5 text-[var(--primary)]" />
      {label}
    </span>
  );
}

function HeaderMetric({ title, value, icon: Icon }: { title: string; value: string | number; icon: React.ElementType }) {
  return (
    <div className="flex flex-col justify-center rounded-xl border border-[var(--border)] bg-[var(--background)] p-3 text-center shadow-sm">
      <div className="mb-1 flex items-center justify-center gap-1.5 text-[var(--muted-foreground)]">
        <Icon className="h-3 w-3" />
        <span className="text-[10px] font-bold uppercase tracking-wider">{title}</span>
      </div>
      <p className="text-lg font-bold text-[var(--foreground)]">{value}</p>
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
    blue: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    purple: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
    emerald: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    amber: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    red: "bg-red-500/10 text-red-600 dark:text-red-400",
  };

  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--background)] p-4 shadow-sm transition-transform hover:-translate-y-0.5">
      <div className="flex items-center justify-between mb-3">
        <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--muted-foreground)]">{title}</p>
        <div className={`rounded-lg p-2 ${styles[tone]}`}>
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <p className="text-2xl font-bold text-[var(--foreground)]">{value}</p>
    </div>
  );
}

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--background)] p-4">
      <h3 className="mb-4 text-sm font-bold text-[var(--foreground)]">{title}</h3>
      {children}
    </div>
  );
}

function MiniBox({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-2 text-center">
      <p className="text-[9px] font-bold uppercase tracking-wider text-[var(--muted-foreground)]">{label}</p>
      <p className="mt-0.5 font-bold text-[var(--foreground)]">{value}</p>
    </div>
  );
}

function PlatformCard({ title, groups, posts }: { title: string; groups: number; posts: number }) {
  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-sm">
      <div className="mb-4 flex items-center gap-3">
        <div className="rounded-lg bg-[var(--primary)]/10 p-2.5 text-[var(--primary)]">
          <MessageCircle className="h-4 w-4" />
        </div>
        <div>
          <h3 className="font-bold text-[var(--foreground)]">{title}</h3>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <MiniBox label="Groups" value={groups} />
        <MiniBox label="Posts" value={posts} />
      </div>
    </div>
  );
}

function TableHead({ children }: { children: React.ReactNode }) {
  return (
    <th className="whitespace-nowrap px-6 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-[var(--muted-foreground)]">
      {children}
    </th>
  );
}

function TableValue({ value }: { value: number }) {
  return (
    <td className="whitespace-nowrap px-6 py-3 text-[var(--foreground)]">
      {value}
    </td>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    APPROVED: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    PENDING: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    REJECTED: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20",
  };

  return (
    <span
      className={`inline-flex rounded-md border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${
        styles[status] ?? "bg-[var(--background)] border-[var(--border)] text-[var(--muted-foreground)]"
      }`}
    >
      {status}
    </span>
  );
}