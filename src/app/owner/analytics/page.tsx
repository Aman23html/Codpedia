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

// ============================================================================
// HELPER FUNCTIONS (UNCHANGED LOGIC)
// ============================================================================

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

// ============================================================================
// MAIN PAGE COMPONENT
// ============================================================================

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
    <div className="mx-auto flex min-h-screen w-full max-w-[1400px] flex-col gap-6 px-4 py-8 pt-20 sm:gap-8 sm:px-5 sm:py-12 md:pt-24 lg:px-6">
      
      {/* ========================================== */}
      {/* HEADER SECTION                             */}
      {/* ========================================== */}
      <header className="flex flex-col gap-5 rounded-xl border border-[var(--border)] bg-[var(--card)] p-4 shadow-sm sm:p-5 md:flex-row md:items-start md:justify-between">
        <div className="flex min-w-0 flex-1 flex-col items-start gap-1.5">
          <div className="inline-flex items-center gap-1.5 rounded-md bg-[var(--primary)]/10 px-2 py-0.5 text-[10px] font-medium text-[var(--primary)] sm:text-xs">
            <LineChart className="h-3 w-3 shrink-0" />
            <span>Owner Analytics Command</span>
          </div>

          <h1 className="text-xl font-semibold tracking-tight text-[var(--foreground)] sm:text-2xl">
            Department Analytics
          </h1>

          <p className="max-w-2xl text-sm text-[var(--muted-foreground)]">
            Select a department to view its report analytics, employee-wise performance, approval status, and department-specific progress.
          </p>
        </div>

        {/* Compact Metrics Row */}
        <div className="grid shrink-0 grid-cols-3 gap-2 w-full md:w-auto md:flex md:flex-row md:gap-3">
          <HeaderMetric title="Employees" value={totalEmployees} icon={Users} />
          <HeaderMetric title="Incharges" value={totalIncharges} icon={UserCog} />
          <HeaderMetric title="Reports" value={totalReports} icon={FileText} />
        </div>
      </header>

      {/* ========================================== */}
      {/* OVERVIEW CARDS                             */}
      {/* ========================================== */}
      <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 sm:gap-4">
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

      {/* ========================================== */}
      {/* DEPARTMENTS GRID                           */}
      {/* ========================================== */}
      <section className="mt-2 flex flex-col gap-3 sm:mt-4 sm:gap-4">
        <header>
          <h2 className="text-base font-semibold text-[var(--foreground)] sm:text-lg">
            Choose Department
          </h2>
          <p className="mt-0.5 text-xs text-[var(--muted-foreground)] sm:text-sm">
            Marketing and Operations analytics are active. Other departments can be connected after their report modules are created.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 sm:gap-4">
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

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

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
    <div className="flex flex-col items-start justify-center rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 shadow-sm md:min-w-[100px]">
      <div className="mb-0.5 flex items-center gap-1.5 text-[var(--muted-foreground)]">
        <Icon className="h-3.5 w-3.5" />
        <span className="text-[9px] font-semibold uppercase tracking-wider md:text-[10px]">{title}</span>
      </div>
      <p className="text-base font-semibold text-[var(--foreground)] sm:text-lg">{value}</p>
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
    blue: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    emerald: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    purple: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
    amber: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  };

  return (
    <div className="group flex min-w-0 flex-col rounded-xl border border-[var(--border)] bg-[var(--card)] p-3.5 transition-all duration-200 hover:-translate-y-[1px] hover:border-[var(--primary)]/30 hover:shadow-sm sm:p-4">
      <div className="mb-3 flex items-start justify-between sm:mb-4">
        <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-md border sm:h-9 sm:w-9 ${styles[tone]}`}>
          <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
        </div>
        <Activity className="h-4 w-4 shrink-0 text-[var(--muted-foreground)] opacity-50 transition-all duration-200 group-hover:text-[var(--primary)] group-hover:opacity-100" />
      </div>

      <div className="mt-auto min-w-0">
        <h3 className="truncate text-xl font-semibold leading-tight text-[var(--foreground)] sm:text-2xl">
          {value}
        </h3>
        <p className="mt-0.5 truncate text-[10px] font-bold uppercase tracking-wider text-[var(--muted-foreground)]">
          {title}
        </p>
        <p className="mt-1 truncate text-xs text-[var(--muted-foreground)]">
          {description}
        </p>
      </div>
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
  const cardClassName = `group flex flex-col rounded-xl border border-[var(--border)] bg-[var(--card)] p-4 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] sm:p-5 ${
    isAvailable
      ? "cursor-pointer hover:-translate-y-[1px] hover:shadow-sm hover:border-[var(--primary)]/40"
      : "opacity-75 cursor-default"
  }`;

  const cardContent = (
    <>
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-[var(--primary)]/10 text-[var(--primary)] transition-colors duration-200 group-hover:bg-[var(--primary)] group-hover:text-white">
            <Building2 className="h-4 w-4 sm:h-5 sm:w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-sm font-semibold text-[var(--foreground)] transition-colors duration-200 group-hover:text-[var(--primary)] sm:text-base">
              {department.name}
            </h3>
            <p className="truncate text-[10px] font-medium uppercase tracking-wider text-[var(--muted-foreground)]">
              Department
            </p>
          </div>
        </div>

        <span
          className={`shrink-0 rounded-md border px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider sm:text-[10px] ${
            isAvailable
              ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
              : "border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-400"
          }`}
        >
          {status}
        </span>
      </div>

      <div className="mb-4 grid grid-cols-4 gap-2 sm:gap-3">
        <MiniMetric label="EMP" value={department.employees} />
        <MiniMetric label="INC" value={department.incharges} />
        <MiniMetric label="ACT" value={department.activeUsers} />
        <MiniMetric label="REP" value={department.totalReports} />
      </div>

      <div className="mt-auto flex items-center justify-between border-t border-[var(--border)]/60 pt-4 text-xs font-semibold text-[var(--muted-foreground)] transition-colors duration-200 group-hover:text-[var(--primary)]">
        <span>{isAvailable ? "Open Analytics" : "Module Pending"}</span>
        {isAvailable && (
          <ArrowRight className="h-4 w-4 shrink-0 opacity-100 transition-all duration-200 md:-translate-x-1 md:opacity-0 md:group-hover:translate-x-0 md:group-hover:opacity-100" />
        )}
      </div>
    </>
  );

  return isAvailable ? (
    <Link href={getDepartmentHref(department.type)} className={cardClassName} aria-disabled="false">
      {cardContent}
    </Link>
  ) : (
    <div className={cardClassName} aria-disabled="true">
      {cardContent}
    </div>
  );
}

function MiniMetric({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--background)] py-1.5 shadow-sm sm:py-2">
      <p className="text-[9px] font-medium uppercase tracking-wider text-[var(--muted-foreground)]">
        {label}
      </p>
      <p className="mt-0.5 text-sm font-semibold text-[var(--foreground)] sm:text-base">
        {value}
      </p>
    </div>
  );
}