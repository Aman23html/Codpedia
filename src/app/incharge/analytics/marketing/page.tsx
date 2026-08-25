import Image from "next/image";
import Link from "next/link";

import { getInchargeAnalytics } from "@/actions/marketing/get-incharge-analytics";
import { getInchargeReportSheet } from "@/actions/marketing/get-incharge-report-sheet";
import { getCountryChartData } from "@/actions/marketing/get-country-chart-data";
import { CountryCharts } from "@/components/incharge/country-charts";

import {
  BarChart3,
  Users,
  FileText,
  CheckCircle2,
  Clock,
  XCircle,
  TrendingUp,
  Globe2,
  Share2,
  Key,
  Trash2,
  Search,
  Filter,
  CalendarDays,
  Activity,
  Target,
  Database,
  ShieldCheck,
  RotateCcw,
  SlidersHorizontal,
  MapPin,
  Layers,
  ArrowUpDown,
  Fingerprint,
  Eye,
  User,
} from "lucide-react";

function getStringValue(value: string | string[] | undefined) {
  return typeof value === "string" ? value : "";
}

function buildQuery(params: Record<string, string | undefined>) {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value && value !== "ALL") {
      query.set(key, value);
    }
  });

  const queryString = query.toString();

  return queryString ? `?${queryString}` : "?";
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

function formatCountry(country: string) {
  if (!country) return "-";

  return country
    .split(",")
    .map((item) => item.trim().replaceAll("_", " "))
    .join(", ");
}

