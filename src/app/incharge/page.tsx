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
  Clock,
  Mail,
  Phone,
  Search,
  Bell,
  Sparkles,
  ArrowRight,
  Check,
  X,
  Calendar,
  LayoutDashboard,
  Fingerprint,
  Settings,
} from "lucide-react";

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
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const inchargeCode = getEmployeeCode(currentUser);
  const currentUserInitials = getInitials(currentUser.fullName);

  return (
    <div className="relative min-h-screen overflow-hidden bg-[var(--background)] font-sans text-[var(--foreground)] selection:bg-[var(--primary)]/25">
      {/* Premium Background */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(var(--border)_1px,transparent_1px)] [background-size:34px_34px] opacity-[0.18]" />
        <div className="absolute -left-32 -top-32 h-[420px] w-[420px] rounded-full bg-[var(--primary)]/15 blur-[140px]" />
        <div className="absolute right-[-140px] top-20 h-[460px] w-[460px] rounded-full bg-cyan-500/10 blur-[150px]" />
        <div className="absolute bottom-[-180px] left-1/2 h-[420px] w-[620px] -translate-x-1/2 rounded-full bg-amber-400/10 blur-[160px]" />
      </div>

      {/* Premium Top Bar */}
      <header className="sticky top-0 z-40 border-b border-[var(--border)]/70 bg-[var(--background)]/75 px-4 py-4 backdrop-blur-2xl lg:px-8">
        <div className="mx-auto flex max-w-screen-2xl items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-sm">
              <LayoutDashboard className="h-5 w-5 text-[var(--primary)]" />
            </div>

            <div className="hidden sm:block">
              <p className="text-sm font-semibold leading-none text-[var(--foreground)]">
                Incharge Console
              </p>
              <p className="mt-1 text-xs text-[var(--muted-foreground)]">
                {currentUser.department.name} Department
              </p>
            </div>
          </div>

          <div className="hidden w-full max-w-xl items-center md:flex">
            <div className="relative w-full">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted-foreground)]" />
              <input
                placeholder="Search employees, reports, or commands..."
                className="h-11 w-full rounded-2xl border border-[var(--border)] bg-[var(--card)]/80 pl-11 pr-4 text-sm text-[var(--foreground)] shadow-sm outline-none placeholder:text-[var(--muted-foreground)] transition-all duration-300 focus:border-[var(--primary)]/60 focus:bg-[var(--background)] focus:shadow-[0_0_0_4px_var(--primary)/10]"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/incharge/profile"
              className="hidden items-center gap-2 rounded-2xl border border-[var(--border)] bg-[var(--card)] px-4 py-2.5 text-xs font-semibold text-[var(--foreground)] shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-[var(--primary)]/40 hover:shadow-md lg:flex"
            >
              <Settings className="h-4 w-4 text-[var(--muted-foreground)]" />
              Settings
            </Link>

            <button className="relative flex h-11 w-11 items-center justify-center rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-[var(--primary)]/40 hover:shadow-md">
              <Bell className="h-4 w-4 text-[var(--muted-foreground)]" />
              <span className="absolute right-2.5 top-2.5 h-2.5 w-2.5 rounded-full border-2 border-[var(--card)] bg-[var(--primary)]" />
            </button>

            <div className="relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-2xl border border-white/20 bg-gradient-to-br from-[var(--primary)] via-cyan-500 to-blue-700 text-xs font-bold text-white shadow-lg shadow-[var(--primary)]/20">
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

      <main className="relative z-10 mx-auto max-w-screen-2xl space-y-8 px-4 pb-24 pt-6 sm:px-6 lg:px-8">
        {/* Hero Bento */}
        <section className="relative overflow-hidden rounded-[2rem] border border-[var(--border)] bg-[var(--card)]/85 p-5 shadow-[0_24px_80px_rgba(0,0,0,0.08)] backdrop-blur-xl sm:p-7 lg:p-8">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -right-20 -top-24 h-80 w-80 rounded-full bg-[var(--primary)]/15 blur-3xl" />
            <div className="absolute bottom-[-140px] left-1/4 h-72 w-96 rounded-full bg-amber-400/10 blur-3xl" />
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent dark:from-white/[0.03]" />
          </div>

          <div className="relative grid gap-6 lg:grid-cols-12 lg:items-stretch">
            <div className="lg:col-span-7">
              <div className="mb-5 flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                  </span>
                  Live Status: Operational
                </span>

                <span className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--background)]/70 px-3 py-1.5 text-xs font-semibold text-[var(--muted-foreground)]">
                  <Calendar className="h-3.5 w-3.5" />
                  {dateString}
                </span>

                <span className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--background)]/70 px-3 py-1.5 text-xs font-semibold text-[var(--muted-foreground)]">
                  <Fingerprint className="h-3.5 w-3.5" />
                  {inchargeCode}
                </span>
              </div>

              <h1 className="max-w-3xl text-3xl font-semibold tracking-[-0.04em] text-[var(--foreground)] sm:text-4xl lg:text-5xl">
                Welcome back,{" "}
                <span className="bg-gradient-to-r from-[var(--foreground)] via-[var(--primary)] to-cyan-500 bg-clip-text text-transparent">
                  {currentUser.fullName.split(" ")[0]}
                </span>
              </h1>

              <p className="mt-4 max-w-2xl text-sm leading-6 text-[var(--muted-foreground)] sm:text-base">
                Review pending submissions, monitor department performance, and
                keep your team operations moving with clarity.
              </p>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <Link
                  href={routes.reportsHref}
                  className="group inline-flex items-center justify-center gap-2 rounded-2xl bg-[var(--primary)] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-[var(--primary)]/25 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-[var(--primary)]/30"
                >
                  <FileText className="h-4 w-4" />
                  {routes.actionTitle}
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                </Link>

                <Link
                  href="/incharge/employees"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[var(--border)] bg-[var(--background)]/70 px-5 py-3 text-sm font-semibold text-[var(--foreground)] shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-[var(--primary)]/40 hover:shadow-md"
                >
                  <Users className="h-4 w-4 text-[var(--primary)]" />
                  View Directory
                </Link>
              </div>
            </div>

            <div className="grid gap-4 lg:col-span-5">
              <div className="rounded-[1.6rem] border border-[var(--border)] bg-[var(--background)]/70 p-5 shadow-sm backdrop-blur">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
                      Approval Flow
                    </p>
                    <h2 className="mt-1 text-2xl font-semibold tracking-tight text-[var(--foreground)]">
                      {approvalRate}%
                    </h2>
                  </div>

                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                    <ShieldCheck className="h-6 w-6" />
                  </div>
                </div>

                <div className="h-3 w-full overflow-hidden rounded-full bg-[var(--muted)]">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 transition-all duration-1000"
                    style={{ width: `${approvalRate}%` }}
                  />
                </div>

                <div className="mt-4 grid grid-cols-3 gap-3">
                  <MiniHeroMetric label="Approved" value={stats.approvedReports} />
                  <MiniHeroMetric label="Pending" value={stats.pendingReports} />
                  <MiniHeroMetric label="Rejected" value={stats.rejectedReports} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-[1.6rem] border border-[var(--border)] bg-[var(--background)]/70 p-5 shadow-sm backdrop-blur">
                  <p className="text-xs font-medium text-[var(--muted-foreground)]">
                    Total Employees
                  </p>
                  <p className="mt-2 text-3xl font-semibold tracking-tight text-[var(--foreground)]">
                    {stats.totalEmployees}
                  </p>
                </div>

                <div className="rounded-[1.6rem] border border-[var(--border)] bg-[var(--background)]/70 p-5 shadow-sm backdrop-blur">
                  <p className="text-xs font-medium text-[var(--muted-foreground)]">
                    Review Queue
                  </p>
                  <p className="mt-2 text-3xl font-semibold tracking-tight text-[var(--foreground)]">
                    {grouped.length}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* KPI Grid */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6">
          <KpiCard
            title="Total Employees"
            value={stats.totalEmployees}
            trend="+12%"
            icon={Users}
            tone="primary"
          />
          <KpiCard
            title="Approved"
            value={stats.approvedReports}
            trend="+5%"
            icon={CheckCircle2}
            tone="emerald"
          />
          <KpiCard
            title="Pending"
            value={stats.pendingReports}
            trend="-2%"
            icon={AlertCircle}
            tone="amber"
          />
          <KpiCard
            title="Rejected"
            value={stats.rejectedReports}
            trend="0%"
            icon={X}
            tone="red"
          />
          <KpiCard
            title="Attendance Rate"
            value="96%"
            trend="+2%"
            icon={Clock}
            tone="purple"
          />
          <KpiCard
            title="Active Leaves"
            value="2"
            trend="-1"
            icon={CalendarDays}
            tone="sky"
          />
        </section>

        {/* Main Layout */}
        <section className="grid items-start gap-6 xl:grid-cols-12">
          <div className="space-y-6 xl:col-span-8">
            {/* Pending Queue */}
            <div className="overflow-hidden rounded-[2rem] border border-[var(--border)] bg-[var(--card)]/90 shadow-[0_20px_70px_rgba(0,0,0,0.07)] backdrop-blur-xl">
              <div className="flex flex-col gap-4 border-b border-[var(--border)] bg-gradient-to-r from-[var(--muted)]/40 via-transparent to-[var(--primary)]/5 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[var(--primary)]/10 text-[var(--primary)] shadow-sm">
                    <LayoutDashboard className="h-5 w-5" />
                  </div>

                  <div>
                    <h2 className="text-lg font-semibold tracking-tight text-[var(--foreground)]">
                      {routes.queueTitle}
                    </h2>
                    <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                      {grouped.length} employees waiting for review
                    </p>
                  </div>
                </div>

                <Link
                  href={routes.reportsHref}
                  className="group inline-flex items-center justify-center gap-2 rounded-2xl border border-[var(--border)] bg-[var(--background)]/75 px-4 py-2.5 text-sm font-semibold text-[var(--foreground)] shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-[var(--primary)]/40"
                >
                  View All
                  <ArrowRight className="h-4 w-4 text-[var(--primary)] transition-transform duration-300 group-hover:translate-x-0.5" />
                </Link>
              </div>

              <div className="p-5 sm:p-6">
                {grouped.length === 0 ? (
                  <div className="relative overflow-hidden rounded-[1.6rem] border border-dashed border-[var(--border)] bg-[var(--background)]/70 px-6 py-16 text-center">
                    <div className="absolute left-1/2 top-0 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-500/10 blur-3xl" />

                    <div className="relative mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-3xl bg-emerald-500/10 text-emerald-600 ring-1 ring-emerald-500/20 dark:text-emerald-400">
                      <Check className="h-8 w-8" />
                    </div>

                    <h3 className="relative text-xl font-semibold tracking-tight text-[var(--foreground)]">
                      Queue is Empty
                    </h3>
                    <p className="relative mx-auto mt-2 max-w-md text-sm leading-6 text-[var(--muted-foreground)]">
                      All employee submissions have been successfully reviewed.
                      Your department queue is fully clear.
                    </p>
                  </div>
                ) : (
                  <div className="grid gap-4 md:grid-cols-2">
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
            <div className="rounded-[2rem] border border-[var(--border)] bg-[var(--card)]/90 p-5 shadow-[0_20px_70px_rgba(0,0,0,0.06)] backdrop-blur-xl sm:p-6">
              <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--muted-foreground)]">
                    Quick Operations
                  </p>
                  <h3 className="mt-1 text-xl font-semibold tracking-tight text-[var(--foreground)]">
                    Department shortcuts
                  </h3>
                </div>

                <p className="text-sm text-[var(--muted-foreground)]">
                  Fast access to daily management tools
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <ActionCard
                  href={routes.reportsHref}
                  title={routes.actionTitle}
                  icon={FileText}
                  tone="primary"
                />
                <ActionCard
                  href="/incharge/employees"
                  title="Directory"
                  icon={Users}
                  tone="purple"
                />
                <ActionCard
                  href="/incharge/attendance"
                  title="Attendance"
                  icon={MapPin}
                  tone="emerald"
                />
                <ActionCard
                  href="/incharge/leaves"
                  title="Leave Vault"
                  icon={CalendarDays}
                  tone="orange"
                />
              </div>
            </div>
          </div>

          {/* Right Aside */}
          <aside className="space-y-6 xl:col-span-4">
            {/* Profile Card */}
            <div className="relative overflow-hidden rounded-[2rem] border border-[var(--border)] bg-[var(--card)]/90 p-5 shadow-[0_20px_70px_rgba(0,0,0,0.07)] backdrop-blur-xl sm:p-6">
              <div className="absolute -right-20 -top-20 h-48 w-48 rounded-full bg-[var(--primary)]/15 blur-3xl" />

              <div className="relative mb-6 flex items-start gap-4">
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--muted)] shadow-sm ring-4 ring-[var(--background)]/80">
                  {currentUser.profileImageUrl ? (
                    <Image
                      src={currentUser.profileImageUrl}
                      alt={currentUser.fullName}
                      fill
                      unoptimized
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[var(--primary)] to-cyan-600 text-lg font-bold text-white">
                      {currentUserInitials}
                    </div>
                  )}
                </div>

                <div className="min-w-0 pt-1">
                  <h3 className="truncate text-lg font-semibold tracking-tight text-[var(--foreground)]">
                    {currentUser.fullName}
                  </h3>
                  <p className="text-sm font-semibold text-[var(--primary)]">
                    Department Incharge
                  </p>
                  <p className="mt-1 font-mono text-xs text-[var(--muted-foreground)]">
                    {inchargeCode}
                  </p>
                </div>
              </div>

              <div className="relative mb-6 space-y-3">
                <ProfileRow icon={Mail} label="Email" value={currentUser.email} />
                <ProfileRow
                  icon={Phone}
                  label="Phone"
                  value={currentUser.phone || "Not Provided"}
                />
                <ProfileRow
                  icon={ShieldCheck}
                  label="Dept."
                  value={currentUser.department.name}
                />
              </div>

              <div className="relative space-y-4 border-t border-[var(--border)] pt-5">
                <ProgressMetric
                  title="Approval Progress"
                  value={`${approvalRate}%`}
                  width={approvalRate}
                  tone="emerald"
                />
                <ProgressMetric
                  title="Department Score"
                  value="94%"
                  width={94}
                  tone="primary"
                />
              </div>
            </div>

            {/* Team Health */}
            <div className="rounded-[2rem] border border-[var(--border)] bg-[var(--card)]/90 p-5 shadow-[0_20px_70px_rgba(0,0,0,0.06)] backdrop-blur-xl sm:p-6">
              <div className="mb-5 flex items-center justify-between gap-4">
                <h3 className="flex items-center gap-2 text-sm font-semibold text-[var(--foreground)]">
                  <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                    <Activity className="h-4 w-4" />
                  </span>
                  Team Health Pulse
                </h3>

                <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  Excellent
                </span>
              </div>

              <div className="mb-3 flex items-end gap-1">
                <span className="text-5xl font-semibold tracking-[-0.06em] text-[var(--foreground)]">
                  93
                </span>
                <span className="mb-2 text-sm font-semibold text-[var(--muted-foreground)]">
                  %
                </span>
              </div>

              <div className="mb-6 h-3 w-full overflow-hidden rounded-full bg-[var(--muted)]">
                <div className="h-full w-[93%] rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500" />
              </div>

              <div className="grid grid-cols-3 gap-3 border-t border-[var(--border)] pt-4">
                <SmallMetric label="Present" value="52" />
                <SmallMetric label="Leave" value="2" />
                <SmallMetric label="Absent" value="2" />
              </div>
            </div>

            {/* Insights */}
            <div className="relative overflow-hidden rounded-[2rem] border border-[var(--border)] bg-gradient-to-br from-[var(--primary)]/10 via-[var(--card)] to-[var(--card)] p-5 shadow-[0_20px_70px_rgba(0,0,0,0.06)] backdrop-blur-xl sm:p-6">
              <div className="absolute -right-8 -top-8 opacity-10">
                {/* <Sparkles className="h-28 w-28 text-[var(--primary)]" /> */}
              </div>

              <h3 className="relative mb-5 flex items-center gap-2 text-sm font-semibold text-[var(--foreground)]">
                <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-[var(--primary)]/10 text-[var(--primary)]">
                  {/* <Sparkles className="h-4 w-4" />/ */}
                </span>
                Insights & Tasks
              </h3>

              <ul className="relative z-10 space-y-4">
                <InsightItem
                  tone="emerald"
                  title="Queue is active"
                  subtitle={`${grouped.length} submissions ready for review.`}
                />
                <InsightItem
                  tone="primary"
                  title="Review schedules"
                  subtitle="Verify employee hours for the week."
                />
              </ul>
            </div>
          </aside>
        </section>
      </main>
    </div>
  );
}

