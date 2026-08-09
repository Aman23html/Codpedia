import Link from "next/link";
import {
  ArrowRight,
  Building2,
  FolderKanban,
  Network,
  UserCog,
  Users,
  Activity,
  Layers3, // Kept for imports, though removed from individual metrics to save space
} from "lucide-react";

import { getDepartments } from "@/actions/owner/get-departments";

export default async function DepartmentsPage() {
  const departments = await getDepartments();

  const totalEmployees = departments.reduce(
    (sum, department) => sum + department.employeeCount,
    0
  );

  const totalIncharges = departments.reduce(
    (sum, department) => sum + department.inchargeCount,
    0
  );

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-[1400px] flex-col gap-6 px-4 py-8 pt-20 sm:gap-8 sm:px-5 sm:py-12 md:pt-24 lg:px-6">
      
      {/* ========================================== */}
      {/* HEADER SECTION                             */}
      {/* ========================================== */}
      <header className="flex flex-col gap-5 rounded-xl border border-[var(--border)] bg-[var(--card)] p-4 sm:p-5 md:flex-row md:items-start md:justify-between shadow-sm">
        <div className="flex min-w-0 flex-1 flex-col items-start gap-1.5">
          <div className="inline-flex items-center gap-1.5 rounded-md bg-[var(--primary)]/10 px-2 py-0.5 text-[10px] font-medium text-[var(--primary)] sm:text-xs">
            <Network className="h-3 w-3 shrink-0" />
            <span>Owner Organizational Control</span>
          </div>
          
          <h1 className="text-xl font-semibold tracking-tight text-[var(--foreground)] sm:text-2xl">
            Department Directory
          </h1>
          <p className="max-w-2xl text-sm text-[var(--muted-foreground)]">
            Manage all company departments, review employee distribution, monitor incharge allocation, and access each division from one global workspace.
          </p>
        </div>

        {/* Compact Metrics Row */}
        <div className="grid shrink-0 grid-cols-3 gap-2 w-full md:w-auto md:flex md:flex-row md:gap-3">
          <HeaderMetric title="Depts" value={departments.length} icon={FolderKanban} />
          <HeaderMetric title="Staff" value={totalEmployees} icon={Users} />
          <HeaderMetric title="Leads" value={totalIncharges} icon={UserCog} />
        </div>
      </header>

      {/* ========================================== */}
      {/* DEPARTMENTS SECTION                        */}
      {/* ========================================== */}
      <section className="mt-2 flex flex-col gap-3 sm:mt-4 sm:gap-4">
        <header>
          <h2 className="text-base font-semibold text-[var(--foreground)] sm:text-lg">
            All Departments
          </h2>
          <p className="mt-0.5 text-xs text-[var(--muted-foreground)] sm:text-sm">
            Select a department to view assigned employees, incharges, and operational details.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
          {departments.map((department, index) => (
            <DepartmentCard
              key={department.id}
              department={department}
              index={index}
            />
          ))}
        </div>
      </section>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* SUB-COMPONENTS                                                             */
/* -------------------------------------------------------------------------- */

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

function DepartmentCard({
  department,
  index,
}: {
  department: {
    id: string;
    name: string;
    type: string;
    employeeCount: number;
    inchargeCount: number;
  };
  index: number;
}) {
  const totalPeople = department.employeeCount + department.inchargeCount;

  const coverage =
    totalPeople > 0
      ? Math.round((department.inchargeCount / totalPeople) * 100)
      : 0;

  return (
    <Link
      href={`/owner/departments/${department.id}`}
      className="group flex flex-col rounded-xl border border-[var(--border)] bg-[var(--card)] p-4 transition-all duration-200 hover:-translate-y-[1px] hover:border-[var(--primary)]/40 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] sm:p-5"
    >
      {/* Card Header */}
      <div className="mb-4 flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-[var(--primary)]/10 text-[var(--primary)] transition-colors duration-200 group-hover:bg-[var(--primary)] group-hover:text-white">
            <Building2 className="h-4 w-4 sm:h-5 sm:w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-sm font-semibold text-[var(--foreground)] transition-colors duration-200 group-hover:text-[var(--primary)] sm:text-base">
              {department.name}
            </h3>
            <div className="mt-0.5 flex items-center gap-1.5 sm:gap-2">
              <span className="shrink-0 text-[11px] text-[var(--muted-foreground)] sm:text-xs">
                Div {String(index + 1).padStart(2, "0")}
              </span>
              <span className="inline-block h-1 w-1 shrink-0 rounded-full bg-[var(--border)]"></span>
              <span className="truncate text-[9px] font-medium uppercase tracking-wider text-[var(--muted-foreground)] sm:text-[10px]">
                {department.type.replaceAll("_", " ")}
              </span>
            </div>
          </div>
        </div>
        <ArrowRight className="h-4 w-4 shrink-0 text-[var(--muted-foreground)] opacity-100 transition-all duration-200 group-hover:text-[var(--primary)] md:-translate-x-1 md:opacity-0 md:group-hover:translate-x-0 md:group-hover:opacity-100" />
      </div>

      {/* Metrics Grid */}
      <div className="mb-5 grid grid-cols-3 gap-2 sm:gap-3">
        <DepartmentMetric label="Employees" value={department.employeeCount} />
        <DepartmentMetric label="Incharges" value={department.inchargeCount} />
        <DepartmentMetric label="Total" value={totalPeople} />
      </div>

      {/* Coverage Progress Bar */}
      <div className="mt-auto flex flex-col gap-1.5">
        <div className="flex items-center justify-between text-[10px] font-medium uppercase tracking-wider">
          <span className="text-[var(--muted-foreground)]">Coverage</span>
          <span className="text-[var(--primary)]">{coverage}%</span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full border border-[var(--border)]/50 bg-[var(--background)]">
          <div
            className="h-full rounded-full bg-[var(--primary)] transition-all duration-700 ease-in-out"
            style={{ width: `${coverage}%` }}
          />
        </div>
      </div>
    </Link>
  );
}

function DepartmentMetric({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--background)] py-1.5 sm:py-2 shadow-sm">
      <p className="text-[9px] font-medium uppercase tracking-wider text-[var(--muted-foreground)]">
        {label}
      </p>
      <p className="mt-0.5 text-sm font-semibold text-[var(--foreground)] sm:text-base">
        {value}
      </p>
    </div>
  );
}

