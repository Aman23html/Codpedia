import Image from "next/image";
import Link from "next/link";

import { getDashboardData } from "@/actions/employee/get-dashboard-data";
import { AttendanceCard } from "@/components/attendance/attendance-card";
import { getEmployeeWorkspace } from "@/lib/employee/department-workspace";
import LogoutButton from "@/components/auth/logout-button";

import {
  FileText,
  CalendarDays,
  Clock,
  MapPin,
  Target,
  Mail,
  Phone,
  ArrowRight,
  Activity,
  User,
  Settings,
  Building2,
  Fingerprint,
} from "lucide-react";
import { formatDateIST } from "@/lib/format-date";

export default async function EmployeePage() {
  const dashboard = await getDashboardData();

  if (!dashboard || !dashboard.employee) return null;

  const { employee, stats, todayAttendance, greeting } = dashboard;

  const workspace = getEmployeeWorkspace(employee.department?.type);

  const today = formatDateIST(new Date());

  const employeeId = employee.employeeCode || "Not Generated";

  const initials = employee.fullName
    .split(" ")
    .map((part: string) => part[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  const firstName = employee.fullName.split(" ")[0];

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-[1400px] flex-col gap-4 px-4 py-8 pt-20 sm:gap-6 sm:px-5 sm:py-12 md:pt-24 lg:px-6 lg:gap-8">
      
      {/* ========================================== */}
      {/* TOP SECTION: HERO & PROFILE                */}
      {/* ========================================== */}
      <section className="flex flex-col gap-4 sm:gap-6 lg:grid lg:grid-cols-12 lg:gap-6">
        
        {/* Hero Card */}
        <div className="flex flex-col justify-between rounded-xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-sm sm:p-6 lg:col-span-8 lg:p-8">
          <div className="flex flex-col items-start gap-1.5">
            <div className="mb-2 inline-flex items-center gap-1.5 rounded-md bg-[var(--primary)]/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-[var(--primary)] sm:text-xs">
              <span className="relative flex h-1.5 w-1.5 shrink-0">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--primary)] opacity-75"></span>
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[var(--primary)]"></span>
              </span>
              {workspace.badge}
            </div>

            <h1 className="text-2xl font-semibold tracking-tight text-[var(--foreground)] sm:text-3xl lg:text-4xl">
              {greeting}, {firstName} 👋
            </h1>

            <p className="text-sm font-medium text-[var(--muted-foreground)] sm:text-base">
              {today} • {employee.department?.name || "General"} Department
            </p>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-3 sm:mt-8 sm:grid-cols-3 sm:gap-4">
            <div className="flex flex-col rounded-lg border border-[var(--border)] bg-[var(--background)] p-3.5 sm:p-4">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
                Today's Focus
              </p>
              <p className="mt-1 text-sm font-semibold text-[var(--foreground)]">
                {workspace.focus}
              </p>
            </div>

            <div className="flex flex-col rounded-lg border border-[var(--border)] bg-[var(--background)] p-3.5 sm:p-4">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
                Shift Status
              </p>
              <p className="mt-1 text-sm font-semibold text-[var(--foreground)]">
                General Shift
              </p>
              <p className="text-xs font-medium text-[var(--muted-foreground)]">
                09:00 - 18:00
              </p>
            </div>

            <div className="flex flex-col rounded-lg border border-[var(--primary)]/20 bg-[var(--primary)]/5 p-3.5 sm:p-4">
              <p className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-[var(--primary)]">
                <Fingerprint className="h-3 w-3" />
                Employee ID
              </p>
              <p className="mt-1 font-mono text-sm font-semibold text-[var(--foreground)]">
                {employeeId}
              </p>
            </div>
          </div>
        </div>

        {/* Profile Card */}
        <div className="flex flex-col rounded-xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-sm sm:p-6 lg:col-span-4 lg:p-8">
          <div className="mb-5 flex items-center gap-4 sm:mb-6">
            <div className="relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-[var(--border)] bg-gradient-to-tr from-[var(--primary)] to-purple-600 text-lg font-bold text-white shadow-sm sm:h-16 sm:w-16">
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

            <div className="min-w-0 flex-1">
              <h2 className="truncate text-base font-semibold text-[var(--foreground)] sm:text-lg">
                {employee.fullName}
              </h2>
              <div className="mt-0.5 flex items-center gap-1.5">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--primary)]">
                  Employee
                </span>
                <span className="h-1 w-1 rounded-full bg-[var(--border)]"></span>
                <span className="truncate font-mono text-[10px] font-medium text-[var(--muted-foreground)]">
                  {employeeId}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-1 text-sm">
            <ProfileRow icon={Mail} label="Email" value={employee.email} />
            <ProfileRow icon={Phone} label="Phone" value={employee.phone || "-"} />
            <ProfileRow
              icon={Building2}
              label="Department"
              value={employee.department?.name || "General"}
            />
          </div>

          <Link
            href="/employee/profile"
            className="mt-auto pt-6 focus-visible:outline-none"
          >
            <div className="flex w-full items-center justify-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--background)] px-4 py-2.5 text-sm font-semibold text-[var(--foreground)] transition-colors hover:border-[var(--primary)] hover:bg-[var(--primary)] hover:text-white focus-visible:ring-2 focus-visible:ring-[var(--primary)]">
              <Settings className="h-4 w-4" />
              Profile Settings
            </div>
          </Link>
        </div>
      </section>

      {/* ========================================== */}
      {/* KPI METRICS                                */}
      {/* ========================================== */}
      <section className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4 lg:gap-6">
        <KpiCard
          title="Attendance"
          value={`${stats.attendancePercentage}%`}
          icon={Clock}
          color="text-purple-600 dark:text-purple-400"
        />
        <KpiCard
          title="Reports Done"
          value={stats.totalReports}
          icon={FileText}
          color="text-blue-600 dark:text-blue-400"
        />
        <KpiCard
          title="Leave Balance"
          value={stats.leaveBalance}
          icon={CalendarDays}
          color="text-amber-600 dark:text-amber-400"
        />
        <KpiCard
          title="Performance"
          value={stats.performance}
          icon={Target}
          color="text-emerald-600 dark:text-emerald-400"
        />
      </section>

      {/* ========================================== */}
      {/* BOTTOM SECTION: ATTENDANCE & ACTIONS       */}
      {/* ========================================== */}
      <section className="flex flex-col gap-4 sm:gap-6 lg:grid lg:grid-cols-12 lg:gap-6">
        
        {/* Today's Attendance Widget */}
        <div className="flex flex-col rounded-xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-sm sm:p-6 lg:col-span-8 lg:p-8">
          <div className="mb-5 flex items-center gap-2 sm:mb-6">
            <Activity className="h-5 w-5 text-[var(--primary)]" />
            <h2 className="text-lg font-semibold text-[var(--foreground)] sm:text-xl">
              Today's Attendance
            </h2>
          </div>
          
          <AttendanceCard attendance={todayAttendance} />
        </div>

        {/* Quick Actions Menu */}
        <div className="flex flex-col gap-3 rounded-xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-sm sm:gap-4 sm:p-6 lg:col-span-4 lg:p-8">
          <h2 className="mb-2 text-sm font-semibold text-[var(--foreground)] sm:text-base">
            Quick Actions
          </h2>
          
          <ActionLink
            href="/employee/attendance"
            title="Check In / Out"
            icon={MapPin}
          />
          <ActionLink
            href="/employee/leave"
            title="Request Leave"
            icon={CalendarDays}
          />
          <ActionLink
            href={workspace.reportHref}
            title={workspace.reportTitle}
            icon={FileText}
          />
          <ActionLink
            href="/employee/profile"
            title="Edit Profile"
            icon={User}
          />

          <div className="mt-2 border-t border-[var(--border)] pt-5 sm:mt-auto sm:pt-6">
            <LogoutButton />
          </div>
        </div>
      </section>

    </div>
  );
}

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

function ProfileRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between border-b border-[var(--border)] py-2.5 last:border-0">
      <div className="flex items-center gap-2 text-[var(--muted-foreground)]">
        <Icon className="h-3.5 w-3.5 shrink-0" />
        <span className="text-xs font-medium">{label}</span>
      </div>
      <span className="max-w-[160px] truncate text-sm font-medium text-[var(--foreground)] sm:max-w-[200px]">
        {value}
      </span>
    </div>
  );
}

function KpiCard({ title, value, icon: Icon, color }: any) {
  return (
    <div className="group flex min-w-0 flex-col rounded-xl border border-[var(--border)] bg-[var(--card)] p-3.5 transition-all duration-200 hover:-translate-y-[1px] hover:shadow-sm sm:p-5">
      <div className="mb-3 flex items-start justify-between sm:mb-4">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-[var(--border)] bg-[var(--background)] sm:h-9 sm:w-9">
          <Icon className={`h-4 w-4 sm:h-4.5 sm:w-4.5 ${color}`} />
        </div>
      </div>
      
      <div className="mt-auto min-w-0">
        <h3 className="truncate text-xl font-semibold leading-tight text-[var(--foreground)] sm:text-2xl">
          {value}
        </h3>
        <p className="mt-0.5 truncate text-[10px] font-medium uppercase tracking-wider text-[var(--muted-foreground)]">
          {title}
        </p>
      </div>
    </div>
  );
}

function ActionLink({ href, title, icon: Icon }: any) {
  return (
    <Link
      href={href}
      className="group flex items-center justify-between rounded-lg border border-[var(--border)] bg-[var(--background)] p-3 transition-all duration-200 hover:-translate-y-[1px] hover:border-[var(--primary)]/40 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] sm:p-4"
    >
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-[var(--primary)]/10 text-[var(--primary)] transition-colors duration-200 group-hover:bg-[var(--primary)] group-hover:text-white">
          <Icon className="h-4 w-4" />
        </div>
        <span className="truncate text-sm font-medium text-[var(--foreground)] transition-colors duration-200 group-hover:text-[var(--primary)]">
          {title}
        </span>
      </div>
      <ArrowRight className="ml-2 h-4 w-4 shrink-0 text-[var(--muted-foreground)] opacity-100 transition-all duration-200 group-hover:text-[var(--primary)] md:opacity-0 md:-translate-x-1 md:group-hover:translate-x-0 md:group-hover:opacity-100" />
    </Link>
  );
}