// -----------------------------------------------------------------------------
// Sub-components
// -----------------------------------------------------------------------------

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
    <div className="group relative overflow-hidden rounded-[1.5rem] border border-[var(--border)] bg-[var(--background)]/75 p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[var(--primary)]/45 hover:shadow-xl hover:shadow-[var(--primary)]/10">
      <div className="pointer-events-none absolute -right-12 -top-12 h-28 w-28 rounded-full bg-[var(--primary)]/10 opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100" />

      <div className="relative mb-5 flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <div className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--muted)] text-xs font-bold text-[var(--foreground)] shadow-sm">
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
            <h4 className="truncate text-sm font-semibold text-[var(--foreground)]">
              {group.user.fullName}
            </h4>
            <p className="mt-0.5 truncate font-mono text-xs text-[var(--muted-foreground)]">
              {employeeCode}
            </p>
          </div>
        </div>

        <div className="shrink-0 rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-600 dark:text-amber-400">
          {group.reports.length} Pending
        </div>
      </div>

      <div className="relative mb-5 flex flex-wrap gap-2">
        {previewLabels.map((label: string, index: number) => (
          <span
            key={`${label}-${index}`}
            className="rounded-full border border-[var(--border)] bg-[var(--card)] px-3 py-1 text-[11px] font-semibold text-[var(--muted-foreground)]"
          >
            {label}
          </span>
        ))}

        {group.reports.length > 3 && (
          <span className="rounded-full border border-[var(--border)] bg-[var(--card)] px-3 py-1 text-[11px] font-semibold text-[var(--muted-foreground)]">
            +{group.reports.length - 3}
          </span>
        )}
      </div>

      <Link
        href={`${reportsHref}/${firstReport.id}`}
        className="relative flex w-full items-center justify-center gap-2 rounded-2xl border border-[var(--border)] bg-[var(--card)] px-4 py-3 text-sm font-semibold text-[var(--foreground)] transition-all duration-300 hover:border-[var(--primary)]/45 hover:bg-[var(--muted)]/35"
      >
        Review Submission
        <ArrowRight className="h-4 w-4 text-[var(--primary)] transition-transform duration-300 group-hover:translate-x-0.5" />
      </Link>
    </div>
  );
}

