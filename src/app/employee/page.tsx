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
  ShieldCheck,
  Mail,
  Phone,
  ArrowRight,
  Activity,
  User,
  Settings,
  Building2,
  Fingerprint,
} from "lucide-react";
import AttendancePage from "./attendance/page";

export default async function EmployeePage() {
  const dashboard = await getDashboardData();

  if (!dashboard || !dashboard.employee) return null;

  const { employee, stats, todayAttendance, greeting } = dashboard;

  const workspace = getEmployeeWorkspace(employee.department?.type);

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const employeeId = employee.employeeCode || "Not Generated";

  const initials = employee.fullName
    .split(" ")
    .map((part: string) => part[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  const firstName = employee.fullName.split(" ")[0];

  return (
    <div className="min-h-screen bg-[var(--background)] px-6 pt-32 pb-24 lg:px-12 max-w-[1600px] mx-auto space-y-8">
      <section className="grid gap-8 lg:grid-cols-12">
        <div className="relative flex flex-col justify-between overflow-hidden rounded-[32px] border border-[var(--border)] bg-[var(--card)]/40 p-10 shadow-sm backdrop-blur-xl lg:col-span-8">
          <div className="pointer-events-none absolute right-0 top-0 h-[500px] w-[500px] -translate-y-1/2 translate-x-1/3 rounded-full bg-[var(--primary)]/5 blur-[100px]" />
          <div className="pointer-events-none absolute bottom-[-120px] left-[20%] h-[280px] w-[280px] rounded-full bg-purple-500/10 blur-[90px]" />

          <div className="relative z-10">
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-[var(--primary)]/20 bg-[var(--primary)]/10 px-4 py-2 text-[11px] font-black uppercase tracking-widest text-[var(--primary)]">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--primary)]" />
              {workspace.badge}
            </div>

            <h1 className="mb-3 text-4xl font-black tracking-tight text-[var(--foreground)] md:text-5xl">
              {greeting}, {firstName} 👋
            </h1>

            <p className="text-lg font-medium text-[var(--muted-foreground)]">
              {today} • {employee.department?.name || "General"} Department
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--background)]/50 p-5 shadow-inner">
              <p className="mb-1 text-[10px] font-black uppercase tracking-widest text-[var(--muted-foreground)]">
                Today's Focus
              </p>

              <p className="font-bold text-[var(--foreground)]">
                {workspace.focus}
              </p>
            </div>
            

            <div className="rounded-2xl border border-[var(--border)] bg-[var(--background)]/50 p-5 shadow-inner">
              <p className="mb-1 text-[10px] font-black uppercase tracking-widest text-[var(--muted-foreground)]">
                Shift Status
              </p>

              <p className="font-bold text-[var(--foreground)]">
                General Shift
              </p>

              <p className="mt-1 text-xs font-semibold text-[var(--muted-foreground)]">
                09:00 - 18:00
              </p>
            </div>

            <div className="rounded-2xl border border-[var(--primary)]/20 bg-[var(--primary)]/10 p-5 shadow-inner">
              <p className="mb-1 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[var(--primary)]">
                <Fingerprint className="h-3.5 w-3.5" />
                Employee ID
              </p>

              <p className="font-mono text-sm font-black text-[var(--foreground)]">
                {employeeId}
              </p>
            </div>
          </div>
        </div>

        

        <div className="relative overflow-hidden rounded-[32px] border border-[var(--border)] bg-[var(--card)]/60 p-8 shadow-sm backdrop-blur-xl lg:col-span-4">
          <div className="pointer-events-none absolute right-[-80px] top-[-80px] h-48 w-48 rounded-full bg-[var(--primary)]/10 blur-[70px]" />

          <div className="relative z-10">
            <div className="mb-8 flex items-center gap-4">
              <div className="relative flex h-20 w-20 items-center justify-center overflow-hidden rounded-[24px] border border-[var(--border)] bg-gradient-to-tr from-[var(--primary)] to-purple-600 text-xl font-black text-white shadow-lg">
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
                <h2 className="text-lg font-black text-[var(--foreground)]">
                  {employee.fullName}
                </h2>

                <p className="mt-1 text-xs font-bold uppercase tracking-widest text-[var(--primary)]">
                  Employee
                </p>

                <p className="mt-2 font-mono text-xs font-black text-[var(--muted-foreground)]">
                  {employeeId}
                </p>
              </div>
            </div>

            <div className="space-y-4 text-sm font-medium text-[var(--muted-foreground)]">
              <ProfileRow
                icon={Fingerprint}
                label="Employee ID"
                value={employeeId}
              />

              <ProfileRow icon={Mail} label="Email" value={employee.email} />

              <ProfileRow
                icon={Phone}
                label="Phone"
                value={employee.phone || "-"}
              />

              <ProfileRow
                icon={Building2}
                label="Department"
                value={employee.department?.name || "General"}
              />
            </div>

            <Link
              href="/employee/profile"
              className="mt-8 flex w-full items-center justify-center gap-2 rounded-2xl border border-[var(--border)] bg-[var(--background)] px-5 py-4 text-sm font-black text-[var(--foreground)] transition hover:border-[var(--primary)]/40 hover:bg-[var(--primary)] hover:text-white"
            >
              <Settings className="h-4 w-4" />
              Profile Settings
            </Link>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-6 md:grid-cols-4">
        <KpiCard
          title="Attendance"
          value={`${stats.attendancePercentage}%`}
          icon={Clock}
          color="text-purple-500"
        />

        <KpiCard
          title="Reports Done"
          value={stats.totalReports}
          icon={FileText}
          color="text-blue-500"
        />

        <KpiCard
          title="Leave Balance"
          value={stats.leaveBalance}
          icon={CalendarDays}
          color="text-amber-500"
        />

        <KpiCard
          title="Performance"
          value={stats.performance}
          icon={Target}
          color="text-emerald-500"
        />
      </section>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="rounded-[32px] border border-[var(--border)] bg-[var(--card)]/40 p-10 shadow-sm backdrop-blur-xl lg:col-span-2">
          <h2 className="mb-8 flex items-center gap-3 text-xl font-bold text-[var(--foreground)]">
            <Activity className="h-6 w-6 text-[var(--primary)]" />
            Today's Attendance
          </h2>

          <AttendanceCard attendance={todayAttendance} />
        </div>

        <div className="space-y-6">
          <ActionLink
            href="/employee/attendance"
            title="Check In / Out"
            icon={MapPin}
            color="blue"
          />

          <ActionLink
            href="/employee/leave"
            title="Request Leave"
            icon={CalendarDays}
            color="purple"
          />

          <ActionLink
            href={workspace.reportHref}
            title={workspace.reportTitle}
            icon={FileText}
            color="emerald"
          />

          <ActionLink
            href="/employee/profile"
            title="Edit Profile"
            icon={User}
            color="purple"
          />

          <div className="border-t border-[var(--border)] pt-4">
            <LogoutButton />
          </div>
        </div>
      </div>
    </div>
  );
}

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
    <div className="flex justify-between gap-4 rounded-2xl border border-[var(--border)] bg-[var(--background)]/70 px-4 py-3">
      <span className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[var(--muted-foreground)]">
        <Icon className="h-4 w-4 text-[var(--primary)]" />
        {label}
      </span>

      <span className="max-w-[190px] truncate text-sm font-bold text-[var(--foreground)]">
        {value}
      </span>
    </div>
  );
}

