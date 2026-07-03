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
import { DepartmentType, Role } from "@prisma/client";

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

  const { employee, summary, approvalRate, countries, chartData, reports } =
    data;

  const employeeId = employee.employeeCode || "Not Generated";
  const initials = getInitials(employee.fullName);

  const hasFilter =
    filter !== "ALL" || status !== "ALL" || Boolean(from) || Boolean(to);

  return (
    <div className="min-h-screen bg-[var(--background)] px-6 pt-28 pb-24 lg:px-12 lg:pt-32 max-w-[1700px] mx-auto space-y-10 text-[var(--foreground)]">
      <header className="relative overflow-hidden rounded-[38px] border border-[var(--border)] bg-[var(--card)]/45 p-8 shadow-sm backdrop-blur-xl lg:p-10">
        <div className="pointer-events-none absolute right-[-140px] top-[-140px] h-[380px] w-[380px] rounded-full bg-[var(--primary)]/10 blur-[90px]" />
        <div className="pointer-events-none absolute bottom-[-140px] left-[18%] h-[320px] w-[320px] rounded-full bg-purple-500/10 blur-[90px]" />

        <div className="relative z-10">
          <Link
            href="/incharge/analytics"
            className="mb-8 inline-flex items-center gap-2 rounded-2xl border border-[var(--border)] bg-[var(--background)]/70 px-4 py-2 text-xs font-black uppercase tracking-widest text-[var(--muted-foreground)] transition hover:border-[var(--primary)]/40 hover:text-[var(--foreground)]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Analytics
          </Link>

          <div className="grid gap-8 xl:grid-cols-12 xl:items-end">
            <div className="xl:col-span-8">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[var(--primary)]/20 bg-[var(--primary)]/10 px-4 py-2 text-[11px] font-black uppercase tracking-widest text-[var(--primary)]">
                <BarChart3 className="h-3.5 w-3.5" />
                Individual Marketing Analytics
              </div>

              <div className="flex flex-col gap-6 md:flex-row md:items-center">
                <div className="relative flex h-24 w-24 items-center justify-center overflow-hidden rounded-[30px] border border-[var(--border)] bg-gradient-to-tr from-[var(--primary)] to-purple-600 text-3xl font-black text-white shadow-lg">
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
                  <h1 className="text-4xl font-black tracking-tight text-[var(--foreground)] lg:text-6xl">
                    {employee.fullName}
                  </h1>

                  <div className="mt-4 flex flex-wrap items-center gap-3">
                    <span className="inline-flex items-center gap-2 rounded-2xl border border-[var(--primary)]/20 bg-[var(--primary)]/10 px-4 py-2 font-mono text-xs font-black text-[var(--primary)]">
                      <Fingerprint className="h-4 w-4" />
                      {employeeId}
                    </span>

                    <span className="inline-flex items-center gap-2 rounded-2xl border border-[var(--border)] bg-[var(--background)]/70 px-4 py-2 text-xs font-black uppercase tracking-widest text-[var(--muted-foreground)]">
                      <ShieldCheck className="h-4 w-4 text-[var(--primary)]" />
                      {employee.status}
                    </span>

                    <span className="inline-flex items-center gap-2 rounded-2xl border border-[var(--border)] bg-[var(--background)]/70 px-4 py-2 text-xs font-black uppercase tracking-widest text-[var(--muted-foreground)]">
                      <Users className="h-4 w-4 text-[var(--primary)]" />
                      {employee.department?.name || "Marketing"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="xl:col-span-4">
              <div className="grid grid-cols-3 gap-4">
                <HeaderMetric
                  title="Approval"
                  value={`${approvalRate}%`}
                  icon={CheckCircle2}
                />

                <HeaderMetric
                  title="Reports"
                  value={summary.totalReports}
                  icon={FileText}
                />

                <HeaderMetric
                  title="Output"
                  value={summary.totalGroups + summary.totalPosts}
                  icon={TrendingUp}
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      <section className="grid grid-cols-2 gap-5 md:grid-cols-3 xl:grid-cols-6">
        <KPICard
          title="Total Reports"
          value={summary.totalReports}
          icon={FileText}
          tone="blue"
        />

        <KPICard
          title="Approved"
          value={summary.approved}
          icon={CheckCircle2}
          tone="emerald"
        />

        <KPICard
          title="Pending"
          value={summary.pending}
          icon={Clock}
          tone="amber"
        />

        <KPICard
          title="Rejected"
          value={summary.rejected}
          icon={XCircle}
          tone="red"
        />

        <KPICard
          title="Groups"
          value={summary.totalGroups}
          icon={Users}
          tone="purple"
        />

        <KPICard
          title="Posts"
          value={summary.totalPosts}
          icon={TrendingUp}
          tone="indigo"
        />
      </section>

      <section className="grid gap-6 lg:grid-cols-4">
        <ExecutiveCard
          title="WhatsApp Output"
          value={summary.whatsappGroups + summary.whatsappPosts}
          description={`${summary.whatsappGroups} groups joined and ${summary.whatsappPosts} posts done.`}
          icon={MessageSquareText}
          tone="emerald"
        />

        <ExecutiveCard
          title="Telegram Output"
          value={summary.telegramGroups + summary.telegramPosts}
          description={`${summary.telegramGroups} groups joined and ${summary.telegramPosts} posts done.`}
          icon={Activity}
          tone="blue"
        />

        <ExecutiveCard
          title="Facebook Output"
          value={summary.facebookGroups + summary.facebookPosts}
          description={`${summary.facebookGroups} groups joined and ${summary.facebookPosts} posts done.`}
          icon={Globe2}
          tone="purple"
        />

        <ExecutiveCard
          title="Login / Clean"
          value={`${summary.resourceLogin} / ${summary.accountClean}`}
          description="Total resource login and account clean completed."
          icon={Key}
          tone="amber"
        />
      </section>

      <section className="rounded-[34px] border border-[var(--border)] bg-[var(--card)]/40 p-6 shadow-sm backdrop-blur-xl">
        <div className="mb-6 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="flex items-center gap-3 text-2xl font-black text-[var(--foreground)]">
              <Filter className="h-6 w-6 text-[var(--primary)]" />
              Advanced Employee Filter
            </h2>

            <p className="mt-2 text-sm font-medium text-[var(--muted-foreground)]">
              Filter this employee’s reports by status, quick range, or custom
              date range.
            </p>
          </div>

          {hasFilter && (
            <Link
              href={`/incharge/analytics/marketing/${userId}`}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--background)] px-5 py-3 text-xs font-black uppercase tracking-widest text-[var(--muted-foreground)] transition hover:text-[var(--foreground)]"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Clear
            </Link>
          )}
        </div>

        <form
          method="GET"
          className="grid gap-4 md:grid-cols-2 xl:grid-cols-[1fr_1fr_1fr_1fr_auto_auto]"
        >
          <label className="space-y-2">
            <span className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[var(--muted-foreground)]">
              <ShieldCheck className="h-3.5 w-3.5" />
              Status
            </span>

            <select
              name="status"
              defaultValue={status}
              className="h-12 w-full rounded-2xl border border-[var(--border)] bg-[var(--background)] px-4 text-sm font-bold outline-none transition focus:border-[var(--primary)]"
            >
              <option value="ALL">All Status</option>
              <option value="APPROVED">Approved</option>
              <option value="PENDING">Pending</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </label>

          <label className="space-y-2">
            <span className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[var(--muted-foreground)]">
              <CalendarDays className="h-3.5 w-3.5" />
              Quick Date
            </span>

            <select
              name="filter"
              defaultValue={filter}
              className="h-12 w-full rounded-2xl border border-[var(--border)] bg-[var(--background)] px-4 text-sm font-bold outline-none transition focus:border-[var(--primary)]"
            >
              <option value="ALL">All Time</option>
              <option value="TODAY">Today</option>
              <option value="7_DAYS">Last 7 Days</option>
              <option value="30_DAYS">Last 30 Days</option>
            </select>
          </label>

          <label className="space-y-2">
            <span className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[var(--muted-foreground)]">
              <CalendarDays className="h-3.5 w-3.5" />
              From Date
            </span>

            <input
              type="date"
              name="from"
              defaultValue={from}
              className="h-12 w-full rounded-2xl border border-[var(--border)] bg-[var(--background)] px-4 text-sm font-bold outline-none transition focus:border-[var(--primary)]"
            />
          </label>

          <label className="space-y-2">
            <span className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[var(--muted-foreground)]">
              <CalendarDays className="h-3.5 w-3.5" />
              To Date
            </span>

            <input
              type="date"
              name="to"
              defaultValue={to}
              className="h-12 w-full rounded-2xl border border-[var(--border)] bg-[var(--background)] px-4 text-sm font-bold outline-none transition focus:border-[var(--primary)]"
            />
          </label>

          <button
            type="submit"
            className="mt-6 inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-[var(--primary)] px-6 text-xs font-black uppercase tracking-widest text-white shadow-lg transition hover:opacity-90"
          >
            <Filter className="h-4 w-4" />
            Apply
          </button>

          <Link
            href={`/incharge/analytics/marketing/${userId}`}
            className="mt-6 inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-[var(--border)] bg-[var(--background)] px-6 text-xs font-black uppercase tracking-widest text-[var(--muted-foreground)] transition hover:text-[var(--foreground)]"
          >
            <RotateCcw className="h-4 w-4" />
            Reset
          </Link>
        </form>

        <div className="mt-5 flex flex-wrap gap-2">
          {["ALL", "TODAY", "7_DAYS", "30_DAYS"].map((item) => (
            <Link
              key={item}
              href={buildFilterHref({
                userId,
                filter: item,
                status,
              })}
              className={`rounded-xl border px-4 py-2 text-[10px] font-black uppercase tracking-widest transition ${
                filter === item
                  ? "border-[var(--primary)] bg-[var(--primary)] text-white"
                  : "border-[var(--border)] bg-[var(--background)] text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
              }`}
            >
              {item.replace("_", " ")}
            </Link>
          ))}
        </div>
      </section>

      <section className="grid gap-8 lg:grid-cols-12">
        <div className="space-y-8 lg:col-span-8">
          <section className="rounded-[34px] border border-[var(--border)] bg-[var(--card)]/40 p-8 shadow-sm backdrop-blur-xl">
            <div className="mb-8">
              <h2 className="flex items-center gap-3 text-2xl font-black text-[var(--foreground)]">
                <BarChart3 className="h-6 w-6 text-[var(--primary)]" />
                Daily Activity Trend
              </h2>

              <p className="mt-2 text-sm font-medium text-[var(--muted-foreground)]">
                Date-wise combined marketing performance for this employee.
              </p>
            </div>

            {chartData.length === 0 ? (
              <EmptyState message="No chart data available for selected filters." />
            ) : (
              <div className="space-y-4">
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
                      className="rounded-[24px] border border-[var(--border)] bg-[var(--background)]/70 p-5"
                    >
                      <div className="mb-4 flex items-center justify-between">
                        <p className="text-sm font-black text-[var(--foreground)]">
                          {row.date}
                        </p>

                        <p className="text-[10px] font-black uppercase tracking-widest text-[var(--muted-foreground)]">
                          Total:{" "}
                          {row.totalGroups +
                            row.totalPosts +
                            row.resourceLogin +
                            row.accountClean}
                        </p>
                      </div>

                      <TrendBar
                        label="Groups"
                        value={row.totalGroups}
                        max={maxValue}
                        tone="blue"
                      />

                      <TrendBar
                        label="Posts"
                        value={row.totalPosts}
                        max={maxValue}
                        tone="purple"
                      />

                      <TrendBar
                        label="Login"
                        value={row.resourceLogin}
                        max={maxValue}
                        tone="emerald"
                      />

                      <TrendBar
                        label="Clean"
                        value={row.accountClean}
                        max={maxValue}
                        tone="pink"
                      />
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          <section className="rounded-[34px] border border-[var(--border)] bg-[var(--card)]/40 shadow-sm backdrop-blur-xl">
            <div className="border-b border-[var(--border)]/60 p-6">
              <h2 className="flex items-center gap-3 text-2xl font-black text-[var(--foreground)]">
                <Database className="h-6 w-6 text-[var(--primary)]" />
                Full Report Ledger
              </h2>

              <p className="mt-2 text-sm font-medium text-[var(--muted-foreground)]">
                Every report entry submitted by this employee under selected
                filter.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[1200px] text-left">
                <thead className="border-b border-[var(--border)]/60 bg-[var(--background)]/50">
                  <tr>
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
                  {reports.length === 0 ? (
                    <tr>
                      <td
                        colSpan={8}
                        className="px-8 py-16 text-center text-sm font-semibold text-[var(--muted-foreground)]"
                      >
                        No reports found for selected filters.
                      </td>
                    </tr>
                  ) : (
                    reports.map((report: any) => {
                      const StatusIcon = getStatusIcon(report.status);

                      return (
                        <tr
                          key={report.id}
                          className="transition hover:bg-[var(--background)]/60"
                        >
                          <td className="whitespace-nowrap px-8 py-5 text-sm font-black text-[var(--foreground)]">
                            {formatDate(report.reportDate)}
                          </td>

                          <td className="whitespace-nowrap px-8 py-5 text-sm font-semibold text-[var(--muted-foreground)]">
                            {report.countryLabel || formatCountry(report.country)}
                          </td>

                          <TableValue value={report.totalGroups} />
                          <TableValue value={report.totalPosts} />
                          <TableValue value={report.resourceLogin ?? 0} />
                          <TableValue value={report.accountClean ?? 0} />

                          <td className="whitespace-nowrap px-8 py-5">
                            <span
                              className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-[10px] font-black uppercase tracking-widest ${getStatusStyle(
                                report.status
                              )}`}
                            >
                              <StatusIcon className="h-3.5 w-3.5" />
                              {report.status}
                            </span>
                          </td>

                          <td className="whitespace-nowrap px-8 py-5 text-xs font-semibold text-[var(--muted-foreground)]">
                            {formatDateTime(report.updatedAt)}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        <aside className="space-y-8 lg:col-span-4">
          <section className="rounded-[34px] border border-[var(--border)] bg-[var(--card)]/40 p-8 shadow-sm backdrop-blur-xl">
            <h2 className="mb-6 flex items-center gap-3 text-xl font-black text-[var(--foreground)]">
              <User className="h-5 w-5 text-[var(--primary)]" />
              Employee Details
            </h2>

            <div className="space-y-4">
              <InfoRow icon={Fingerprint} label="Employee ID" value={employeeId} mono />
              <InfoRow icon={User} label="Name" value={employee.fullName} />
              <InfoRow icon={Mail} label="Email" value={employee.email} />
              <InfoRow icon={Phone} label="Phone" value={employee.phone || "Not Provided"} />
              <InfoRow icon={ShieldCheck} label="Status" value={employee.status} />
              <InfoRow icon={CalendarDays} label="Joined" value={formatDate(employee.createdAt)} />
            </div>
          </section>

          <section className="rounded-[34px] border border-[var(--border)] bg-[var(--card)]/40 p-8 shadow-sm backdrop-blur-xl">
            <h2 className="mb-6 flex items-center gap-3 text-xl font-black text-[var(--foreground)]">
              <MapPin className="h-5 w-5 text-[var(--primary)]" />
              Country Performance
            </h2>

            {countries.length === 0 ? (
              <EmptyState message="No country data available." compact />
            ) : (
              <div className="space-y-4">
                {countries.map((country: any) => (
                  <div
                    key={country.country}
                    className="rounded-[24px] border border-[var(--border)] bg-[var(--background)]/70 p-5"
                  >
                    <div className="mb-4 flex items-center justify-between gap-4">
                      <div>
                        <p className="font-black text-[var(--foreground)]">
                          {country.countryLabel}
                        </p>

                        <p className="mt-1 text-xs font-semibold text-[var(--muted-foreground)]">
                          {country.totalReports} Report
                          {country.totalReports > 1 ? "s" : ""}
                        </p>
                      </div>

                      <span className="rounded-xl border border-[var(--primary)]/20 bg-[var(--primary)]/10 px-3 py-1.5 text-xs font-black text-[var(--primary)]">
                        {country.groups + country.posts}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <MiniStat title="Groups" value={country.groups} />
                      <MiniStat title="Posts" value={country.posts} />
                      <MiniStat title="Login" value={country.login} />
                      <MiniStat title="Clean" value={country.clean} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* <section className="rounded-[34px] border border-[var(--border)] bg-[var(--card)]/40 p-8 shadow-sm backdrop-blur-xl">
            <h2 className="mb-6 flex items-center gap-3 text-xl font-black text-[var(--foreground)]">
              <Target className="h-5 w-5 text-[var(--primary)]" />
              Task Breakdown
            </h2>

            <div className="grid grid-cols-2 gap-4">
              <MiniStat title="WA Groups" value={summary.whatsappGroups} />
              <MiniStat title="WA Posts" value={summary.whatsappPosts} />
              <MiniStat title="TG Groups" value={summary.telegramGroups} />
              <MiniStat title="TG Posts" value={summary.telegramPosts} />
              <MiniStat title="FB Groups" value={summary.facebookGroups} />
              <MiniStat title="FB Posts" value={summary.facebookPosts} />
              <MiniStat title="Login" value={summary.resourceLogin} />
              <MiniStat title="Clean" value={summary.accountClean} />
            </div>
          </section> */}
        </aside>
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
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--background)]/70 p-4 shadow-sm">
      <Icon className="mb-3 h-4 w-4 text-[var(--primary)]" />

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
    <div className="rounded-[24px] border border-[var(--border)] bg-[var(--card)]/40 p-6 shadow-sm backdrop-blur-xl transition hover:-translate-y-1 hover:border-[var(--primary)]/30">
      <div className={`mb-5 w-fit rounded-2xl border p-3 ${styles[tone]}`}>
        <Icon className="h-5 w-5" />
      </div>

      <h3 className="text-3xl font-black text-[var(--foreground)]">{value}</h3>

      <p className="mt-1 text-[10px] font-black uppercase tracking-widest text-[var(--muted-foreground)]">
        {title}
      </p>
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
    <div className="rounded-[30px] border border-[var(--border)] bg-[var(--card)]/40 p-7 shadow-sm backdrop-blur-xl">
      <div className={`mb-6 w-fit rounded-2xl border p-3 ${styles[tone]}`}>
        <Icon className="h-6 w-6" />
      </div>

      <h3 className="text-4xl font-black text-[var(--foreground)]">{value}</h3>

      <p className="mt-2 text-sm font-bold text-[var(--foreground)]">
        {title}
      </p>

      <p className="mt-3 text-sm font-medium leading-6 text-[var(--muted-foreground)]">
        {description}
      </p>
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
    <div className="flex items-center justify-between gap-5 rounded-2xl border border-[var(--border)] bg-[var(--background)]/70 px-4 py-3">
      <span className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[var(--muted-foreground)]">
        <Icon className="h-4 w-4 text-[var(--primary)]" />
        {label}
      </span>

      <span
        className={`max-w-[190px] truncate text-sm font-bold text-[var(--foreground)] ${
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
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--background)]/70 p-4">
      <p className="text-xl font-black text-[var(--foreground)]">{value}</p>

      <p className="mt-1 text-[9px] font-black uppercase tracking-widest text-[var(--muted-foreground)]">
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
    <div className="mb-3">
      <div className="mb-1.5 flex items-center justify-between text-xs font-bold">
        <span className="text-[var(--muted-foreground)]">{label}</span>
        <span className="font-mono text-[var(--foreground)]">{value}</span>
      </div>

      <div className="h-2.5 overflow-hidden rounded-full bg-[var(--card)]">
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
      className={`rounded-[24px] border border-dashed border-[var(--border)] bg-[var(--background)]/60 text-center ${
        compact ? "p-6" : "p-12"
      }`}
    >
      <p className="text-sm font-bold text-[var(--muted-foreground)]">
        {message}
      </p>
    </div>
  );
}

function TableHead({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <th className="whitespace-nowrap px-8 py-4 text-left text-[10px] font-black uppercase tracking-widest text-[var(--muted-foreground)]">
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