/* Retained OverviewCard, refactored to match the compact UI constraints */
function OverviewCard({
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
  tone: "blue" | "emerald" | "purple" | "amber";
}) {
  const styles = {
    blue: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    emerald: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    purple: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
    amber: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  };

  return (
    <div className="group flex flex-col rounded-xl border border-[var(--border)] bg-[var(--card)] p-4 shadow-sm transition-all duration-200 hover:-translate-y-[1px] hover:border-[var(--primary)]/30 sm:p-5">
      <div className="mb-3 flex items-start justify-between sm:mb-4">
        <div className={`flex h-8 w-8 items-center justify-center rounded-md border sm:h-9 sm:w-9 ${styles[tone]}`}>
          <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
        </div>
        <Activity className="h-4 w-4 text-[var(--muted-foreground)] opacity-50 transition-all group-hover:text-[var(--primary)] group-hover:opacity-100" />
      </div>

      <div className="mt-auto">
        <h3 className="text-xl font-semibold leading-tight text-[var(--foreground)] sm:text-2xl">
          {value}
        </h3>
        <p className="mt-0.5 text-xs font-medium text-[var(--muted-foreground)] sm:text-sm">
          {title}
        </p>
        <p className="mt-1.5 text-xs text-[var(--muted-foreground)] line-clamp-2">
          {description}
        </p>
      </div>
    </div>
  );
}