function formatDate(date?: Date | string | null) {
  if (!date) return "-";

  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default async function InchargeAnalyticsPage(props: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;

  const search = getStringValue(searchParams?.search);
  const status = getStringValue(searchParams?.status) || "ALL";
  const country = getStringValue(searchParams?.country) || "ALL";
  const platform = getStringValue(searchParams?.platform) || "ALL";
  const dateRange = getStringValue(searchParams?.dateRange) || "ALL";
  const from = getStringValue(searchParams?.from);
  const to = getStringValue(searchParams?.to);

  const minGroups = getStringValue(searchParams?.minGroups);
  const maxGroups = getStringValue(searchParams?.maxGroups);
  const minPosts = getStringValue(searchParams?.minPosts);
  const maxPosts = getStringValue(searchParams?.maxPosts);
  const minLogin = getStringValue(searchParams?.minLogin);
  const maxLogin = getStringValue(searchParams?.maxLogin);
  const minClean = getStringValue(searchParams?.minClean);
  const maxClean = getStringValue(searchParams?.maxClean);

  const sortBy = getStringValue(searchParams?.sortBy) || "lastReportDate";
  const sortOrder = getStringValue(searchParams?.sortOrder) || "desc";
  const graphDateRange =
    getStringValue(searchParams?.graphDateRange) || "month";

  const [data, reports, chartData] = await Promise.all([
    getInchargeAnalytics(),
    getInchargeReportSheet(searchParams),
    getCountryChartData(searchParams),
  ]);

  const totalReviewed = data.approvedReports + data.rejectedReports;

  const approvalRate =
    data.totalReports > 0
      ? Math.round((data.approvedReports / data.totalReports) * 100)
      : 0;

  const pendingRate =
    data.totalReports > 0
      ? Math.round((data.pendingReports / data.totalReports) * 100)
      : 0;

  const hasAdvancedFilter =
    search ||
    status !== "ALL" ||
    country !== "ALL" ||
    platform !== "ALL" ||
    dateRange !== "ALL" ||
    from ||
    to ||
    minGroups ||
    maxGroups ||
    minPosts ||
    maxPosts ||
    minLogin ||
    maxLogin ||
    minClean ||
    maxClean ||
    sortBy !== "lastReportDate" ||
    sortOrder !== "desc";

  return (
    <div className="min-h-screen bg-[var(--background)] max-w-[1400px] mx-auto px-4 sm:px-5 lg:px-6 py-5 sm:py-6 lg:py-8 space-y-6 text-[var(--foreground)]">
      {/* PAGE HEADER */}
      <header className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between border-b border-[var(--border)] pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--primary)] bg-[var(--primary)]/10 px-2 py-0.5 rounded">
              Command Center
            </span>
            <span className="text-xs text-[var(--muted-foreground)]">/ Analytics</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-[var(--foreground)]">
            Marketing Performance Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-[var(--muted-foreground)] mt-0.5">
            Track employee marketing performance, country-wise activity, report approval status, and task output across WhatsApp, Telegram, and Facebook operations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <HeaderMetric title="Approval" value={`${approvalRate}%`} icon={ShieldCheck} />
          <HeaderMetric title="Pending" value={`${pendingRate}%`} icon={Clock} />
          <HeaderMetric title="Today" value={data.todayReports} icon={Activity} />
        </div>
      </header>

      {/* SUMMARY / KPI CARDS */}
      <section className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <KPICard title="Employees" value={data.totalEmployees} icon={Users} tone="blue" />
        <KPICard title="Reports" value={data.totalReports} icon={FileText} tone="indigo" />
        <KPICard title="Approved" value={data.approvedReports} icon={CheckCircle2} tone="emerald" />
        <KPICard title="Pending" value={data.pendingReports} icon={Clock} tone="amber" />
        <KPICard title="Rejected" value={data.rejectedReports} icon={XCircle} tone="red" />
        <KPICard title="Reviewed" value={totalReviewed} icon={Target} tone="purple" />
      </section>

      {/* EXECUTIVE SUMMARY CARDS */}
      <section className="grid gap-3 md:grid-cols-3">
        <ExecutiveCard
          title="Approval Health"
          value={`${approvalRate}%`}
          description="Approved reports compared to total submitted reports."
          icon={CheckCircle2}
          tone="emerald"
        />
        <ExecutiveCard
          title="Pending Load"
          value={data.pendingReports}
          description="Reports currently waiting for incharge review."
          icon={Clock}
          tone="amber"
        />
        <ExecutiveCard
          title="Marketing Output"
          value={data.totalGroupsJoined + data.totalPostsDone}
          description="Combined groups joined and posts completed."
          icon={TrendingUp}
          tone="blue"
        />
      </section>

      {/* TRENDS & CHARTS SECTION */}
      <section className="rounded-xl border border-[var(--border)] bg-[var(--card)]/40 p-4 sm:p-5 shadow-sm backdrop-blur-xl">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="flex items-center gap-2 text-sm sm:text-base font-semibold text-[var(--foreground)]">
              <TrendingUp className="h-4 w-4 text-[var(--primary)]" />
              Country-wise Marketing Trends
            </h2>
            <p className="text-xs text-[var(--muted-foreground)]">
              Compare daily country-wise marketing activity using selected date range.
            </p>
          </div>

          <form
            method="GET"
            className="flex items-center gap-2 bg-[var(--background)] p-1 rounded-lg border border-[var(--border)]"
          >
            <input type="hidden" name="search" value={search} />
            <input type="hidden" name="status" value={status} />
            <input type="hidden" name="country" value={country} />
            <input type="hidden" name="platform" value={platform} />
            <input type="hidden" name="dateRange" value={dateRange} />
            <input type="hidden" name="from" value={from} />
            <input type="hidden" name="to" value={to} />

            <div className="relative">
              <select
                name="graphDateRange"
                defaultValue={graphDateRange}
                className="h-8 appearance-none rounded-md bg-transparent pl-3 pr-8 text-xs font-semibold outline-none cursor-pointer"
              >
                <option value="week">Last 7 Days</option>
                <option value="month">This Month</option>
                <option value="year">This Year</option>
              </select>
              <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-[var(--muted-foreground)]">
                ▼
              </span>
            </div>

            <button
              type="submit"
              className="h-8 rounded-md bg-[var(--primary)] px-3 text-xs font-semibold text-white transition hover:opacity-90"
            >
              Apply
            </button>
          </form>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <ChartPanel
            title="Groups Joined by Country"
            description="Daily joined groups segmented by region."
            icon={Users}
          >
            <CountryCharts data={chartData.groupsData} />
          </ChartPanel>

          <ChartPanel
            title="Posts Done by Country"
            description="Daily posting activity across regions."
            icon={FileText}
          >
            <CountryCharts data={chartData.postsData} />
          </ChartPanel>
        </div>
      </section>

      {/* METRIC SECTIONS */}
      <section className="grid gap-4 lg:grid-cols-2">
        <MetricSection
          title="Regional Distribution"
          description="Report distribution by target country."
          icon={Globe2}
        >
          <MiniCard title="North America" value={data.northAmerica} />
          <MiniCard title="Europe" value={data.europe} />
          <MiniCard title="Australia" value={data.australia} />
        </MetricSection>

        <MetricSection
          title="Task Performance"
          description="Total task output from approved and submitted marketing activities."
          icon={Share2}
        >
          <MiniCard title="Groups Joined" value={data.totalGroupsJoined} icon={Users} tone="purple" />
          <MiniCard title="Posts Done" value={data.totalPostsDone} icon={FileText} tone="blue" />
          <MiniCard title="Resource Login" value={data.totalResourceLogin} icon={Key} tone="emerald" />
          <MiniCard title="Account Clean" value={data.totalAccountClean} icon={Trash2} tone="pink" />
        </MetricSection>
      </section>

      {/* TOOLBAR & DATA TABLE CONTAINER */}
      <section className="rounded-xl border border-[var(--border)] bg-[var(--card)]/40 shadow-sm backdrop-blur-xl overflow-hidden">
        <div className="border-b border-[var(--border)] p-4 sm:p-5">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="flex items-center gap-2 text-sm sm:text-base font-semibold text-[var(--foreground)]">
                <Database className="h-4 w-4 text-[var(--primary)]" />
                Date-wise Employee Reports
              </h2>
              <p className="text-xs text-[var(--muted-foreground)]">
                Same employee reports are combined date-wise. Click employee name to open individual detailed analytics.
              </p>
            </div>

            {hasAdvancedFilter && (
              <Link
                href="/incharge/analytics"
                className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 text-xs font-medium text-[var(--muted-foreground)] transition hover:text-[var(--foreground)]"
              >
                <RotateCcw className="h-3 w-3" />
                Clear Filters
              </Link>
            )}
          </div>

          {/* COMPACT TOOLBAR / FILTERS */}
          <form method="GET" className="space-y-3">
            <input type="hidden" name="graphDateRange" value={graphDateRange} />

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <label className="relative flex items-center lg:col-span-2">
                <Search className="absolute left-3 h-4 w-4 text-[var(--muted-foreground)] pointer-events-none" />
                <input
                  type="text"
                  name="search"
                  defaultValue={search}
                  placeholder="Search name, email, phone, username, employee ID..."
                  className="h-10 w-full rounded-lg border border-[var(--border)] bg-[var(--background)] pl-9 pr-3 text-xs font-medium outline-none transition focus:border-[var(--primary)]"
                />
              </label>

              <FilterSelect
                icon={ShieldCheck}
                label="Status"
                name="status"
                defaultValue={status}
                options={[
                  ["ALL", "All Status"],
                  ["APPROVED", "Approved"],
                  ["PENDING", "Pending"],
                  ["REJECTED", "Rejected"],
                ]}
              />

              <FilterSelect
                icon={CalendarDays}
                label="Quick Date"
                name="dateRange"
                defaultValue={dateRange}
                options={[
                  ["ALL", "All Time"],
                  ["TODAY", "Today"],
                  ["7_DAYS", "Last 7 Days"],
                  ["30_DAYS", "Last 30 Days"],
                ]}
              />
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <FilterSelect
                icon={MapPin}
                label="Country"
                name="country"
                defaultValue={country}
                options={[
                  ["ALL", "All Countries"],
                  ["NORTH_AMERICA", "North America"],
                  ["EUROPE", "Europe"],
                  ["AUSTRALIA", "Australia"],
                ]}
              />

              <FilterSelect
                icon={Layers}
                label="Platform"
                name="platform"
                defaultValue={platform}
                options={[
                  ["ALL", "All Platforms"],
                  ["WHATSAPP", "WhatsApp"],
                  ["TELEGRAM", "Telegram"],
                  ["FACEBOOK", "Facebook"],
                ]}
              />

              <DateInput label="From Date" name="from" defaultValue={from} />
              <DateInput label="To Date" name="to" defaultValue={to} />
            </div>

            <div className="flex items-center justify-end gap-2 pt-1">
              <Link
                href="/incharge/analytics"
                className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-[var(--border)] bg-[var(--background)] px-4 text-xs font-medium text-[var(--muted-foreground)] transition hover:text-[var(--foreground)]"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Reset
              </Link>
              <button
                type="submit"
                className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-[var(--primary)] px-4 text-xs font-medium text-white transition hover:opacity-90"
              >
                <Filter className="h-3.5 w-3.5" />
                Apply Filter
              </button>
            </div>
          </form>
        </div>

        {/* DATA TABLE (Desktop) & RECORD CARDS (Mobile) */}
        <div>
          {reports.length === 0 ? (
            <div className="p-12 text-center text-xs text-[var(--muted-foreground)]">
              No reports found for the selected advanced filters.
            </div>
          ) : (
            <>
              {/* DESKTOP TABLE */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[1100px]">
                  <thead>
                    <tr className="border-b border-[var(--border)] bg-[var(--background)]/50">
                      <TableHead>Employee</TableHead>
                      <TableHead>Employee ID</TableHead>
                      <TableHead>Report Date</TableHead>
                      <TableHead>Territories</TableHead>
                      <TableHead>Groups</TableHead>
                      <TableHead>Posts</TableHead>
                      <TableHead>Logins</TableHead>
                      <TableHead>Cleans</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead alignRight>Volume</TableHead>
                      <TableHead alignRight>Details</TableHead>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border)]/50">
                    {reports.map((employee: any) => {
                      const employeeId = employee.employeeCode || "Not Generated";
                      const initials = getInitials(employee.employeeName);

                      return (
                        <tr
                          key={employee.rowId}
                          className="transition-colors hover:bg-[var(--background)]/60 text-xs"
                        >
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="flex items-center gap-3">
                              <div className="relative flex h-8 w-8 items-center justify-center overflow-hidden rounded-md border border-[var(--border)] bg-[var(--background)] text-xs font-bold text-[var(--foreground)]">
                                {employee.profileImageUrl ? (
                                  <Image
                                    src={employee.profileImageUrl}
                                    alt={employee.employeeName}
                                    fill
                                    unoptimized
                                    className="object-cover"
                                  />
                                ) : (
                                  <>
                                    <User className="h-3.5 w-3.5 text-[var(--muted-foreground)]" />
                                    <span className="sr-only">{initials}</span>
                                  </>
                                )}
                              </div>
                              <div>
                                <Link
                                  href={`/incharge/analytics/marketing/${employee.userId}`}
                                  className="font-semibold text-[var(--foreground)] transition hover:text-[var(--primary)]"
                                >
                                  {employee.employeeName}
                                </Link>
                                <p className="text-[10px] text-[var(--muted-foreground)]">
                                  Marketing Employee
                                </p>
                              </div>
                            </div>
                          </td>

                          <td className="px-4 py-3 whitespace-nowrap">
                            <span className="inline-flex items-center gap-1 rounded bg-[var(--primary)]/10 px-2 py-0.5 font-mono text-[10px] font-semibold text-[var(--primary)]">
                              <Fingerprint className="h-3 w-3" />
                              {employeeId}
                            </span>
                          </td>

                          <td className="px-4 py-3 whitespace-nowrap text-[var(--muted-foreground)]">
                            {formatDate(employee.reportDate)}
                          </td>

                          <td className="px-4 py-3 whitespace-nowrap text-[var(--muted-foreground)]">
                            {formatCountry(employee.countries)}
                          </td>

                          <TableValue value={employee.totalGroupsJoined} />
                          <TableValue value={employee.totalPostsDone} />
                          <TableValue value={employee.totalResourceLogin} />
                          <TableValue value={employee.totalAccountClean} />

                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="flex items-center gap-1.5">
                              <StatusPill label="A" value={employee.approvedReports} tone="emerald" />
                              <StatusPill label="P" value={employee.pendingReports} tone="amber" />
                              <StatusPill label="R" value={employee.rejectedReports} tone="red" />
                            </div>
                          </td>

                          <td className="px-4 py-3 whitespace-nowrap text-right">
                            <span className="inline-flex rounded border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-500">
                              {employee.totalReports} Report{employee.totalReports > 1 ? "s" : ""}
                            </span>
                          </td>

                          <td className="px-4 py-3 whitespace-nowrap text-right">
                            <Link
                              href={`/incharge/analytics/marketing/${employee.userId}`}
                              className="inline-flex h-7 items-center gap-1 rounded border border-[var(--border)] bg-[var(--background)] px-2.5 text-[11px] font-medium text-[var(--muted-foreground)] transition hover:border-[var(--primary)]/40 hover:text-[var(--primary)]"
                            >
                              <Eye className="h-3.5 w-3.5" />
                              View
                            </Link>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* MOBILE CARDS VIEW */}
              <div className="block lg:hidden divide-y divide-[var(--border)]">
                {reports.map((employee: any) => {
                  const employeeId = employee.employeeCode || "Not Generated";
                  const initials = getInitials(employee.employeeName);

                  return (
                    <div key={employee.rowId} className="p-4 space-y-3 bg-[var(--card)]/20">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="relative flex h-8 w-8 items-center justify-center overflow-hidden rounded-md border border-[var(--border)] bg-[var(--background)] text-xs font-bold">
                            {employee.profileImageUrl ? (
                              <Image
                                src={employee.profileImageUrl}
                                alt={employee.employeeName}
                                fill
                                unoptimized
                                className="object-cover"
                              />
                            ) : (
                              <User className="h-3.5 w-3.5 text-[var(--muted-foreground)]" />
                            )}
                          </div>
                          <div>
                            <Link
                              href={`/incharge/analytics/marketing/${employee.userId}`}
                              className="text-xs font-semibold text-[var(--foreground)] hover:text-[var(--primary)]"
                            >
                              {employee.employeeName}
                            </Link>
                            <p className="text-[10px] text-[var(--muted-foreground)] font-mono">
                              {employeeId}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-1">
                          <StatusPill label="A" value={employee.approvedReports} tone="emerald" />
                          <StatusPill label="P" value={employee.pendingReports} tone="amber" />
                          <StatusPill label="R" value={employee.rejectedReports} tone="red" />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-[11px] bg-[var(--background)]/60 p-2.5 rounded-lg border border-[var(--border)]">
                        <div>
                          <span className="text-[var(--muted-foreground)] block">Date & Region:</span>
                          <span className="font-medium">{formatDate(employee.reportDate)}</span>
                          <span className="text-[10px] block text-[var(--muted-foreground)] truncate">
                            {formatCountry(employee.countries)}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-[var(--muted-foreground)] block">Performance:</span>
                          <span className="font-semibold">Groups: {employee.totalGroupsJoined} | Posts: {employee.totalPostsDone}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        <span className="text-[10px] text-[var(--muted-foreground)]">
                          {employee.totalReports} Report{employee.totalReports > 1 ? "s" : ""}
                        </span>
                        <Link
                          href={`/incharge/analytics/marketing/${employee.userId}`}
                          className="inline-flex h-7 items-center gap-1 rounded border border-[var(--border)] bg-[var(--background)] px-3 text-xs font-medium text-[var(--primary)]"
                        >
                          <Eye className="h-3 w-3" />
                          View Details
                        </Link>
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

function FilterSelect({
  icon: Icon,
  label,
  name,
  defaultValue,
  options,
}: {
  icon: React.ElementType;
  label: string;
  name: string;
  defaultValue: string;
  options: [string, string][];
}) {
  return (
    <label className="space-y-1 block">
      <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[var(--muted-foreground)]">
        <Icon className="h-3 w-3" />
        {label}
      </span>
      <div className="relative">
        <select
          name={name}
          defaultValue={defaultValue}
          className="h-9 w-full appearance-none rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 pr-8 text-xs font-semibold outline-none transition focus:border-[var(--primary)] cursor-pointer"
        >
          {options.map(([value, text]) => (
            <option key={value} value={value}>
              {text}
            </option>
          ))}
        </select>
        <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-[var(--muted-foreground)]">
          ▼
        </span>
      </div>
    </label>
  );
}

function DateInput({
  label,
  name,
  defaultValue,
}: {
  label: string;
  name: string;
  defaultValue: string;
}) {
  return (
    <label className="space-y-1 block">
      <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[var(--muted-foreground)]">
        <CalendarDays className="h-3 w-3" />
        {label}
      </span>
      <input
        type="date"
        name={name}
        defaultValue={defaultValue}
        className="h-9 w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 text-xs font-semibold outline-none transition focus:border-[var(--primary)]"
      />
    </label>
  );
}

function StatusPill({
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
      className={`inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-bold border ${styles[tone]}`}
    >
      {label}:{value}
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
      <h3 className="text-xl font-bold text-[var(--foreground)] tracking-tight">
        {value}
      </h3>
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
  tone: "emerald" | "amber" | "blue";
}) {
  const styles = {
    emerald: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    amber: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    blue: "bg-blue-500/10 text-blue-500 border-blue-500/20",
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

      <h3 className="text-2xl font-bold tracking-tight text-[var(--foreground)]">
        {value}
      </h3>

      <p className="text-xs font-semibold text-[var(--foreground)] mt-0.5">
        {title}
      </p>

      <p className="text-[11px] text-[var(--muted-foreground)] mt-1 leading-relaxed">
        {description}
      </p>
    </div>
  );
}

function ChartPanel({
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
    <div className="rounded-lg border border-[var(--border)] bg-[var(--background)]/60 p-4">
      <div className="flex items-center gap-3 mb-4">
        <div className="rounded-md bg-[var(--primary)]/10 p-2 text-[var(--primary)]">
          <Icon className="h-4 w-4" />
        </div>
        <div>
          <h3 className="text-xs sm:text-sm font-semibold text-[var(--foreground)]">
            {title}
          </h3>
          <p className="text-[11px] text-[var(--muted-foreground)]">
            {description}
          </p>
        </div>
      </div>

      <div className="h-[260px] sm:h-[300px]">{children}</div>
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

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {children}
      </div>
    </div>
  );
}

function MiniCard({
  title,
  value,
  icon: Icon,
  tone,
}: {
  title: string;
  value: string | number;
  icon?: React.ElementType;
  tone?: "purple" | "blue" | "emerald" | "pink";
}) {
  const styles = {
    purple: "text-purple-500",
    blue: "text-blue-500",
    emerald: "text-emerald-500",
    pink: "text-pink-500",
  };

  return (
    <div className="rounded-lg border border-[var(--border)] bg-[var(--background)]/70 p-3 shadow-sm">
      {Icon && (
        <Icon className={`mb-2 h-3.5 w-3.5 ${tone ? styles[tone] : "text-[var(--primary)]"}`} />
      )}
      <p className="text-lg font-bold text-[var(--foreground)] tracking-tight">{value}</p>
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