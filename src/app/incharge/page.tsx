import Image from "next/image";
import Link from "next/link";

import { getDashboardStats } from "@/actions/incharge/get-dashboard-stats";
import { getCurrentUser } from "@/lib/current-user";
import { getDepartmentPendingReports } from "@/actions/incharge/get-department-pending-reports";
import { getInchargeDepartmentRoutes } from "@/lib/incharge/department-routes";

import {
  Activity,
  Users,
  FileText,
  CheckCircle2,
  AlertCircle,
  CalendarDays,
  MapPin,
  ShieldCheck,
  Mail,
  Phone,
  Search,
  Bell,
  ArrowRight,
  Check,
  Calendar,
  LayoutDashboard,
  Fingerprint,
  Settings,
} from "lucide-react";

// ============================================================================
// HELPER FUNCTIONS (UNCHANGED LOGIC)
// ============================================================================

function getInitials(name: string) {
  if (!name) return "U";

  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();
}

function getEmployeeCode(user: { employeeCode?: string | null }) {
  return user.employeeCode || "Not Generated";
}

// ============================================================================
// MAIN PAGE COMPONENT
// ============================================================================

export default async function InchargePage() {
  const [reports, stats, currentUser] = await Promise.all([
    getDepartmentPendingReports(),
    getDashboardStats(),
    getCurrentUser(),
  ]);

  if (!currentUser || !currentUser.department) return null;

  const routes = getInchargeDepartmentRoutes(currentUser.department.type);

  const grouped = Object.values(
    reports.reduce((acc: Record<string, any>, report: any) => {
      const key = report.user.id;

      if (!acc[key]) {
        acc[key] = {
          user: report.user,
          reports: [],
        };
      }

      acc[key].reports.push(report);
      return acc;
    }, {})
  );

  const totalReports =
    stats.pendingReports + stats.approvedReports + stats.rejectedReports;

  const approvalRate =
    totalReports > 0
      ? Math.round((stats.approvedReports / totalReports) * 100)
      : 100;

  const today = new Date();

  const dateString = today.toLocaleDateString("en-US", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const inchargeCode = getEmployeeCode(currentUser);
  const currentUserInitials = getInitials(currentUser.fullName);

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-[1400px] flex-col gap-3 px-4 py-6 sm:gap-4 sm:px-5 sm:py-8 lg:gap-5 lg:px-6">
      
      {/* ========================================== */}
      {/* TOP NAVIGATION / HEADER BAR                */}
      {/* ========================================== */}
      <header className="flex flex-col gap-3 rounded-xl border border-[var(--border)] bg-[var(--card)] p-3 shadow-sm sm:p-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex min-w-0 flex-1 items-center gap-2.5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--background)] shadow-sm sm:h-10 sm:w-10">
            <LayoutDashboard className="h-4 w-4 text-[var(--primary)]" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold leading-none text-[var(--foreground)]">
              Incharge Console
            </p>
            <p className="mt-0.5 truncate text-[11px] text-[var(--muted-foreground)]">
              {currentUser.department.name} Department
            </p>
          </div>
        </div>

        <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center lg:w-auto">
          

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <Link
              href="/incharge/profile"
              className="hidden items-center gap-1.5 rounded-md border border-[var(--border)] bg-[var(--background)] px-2.5 py-1.5 text-[11px] font-semibold text-[var(--foreground)] shadow-sm transition-all duration-200 hover:-translate-y-[1px] hover:border-[var(--primary)]/40 hover:shadow-md lg:flex"
            >
              <Settings className="h-3.5 w-3.5 text-[var(--muted-foreground)]" />
              Settings
            </Link>

            <button className="flex h-8 w-8 items-center justify-center rounded-md border border-[var(--border)] bg-[var(--background)] shadow-sm transition-all duration-200 hover:-translate-y-[1px] hover:border-[var(--primary)]/40 hover:shadow-md sm:h-9 sm:w-9">
              <div className="relative">
                <Bell className="h-3.5 w-3.5 text-[var(--muted-foreground)]" />
                <span className="absolute -right-0.5 -top-0.5 h-1.5 w-1.5 rounded-full border border-[var(--background)] bg-[var(--primary)]" />
              </div>
            </button>

            <div className="relative flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-md border border-[var(--border)] bg-gradient-to-br from-[var(--primary)] to-cyan-600 text-[10px] font-bold text-white shadow-sm sm:h-9 sm:w-9">
              {currentUser.profileImageUrl ? (
                <Image
                  src={currentUser.profileImageUrl}
                  alt={currentUser.fullName}
                  fill
                  unoptimized
                  className="object-cover"
                />
              ) : (
                currentUserInitials
              )}
            </div>
          </div>
        </div>
      </header>

      {/* ========================================== */}
      {/* HERO SECTION                               */}
      {/* ========================================== */}
      <section className="flex flex-col gap-3 sm:gap-4 lg:grid lg:grid-cols-12 lg:gap-5">
        {/* Welcome Area */}
        <div className="flex flex-col rounded-xl border border-[var(--border)] bg-[var(--card)] p-4 shadow-sm sm:p-5 lg:col-span-7">
          <div className="mb-3 flex flex-wrap items-center gap-2 sm:mb-4">
            <span className="inline-flex items-center gap-1.5 rounded-md border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 sm:text-[10px]">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
              </span>
              Operational
            </span>
            <span className="inline-flex items-center gap-1 rounded-md border border-[var(--border)] bg-[var(--background)] px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-[var(--muted-foreground)] sm:text-[10px]">
              <Calendar className="h-3 w-3" />
              {dateString}
            </span>
            <span className="inline-flex items-center gap-1 rounded-md border border-[var(--border)] bg-[var(--background)] px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-[var(--muted-foreground)] sm:text-[10px]">
              <Fingerprint className="h-3 w-3" />
              {inchargeCode}
            </span>
          </div>

          <h1 className="text-xl font-semibold tracking-tight text-[var(--foreground)] sm:text-2xl lg:text-3xl">
            Welcome back,{" "}
            <span className="text-[var(--primary)]">
              {currentUser.fullName.split(" ")[0]}
            </span>
          </h1>

          <p className="mt-1.5 max-w-xl text-xs leading-relaxed text-[var(--muted-foreground)] sm:mt-2 sm:text-sm">
            Review pending submissions, monitor department performance, and keep your team operations moving with clarity.
          </p>

          <div className="mt-4 flex flex-col gap-2 sm:mt-auto sm:flex-row sm:items-center pt-3">
            <Link
              href={routes.reportsHref}
              className="group inline-flex items-center justify-center gap-1.5 rounded-md bg-[var(--primary)] px-3 py-2 text-xs font-semibold text-white transition-all duration-200 hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2"
            >
              <FileText className="h-3.5 w-3.5" />
              {routes.actionTitle}
              <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="/incharge/employees"
              className="inline-flex items-center justify-center gap-1.5 rounded-md border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-xs font-semibold text-[var(--foreground)] transition-all duration-200 hover:bg-[var(--accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]"
            >
              <Users className="h-3.5 w-3.5 text-[var(--primary)]" />
              View Directory
            </Link>
          </div>
        </div>

        {/* Hero Stats */}
        <div className="flex flex-col gap-3 sm:gap-4 lg:col-span-5">
          <div className="flex flex-col justify-between rounded-xl border border-[var(--border)] bg-[var(--card)] p-4 shadow-sm sm:p-5 lg:flex-1 lg:justify-center">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <p className="text-[9px] font-semibold uppercase tracking-wider text-[var(--muted-foreground)] sm:text-[10px]">
                  Approval Flow
                </p>
                <h2 className="text-xl font-semibold tracking-tight text-[var(--foreground)] sm:text-2xl">
                  {approvalRate}%
                </h2>
              </div>
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 sm:h-10 sm:w-10">
                <ShieldCheck className="h-4 w-4 sm:h-5 sm:w-5" />
              </div>
            </div>

            <div className="mb-3 h-1.5 w-full overflow-hidden rounded-full bg-[var(--background)] border border-[var(--border)]/50">
              <div
                className="h-full rounded-full bg-[var(--primary)] transition-all duration-1000"
                style={{ width: `${approvalRate}%` }}
              />
            </div>

            {/* Replaced 3-column with 2-column (removed rejected metric per request logic constraints) */}
            <div className="grid grid-cols-2 gap-2 mt-auto">
              <MiniHeroMetric label="Approved" value={stats.approvedReports} />
              <MiniHeroMetric label="Pending" value={stats.pendingReports} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <div className="flex flex-col justify-center rounded-xl border border-[var(--border)] bg-[var(--card)] p-3 shadow-sm sm:p-4">
              <p className="text-[9px] font-semibold uppercase tracking-wider text-[var(--muted-foreground)] sm:text-[10px]">
                Employees
              </p>
              <p className="mt-0.5 text-lg font-semibold tracking-tight text-[var(--foreground)] sm:text-xl">
                {stats.totalEmployees}
              </p>
            </div>
            <div className="flex flex-col justify-center rounded-xl border border-[var(--border)] bg-[var(--card)] p-3 shadow-sm sm:p-4">
              <p className="text-[9px] font-semibold uppercase tracking-wider text-[var(--muted-foreground)] sm:text-[10px]">
                Review Queue
              </p>
              <p className="mt-0.5 text-lg font-semibold tracking-tight text-[var(--foreground)] sm:text-xl">
                {grouped.length}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================== */}
      {/* KPI GRID                                   */}
      {/* ========================================== */}
      <section className="grid grid-cols-1 gap-2 sm:grid-cols-3 sm:gap-3 lg:gap-4">
        <KpiCard title="Total Employees" value={stats.totalEmployees} trend="+12%" icon={Users} tone="primary" />
        <KpiCard title="Approved" value={stats.approvedReports} trend="+5%" icon={CheckCircle2} tone="emerald" />
        <KpiCard title="Pending" value={stats.pendingReports} trend="-2%" icon={AlertCircle} tone="amber" />
      </section>

      {/* ========================================== */}
      {/* MAIN CONTENT LAYOUT                        */}
      {/* ========================================== */}
      <section className="flex flex-col gap-3 sm:gap-4 lg:grid lg:grid-cols-12 lg:items-start lg:gap-5">
        
        {/* Left Column: Queue & Quick Ops */}
        <div className="flex flex-col gap-3 sm:gap-4 lg:col-span-8">
          
          {/* Pending Queue */}
          <div className="flex flex-col overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--card)] shadow-sm">
            <div className="flex flex-col gap-2 border-b border-[var(--border)] p-3 sm:flex-row sm:items-center sm:justify-between sm:p-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-[var(--primary)]/10 text-[var(--primary)]">
                  <LayoutDashboard className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </div>
                <div>
                  <h2 className="text-sm font-semibold tracking-tight text-[var(--foreground)] sm:text-base">
                    {routes.queueTitle}
                  </h2>
                  <p className="text-[10px] text-[var(--muted-foreground)] sm:text-xs">
                    {grouped.length} employees waiting for review
                  </p>
                </div>
              </div>

              <Link
                href={routes.reportsHref}
                className="group inline-flex items-center justify-center gap-1 rounded-md border border-[var(--border)] bg-[var(--background)] px-2.5 py-1 text-[11px] font-medium text-[var(--foreground)] transition-colors hover:bg-[var(--accent)] sm:px-3 sm:py-1.5 sm:text-xs"
              >
                View All
                <ArrowRight className="h-3 w-3 text-[var(--primary)] transition-transform duration-300 group-hover:translate-x-0.5" />
              </Link>
            </div>

            <div className="p-3 sm:p-4 bg-[var(--background)]/50">
              {grouped.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-[var(--border)] bg-[var(--background)] px-4 py-8 text-center">
                  <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                    <Check className="h-4 w-4" />
                  </div>
                  <h3 className="text-sm font-semibold text-[var(--foreground)] sm:text-base">
                    Queue is Empty
                  </h3>
                  <p className="mt-0.5 max-w-sm text-[11px] text-[var(--muted-foreground)] sm:text-xs">
                    All employee submissions have been successfully reviewed.
                  </p>
                </div>
              ) : (
                <div className="grid gap-2 sm:gap-3 md:grid-cols-2">
                  {grouped.map((group: any) => (
                    <PendingGroupCard
                      key={group.user.id}
                      group={group}
                      reportsHref={routes.reportsHref}
                      departmentType={currentUser.department!.type}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Quick Operations */}
          <div className="flex flex-col rounded-xl border border-[var(--border)] bg-[var(--card)] p-3 shadow-sm sm:p-4">
            <div className="mb-3 flex flex-col gap-0.5 sm:mb-4">
              <p className="text-[9px] font-semibold uppercase tracking-wider text-[var(--muted-foreground)] sm:text-[10px]">
                Quick Operations
              </p>
              <h3 className="text-sm font-semibold tracking-tight text-[var(--foreground)] sm:text-base">
                Department shortcuts
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-2 sm:gap-3 xl:grid-cols-4">
              <ActionCard href={routes.reportsHref} title={routes.actionTitle} icon={FileText} tone="primary" />
              <ActionCard href="/incharge/employees" title="Directory" icon={Users} tone="purple" />
              <ActionCard href="/incharge/attendance" title="Attendance" icon={MapPin} tone="emerald" />
              <ActionCard href="/incharge/leaves" title="Leave Vault" icon={CalendarDays} tone="orange" />
            </div>
          </div>
        </div>

        {/* Right Aside: Profile & Team Health */}
        <aside className="flex flex-col gap-3 sm:gap-4 lg:col-span-4">
          
          {/* Profile Details */}
          <div className="flex flex-col rounded-xl border border-[var(--border)] bg-[var(--card)] p-3 shadow-sm sm:p-4">
            <div className="mb-4 flex items-start gap-3">
              <div className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-md border border-[var(--border)] bg-[var(--background)] shadow-sm sm:h-12 sm:w-12">
                {currentUser.profileImageUrl ? (
                  <Image
                    src={currentUser.profileImageUrl}
                    alt={currentUser.fullName}
                    fill
                    unoptimized
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[var(--primary)] to-cyan-600 text-sm font-bold text-white">
                    {currentUserInitials}
                  </div>
                )}
              </div>
              <div className="min-w-0 pt-0.5">
                <h3 className="truncate text-sm font-semibold tracking-tight text-[var(--foreground)] sm:text-base">
                  {currentUser.fullName}
                </h3>
                <p className="truncate text-[11px] font-semibold text-[var(--primary)] sm:text-xs">
                  Department Incharge
                </p>
                <p className="truncate font-mono text-[9px] text-[var(--muted-foreground)] sm:text-[10px]">
                  {inchargeCode}
                </p>
              </div>
            </div>

            <div className="mb-4 flex flex-col gap-1.5">
              <ProfileRow icon={Mail} label="Email" value={currentUser.email} />
              <ProfileRow icon={Phone} label="Phone" value={currentUser.phone || "-"} />
              <ProfileRow icon={ShieldCheck} label="Dept." value={currentUser.department.name} />
            </div>

            <div className="flex flex-col gap-2.5 border-t border-[var(--border)] pt-3">
              <ProgressMetric title="Approval Progress" value={`${approvalRate}%`} width={approvalRate} tone="emerald" />
              <ProgressMetric title="Department Score" value="94%" width={94} tone="primary" />
            </div>
          </div>

          {/* Team Health */}
          <div className="flex flex-col rounded-xl border border-[var(--border)] bg-[var(--card)] p-3 shadow-sm sm:p-4">
            <div className="mb-3 flex items-center justify-between gap-2">
              <h3 className="flex items-center gap-1.5 text-xs font-semibold text-[var(--foreground)] sm:text-sm">
                <Activity className="h-3.5 w-3.5 text-emerald-500" />
                Team Health Pulse
              </h3>
              <span className="rounded-md border border-emerald-500/20 bg-emerald-500/10 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                Excellent
              </span>
            </div>

            <div className="mb-1.5 flex items-baseline gap-1">
              <span className="text-2xl font-semibold tracking-tight text-[var(--foreground)] sm:text-3xl">
                93
              </span>
              <span className="text-xs font-semibold text-[var(--muted-foreground)]">%</span>
            </div>

            <div className="mb-4 h-1.5 w-full overflow-hidden rounded-full bg-[var(--background)] border border-[var(--border)]/50">
              <div className="h-full w-[93%] rounded-full bg-[var(--primary)]" />
            </div>

            <div className="grid grid-cols-3 gap-2 border-t border-[var(--border)] pt-3">
              <SmallMetric label="Present" value="52" />
              <SmallMetric label="Leave" value="2" />
              <SmallMetric label="Absent" value="2" />
            </div>
          </div>

         

        </aside>
      </section>
    </div>
  );
}

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

function PendingGroupCard({ group, reportsHref, departmentType }: any) {
  const firstReport = group.reports[0];
  const employeeCode = getEmployeeCode(group.user);

  const previewLabels =
    departmentType === "MARKETING"
      ? group.reports
          .slice(0, 3)
          .map((report: any) =>
            report.country ? report.country.replaceAll("_", " ") : "Report"
          )
      : group.reports.slice(0, 3).map((report: any) =>
          report.reportDate
            ? new Date(report.reportDate).toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "short",
              })
            : "Report"
        );

  return (
    <div className="flex min-w-0 flex-col rounded-lg border border-[var(--border)] bg-[var(--card)] p-3 transition-all duration-200 hover:-translate-y-[1px] hover:border-[var(--primary)]/40 hover:shadow-sm sm:p-4">
      <div className="mb-3 flex items-start justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          <div className="relative flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-md border border-[var(--border)] bg-[var(--background)] text-[9px] font-bold text-[var(--foreground)] shadow-sm">
            {group.user.profileImageUrl ? (
              <Image
                src={group.user.profileImageUrl}
                alt={group.user.fullName}
                fill
                unoptimized
                className="object-cover"
              />
            ) : (
              getInitials(group.user.fullName)
            )}
          </div>
          <div className="min-w-0">
            <h4 className="truncate text-xs font-semibold text-[var(--foreground)] sm:text-sm">
              {group.user.fullName}
            </h4>
            <p className="truncate font-mono text-[9px] text-[var(--muted-foreground)] sm:text-[10px]">
              {employeeCode}
            </p>
          </div>
        </div>
        <div className="shrink-0 rounded-md border border-amber-500/20 bg-amber-500/10 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400">
          {group.reports.length} Wait
        </div>
      </div>

      <div className="mb-3 flex flex-wrap gap-1.5">
        {previewLabels.map((label: string, index: number) => (
          <span
            key={`${label}-${index}`}
            className="rounded-md border border-[var(--border)] bg-[var(--background)] px-1.5 py-0.5 text-[9px] font-medium text-[var(--muted-foreground)]"
          >
            {label}
          </span>
        ))}
        {group.reports.length > 3 && (
          <span className="rounded-md border border-[var(--border)] bg-[var(--background)] px-1.5 py-0.5 text-[9px] font-medium text-[var(--muted-foreground)]">
            +{group.reports.length - 3}
          </span>
        )}
      </div>

      <Link
        href={`${reportsHref}/${firstReport.id}`}
        className="mt-auto flex w-full items-center justify-center gap-1.5 rounded-md border border-[var(--border)] bg-[var(--background)] px-2 py-1.5 text-[11px] font-semibold text-[var(--foreground)] transition-colors hover:bg-[var(--accent)] hover:text-[var(--primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]"
      >
        Review
        <ArrowRight className="h-3 w-3" />
      </Link>
    </div>
  );
}

