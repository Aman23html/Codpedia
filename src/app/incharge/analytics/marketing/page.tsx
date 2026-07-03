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
    <div className="min-h-screen bg-[var(--background)] px-6 pt-28 pb-20 lg:pt-32 lg:px-12 max-w-[1700px] mx-auto space-y-10 text-[var(--foreground)]">
      <header className="relative overflow-hidden rounded-[36px] border border-[var(--border)] bg-[var(--card)]/45 p-8 shadow-sm backdrop-blur-xl lg:p-10">
        <div className="pointer-events-none absolute right-[-140px] top-[-140px] h-[380px] w-[380px] rounded-full bg-[var(--primary)]/10 blur-[90px]" />
        <div className="pointer-events-none absolute bottom-[-150px] left-[25%] h-[320px] w-[320px] rounded-full bg-purple-500/10 blur-[90px]" />

        <div className="relative z-10 flex flex-col gap-8 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[var(--primary)]/20 bg-[var(--primary)]/10 px-4 py-2 shadow-inner">
              <BarChart3 className="h-3.5 w-3.5 text-[var(--primary)]" />

              <span className="text-[11px] font-black uppercase tracking-widest text-[var(--primary)]">
                Marketing Analytics Command
              </span>
            </div>

            <h1 className="mb-4 text-4xl font-black leading-none tracking-tight text-[var(--foreground)] lg:text-5xl">
              Marketing Performance Dashboard
            </h1>

            <p className="max-w-3xl text-base font-medium leading-7 text-[var(--muted-foreground)]">
              Track employee marketing performance, country-wise activity,
              report approval status, and task output across WhatsApp, Telegram,
              and Facebook operations.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <HeaderMetric
              title="Approval"
              value={`${approvalRate}%`}
              icon={ShieldCheck}
            />

            <HeaderMetric
              title="Pending"
              value={`${pendingRate}%`}
              icon={Clock}
            />

            <HeaderMetric
              title="Today"
              value={data.todayReports}
              icon={Activity}
            />
          </div>
        </div>
      </header>

      <section className="grid grid-cols-2 gap-5 md:grid-cols-3 xl:grid-cols-6">
        <KPICard
          title="Employees"
          value={data.totalEmployees}
          icon={Users}
          tone="blue"
        />

        <KPICard
          title="Reports"
          value={data.totalReports}
          icon={FileText}
          tone="indigo"
        />

        <KPICard
          title="Approved"
          value={data.approvedReports}
          icon={CheckCircle2}
          tone="emerald"
        />

        <KPICard
          title="Pending"
          value={data.pendingReports}
          icon={Clock}
          tone="amber"
        />

        <KPICard
          title="Rejected"
          value={data.rejectedReports}
          icon={XCircle}
          tone="red"
        />

        <KPICard
          title="Reviewed"
          value={totalReviewed}
          icon={Target}
          tone="purple"
        />
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
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

      <section className="rounded-[34px] border border-[var(--border)] bg-[var(--card)]/40 p-8 shadow-sm backdrop-blur-xl">
        <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="flex items-center gap-3 text-2xl font-black tracking-tight text-[var(--foreground)]">
              <TrendingUp className="h-6 w-6 text-[var(--primary)]" />
              Country-wise Marketing Trends
            </h2>

            <p className="mt-2 text-sm font-medium text-[var(--muted-foreground)]">
              Compare daily country-wise marketing activity using selected date
              range.
            </p>
          </div>

          <form
            method="GET"
            className="flex w-full flex-wrap gap-3 rounded-2xl border border-[var(--border)] bg-[var(--background)]/70 p-2 shadow-sm lg:w-auto"
          >
            <input type="hidden" name="search" value={search} />
            <input type="hidden" name="status" value={status} />
            <input type="hidden" name="country" value={country} />
            <input type="hidden" name="platform" value={platform} />
            <input type="hidden" name="dateRange" value={dateRange} />
            <input type="hidden" name="from" value={from} />
            <input type="hidden" name="to" value={to} />

            <div className="relative flex-1 lg:flex-none">
              <CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--primary)]" />

              <select
                name="graphDateRange"
                defaultValue={graphDateRange}
                className="w-full appearance-none rounded-xl border border-[var(--border)] bg-[var(--card)] px-10 py-3 text-xs font-black uppercase tracking-widest outline-none focus:border-[var(--primary)] lg:w-[190px]"
              >
                <option value="week">Last 7 Days</option>
                <option value="month">This Month</option>
                <option value="year">This Year</option>
              </select>

              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[var(--muted-foreground)]">
                ▼
              </span>
            </div>

            <button
              type="submit"
              className="rounded-xl bg-[var(--primary)] px-5 py-3 text-xs font-black uppercase tracking-widest text-white transition hover:opacity-90"
            >
              Apply
            </button>
          </form>
        </div>

        <div className="grid gap-8 xl:grid-cols-2">
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

      <section className="grid gap-8 lg:grid-cols-2">
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
          <MiniCard
            title="Groups Joined"
            value={data.totalGroupsJoined}
            icon={Users}
            tone="purple"
          />

          <MiniCard
            title="Posts Done"
            value={data.totalPostsDone}
            icon={FileText}
            tone="blue"
          />

          <MiniCard
            title="Resource Login"
            value={data.totalResourceLogin}
            icon={Key}
            tone="emerald"
          />

          <MiniCard
            title="Account Clean"
            value={data.totalAccountClean}
            icon={Trash2}
            tone="pink"
          />
        </MetricSection>
      </section>

      <section className="rounded-[34px] border border-[var(--border)] bg-[var(--card)]/40 shadow-sm backdrop-blur-xl">
        <div className="border-b border-[var(--border)]/60 p-6">
          <div className="mb-6 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="flex items-center gap-3 text-2xl font-black text-[var(--foreground)]">
                <Database className="h-6 w-6 text-[var(--primary)]" />
                Date-wise Employee Reports
              </h2>

              <p className="mt-2 text-sm font-medium text-[var(--muted-foreground)]">
                Same employee reports are combined date-wise. Click employee
                name to open individual detailed analytics.
              </p>
            </div>

            {hasAdvancedFilter && (
              <Link
                href="/incharge/analytics"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--background)] px-5 py-3 text-xs font-black uppercase tracking-widest text-[var(--muted-foreground)] transition hover:text-[var(--foreground)]"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Clear Filters
              </Link>
            )}
          </div>

          <form method="GET" className="space-y-5">
            <input type="hidden" name="graphDateRange" value={graphDateRange} />

            <div className="grid gap-4 xl:grid-cols-4">
              <label className="space-y-2 xl:col-span-2">
                <span className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[var(--muted-foreground)]">
                  <Search className="h-3.5 w-3.5" />
                  Search Employee
                </span>

                <input
                  type="text"
                  name="search"
                  defaultValue={search}
                  placeholder="Name, email, phone, username, employee ID"
                  className="h-12 w-full rounded-2xl border border-[var(--border)] bg-[var(--background)] px-4 text-sm font-bold outline-none transition focus:border-[var(--primary)]"
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

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
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

        

            <div className="grid gap-4 lg:grid-cols-[1fr_1fr_auto_auto]">
              
              <button
                type="submit"
                className="mt-6 inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-[var(--primary)] px-7 text-xs font-black uppercase tracking-widest text-white shadow-lg transition hover:opacity-90"
              >
                <Filter className="h-4 w-4" />
                Apply Filter
              </button>

              <Link
                href="/incharge/analytics"
                className="mt-6 inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-[var(--border)] bg-[var(--background)] px-7 text-xs font-black uppercase tracking-widest text-[var(--muted-foreground)] transition hover:text-[var(--foreground)]"
              >
                <RotateCcw className="h-4 w-4" />
                Reset
              </Link>
            </div>
          </form>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1400px] text-left">
            <thead className="border-b border-[var(--border)]/60 bg-[var(--background)]/50">
              <tr>
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
              {reports.length === 0 ? (
                <tr>
                  <td
                    colSpan={11}
                    className="px-8 py-16 text-center text-sm font-semibold text-[var(--muted-foreground)]"
                  >
                    No reports found for the selected advanced filters.
                  </td>
                </tr>
              ) : (
                reports.map((employee: any) => {
                  const employeeId = employee.employeeCode || "Not Generated";
                  const initials = getInitials(employee.employeeName);

                  return (
                    <tr
                      key={employee.rowId}
                      className="transition hover:bg-[var(--background)]/60"
                    >
                      <td className="whitespace-nowrap px-8 py-5">
                        <div className="flex items-center gap-4">
                          <div className="relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--background)] text-sm font-black text-[var(--foreground)]">
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
                                <User className="h-4 w-4 text-[var(--muted-foreground)]" />
                                <span className="sr-only">{initials}</span>
                              </>
                            )}
                          </div>

                          <div>
                            <Link
                              href={`/incharge/analytics/marketing/${employee.userId}`}
                              className="font-black text-[var(--foreground)] transition hover:text-[var(--primary)]"
                            >
                              {employee.employeeName}
                            </Link>

                            <p className="mt-1 text-xs font-semibold text-[var(--muted-foreground)]">
                              Marketing Employee
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="whitespace-nowrap px-8 py-5">
                        <span className="inline-flex items-center gap-2 rounded-xl border border-[var(--primary)]/20 bg-[var(--primary)]/10 px-3 py-1.5 font-mono text-[11px] font-black text-[var(--primary)]">
                          <Fingerprint className="h-3.5 w-3.5" />
                          {employeeId}
                        </span>
                      </td>

                      <td className="whitespace-nowrap px-8 py-5 text-sm font-bold text-[var(--muted-foreground)]">
                        {formatDate(employee.reportDate)}
                      </td>

                      <td className="whitespace-nowrap px-8 py-5 text-sm font-semibold text-[var(--muted-foreground)]">
                        {formatCountry(employee.countries)}
                      </td>

                      <TableValue value={employee.totalGroupsJoined} />
                      <TableValue value={employee.totalPostsDone} />
                      <TableValue value={employee.totalResourceLogin} />
                      <TableValue value={employee.totalAccountClean} />

                      <td className="whitespace-nowrap px-8 py-5">
                        <div className="flex flex-wrap gap-2">
                          <StatusPill
                            label="A"
                            value={employee.approvedReports}
                            tone="emerald"
                          />

                          <StatusPill
                            label="P"
                            value={employee.pendingReports}
                            tone="amber"
                          />

                          <StatusPill
                            label="R"
                            value={employee.rejectedReports}
                            tone="red"
                          />
                        </div>
                      </td>

                      <td className="whitespace-nowrap px-8 py-5 text-right">
                        <span className="inline-flex rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-emerald-500">
                          {employee.totalReports} Report
                          {employee.totalReports > 1 ? "s" : ""}
                        </span>
                      </td>

                      <td className="whitespace-nowrap px-8 py-5 text-right">
                        <Link
                          href={`/incharge/analytics/marketing/${employee.userId}`}
                          className="inline-flex items-center justify-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-2 text-xs font-black uppercase tracking-widest text-[var(--muted-foreground)] transition hover:border-[var(--primary)]/40 hover:text-[var(--primary)]"
                        >
                          <Eye className="h-4 w-4" />
                          View
                        </Link>
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
    <label className="space-y-2">
      <span className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[var(--muted-foreground)]">
        <Icon className="h-3.5 w-3.5" />
        {label}
      </span>

      <select
        name={name}
        defaultValue={defaultValue}
        className="h-12 w-full rounded-2xl border border-[var(--border)] bg-[var(--background)] px-4 text-sm font-bold outline-none transition focus:border-[var(--primary)]"
      >
        {options.map(([value, text]) => (
          <option key={value} value={value}>
            {text}
          </option>
        ))}
      </select>
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
    <label className="space-y-2">
      <span className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[var(--muted-foreground)]">
        <CalendarDays className="h-3.5 w-3.5" />
        {label}
      </span>

      <input
        type="date"
        name={name}
        defaultValue={defaultValue}
        className="h-12 w-full rounded-2xl border border-[var(--border)] bg-[var(--background)] px-4 text-sm font-bold outline-none transition focus:border-[var(--primary)]"
      />
    </label>
  );
}

function RangeInput({
  label,
  minName,
  maxName,
  minValue,
  maxValue,
}: {
  label: string;
  minName: string;
  maxName: string;
  minValue: string;
  maxValue: string;
}) {
  return (
    <div className="space-y-2">
      <span className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[var(--muted-foreground)]">
        <SlidersHorizontal className="h-3.5 w-3.5" />
        {label}
      </span>

      <div className="grid grid-cols-2 gap-2">
        <input
          type="number"
          name={minName}
          defaultValue={minValue}
          placeholder="Min"
          min={0}
          className="h-12 w-full rounded-2xl border border-[var(--border)] bg-[var(--background)] px-4 text-sm font-bold outline-none transition focus:border-[var(--primary)]"
        />

        <input
          type="number"
          name={maxName}
          defaultValue={maxValue}
          placeholder="Max"
          min={0}
          className="h-12 w-full rounded-2xl border border-[var(--border)] bg-[var(--background)] px-4 text-sm font-bold outline-none transition focus:border-[var(--primary)]"
        />
      </div>
    </div>
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
      className={`inline-flex rounded-lg border px-2.5 py-1 text-[10px] font-black ${styles[tone]}`}
    >
      {label}: {value}
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
      <div className="mb-5 flex items-center justify-between">
        <div className={`rounded-2xl border p-3 ${styles[tone]}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>

      <h3 className="text-3xl font-black text-[var(--foreground)]">
        {value}
      </h3>

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
  tone: "emerald" | "amber" | "blue";
}) {
  const styles = {
    emerald: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    amber: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    blue: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  };

  return (
    <div className="rounded-[30px] border border-[var(--border)] bg-[var(--card)]/40 p-7 shadow-sm backdrop-blur-xl">
      <div className="mb-6 flex items-center justify-between">
        <div className={`rounded-2xl border p-3 ${styles[tone]}`}>
          <Icon className="h-6 w-6" />
        </div>

        <span className="text-[10px] font-black uppercase tracking-widest text-[var(--muted-foreground)]">
          Summary
        </span>
      </div>

      <h3 className="text-4xl font-black text-[var(--foreground)]">
        {value}
      </h3>

      <p className="mt-2 text-sm font-bold text-[var(--foreground)]">
        {title}
      </p>

      <p className="mt-3 text-sm font-medium leading-6 text-[var(--muted-foreground)]">
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
    <div className="rounded-[28px] border border-[var(--border)] bg-[var(--background)]/60 p-6">
      <div className="mb-6 flex items-start gap-4">
        <div className="rounded-2xl bg-[var(--primary)]/10 p-3 text-[var(--primary)]">
          <Icon className="h-5 w-5" />
        </div>

        <div>
          <h3 className="text-lg font-black text-[var(--foreground)]">
            {title}
          </h3>

          <p className="mt-1 text-sm font-medium text-[var(--muted-foreground)]">
            {description}
          </p>
        </div>
      </div>

      <div className="h-[380px]">{children}</div>
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

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
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
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--background)]/70 p-5 shadow-sm">
      {Icon && (
        <Icon className={`mb-3 h-4 w-4 ${tone ? styles[tone] : ""}`} />
      )}

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