function KpiCard({ title, value, icon: Icon, color }: any) {
  return (
    <div className="group flex items-center gap-4 rounded-[24px] border border-[var(--border)] bg-[var(--card)]/40 p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-[var(--primary)]/30">
      <div className={`rounded-2xl bg-[var(--background)] p-3 ${color}`}>
        <Icon className="h-6 w-6" />
      </div>

      <div>
        <p className="text-[10px] font-black uppercase tracking-widest text-[var(--muted-foreground)]">
          {title}
        </p>

        <p className="text-2xl font-black text-[var(--foreground)]">
          {value}
        </p>
      </div>
    </div>
  );
}

function ActionLink({ href, title, icon: Icon, color }: any) {
  const styles = {
    blue: "hover:border-blue-500/30 hover:bg-blue-500/5",
    purple: "hover:border-purple-500/30 hover:bg-purple-500/5",
    emerald: "hover:border-emerald-500/30 hover:bg-emerald-500/5",
  };

  return (
    <Link
      href={href}
      className={`group flex items-center gap-5 rounded-[24px] border border-[var(--border)] bg-[var(--card)]/40 p-6 transition-all ${
        styles[color as keyof typeof styles]
      }`}
    >
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--background)] p-3">
        <Icon className="h-5 w-5 text-[var(--muted-foreground)] group-hover:text-[var(--primary)]" />
      </div>

      <span className="text-sm font-bold text-[var(--foreground)]">
        {title}
      </span>

      <ArrowRight className="ml-auto h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100" />
    </Link>
  );
}