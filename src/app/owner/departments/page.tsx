import Link from "next/link";
import {
  ArrowRight,
  Building2,
  FolderKanban,
  Network,
  UserCog,
  Users,
  Activity,
  Layers3,
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
    <div className="min-h-screen bg-[var(--background)] px-4 pt-24 pb-12 md:px-6 lg:px-8 max-w-[1600px] mx-auto flex flex-col gap-6">
      
      {/* ========================================== */}
      {/* HEADER SECTION                             */}
      {/* ========================================== */}
      <header className="relative overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm lg:p-8">
        <div className="pointer-events-none absolute right-0 top-0 h-full w-1/2 bg-gradient-to-l from-[var(--primary)]/5 to-transparent opacity-50" />

        <div className="relative z-10 flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-md bg-[var(--primary)]/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[var(--primary)] shadow-sm ring-1 ring-[var(--primary)]/20">
              <Network className="h-3 w-3 text-[var(--primary)]" />
              <span>Owner Organizational Control</span>
            </div>

            <h1 className="mb-2 text-2xl font-bold tracking-tight text-[var(--foreground)] lg:text-3xl">
              Department Directory
            </h1>

            <p className="max-w-2xl text-sm text-[var(--muted-foreground)]">
              Manage all company departments, review employee distribution, monitor incharge allocation, and access each division from one global owner workspace.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 w-full xl:w-auto">
            <HeaderMetric
              title="Departments"
              value={departments.length}
              icon={FolderKanban}
            />
            <HeaderMetric
              title="Employees"
              value={totalEmployees}
              icon={Users}
            />
            <HeaderMetric
              title="Incharges"
              value={totalIncharges}
              icon={UserCog}
            />
          </div>
        </div>
      </header>

      {/* ========================================== */}
      {/* MIDDLE CONTROL BAR                         */}
      {/* ========================================== */}
      <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4 lg:px-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-[var(--foreground)] flex items-center gap-2">
            All Departments
          </h2>
          <p className="text-xs text-[var(--muted-foreground)]">
            Select a department to view assigned employees, incharges, and operational details.
          </p>
        </div>
      </div>

      {/* ========================================== */}
      {/* DEPARTMENTS GRID                           */}
      {/* ========================================== */}
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {departments.map((department, index) => (
          <DepartmentCard
            key={department.id}
            department={department}
            index={index}
          />
        ))}
      </div>
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
    <div className="flex flex-col justify-center rounded-xl border border-[var(--border)] bg-[var(--background)] p-3 lg:px-5 lg:py-4 text-center shadow-sm min-w-[110px]">
      <div className="mb-1 flex items-center justify-center gap-1.5 text-[var(--muted-foreground)]">
        <Icon className="h-3.5 w-3.5" />
        <span className="text-[10px] font-bold uppercase tracking-wider">{title}</span>
      </div>
      <p className="text-xl lg:text-2xl font-bold text-[var(--foreground)]">{value}</p>
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
      className="group relative flex flex-col overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-[var(--primary)]/40 hover:shadow-md outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]"
    >
      {/* Subtle Background Mesh Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(var(--border)_1px,transparent_1px)] [background-size:16px_16px] opacity-10 transition-opacity group-hover:opacity-20" />
      
      <div className="relative z-10 flex flex-col h-full">
        {/* Card Header */}
        <div className="mb-5 flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[var(--primary)]/10 text-[var(--primary)] shadow-sm ring-1 ring-[var(--primary)]/20 transition-all duration-300 group-hover:bg-[var(--primary)] group-hover:text-white">
              <Building2 className="h-6 w-6" />
            </div>

            <div>
              <p className="mb-0.5 text-[10px] font-bold uppercase tracking-wider text-[var(--muted-foreground)]">
                Division {String(index + 1).padStart(2, "0")}
              </p>
              <h2 className="text-lg font-bold text-[var(--foreground)] transition-colors group-hover:text-[var(--primary)]">
                {department.name}
              </h2>
            </div>
          </div>

          <span className="rounded-md border border-[var(--border)] bg-[var(--background)] px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-[var(--muted-foreground)] shadow-sm">
            {department.type.replaceAll("_", " ")}
          </span>
        </div>

        {/* Metrics Grid */}
        <div className="mb-4 grid grid-cols-3 gap-3">
          <DepartmentMetric label="Employees" value={department.employeeCount} icon={Users} />
          <DepartmentMetric label="Incharges" value={department.inchargeCount} icon={UserCog} />
          <DepartmentMetric label="Total" value={totalPeople} icon={Layers3} />
        </div>

        {/* Coverage Progress Bar */}
        <div className="rounded-lg border border-[var(--border)] bg-[var(--background)] p-3 shadow-sm mb-5">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--muted-foreground)]">
              Management Coverage
            </p>
            <p className="text-[10px] font-bold text-[var(--primary)]">
              {coverage}%
            </p>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-[var(--card)] border border-[var(--border)]/50">
            <div
              className="h-full rounded-full bg-[var(--primary)] transition-all duration-700 ease-in-out"
              style={{ width: `${coverage}%` }}
            />
          </div>
        </div>

        {/* Action Footer */}
        <div className="mt-auto flex items-center border-t border-[var(--border)]/60 pt-4 text-xs font-bold uppercase tracking-wider text-[var(--foreground)] transition-colors group-hover:text-[var(--primary)]">
          <span>Open Department</span>

          <div className="ml-auto flex h-7 w-7 -translate-x-2 items-center justify-center rounded-md bg-[var(--primary)]/10 text-[var(--primary)] opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:bg-[var(--primary)] group-hover:text-white group-hover:opacity-100">
            <ArrowRight className="h-3.5 w-3.5" />
          </div>
        </div>
      </div>

      {/* Shine Sweep Effect */}
      <div className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/5 to-transparent group-hover:animate-[shimmer_2s_infinite]" />
    </Link>
  );
}

function DepartmentMetric({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: number;
  icon: React.ElementType;
}) {
  return (
    <div className="rounded-lg border border-[var(--border)] bg-[var(--background)] p-3 text-center shadow-sm">
      <div className="mb-1 flex items-center justify-center gap-1.5 text-[var(--muted-foreground)]">
        <Icon className="h-3 w-3 text-[var(--primary)]/80" />
        <p className="text-[9px] font-bold uppercase tracking-wider">
          {label}
        </p>
      </div>
      <p className="text-lg font-bold text-[var(--foreground)]">
        {value}
      </p>
    </div>
  );
}

/* Note: Retained OverviewCard in the codebase as it was originally declared, though it wasn't used in the main render tree */
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
    <div className="group rounded-xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-[var(--primary)]/30">
      <div className="mb-4 flex items-center justify-between">
        <div className={`rounded-lg p-2.5 border ${styles[tone]}`}>
          <Icon className="h-5 w-5" />
        </div>
        <Activity className="h-4 w-4 text-[var(--muted-foreground)] opacity-50 transition group-hover:text-[var(--primary)] group-hover:opacity-100" />
      </div>

      <h3 className="text-2xl font-bold text-[var(--foreground)]">
        {value}
      </h3>

      <p className="mt-1 text-[10px] font-bold uppercase tracking-wider text-[var(--muted-foreground)]">
        {title}
      </p>

      <p className="mt-2 text-sm text-[var(--muted-foreground)]">
        {description}
      </p>
    </div>
  );
}