function KpiCard({ title, value, trend, icon: Icon, tone }: any) {
  const isPositive = trend.includes("+");
  const isNeutral = trend === "0%";

  const toneConfig: Record<string, string> = {
    primary:
      "text-blue-600 bg-blue-500/10 ring-blue-500/15 dark:text-blue-400",
    emerald:
      "text-emerald-600 bg-emerald-500/10 ring-emerald-500/15 dark:text-emerald-400",
    amber:
      "text-amber-600 bg-amber-500/10 ring-amber-500/15 dark:text-amber-400",
    red: "text-red-600 bg-red-500/10 ring-red-500/15 dark:text-red-400",
    purple:
      "text-purple-600 bg-purple-500/10 ring-purple-500/15 dark:text-purple-400",
    sky: "text-sky-600 bg-sky-500/10 ring-sky-500/15 dark:text-sky-400",
  };

  const trendStyles = isPositive
    ? "text-emerald-600 bg-emerald-500/10 border-emerald-500/20 dark:text-emerald-400"
    : isNeutral
      ? "text-[var(--muted-foreground)] bg-[var(--muted)] border-[var(--border)]"
      : "text-red-600 bg-red-500/10 border-red-500/20 dark:text-red-400";

  return (
    <div className="group relative overflow-hidden rounded-[1.5rem] border border-[var(--border)] bg-[var(--card)]/90 p-5 shadow-sm backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-[var(--primary)]/35 hover:shadow-xl hover:shadow-[var(--primary)]/10">
      <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-[var(--primary)]/10 opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100" />

      <div className="relative mb-5 flex items-start justify-between gap-3">
        <div
          className={`flex h-11 w-11 items-center justify-center rounded-2xl ring-1 ${toneConfig[tone]}`}
        >
          <Icon className="h-5 w-5" />
        </div>

        <span
          className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${trendStyles}`}
        >
          {trend}
        </span>
      </div>

      <div className="relative">
        <p className="text-3xl font-semibold tracking-[-0.05em] text-[var(--foreground)]">
          {value}
        </p>
        <p className="mt-1 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--muted-foreground)]">
          {title}
        </p>
      </div>
    </div>
  );
}

function ProgressMetric({ title, value, width, tone }: any) {
  const tones = {
    emerald: "bg-gradient-to-r from-emerald-500 to-cyan-500",
    primary: "bg-gradient-to-r from-[var(--primary)] to-cyan-500",
    purple: "bg-gradient-to-r from-purple-500 to-pink-500",
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between gap-4 text-xs font-semibold">
        <span className="text-[var(--muted-foreground)]">{title}</span>
        <span className="text-[var(--foreground)]">{value}</span>
      </div>

      <div className="h-2 w-full overflow-hidden rounded-full bg-[var(--muted)]">
        <div
          className={`h-full rounded-full transition-all duration-1000 ${
            tones[tone as keyof typeof tones]
          }`}
          style={{ width: `${width}%` }}
        />
      </div>
    </div>
  );
}

function ProfileRow({ icon: Icon, label, value }: any) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-[var(--border)] bg-[var(--background)]/65 px-4 py-3 text-sm">
      <span className="flex shrink-0 items-center gap-2 text-[var(--muted-foreground)]">
        <Icon className="h-4 w-4" />
        {label}
      </span>

      <span className="max-w-[160px] truncate text-right font-semibold text-[var(--foreground)]">
        {value}
      </span>
    </div>
  );
}

function InsightItem({ tone, title, subtitle }: any) {
  const tones = {
    emerald: "bg-emerald-500 shadow-emerald-500/30",
    primary: "bg-[var(--primary)] shadow-[var(--primary)]/30",
    red: "bg-red-500 shadow-red-500/30",
  };

  return (
    <li className="rounded-2xl border border-[var(--border)] bg-[var(--background)]/60 p-4">
      <div className="flex items-start gap-3">
        <span
          className={`mt-1.5 flex h-2.5 w-2.5 shrink-0 rounded-full shadow-lg ${
            tones[tone as keyof typeof tones]
          }`}
        />

        <div>
          <p className="text-sm font-semibold text-[var(--foreground)]">
            {title}
          </p>
          <p className="mt-1 text-xs leading-5 text-[var(--muted-foreground)]">
            {subtitle}
          </p>
        </div>
      </div>
    </li>
  );
}

function SmallMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--background)]/60 p-4">
      <p className="mb-1 text-xs font-medium text-[var(--muted-foreground)]">
        {label}
      </p>
      <p className="text-xl font-semibold tracking-tight text-[var(--foreground)]">
        {value}
      </p>
    </div>
  );
}

function ActionCard({ href, title, icon: Icon, tone }: any) {
  const tones: Record<string, string> = {
    primary:
      "bg-blue-500/10 text-blue-600 ring-blue-500/15 dark:text-blue-400",
    purple:
      "bg-purple-500/10 text-purple-600 ring-purple-500/15 dark:text-purple-400",
    emerald:
      "bg-emerald-500/10 text-emerald-600 ring-emerald-500/15 dark:text-emerald-400",
    orange:
      "bg-orange-500/10 text-orange-600 ring-orange-500/15 dark:text-orange-400",
  };

  return (
    <Link
      href={href}
      className="group relative overflow-hidden rounded-[1.5rem] border border-[var(--border)] bg-[var(--background)]/70 p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[var(--primary)]/35 hover:shadow-xl hover:shadow-[var(--primary)]/10"
    >
      <div className="pointer-events-none absolute -right-10 -top-10 h-24 w-24 rounded-full bg-[var(--primary)]/10 opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100" />

      <div
        className={`relative mb-5 flex h-12 w-12 items-center justify-center rounded-2xl ring-1 ${tones[tone]}`}
      >
        <Icon className="h-5 w-5" />
      </div>

      <div className="relative flex items-end justify-between gap-4">
        <h3 className="text-sm font-semibold text-[var(--foreground)]">
          {title}
        </h3>

        <ArrowRight className="h-4 w-4 shrink-0 text-[var(--muted-foreground)] transition-all duration-300 group-hover:translate-x-1 group-hover:text-[var(--primary)]" />
      </div>
    </Link>
  );
}

function MiniHeroMetric({ label, value }: { label: string; value: any }) {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)]/70 p-3">
      <p className="text-lg font-semibold tracking-tight text-[var(--foreground)]">
        {value}
      </p>
      <p className="mt-0.5 text-[11px] font-medium text-[var(--muted-foreground)]">
        {label}
      </p>
    </div>
  );
}