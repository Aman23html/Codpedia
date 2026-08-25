import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import {
  ArrowLeft,
  BarChart3,
  CalendarDays,
  CheckCircle2,
  Clock,
  Database,
  FileText,
  Fingerprint,
  Globe2,
  Key,
  Mail,
  Phone,
  ShieldCheck,
  Target,
  Trash2,
  TrendingUp,
  User,
  Users,
  XCircle,
  Filter,
  RotateCcw,
  Activity,
  MapPin,
  MessageSquareText,
} from "lucide-react";

import { getCurrentUser } from "@/lib/current-user";
import { getInchargeMarketingUserAnalytics } from "@/actions/marketing/get-incharge-marketing-user-analytics";
import { DepartmentType, Role } from "@/constants/enums";

function getStringValue(value: string | string[] | undefined) {
  return typeof value === "string" ? value : "";
}

function getInitials(name: string) {
  if (!name) return "U";

  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();
}

function formatDate(date?: Date | string | null) {
  if (!date) return "-";

  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatDateTime(date?: Date | string | null) {
  if (!date) return "-";

  return new Date(date).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatCountry(country?: string | null) {
  if (!country) return "-";

  if (country === "NORTH_AMERICA") return "North America";
  if (country === "EUROPE") return "Europe";
  if (country === "AUSTRALIA") return "Australia";

  return country.replaceAll("_", " ");
}

function getStatusStyle(status: string) {
  if (status === "APPROVED") {
    return "border-emerald-500/20 bg-emerald-500/10 text-emerald-500";
  }

  if (status === "REJECTED") {
    return "border-red-500/20 bg-red-500/10 text-red-500";
  }

  return "border-amber-500/20 bg-amber-500/10 text-amber-500";
}

function getStatusIcon(status: string) {
  if (status === "APPROVED") return CheckCircle2;
  if (status === "REJECTED") return XCircle;
  return Clock;
}

function buildFilterHref({
  userId,
  filter,
  status,
  from,
  to,
}: {
  userId: string;
  filter: string;
  status: string;
  from?: string;
  to?: string;
}) {
  const params = new URLSearchParams();

  if (filter && filter !== "ALL") params.set("filter", filter);
  if (status && status !== "ALL") params.set("status", status);
  if (from) params.set("from", from);
  if (to) params.set("to", to);

  const query = params.toString();

  return `/incharge/analytics/marketing/${userId}${query ? `?${query}` : ""}`;
}

export default async function InchargeMarketingUserAnalyticsPage({
  params,
  searchParams,
}: {
  params: Promise<{
    userId: string;
  }>;
  searchParams?: Promise<{
    filter?: string;
    status?: string;
    from?: string;
    to?: string;
  }>;
}) {
  const { userId } = await params;
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
    currentUser.department.type !== DepartmentType.MARKETING
  ) {
    redirect("/incharge");
  }

  const filter = getStringValue(query?.filter) || "ALL";
  const status = getStringValue(query?.status) || "ALL";
  const from = getStringValue(query?.from);
  const to = getStringValue(query?.to);

  const data = await getInchargeMarketingUserAnalytics({
    userId,
    filter,
    status,
    from,
    to,
  });

  if (!data) {
    notFound();
  }

  const { employee, summary, approvalRate, countries, chartData, reports } = data;

  const employeeId = employee.employeeCode || "Not Generated";
  const initials = getInitials(employee.fullName);

  const hasFilter =
    filter !== "ALL" || status !== "ALL" || Boolean(from) || Boolean(to);

  return (
    <div className="min-h-screen bg-[var(--background)] max-w-[1400px] mx-auto px-4 sm:px-5 lg:px-6 py-5 sm:py-6 lg:py-8 space-y-6 text-[var(--foreground)]">
      {/* PAGE HEADER */}
      <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b border-[var(--border)] pb-5">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Link
              href="/incharge/analytics"
              className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-[var(--muted-foreground)] hover:text-[var(--primary)] transition-colors"
            >
              <ArrowLeft className="h-3 w-3" />
              Back to Analytics
            </Link>
            <span className="text-[var(--muted-foreground)]">/</span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--primary)] bg-[var(--primary)]/10 px-2 py-0.5 rounded">
              Individual Analytics
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-md border border-[var(--border)] bg-gradient-to-tr from-[var(--primary)] to-purple-600 text-sm font-bold text-white shadow-sm">
              {employee.profileImageUrl ? (
                <Image
                  src={employee.profileImageUrl}
                  alt={employee.fullName}
                  fill
                  unoptimized
                  className="object-cover"
                />
              ) : (
                initials
              )}
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-[var(--foreground)] flex items-center gap-2">
                {employee.fullName}
                <span className="inline-flex items-center gap-1 rounded bg-[var(--primary)]/10 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-[var(--primary)]">
                  {employeeId}
                </span>
              </h1>
              <p className="text-xs text-[var(--muted-foreground)] flex items-center gap-2 mt-0.5">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="h-3 w-3" />
                  {employee.status}
                </span>
                <span>&bull;</span>
                <span className="flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  {employee.department?.name || "Marketing"}
                </span>
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <HeaderMetric title="Approval" value={`${approvalRate}%`} icon={CheckCircle2} />
          <HeaderMetric title="Reports" value={summary.totalReports} icon={FileText} />
          <HeaderMetric title="Output" value={summary.totalGroups + summary.totalPosts} icon={TrendingUp} />
        </div>
      </header>

      {/* KPI CARDS */}
      <section className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <KPICard title="Total Reports" value={summary.totalReports} icon={FileText} tone="blue" />
        <KPICard title="Approved" value={summary.approved} icon={CheckCircle2} tone="emerald" />
        <KPICard title="Pending" value={summary.pending} icon={Clock} tone="amber" />
        <KPICard title="Rejected" value={summary.rejected} icon={XCircle} tone="red" />
        <KPICard title="Groups" value={summary.totalGroups} icon={Users} tone="purple" />
        <KPICard title="Posts" value={summary.totalPosts} icon={TrendingUp} tone="indigo" />
      </section>

      {/* EXECUTIVE TASK BREAKDOWN */}
      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <ExecutiveCard
          title="WhatsApp Output"
          value={summary.whatsappGroups + summary.whatsappPosts}
          description={`${summary.whatsappGroups} groups & ${summary.whatsappPosts} posts.`}
          icon={MessageSquareText}
          tone="emerald"
        />
        <ExecutiveCard
          title="Telegram Output"
          value={summary.telegramGroups + summary.telegramPosts}
          description={`${summary.telegramGroups} groups & ${summary.telegramPosts} posts.`}
          icon={Activity}
          tone="blue"
        />
        <ExecutiveCard
          title="Facebook Output"
          value={summary.facebookGroups + summary.facebookPosts}
          description={`${summary.facebookGroups} groups & ${summary.facebookPosts} posts.`}
          icon={Globe2}
          tone="purple"
        />
        <ExecutiveCard
          title="Login / Clean"
          value={`${summary.resourceLogin} / ${summary.accountClean}`}
          description="Total resources processed."
          icon={Key}
          tone="amber"
        />
      </section>

      {/* MAIN CONTENT GRID (Main + Aside) */}
      <div className="grid gap-5 lg:grid-cols-12 items-start">
        {/* LEFT COLUMN: Charts & Tables */}
        <div className="space-y-5 lg:col-span-8">
          
          {/* FILTER TOOLBAR */}
          <section className="rounded-xl border border-[var(--border)] bg-[var(--card)]/40 shadow-sm backdrop-blur-xl overflow-hidden">
            <div className="border-b border-[var(--border)] p-4 sm:p-5 flex flex-col xl:flex-row xl:items-center justify-between gap-4">
              <div>
                <h2 className="flex items-center gap-2 text-sm sm:text-base font-semibold text-[var(--foreground)]">
                  <Filter className="h-4 w-4 text-[var(--primary)]" />
                  Advanced Filter
                </h2>
                <p className="text-xs text-[var(--muted-foreground)]">
                  Refine reports by status or custom date ranges.
                </p>
              </div>
              
              <div className="flex flex-wrap items-center gap-2">
                {["ALL", "TODAY", "7_DAYS", "30_DAYS"].map((item) => (
                  <Link
                    key={item}
                    href={buildFilterHref({ userId, filter: item, status })}
                    className={`inline-flex items-center h-7 px-2.5 rounded-md text-[10px] font-bold uppercase tracking-wider transition ${
                      filter === item
                        ? "bg-[var(--primary)] text-white border border-[var(--primary)]"
                        : "bg-[var(--background)] border border-[var(--border)] text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                    }`}
                  >
                    {item.replace("_", " ")}
                  </Link>
                ))}
              </div>
            </div>

            <form method="GET" className="p-4 sm:p-5 bg-[var(--background)]/30 space-y-3">
              <div className="grid gap-3 sm:grid-cols-4">
                <label className="space-y-1 block">
                  <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[var(--muted-foreground)]">
                    <ShieldCheck className="h-3 w-3" /> Status
                  </span>
                  <select
                    name="status"
                    defaultValue={status}
                    className="h-9 w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 text-xs font-semibold outline-none transition focus:border-[var(--primary)]"
                  >
                    <option value="ALL">All Status</option>
                    <option value="APPROVED">Approved</option>
                    <option value="PENDING">Pending</option>
                    <option value="REJECTED">Rejected</option>
                  </select>
                </label>
                
                <label className="space-y-1 block">
                  <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[var(--muted-foreground)]">
                    <CalendarDays className="h-3 w-3" /> Quick Filter
                  </span>
                  <select
                    name="filter"
                    defaultValue={filter}
                    className="h-9 w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 text-xs font-semibold outline-none transition focus:border-[var(--primary)]"
                  >
                    <option value="ALL">All Time</option>
                    <option value="TODAY">Today</option>
                    <option value="7_DAYS">Last 7 Days</option>
                    <option value="30_DAYS">Last 30 Days</option>
                  </select>
                </label>

                <label className="space-y-1 block">
                  <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[var(--muted-foreground)]">
                    <CalendarDays className="h-3 w-3" /> From
                  </span>
                  <input
                    type="date"
                    name="from"
                    defaultValue={from}
                    className="h-9 w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 text-xs font-semibold outline-none transition focus:border-[var(--primary)]"
                  />
                </label>

                <label className="space-y-1 block">
                  <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[var(--muted-foreground)]">
                    <CalendarDays className="h-3 w-3" /> To
                  </span>
                  <input
                    type="date"
                    name="to"
                    defaultValue={to}
                    className="h-9 w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 text-xs font-semibold outline-none transition focus:border-[var(--primary)]"
                  />
                </label>
              </div>
              
              <div className="flex items-center justify-end gap-2 pt-1">
                {hasFilter && (
                  <Link
                    href={`/incharge/analytics/marketing/${userId}`}
                    className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 text-xs font-medium text-[var(--muted-foreground)] transition hover:text-[var(--foreground)]"
                  >
                    <RotateCcw className="h-3 w-3" /> Reset
                  </Link>
                )}
                <button
                  type="submit"
                  className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-[var(--primary)] px-4 text-xs font-medium text-white transition hover:opacity-90"
                >
                  <Filter className="h-3.5 w-3.5" /> Apply Filters
                </button>
              </div>
            </form>
          </section>

          {/* DAILY ACTIVITY TRENDS */}
          <section className="rounded-xl border border-[var(--border)] bg-[var(--card)]/40 p-4 sm:p-5 shadow-sm backdrop-blur-xl">
            <div className="mb-4">
              <h2 className="flex items-center gap-2 text-sm sm:text-base font-semibold text-[var(--foreground)]">
                <BarChart3 className="h-4 w-4 text-[var(--primary)]" />
                Daily Activity Trend
              </h2>
            </div>

            {chartData.length === 0 ? (
              <EmptyState message="No chart data available for selected filters." compact />
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">
                {chartData.map((row: any) => {
                  const maxValue = Math.max(
                    row.totalGroups,
                    row.totalPosts,
                    row.resourceLogin,
                    row.accountClean,
                    1
                  );

                  return (
                    <div
                      key={row.date}
                      className="rounded-lg border border-[var(--border)] bg-[var(--background)]/70 p-3 sm:p-4"
                    >
                      <div className="mb-3 flex items-center justify-between border-b border-[var(--border)] pb-2">
                        <p className="text-xs font-bold text-[var(--foreground)]">
                          {row.date}
                        </p>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--muted-foreground)]">
                          Total:{" "}
                          {row.totalGroups +
                            row.totalPosts +
                            row.resourceLogin +
                            row.accountClean}
                        </p>
                      </div>

                      <div className="space-y-2.5">
                        <TrendBar label="Groups" value={row.totalGroups} max={maxValue} tone="blue" />
                        <TrendBar label="Posts" value={row.totalPosts} max={maxValue} tone="purple" />
                        <TrendBar label="Login" value={row.resourceLogin} max={maxValue} tone="emerald" />
                        <TrendBar label="Clean" value={row.accountClean} max={maxValue} tone="pink" />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          {/* FULL REPORT LEDGER */}
          <section className="rounded-xl border border-[var(--border)] bg-[var(--card)]/40 shadow-sm backdrop-blur-xl overflow-hidden">
            <div className="border-b border-[var(--border)] p-4 sm:p-5">
              <h2 className="flex items-center gap-2 text-sm sm:text-base font-semibold text-[var(--foreground)]">
                <Database className="h-4 w-4 text-[var(--primary)]" />
                Full Report Ledger
              </h2>
            </div>

            <div>
              {reports.length === 0 ? (
                <EmptyState message="No reports found for selected filters." />
              ) : (
                <>
                  {/* DESKTOP TABLE */}
                  <div className="hidden lg:block overflow-x-auto">
                    <table className="w-full min-w-[900px] text-left border-collapse">
                      <thead>
                        <tr className="border-b border-[var(--border)] bg-[var(--background)]/50">
                          <TableHead>Date</TableHead>
                          <TableHead>Country</TableHead>
                          <TableHead>Groups</TableHead>
                          <TableHead>Posts</TableHead>
                          <TableHead>Login</TableHead>
                          <TableHead>Clean</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Updated</TableHead>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[var(--border)]/50">
                        {reports.map((report: any) => {
                          const StatusIcon = getStatusIcon(report.status);
                          return (
                            <tr
                              key={report.id || report._id}
                              className="transition-colors hover:bg-[var(--background)]/60 text-xs"
                            >
                              <td className="px-4 py-3 whitespace-nowrap font-medium text-[var(--foreground)]">
                                {formatDate(report.reportDate)}
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-[var(--muted-foreground)]">
                                {report.countryLabel || formatCountry(report.country)}
                              </td>
                              <TableValue value={report.totalGroups} />
                              <TableValue value={report.totalPosts} />
                              <TableValue value={report.resourceLogin ?? 0} />
                              <TableValue value={report.accountClean ?? 0} />
                              <td className="px-4 py-3 whitespace-nowrap">
                                <span
                                  className={`inline-flex items-center gap-1 rounded border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${getStatusStyle(
                                    report.status
                                  )}`}
                                >
                                  <StatusIcon className="h-3 w-3" />
                                  {report.status}
                                </span>
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-[var(--muted-foreground)]">
                                {formatDateTime(report.updatedAt)}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  {/* MOBILE LIST */}
                  <div className="block lg:hidden divide-y divide-[var(--border)]">
                    {reports.map((report: any) => {
                      const StatusIcon = getStatusIcon(report.status);
                      return (
                        <div key={report.id || report._id} className="p-4 bg-[var(--background)]/30 space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold">{formatDate(report.reportDate)}</span>
                            <span
                              className={`inline-flex items-center gap-1 rounded border px-1.5 py-0.5 text-[10px] font-bold uppercase ${getStatusStyle(
                                report.status
                              )}`}
                            >
                              <StatusIcon className="h-3 w-3" />
                              {report.status}
                            </span>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-[11px] border border-[var(--border)] bg-[var(--background)]/60 rounded-md p-2">
                            <div>
                              <span className="block text-[var(--muted-foreground)]">Country</span>
                              <span className="font-medium">{report.countryLabel || formatCountry(report.country)}</span>
                            </div>
                            <div className="text-right">
                              <span className="block text-[var(--muted-foreground)]">G / P / L / C</span>
                              <span className="font-semibold">
                                {report.totalGroups} / {report.totalPosts} / {report.resourceLogin ?? 0} / {report.accountClean ?? 0}
                              </span>
                            </div>
                          </div>
                          <div className="text-[10px] text-[var(--muted-foreground)] text-right">
                            Updated: {formatDateTime(report.updatedAt)}
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

        {/* RIGHT COLUMN: Aside Info */}
        <aside className="space-y-5 lg:col-span-4">
          
          <section className="rounded-xl border border-[var(--border)] bg-[var(--card)]/40 p-4 sm:p-5 shadow-sm backdrop-blur-xl">
            <h2 className="mb-4 flex items-center gap-2 text-sm sm:text-base font-semibold text-[var(--foreground)]">
              <User className="h-4 w-4 text-[var(--primary)]" />
              Employee Details
            </h2>

            <div className="space-y-2">
              <InfoRow icon={Fingerprint} label="ID" value={employeeId} mono />
              <InfoRow icon={User} label="Name" value={employee.fullName} />
              <InfoRow icon={Mail} label="Email" value={employee.email} />
              <InfoRow icon={Phone} label="Phone" value={employee.phone || "N/A"} />
              <InfoRow icon={ShieldCheck} label="Status" value={employee.status} />
              <InfoRow icon={CalendarDays} label="Joined" value={formatDate(employee.createdAt)} />
            </div>
          </section>

          <section className="rounded-xl border border-[var(--border)] bg-[var(--card)]/40 p-4 sm:p-5 shadow-sm backdrop-blur-xl">
            <h2 className="mb-4 flex items-center gap-2 text-sm sm:text-base font-semibold text-[var(--foreground)]">
              <MapPin className="h-4 w-4 text-[var(--primary)]" />
              Country Performance
            </h2>

            {countries.length === 0 ? (
              <EmptyState message="No country data available." compact />
            ) : (
              <div className="space-y-3">
                {countries.map((country: any) => (
                  <div
                    key={country.country}
                    className="rounded-lg border border-[var(--border)] bg-[var(--background)]/70 p-3 sm:p-4"
                  >
                    <div className="mb-3 flex items-center justify-between border-b border-[var(--border)] pb-2">
                      <div>
                        <p className="text-xs font-bold text-[var(--foreground)]">
                          {country.countryLabel}
                        </p>
                        <p className="text-[10px] text-[var(--muted-foreground)] mt-0.5">
                          {country.totalReports} Report{country.totalReports > 1 ? "s" : ""}
                        </p>
                      </div>
                      <span className="rounded bg-[var(--primary)]/10 px-2 py-0.5 text-[10px] font-bold text-[var(--primary)]">
                        {country.groups + country.posts} Outputs
                      </span>
                    </div>

                    <div className="grid grid-cols-4 gap-2">
                      <MiniStat title="Grps" value={country.groups} />
                      <MiniStat title="Psts" value={country.posts} />
                      <MiniStat title="Lgn" value={country.login} />
                      <MiniStat title="Cln" value={country.clean} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </aside>
      </div>
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
  value: string | number;
  icon: React.ElementType;
  tone: "blue" | "indigo" | "emerald" | "amber" | "red" | "purple";
}) {
  const styles = {
    blue: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    indigo: "bg-indigo-500/10 text-indigo-500 border-indigo-500/20",
    emerald: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    amber: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    red: "bg-red-500/10 text-red-500 border-red-500/20",
    purple: "bg-purple-500/10 text-purple-500 border-purple-500/20",
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
      <h3 className="text-xl font-bold tracking-tight text-[var(--foreground)]">{value}</h3>
    </div>
  );
}

function ExecutiveCard({
  title,
  value,
  description,
  icon: Icon,
  tone,
}: {
  title: string;
  value: string | number;
  description: string;
  icon: React.ElementType;
  tone: "emerald" | "amber" | "blue" | "purple";
}) {
  const styles = {
    emerald: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    amber: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    blue: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    purple: "bg-purple-500/10 text-purple-500 border-purple-500/20",
  };

  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--card)]/40 p-4 shadow-sm backdrop-blur-xl">
      <div className="flex items-center justify-between mb-3">
        <div className={`rounded-lg border p-2 ${styles[tone]}`}>
          <Icon className="h-4 w-4" />
        </div>
        <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--muted-foreground)]">
          Summary
        </span>
      </div>
      <h3 className="text-2xl font-bold tracking-tight text-[var(--foreground)]">{value}</h3>
      <p className="mt-0.5 text-xs font-semibold text-[var(--foreground)]">{title}</p>
      <p className="mt-1 text-[11px] leading-relaxed text-[var(--muted-foreground)]">{description}</p>
    </div>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
  mono,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border border-[var(--border)] bg-[var(--background)]/50 px-3 py-2">
      <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[var(--muted-foreground)]">
        <Icon className="h-3 w-3 text-[var(--primary)]" />
        {label}
      </span>
      <span
        className={`max-w-[150px] truncate text-xs font-semibold text-[var(--foreground)] ${
          mono ? "font-mono" : ""
        }`}
      >
        {value}
      </span>
    </div>
  );
}

function MiniStat({ title, value }: { title: string; value: string | number }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--background)]/50 p-2 text-center">
      <p className="text-sm font-bold text-[var(--foreground)]">{value}</p>
      <p className="mt-0.5 text-[9px] font-bold uppercase tracking-wider text-[var(--muted-foreground)]">
        {title}
      </p>
    </div>
  );
}

function TrendBar({
  label,
  value,
  max,
  tone,
}: {
  label: string;
  value: number;
  max: number;
  tone: "blue" | "purple" | "emerald" | "pink";
}) {
  const styles = {
    blue: "bg-blue-500",
    purple: "bg-purple-500",
    emerald: "bg-emerald-500",
    pink: "bg-pink-500",
  };

  const width = max > 0 ? Math.max(4, Math.round((value / max) * 100)) : 0;

  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-[10px] font-bold">
        <span className="uppercase tracking-wider text-[var(--muted-foreground)]">{label}</span>
        <span className="font-mono text-[var(--foreground)]">{value}</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-[var(--border)]/50">
        <div
          className={`h-full rounded-full ${styles[tone]}`}
          style={{ width: `${width}%` }}
        />
      </div>
    </div>
  );
}

function EmptyState({
  message,
  compact,
}: {
  message: string;
  compact?: boolean;
}) {
  return (
    <div
      className={`rounded-lg border border-dashed border-[var(--border)] bg-[var(--background)]/30 text-center ${
        compact ? "p-4" : "p-8 sm:p-12"
      }`}
    >
      <p className="text-xs font-semibold text-[var(--muted-foreground)]">{message}</p>
    </div>
  );
}

function TableHead({ children }: { children: React.ReactNode }) {
  return (
    <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-[var(--muted-foreground)] whitespace-nowrap">
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