import Link from "next/link";
import {
  ArrowRight,
  Building2,
  FolderKanban,
  Network,
  ShieldCheck,
  UserCog,
  Users,
  Activity,
  BarChart3,
  Search,
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
    <div className="min-h-screen bg-[var(--background)] px-6 pt-28 pb-20 lg:pt-32 lg:px-12 max-w-[1700px] mx-auto space-y-10">
      <header className="relative overflow-hidden rounded-[36px] border border-[var(--border)] bg-[var(--card)]/50 p-8 shadow-sm backdrop-blur-xl lg:p-10">
        <div className="pointer-events-none absolute right-[-120px] top-[-120px] h-[360px] w-[360px] rounded-full bg-[var(--primary)]/10 blur-[90px]" />
        <div className="pointer-events-none absolute bottom-[-160px] left-[20%] h-[320px] w-[320px] rounded-full bg-purple-500/10 blur-[90px]" />

        <div className="relative z-10 flex flex-col gap-8 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[var(--primary)]/20 bg-[var(--primary)]/10 px-4 py-2 shadow-inner">
              <Network className="h-3.5 w-3.5 text-[var(--primary)]" />

              <span className="text-[11px] font-black uppercase tracking-widest text-[var(--primary)]">
                Owner Organizational Control
              </span>
            </div>

            <h1 className="mb-4 text-4xl font-black leading-none tracking-tight text-[var(--foreground)] lg:text-5xl">
              Department Directory
            </h1>

            <p className="max-w-3xl text-base font-medium leading-7 text-[var(--muted-foreground)]">
              Manage all company departments, review employee distribution, monitor incharge allocation, and access each division from one global owner workspace.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4">
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

     

      <div className="rounded-[32px] border border-[var(--border)] bg-[var(--card)]/40 p-6 shadow-sm backdrop-blur-xl">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-2xl font-black tracking-tight text-[var(--foreground)]">
              All Departments
            </h2>

            <p className="mt-1 text-sm font-medium text-[var(--muted-foreground)]">
              Select a department to view assigned employees, incharges, and operational details.
            </p>
          </div>

         
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
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
    <div className="min-w-[120px] rounded-2xl border border-[var(--border)] bg-[var(--background)]/70 p-4 shadow-sm backdrop-blur-xl">
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
  value: string | number;
  description: string;
  icon: React.ElementType;
  tone: "blue" | "emerald" | "purple" | "amber";
}) {
  const styles = {
    blue: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    emerald: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    purple: "bg-purple-500/10 text-purple-500 border-purple-500/20",
    amber: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  };

  return (
    <div className="group rounded-[28px] border border-[var(--border)] bg-[var(--card)]/40 p-6 shadow-sm backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-[var(--primary)]/30">
      <div className="mb-6 flex items-center justify-between">
        <div className={`rounded-2xl border p-3 ${styles[tone]}`}>
          <Icon className="h-6 w-6" />
        </div>

        <Activity className="h-4 w-4 text-[var(--muted-foreground)] opacity-50 transition group-hover:text-[var(--primary)] group-hover:opacity-100" />
      </div>

      <h3 className="text-3xl font-black text-[var(--foreground)]">
        {value}
      </h3>

      <p className="mt-1 text-[11px] font-black uppercase tracking-widest text-[var(--muted-foreground)]">
        {title}
      </p>

      <p className="mt-3 text-sm font-medium text-[var(--muted-foreground)]">
        {description}
      </p>
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
      className="group relative overflow-hidden rounded-[32px] border border-[var(--border)] bg-[var(--card)]/45 p-7 shadow-sm backdrop-blur-xl outline-none transition-all duration-500 hover:-translate-y-1 hover:border-[var(--primary)]/40 hover:shadow-[0_18px_45px_-20px_rgba(0,102,255,0.35)] focus-visible:ring-2 focus-visible:ring-[var(--primary)]"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(var(--border)_1px,transparent_1px)] [background-size:22px_22px] opacity-[0.12] transition group-hover:opacity-[0.22]" />
      <div className="pointer-events-none absolute right-[-80px] top-[-80px] h-48 w-48 rounded-full bg-[var(--primary)]/0 blur-[60px] transition group-hover:bg-[var(--primary)]/10" />

      <div className="relative z-10">
        <div className="mb-7 flex items-start justify-between gap-5">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-[22px] border border-[var(--primary)]/20 bg-[var(--primary)]/10 text-[var(--primary)] shadow-sm transition-all duration-500 group-hover:scale-105 group-hover:bg-[var(--primary)] group-hover:text-white">
              <Building2 className="h-7 w-7" />
            </div>

            <div>
              <p className="mb-1 text-[10px] font-black uppercase tracking-widest text-[var(--muted-foreground)]">
                Division {String(index + 1).padStart(2, "0")}
              </p>

              <h2 className="text-2xl font-black tracking-tight text-[var(--foreground)] transition-colors group-hover:text-[var(--primary)]">
                {department.name}
              </h2>
            </div>
          </div>

          <span className="rounded-full border border-[var(--border)] bg-[var(--background)] px-3 py-1.5 text-[9px] font-black uppercase tracking-widest text-[var(--muted-foreground)] shadow-sm">
            {department.type.replaceAll("_", " ")}
          </span>
        </div>

        <div className="mb-6 grid grid-cols-3 gap-4">
          <DepartmentMetric
            label="Employees"
            value={department.employeeCount}
            icon={Users}
          />

          <DepartmentMetric
            label="Incharges"
            value={department.inchargeCount}
            icon={UserCog}
          />

          <DepartmentMetric
            label="Total"
            value={totalPeople}
            icon={Layers3}
          />
        </div>

        <div className="rounded-2xl border border-[var(--border)] bg-[var(--background)]/70 p-5">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-[10px] font-black uppercase tracking-widest text-[var(--muted-foreground)]">
              Management Coverage
            </p>

            <p className="text-xs font-black text-[var(--primary)]">
              {coverage}%
            </p>
          </div>

          <div className="h-2.5 w-full overflow-hidden rounded-full border border-[var(--border)] bg-[var(--card)]">
            <div
              className="h-full rounded-full bg-[var(--primary)] transition-all duration-700"
              style={{ width: `${coverage}%` }}
            />
          </div>
        </div>

        <div className="mt-6 flex items-center border-t border-[var(--border)]/60 pt-5 text-sm font-black text-[var(--muted-foreground)] transition-colors group-hover:text-[var(--primary)]">
          <span>Open Department Control</span>

          <div className="ml-auto flex h-9 w-9 -translate-x-2 items-center justify-center rounded-full bg-[var(--primary)]/10 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:bg-[var(--primary)] group-hover:text-white group-hover:opacity-100">
            <ArrowRight className="h-4 w-4" />
          </div>
        </div>
      </div>

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
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--background)]/70 p-4">
      <div className="mb-3 flex items-center gap-2">
        <Icon className="h-3.5 w-3.5 text-[var(--primary)]" />

        <p className="text-[9px] font-black uppercase tracking-widest text-[var(--muted-foreground)]">
          {label}
        </p>
      </div>

      <p className="text-2xl font-black text-[var(--foreground)]">
        {value}
      </p>
    </div>
  );
}