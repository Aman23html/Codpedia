import Link from "next/link";
import {
  Activity,
  ArrowRight,
  BarChart3,
  Building2,
  FileText,
  LineChart,
  ShieldCheck,
  Users,
  UserCog,
} from "lucide-react";

import { getOwnerAnalyticsDepartments } from "@/actions/owner/get-owner-analytics-departments";

function getDepartmentHref(type: string) {
  if (type === "MARKETING") return "/owner/analytics/marketing";
  if (type === "OPERATIONS") return "/owner/analytics/operations";
  if (type === "TUTOR") return "/owner/analytics/tutor";
  if (type === "ACCOUNTS") return "/owner/analytics/accounts";
  if (type === "DIGITAL_MARKETING") {
    return "/owner/analytics/digital-marketing";
  }

  return "/owner/analytics";
}

function getDepartmentStatus(type: string) {
  if (type === "MARKETING" || type === "OPERATIONS") {
    return "Available";
  }

  return "Coming Soon";
}

export default async function OwnerAnalyticsPage() {
  const departments = await getOwnerAnalyticsDepartments();

  const totalEmployees = departments.reduce(
    (sum, department) => sum + department.employees,
    0
  );

  const totalIncharges = departments.reduce(
    (sum, department) => sum + department.incharges,
    0
  );

  const totalReports = departments.reduce(
    (sum, department) => sum + department.totalReports,
    0
  );

  return (
    <div className="min-h-screen bg-[var(--background)] px-6 pt-28 pb-20 lg:pt-32 lg:px-12 max-w-[1700px] mx-auto space-y-10">
      <header className="relative overflow-hidden rounded-[36px] border border-[var(--border)] bg-[var(--card)]/45 p-8 shadow-sm backdrop-blur-xl lg:p-10">
        <div className="pointer-events-none absolute right-[-140px] top-[-140px] h-[380px] w-[380px] rounded-full bg-[var(--primary)]/10 blur-[90px]" />
        <div className="pointer-events-none absolute bottom-[-150px] left-[25%] h-[320px] w-[320px] rounded-full bg-purple-500/10 blur-[90px]" />

        <div className="relative z-10 flex flex-col gap-8 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[var(--primary)]/20 bg-[var(--primary)]/10 px-4 py-2 text-[11px] font-black uppercase tracking-widest text-[var(--primary)]">
              <LineChart className="h-3.5 w-3.5" />
              Owner Analytics Command
            </div>

            <h1 className="mb-4 text-4xl font-black tracking-tight text-[var(--foreground)] lg:text-5xl">
              Department Analytics
            </h1>

            <p className="max-w-3xl text-base font-medium leading-7 text-[var(--muted-foreground)]">
              Select a department to view its report analytics, employee-wise
              performance, approval status, and department-specific progress.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <HeaderMetric title="Employees" value={totalEmployees} icon={Users} />
            <HeaderMetric title="Incharges" value={totalIncharges} icon={UserCog} />
            <HeaderMetric title="Reports" value={totalReports} icon={FileText} />
          </div>
        </div>
      </header>

      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <OverviewCard
          title="Departments"
          value={departments.length}
          description="Total departments configured"
          icon={Building2}
          tone="blue"
        />

        <OverviewCard
          title="Total Employees"
          value={totalEmployees}
          description="Employees across all departments"
          icon={Users}
          tone="emerald"
        />

        <OverviewCard
          title="Total Incharges"
          value={totalIncharges}
          description="Department-level managers"
          icon={ShieldCheck}
          tone="purple"
        />

        <OverviewCard
          title="Total Reports"
          value={totalReports}
          description="Reports from active modules"
          icon={BarChart3}
          tone="amber"
        />
      </section>

      <section>
        <div className="mb-6">
          <h2 className="text-2xl font-black text-[var(--foreground)]">
            Choose Department
          </h2>

          <p className="mt-2 text-sm font-medium text-[var(--muted-foreground)]">
            Marketing and Operations analytics are active. Other departments can
            be connected after their report modules are created.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {departments.map((department) => (
            <DepartmentAnalyticsCard
              key={department.id}
              department={department}
            />
          ))}
        </div>
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
  value: number;
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

function OverviewCard({
  title,
  value,
  description,
  icon: Icon,
  tone,
}: {
  title: string;
  value: number;
  description: string;
  icon: React.ElementType;
  tone: "blue" | "emerald" | "purple" | "amber";
}) {
  const styles = {
    blue: "border-blue-500/20 bg-blue-500/10 text-blue-500",
    emerald: "border-emerald-500/20 bg-emerald-500/10 text-emerald-500",
    purple: "border-purple-500/20 bg-purple-500/10 text-purple-500",
    amber: "border-amber-500/20 bg-amber-500/10 text-amber-500",
  };

  return (
    <div className="rounded-[28px] border border-[var(--border)] bg-[var(--card)]/40 p-6 shadow-sm backdrop-blur-xl transition hover:-translate-y-1 hover:border-[var(--primary)]/30">
      <div className="mb-6 flex items-center justify-between">
        <div className={`rounded-2xl border p-3 ${styles[tone]}`}>
          <Icon className="h-6 w-6" />
        </div>

        <Activity className="h-4 w-4 text-[var(--muted-foreground)]" />
      </div>

      <h3 className="text-3xl font-black text-[var(--foreground)]">
        {value}
      </h3>

      <p className="mt-1 text-[10px] font-black uppercase tracking-widest text-[var(--muted-foreground)]">
        {title}
      </p>

      <p className="mt-3 text-sm font-medium text-[var(--muted-foreground)]">
        {description}
      </p>
    </div>
  );
}

function DepartmentAnalyticsCard({
  department,
}: {
  department: {
    id: string;
    name: string;
    type: string;
    totalUsers: number;
    employees: number;
    incharges: number;
    activeUsers: number;
    totalReports: number;
  };
}) {
  const status = getDepartmentStatus(department.type);
  const isAvailable = status === "Available";

  return (
    <Link
      href={getDepartmentHref(department.type)}
      className={`group relative overflow-hidden rounded-[32px] border border-[var(--border)] bg-[var(--card)]/45 p-7 shadow-sm backdrop-blur-xl transition-all duration-500 hover:-translate-y-1 hover:border-[var(--primary)]/40 ${
        !isAvailable ? "opacity-70" : ""
      }`}
    >
      <div className="pointer-events-none absolute right-[-80px] top-[-80px] h-48 w-48 rounded-full bg-[var(--primary)]/0 blur-[60px] transition group-hover:bg-[var(--primary)]/10" />

      <div className="relative z-10">
        <div className="mb-7 flex items-start justify-between gap-5">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-[22px] border border-[var(--primary)]/20 bg-[var(--primary)]/10 text-[var(--primary)] transition group-hover:bg-[var(--primary)] group-hover:text-white">
              <Building2 className="h-7 w-7" />
            </div>

            <div>
              <p className="mb-1 text-[10px] font-black uppercase tracking-widest text-[var(--muted-foreground)]">
                Department
              </p>

              <h3 className="text-2xl font-black text-[var(--foreground)] group-hover:text-[var(--primary)]">
                {department.name}
              </h3>
            </div>
          </div>

          <span
            className={`rounded-full border px-3 py-1.5 text-[9px] font-black uppercase tracking-widest ${
              isAvailable
                ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-500"
                : "border-amber-500/20 bg-amber-500/10 text-amber-500"
            }`}
          >
            {status}
          </span>
        </div>

        <div className="grid grid-cols-4 gap-3">
          <MiniMetric label="EMP" value={department.employees} />
          <MiniMetric label="INC" value={department.incharges} />
          <MiniMetric label="ACT" value={department.activeUsers} />
          <MiniMetric label="REP" value={department.totalReports} />
        </div>

        <div className="mt-6 flex items-center border-t border-[var(--border)] pt-5 text-sm font-black text-[var(--muted-foreground)] group-hover:text-[var(--primary)]">
          <span>
            {isAvailable ? "Open Analytics" : "Module Pending"}
          </span>

          <div className="ml-auto flex h-9 w-9 items-center justify-center rounded-full bg-[var(--primary)]/10 opacity-0 transition group-hover:bg-[var(--primary)] group-hover:text-white group-hover:opacity-100">
            <ArrowRight className="h-4 w-4" />
          </div>
        </div>
      </div>
    </Link>
  );
}

function MiniMetric({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--background)]/70 p-4">
      <p className="text-[9px] font-black uppercase tracking-widest text-[var(--muted-foreground)]">
        {label}
      </p>

      <p className="mt-2 text-xl font-black text-[var(--foreground)]">
        {value}
      </p>
    </div>
  );
}