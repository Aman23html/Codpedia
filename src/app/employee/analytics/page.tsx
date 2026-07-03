import Link from "next/link";
import { getCurrentUser } from "@/lib/current-user";
import { getEmployeeReportHistory } from "@/actions/marketing/get-employee-report-history";

import ReportStatusPieChart from "@/components/marketing/analytics/ReportStatusPieChart";
import GroupedAuditTable from "@/components/marketing/analytics/GroupedAuditTable";
import EmployeeMarketingLineChart from "@/components/marketing/analytics/EmployeeMarketingLineChart";

import {
  Activity,
  BarChart3,
  Calendar,
  CheckCircle2,
  Clock,
  Database,
  FileText,
  Filter,
  Key,
  LineChart,
  MessageCircle,
  Send,
  Trash2,
  TrendingUp,
  Users,
  XCircle,
} from "lucide-react";

export default async function AnalyticsPage({
  searchParams,
}: {
  searchParams?: Promise<{
    filter?: string;
    date?: string;
  }>;
}) {
  const params = await searchParams;

  const filter = params?.filter ?? "ALL";
  const dateFilter = params?.date;

  const user = await getCurrentUser();

  if (!user) return null;

  let reports = await getEmployeeReportHistory(filter);

  if (dateFilter) {
    reports = reports.filter((report) => {
      const reportDate = new Date(report.createdAt).toISOString().split("T")[0];
      return reportDate === dateFilter;
    });
  }

  const statusData = [
    {
      name: "Approved",
      value: reports.filter((report) => report.status === "APPROVED").length,
    },
    {
      name: "Pending",
      value: reports.filter((report) => report.status === "PENDING").length,
    },
    {
      name: "Rejected",
      value: reports.filter((report) => report.status === "REJECTED").length,
    },
  ];

  const summary = reports.reduce(
    (acc, report) => {
      acc.totalReports += 1;

      acc.whatsappGroups += report.whatsappGroupsJoined ?? 0;
      acc.whatsappPosts += report.whatsappPostsDone ?? 0;

      acc.telegramGroups += report.telegramGroupsJoined ?? 0;
      acc.telegramPosts += report.telegramPostsDone ?? 0;

      acc.facebookGroups += report.facebookGroupsJoined ?? 0;
      acc.facebookPosts += report.facebookPostsDone ?? 0;

      acc.resourceLogin += report.resourceLogin ?? 0;
      acc.accountClean += report.accountClean ?? 0;

      return acc;
    },
    {
      totalReports: 0,
      whatsappGroups: 0,
      whatsappPosts: 0,
      telegramGroups: 0,
      telegramPosts: 0,
      facebookGroups: 0,
      facebookPosts: 0,
      resourceLogin: 0,
      accountClean: 0,
    }
  );

  const totalGroups =
    summary.whatsappGroups + summary.telegramGroups + summary.facebookGroups;

  const totalPosts =
    summary.whatsappPosts + summary.telegramPosts + summary.facebookPosts;

  const approvedReports = statusData[0].value;
  const pendingReports = statusData[1].value;
  const rejectedReports = statusData[2].value;

  const approvalRate =
    summary.totalReports > 0
      ? Math.round((approvedReports / summary.totalReports) * 100)
      : 0;

  const chartMap = new Map<string, any>();

  for (const report of reports) {
    const date = new Date(report.createdAt).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
    });

    if (!chartMap.has(date)) {
      chartMap.set(date, {
        date,
        whatsappGroups: 0,
        whatsappPosts: 0,
        telegramGroups: 0,
        telegramPosts: 0,
        facebookGroups: 0,
        facebookPosts: 0,
        resourceLogin: 0,
        accountClean: 0,
        totalGroups: 0,
        totalPosts: 0,
      });
    }

    const row = chartMap.get(date);

    row.whatsappGroups += report.whatsappGroupsJoined ?? 0;
    row.whatsappPosts += report.whatsappPostsDone ?? 0;

    row.telegramGroups += report.telegramGroupsJoined ?? 0;
    row.telegramPosts += report.telegramPostsDone ?? 0;

    row.facebookGroups += report.facebookGroupsJoined ?? 0;
    row.facebookPosts += report.facebookPostsDone ?? 0;

    row.resourceLogin += report.resourceLogin ?? 0;
    row.accountClean += report.accountClean ?? 0;

    row.totalGroups =
      row.whatsappGroups + row.telegramGroups + row.facebookGroups;

    row.totalPosts =
      row.whatsappPosts + row.telegramPosts + row.facebookPosts;
  }

  const chartData = Array.from(chartMap.values());

  const presetFilters = ["TODAY", "7_DAYS", "30_DAYS", "ALL"];

  return (
    <div className="min-h-screen bg-[var(--background)] px-6 pt-32 pb-24 lg:px-12 max-w-[1700px] mx-auto space-y-10">
      <header className="relative overflow-hidden rounded-[36px] border border-[var(--border)] bg-[var(--card)]/45 p-8 shadow-sm backdrop-blur-xl lg:p-10">
        <div className="pointer-events-none absolute right-[-140px] top-[-140px] h-[380px] w-[380px] rounded-full bg-[var(--primary)]/10 blur-[90px]" />
        <div className="pointer-events-none absolute bottom-[-150px] left-[25%] h-[320px] w-[320px] rounded-full bg-purple-500/10 blur-[90px]" />

        <div className="relative z-10 flex flex-col gap-8 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <div className="mb-6 inline-flex items-center gap-3 rounded-2xl border border-[var(--border)] bg-[var(--background)]/70 px-4 py-2 shadow-sm">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-[var(--primary)] to-purple-600 text-xs font-black text-white shadow-lg">
                {user.fullName.substring(0, 2).toUpperCase()}
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-black text-[var(--foreground)]">
                    {user.fullName}
                  </span>

                  <span className="rounded-full bg-[var(--primary)]/10 px-2 py-0.5 text-[9px] font-black uppercase tracking-widest text-[var(--primary)]">
                    {user.role}
                  </span>
                </div>

                <p className="font-mono text-[10px] uppercase text-[var(--muted-foreground)]">
                  ID: {user.id.substring(0, 8).toUpperCase()}
                </p>
              </div>
            </div>

            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[var(--primary)]/20 bg-[var(--primary)]/10 px-4 py-2 text-[11px] font-black uppercase tracking-widest text-[var(--primary)]">
              <BarChart3 className="h-3.5 w-3.5" />
              Employee Marketing Progress
            </div>

            <h1 className="mb-4 text-4xl font-black tracking-tight text-[var(--foreground)] lg:text-5xl">
              My Marketing Analytics
            </h1>

            <p className="max-w-3xl text-base font-medium leading-7 text-[var(--muted-foreground)]">
              Track your daily marketing progress, report status, platform activity, and performance trends using visual line charts.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <HeaderMetric title="Approval" value={`${approvalRate}%`} icon={CheckCircle2} />
            <HeaderMetric title="Reports" value={summary.totalReports} icon={FileText} />
            <HeaderMetric title="Output" value={totalGroups + totalPosts} icon={TrendingUp} />
          </div>
        </div>
      </header>

      <section className="flex flex-col gap-4 rounded-[30px] border border-[var(--border)] bg-[var(--card)]/40 p-6 shadow-sm backdrop-blur-xl xl:flex-row xl:items-center xl:justify-between">
        <form
          method="GET"
          action="/employee/analytics"
          className="flex flex-wrap items-center gap-3"
        >
          <div className="flex items-center gap-2 rounded-2xl border border-[var(--border)] bg-[var(--background)] px-4 py-3">
            <Calendar className="h-4 w-4 text-[var(--muted-foreground)]" />

            <input
              type="date"
              name="date"
              defaultValue={dateFilter}
              className="bg-transparent text-sm font-bold text-[var(--foreground)] outline-none"
            />
          </div>

          <button
            type="submit"
            className="rounded-2xl bg-[var(--primary)] px-5 py-3 text-xs font-black uppercase tracking-widest text-white transition hover:opacity-90"
          >
            Apply Date
          </button>

          {dateFilter && (
            <Link
              href="/employee/analytics"
              className="rounded-2xl border border-[var(--border)] px-4 py-3 text-sm font-black text-[var(--muted-foreground)] transition hover:bg-[var(--background)] hover:text-[var(--foreground)]"
            >
              Clear
            </Link>
          )}
        </form>

        <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-[var(--border)] bg-[var(--background)]/70 p-1.5">
          <div className="px-3 text-[var(--muted-foreground)]">
            <Filter className="h-4 w-4" />
          </div>

          {presetFilters.map((item) => (
            <Link
              key={item}
              href={`/employee/analytics?filter=${item}`}
              className={`rounded-xl px-5 py-2.5 text-[10px] font-black uppercase tracking-widest transition-all ${
                !dateFilter && filter === item
                  ? "bg-[var(--primary)] text-white shadow-lg"
                  : "text-[var(--muted-foreground)] hover:bg-[var(--card)] hover:text-[var(--foreground)]"
              }`}
            >
              {item.replace("_", " ")}
            </Link>
          ))}
        </div>
      </section>

      <section className="grid grid-cols-2 gap-5 md:grid-cols-4 xl:grid-cols-8">
        <SummaryCard title="Reports" value={summary.totalReports} icon={FileText} tone="blue" />
        <SummaryCard title="Groups" value={totalGroups} icon={Users} tone="purple" />
        <SummaryCard title="Posts" value={totalPosts} icon={Send} tone="emerald" />
        <SummaryCard title="Resource Login" value={summary.resourceLogin} icon={Key} tone="amber" />
        <SummaryCard title="Account Clean" value={summary.accountClean} icon={Trash2} tone="red" />
        <SummaryCard title="Approved" value={approvedReports} icon={CheckCircle2} tone="emerald" />
        <SummaryCard title="Pending" value={pendingReports} icon={Clock} tone="amber" />
        <SummaryCard title="Rejected" value={rejectedReports} icon={XCircle} tone="red" />
      </section>

      <section className="grid gap-8 lg:grid-cols-12">
        <div className="lg:col-span-8 rounded-[34px] border border-[var(--border)] bg-[var(--card)]/40 p-8 shadow-sm backdrop-blur-xl">
          <div className="mb-8">
            <h2 className="flex items-center gap-3 text-2xl font-black text-[var(--foreground)]">
              <LineChart className="h-6 w-6 text-[var(--primary)]" />
              Daily Progress Trend
            </h2>

            <p className="mt-2 text-sm font-medium text-[var(--muted-foreground)]">
              Line charts showing your day-wise growth in marketing work.
            </p>
          </div>

          <div className="grid gap-8 xl:grid-cols-2">
            <ChartCard
              title="Total Groups Joined"
              description="WhatsApp + Telegram + Facebook groups joined."
            >
              <EmployeeMarketingLineChart
                data={chartData}
                dataKey="totalGroups"
                label="Total Groups"
              />
            </ChartCard>

            <ChartCard
              title="Total Posts Done"
              description="WhatsApp + Telegram + Facebook posts completed."
            >
              <EmployeeMarketingLineChart
                data={chartData}
                dataKey="totalPosts"
                label="Total Posts"
              />
            </ChartCard>

            <ChartCard
              title="Resource Login"
              description="Daily resource login count."
            >
              <EmployeeMarketingLineChart
                data={chartData}
                dataKey="resourceLogin"
                label="Resource Login"
              />
            </ChartCard>

            <ChartCard
              title="Account Clean"
              description="Daily account clean count."
            >
              <EmployeeMarketingLineChart
                data={chartData}
                dataKey="accountClean"
                label="Account Clean"
              />
            </ChartCard>
          </div>
        </div>

        <div className="lg:col-span-4 rounded-[34px] border border-[var(--border)] bg-[var(--card)]/40 p-8 shadow-sm backdrop-blur-xl">
          <h3 className="mb-6 flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-[var(--muted-foreground)]">
            <Activity className="h-4 w-4" />
            Status Overview
          </h3>

          <div className="mb-6 grid grid-cols-3 gap-4">
            <StatusStat label="Approved" value={approvedReports} color="text-emerald-500" />
            <StatusStat label="Pending" value={pendingReports} color="text-amber-500" />
            <StatusStat label="Rejected" value={rejectedReports} color="text-red-500" />
          </div>

          <div className="flex h-[230px] w-full items-center justify-center rounded-2xl border border-[var(--border)] bg-[var(--background)]">
            <ReportStatusPieChart data={statusData} />
          </div>

          <div className="mt-6 rounded-2xl border border-[var(--border)] bg-[var(--background)] p-5">
            <p className="text-[10px] font-black uppercase tracking-widest text-[var(--muted-foreground)]">
              Approval Rate
            </p>

            <p className="mt-2 text-3xl font-black text-[var(--foreground)]">
              {approvalRate}%
            </p>

            <div className="mt-4 h-2.5 w-full overflow-hidden rounded-full bg-[var(--card)]">
              <div
                className="h-full rounded-full bg-emerald-500"
                style={{ width: `${approvalRate}%` }}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-8 lg:grid-cols-3">
        <PlatformCard
          title="WhatsApp"
          groups={summary.whatsappGroups}
          posts={summary.whatsappPosts}
        />

        <PlatformCard
          title="Telegram"
          groups={summary.telegramGroups}
          posts={summary.telegramPosts}
        />

        <PlatformCard
          title="Facebook"
          groups={summary.facebookGroups}
          posts={summary.facebookPosts}
        />
      </section>

      <section className="overflow-hidden rounded-[34px] border border-[var(--border)] bg-[var(--card)]/40 shadow-sm backdrop-blur-xl">
        <div className="flex flex-col gap-3 border-b border-[var(--border)]/60 px-8 py-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="flex items-center gap-3 text-2xl font-black text-[var(--foreground)]">
              <Database className="h-6 w-6 text-[var(--primary)]" />
              My Audit Ledger
            </h2>

            <p className="mt-2 text-sm font-medium text-[var(--muted-foreground)]">
              Detailed report history grouped by your submitted marketing records.
            </p>
          </div>
        </div>

        <GroupedAuditTable reports={reports} />
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
    <div className="rounded-[24px] border border-[var(--border)] bg-[var(--card)]/40 p-5 shadow-sm backdrop-blur-xl transition hover:-translate-y-1 hover:border-[var(--primary)]/30">
      <div className="mb-4 flex items-center justify-between">
        <div className={`rounded-2xl border p-3 ${styles[tone]}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>

      <p className="text-3xl font-black text-[var(--foreground)]">{value}</p>

      <p className="mt-1 text-[9px] font-black uppercase tracking-widest text-[var(--muted-foreground)]">
        {title}
      </p>
    </div>
  );
}

function ChartCard({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-[28px] border border-[var(--border)] bg-[var(--background)]/60 p-6">
      <div className="mb-5">
        <h3 className="text-lg font-black text-[var(--foreground)]">
          {title}
        </h3>

        <p className="mt-1 text-sm font-medium text-[var(--muted-foreground)]">
          {description}
        </p>
      </div>

      {children}
    </div>
  );
}

function StatusStat({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--background)] p-4 text-center">
      <div className={`text-2xl font-black ${color}`}>{value}</div>

      <div className="mt-1 text-[9px] font-black uppercase tracking-widest text-[var(--muted-foreground)]">
        {label}
      </div>
    </div>
  );
}

function PlatformCard({
  title,
  groups,
  posts,
}: {
  title: string;
  groups: number;
  posts: number;
}) {
  return (
    <div className="rounded-[30px] border border-[var(--border)] bg-[var(--card)]/40 p-7 shadow-sm backdrop-blur-xl">
      <div className="mb-6 flex items-center gap-4">
        <div className="rounded-2xl bg-[var(--primary)]/10 p-3 text-[var(--primary)]">
          <MessageCircle className="h-5 w-5" />
        </div>

        <div>
          <h3 className="text-xl font-black text-[var(--foreground)]">
            {title}
          </h3>

          <p className="text-sm font-medium text-[var(--muted-foreground)]">
            Platform activity summary
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--background)] p-5">
          <p className="text-[10px] font-black uppercase tracking-widest text-[var(--muted-foreground)]">
            Groups
          </p>

          <p className="mt-2 text-3xl font-black text-[var(--foreground)]">
            {groups}
          </p>
        </div>

        <div className="rounded-2xl border border-[var(--border)] bg-[var(--background)] p-5">
          <p className="text-[10px] font-black uppercase tracking-widest text-[var(--muted-foreground)]">
            Posts
          </p>

          <p className="mt-2 text-3xl font-black text-[var(--foreground)]">
            {posts}
          </p>
        </div>
      </div>
    </div>
  );
}