function KpiCard({ title, value, trend, icon: Icon, tone }: any) {
  const isPositive = trend.includes("+");
  const isNeutral = trend === "0%";

  const toneConfig: Record<string, string> = {
    primary: "text-blue-600 bg-blue-500/10 dark:text-blue-400",
    emerald: "text-emerald-600 bg-emerald-500/10 dark:text-emerald-400",
    amber: "text-amber-600 bg-amber-500/10 dark:text-amber-400",
    red: "text-red-600 bg-red-500/10 dark:text-red-400",
    purple: "text-purple-600 bg-purple-500/10 dark:text-purple-400",
    sky: "text-sky-600 bg-sky-500/10 dark:text-sky-400",
  };

  const trendStyles = isPositive
    ? "text-emerald-600 dark:text-emerald-400"
    : isNeutral
      ? "text-[var(--muted-foreground)]"
      : "text-red-600 dark:text-red-400";

  return (
    <div className="flex min-w-0 flex-col rounded-xl border border-[var(--border)] bg-[var(--card)] p-3 shadow-sm sm:p-3.5">
      <div className="mb-2 flex items-start justify-between sm:mb-3">
        <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-[var(--border)] sm:h-8 sm:w-8 ${toneConfig[tone]}`}>
          <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
        </div>
        <span className={`text-[9px] font-semibold sm:text-[10px] ${trendStyles}`}>
          {trend}
        </span>
      </div>
      <div className="mt-auto min-w-0">
        <p className="truncate text-lg font-semibold leading-tight text-[var(--foreground)] sm:text-xl">
          {value}
        </p>
        <p className="mt-0.5 truncate text-[9px] font-semibold uppercase tracking-wider text-[var(--muted-foreground)] sm:text-[10px]">
          {title}
        </p>
      </div>
    </div>
  );
}

function ProgressMetric({ title, value, width, tone }: any) {
  const tones = {
    emerald: "bg-emerald-500",
    primary: "bg-[var(--primary)]",
    purple: "bg-purple-500",
  };

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between text-[9px] font-semibold uppercase tracking-wider sm:text-[10px]">
        <span className="text-[var(--muted-foreground)]">{title}</span>
        <span className="text-[var(--foreground)]">{value}</span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full border border-[var(--border)]/50 bg-[var(--background)]">
        <div
          className={`h-full rounded-full transition-all duration-1000 ${tones[tone as keyof typeof tones]}`}
          style={{ width: `${width}%` }}
        />
      </div>
    </div>
  );
}

function ProfileRow({ icon: Icon, label, value }: any) {
  return (
    <div className="flex items-center justify-between gap-2 border-b border-[var(--border)] py-1.5 last:border-0 sm:py-2">
      <span className="flex shrink-0 items-center gap-1.5 text-[11px] font-medium text-[var(--muted-foreground)] sm:text-xs">
        <Icon className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
        {label}
      </span>
      <span className="truncate text-right text-[11px] font-semibold text-[var(--foreground)] sm:text-xs">
        {value}
      </span>
    </div>
  );
}

function InsightItem({ tone, title, subtitle }: any) {
  const tones = {
    emerald: "bg-emerald-500",
    primary: "bg-[var(--primary)]",
    red: "bg-red-500",
  };

  return (
    <div className="flex items-start gap-2 rounded-lg border border-[var(--border)] bg-[var(--background)] p-2 shadow-sm sm:gap-2.5 sm:p-3">
      <span className={`mt-1.5 flex h-1.5 w-1.5 shrink-0 rounded-full ${tones[tone as keyof typeof tones]}`} />
      <div className="min-w-0">
        <p className="truncate text-[11px] font-semibold text-[var(--foreground)] sm:text-xs">
          {title}
        </p>
        <p className="mt-0.5 truncate text-[9px] text-[var(--muted-foreground)] sm:text-[10px]">
          {subtitle}
        </p>
      </div>
    </div>
  );
}

function SmallMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--background)] p-1.5 shadow-sm sm:p-2">
      <p className="text-[8px] font-semibold uppercase tracking-wider text-[var(--muted-foreground)] sm:text-[9px]">
        {label}
      </p>
      <p className="mt-0.5 text-sm font-semibold tracking-tight text-[var(--foreground)] sm:text-base">
        {value}
      </p>
    </div>
  );
}

function ActionCard({ href, title, icon: Icon, tone }: any) {
  const tones: Record<string, string> = {
    primary: "text-blue-600 bg-blue-500/10 dark:text-blue-400",
    purple: "text-purple-600 bg-purple-500/10 dark:text-purple-400",
    emerald: "text-emerald-600 bg-emerald-500/10 dark:text-emerald-400",
    orange: "text-orange-600 bg-orange-500/10 dark:text-orange-400",
  };

  return (
    <Link
      href={href}
      className="group flex min-w-0 flex-col items-center justify-center gap-1.5 rounded-lg border border-[var(--border)] bg-[var(--background)] p-2.5 text-center shadow-sm transition-all duration-200 hover:-translate-y-[1px] hover:border-[var(--primary)]/40 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] sm:gap-2 sm:p-3"
    >
      <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-[var(--border)] sm:h-8 sm:w-8 ${tones[tone]}`}>
        <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
      </div>
      <h3 className="w-full truncate text-[10px] font-semibold text-[var(--foreground)] sm:text-[11px]">
        {title}
      </h3>
    </Link>
  );
}

function MiniHeroMetric({ label, value }: { label: string; value: any }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--background)] p-1.5 shadow-sm sm:p-2">
      <p className="text-[8px] font-semibold uppercase tracking-wider text-[var(--muted-foreground)] sm:text-[9px]">
        {label}
      </p>
      <p className="mt-0.5 text-xs font-semibold tracking-tight text-[var(--foreground)] sm:text-sm">
        {value}
      </p>
    </div>
  );
}