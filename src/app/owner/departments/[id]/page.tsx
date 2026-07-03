import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import {
  ArrowLeft,
  Building2,
  Mail,
  ShieldCheck,
  UserCheck,
  UserCog,
  Users,
  CircleDot,
  Fingerprint,
  Phone,
  Crown,
  Activity,
  ArrowRight,
  BadgeCheck,
  Sparkles,
} from "lucide-react";

import { getDepartmentDetails } from "@/actions/owner/get-department-details";

function getInitials(name: string) {
  if (!name) return "U";

  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();
}

function getIdLabel(role: string) {
  if (role === "OWNER") return "Owner ID";
  if (role === "INCHARGE") return "Incharge ID";
  return "Employee ID";
}

function getDisplayCode(user: { employeeCode?: string | null }) {
  return user.employeeCode || "Not Generated";
}

function getRoleSubtitle(role: string) {
  if (role === "OWNER") return "System Owner";
  if (role === "INCHARGE") return "Department Manager";
  return "Department Employee";
}

export default async function DepartmentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const department = await getDepartmentDetails(id);

  if (!department) {
    notFound();
  }

  const totalUsers = department.users.length;

  const owners = department.users.filter((user) => user.role === "OWNER").length;

  const employees = department.users.filter(
    (user) => user.role === "EMPLOYEE"
  ).length;

  const incharges = department.users.filter(
    (user) => user.role === "INCHARGE"
  ).length;

  const activeUsers = department.users.filter(
    (user) => user.status === "ACTIVE"
  ).length;

  const pendingUsers = department.users.filter(
    (user) =>
      user.status === "PENDING_APPROVAL" || user.status === "PENDING_EMAIL"
  ).length;

  const activeRate =
    totalUsers > 0 ? Math.round((activeUsers / totalUsers) * 100) : 0;

  return (
    <div className="min-h-screen bg-[var(--background)] px-6 pt-28 pb-24 lg:pt-32 lg:px-12 max-w-[1700px] mx-auto space-y-10">
      <header className="relative overflow-hidden rounded-[38px] border border-[var(--border)] bg-[var(--card)]/45 p-8 shadow-sm backdrop-blur-xl lg:p-10">
        <div className="pointer-events-none absolute right-[-140px] top-[-140px] h-[380px] w-[380px] rounded-full bg-[var(--primary)]/10 blur-[90px]" />
        <div className="pointer-events-none absolute bottom-[-140px] left-[18%] h-[320px] w-[320px] rounded-full bg-purple-500/10 blur-[90px]" />

        <div className="relative z-10">
          <Link
            href="/owner/departments"
            className="mb-8 inline-flex items-center gap-2 rounded-2xl border border-[var(--border)] bg-[var(--background)]/70 px-4 py-2 text-xs font-black uppercase tracking-widest text-[var(--muted-foreground)] transition hover:border-[var(--primary)]/40 hover:text-[var(--foreground)]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Departments
          </Link>

          <div className="grid gap-8 xl:grid-cols-12 xl:items-end">
            <div className="xl:col-span-8">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[var(--primary)]/20 bg-[var(--primary)]/10 px-4 py-2 text-[11px] font-black uppercase tracking-widest text-[var(--primary)]">
                <Building2 className="h-3.5 w-3.5" />
                Department Control Center
              </div>

              <h1 className="text-4xl font-black tracking-tight text-[var(--foreground)] lg:text-6xl">
                {department.name}
              </h1>

              <p className="mt-4 max-w-3xl text-base font-medium leading-7 text-[var(--muted-foreground)]">
                View department members, employee IDs, incharge details, account
                status, and role distribution from one professional control
                panel.
              </p>
            </div>

            <div className="xl:col-span-4">
              <div className="rounded-[28px] border border-[var(--border)] bg-[var(--background)]/70 p-6 shadow-inner">
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-[var(--muted-foreground)]">
                      Department Type
                    </p>

                    <p className="mt-1 text-lg font-black text-[var(--foreground)]">
                      {department.type.replaceAll("_", " ")}
                    </p>
                  </div>

                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[var(--primary)]/20 bg-[var(--primary)]/10 text-[var(--primary)]">
                    <Building2 className="h-7 w-7" />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-black uppercase tracking-widest text-[var(--muted-foreground)]">
                    <span>Active Rate</span>
                    <span className="text-[var(--foreground)]">
                      {activeRate}%
                    </span>
                  </div>

                  <div className="h-2.5 overflow-hidden rounded-full border border-[var(--border)] bg-[var(--card)]">
                    <div
                      className="h-full rounded-full bg-[var(--primary)]"
                      style={{ width: `${activeRate}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <section className="grid grid-cols-2 gap-6 md:grid-cols-3 xl:grid-cols-6">
        <SummaryCard
          title="Total Users"
          value={totalUsers}
          icon={Users}
          tone="blue"
        />

        <SummaryCard title="Owners" value={owners} icon={Crown} tone="amber" />

        <SummaryCard
          title="Employees"
          value={employees}
          icon={UserCheck}
          tone="emerald"
        />

        <SummaryCard
          title="Incharges"
          value={incharges}
          icon={UserCog}
          tone="purple"
        />

        <SummaryCard
          title="Active"
          value={activeUsers}
          icon={ShieldCheck}
          tone="green"
        />

        <SummaryCard
          title="Pending"
          value={pendingUsers}
          icon={Activity}
          tone="orange"
        />
      </section>

      <section className="overflow-hidden rounded-[36px] border border-[var(--border)] bg-[var(--card)]/40 shadow-sm backdrop-blur-xl">
        <div className="flex flex-col gap-5 border-b border-[var(--border)]/60 bg-[var(--card)]/40 px-8 py-7 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[var(--primary)]/20 bg-[var(--primary)]/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-[var(--primary)]">
            
              Live Members Directory
            </div>

            <h2 className="text-2xl font-black tracking-tight text-[var(--foreground)]">
              Department Members
            </h2>

            <p className="mt-2 text-sm font-medium text-[var(--muted-foreground)]">
              Employees, incharges, and active accounts assigned to this
              department.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <BadgeItem label="Members" value={totalUsers} />
            <BadgeItem label="Active" value={activeUsers} />
            <BadgeItem label="Pending" value={pendingUsers} />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1150px] text-left">
            <thead className="border-b border-[var(--border)]/60 bg-[var(--background)]/50">
              <tr>
                <TableHead>Member</TableHead>
                <TableHead>Employee ID</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Department</TableHead>
              </tr>
            </thead>

            <tbody className="divide-y divide-[var(--border)]/50">
              {department.users.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-20 text-center text-sm font-semibold text-[var(--muted-foreground)]"
                  >
                    <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--background)]">
                      <Users className="h-8 w-8 text-[var(--muted-foreground)]" />
                    </div>

                    No users assigned to this department yet.
                  </td>
                </tr>
              ) : (
                department.users.map((user) => (
                  <MemberRow key={user.id} user={user} department={department} />
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function MemberRow({
  user,
  department,
}: {
  user: any;
  department: {
    name: string;
    type: string;
  };
}) {
  const visibleCode = getDisplayCode(user);
  const visibleIdLabel = getIdLabel(user.role);

  return (
    <tr className="group/row transition hover:bg-[var(--background)]/60">
      <td className="whitespace-nowrap px-6 py-5">
        <div className="flex items-center gap-4">
          <div className="relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--background)] text-sm font-black text-[var(--foreground)] shadow-sm">
            {user.profileImageUrl ? (
              <Image
                src={user.profileImageUrl}
                alt={user.fullName}
                fill
                unoptimized
                className="object-cover"
              />
            ) : (
              getInitials(user.fullName)
            )}
          </div>

          <div>
            <p className="font-black text-[var(--foreground)] transition group-hover/row:text-[var(--primary)]">
              {user.fullName}
            </p>

            <p className="mt-1 text-xs font-semibold text-[var(--muted-foreground)]">
              {user.username ? `@${user.username}` : getRoleSubtitle(user.role)}
            </p>
          </div>
        </div>
      </td>

      <td className="whitespace-nowrap px-6 py-5">
        <div>
          <p className="mb-1 flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-[var(--muted-foreground)]">
            <Fingerprint className="h-3.5 w-3.5 text-[var(--primary)]" />
            {visibleIdLabel}
          </p>

          <p className="font-mono text-sm font-black text-[var(--foreground)]">
            {visibleCode}
          </p>
        </div>
      </td>

      <td className="whitespace-nowrap px-6 py-5">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium text-[var(--muted-foreground)]">
            <Mail className="h-4 w-4 opacity-70" />
            {user.email}
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-[var(--muted-foreground)]">
            <Phone className="h-3.5 w-3.5 opacity-70" />
            {user.phone || "Not Provided"}
          </div>
        </div>
      </td>

      <td className="whitespace-nowrap px-6 py-5">
        <RoleBadge role={user.role} />
      </td>

      <td className="whitespace-nowrap px-6 py-5">
        <StatusBadge status={user.status} />
      </td>

      <td className="whitespace-nowrap px-6 py-5">
        <span className="inline-flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-[var(--muted-foreground)]">
          <Building2 className="h-3.5 w-3.5 text-[var(--primary)]" />
          {department.name}
        </span>
      </td>
    </tr>
  );
}

function BadgeItem({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--background)] px-4 py-2 text-sm font-black text-[var(--foreground)]">
      <span className="text-[var(--muted-foreground)]">{label}: </span>
      {value}
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
  tone: "blue" | "emerald" | "purple" | "amber" | "green" | "orange";
}) {
  const styles = {
    blue: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    emerald: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    purple: "bg-purple-500/10 text-purple-500 border-purple-500/20",
    amber: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    green: "bg-green-500/10 text-green-500 border-green-500/20",
    orange: "bg-orange-500/10 text-orange-500 border-orange-500/20",
  };

  return (
    <div className="group rounded-[28px] border border-[var(--border)] bg-[var(--card)]/40 p-6 shadow-sm backdrop-blur-xl transition hover:-translate-y-1 hover:border-[var(--primary)]/30">
      <div className="mb-6 flex items-center justify-between">
        <div className={`rounded-2xl border p-3 ${styles[tone]}`}>
          <Icon className="h-6 w-6" />
        </div>

        <ArrowRight className="h-4 w-4 text-[var(--muted-foreground)] opacity-0 transition group-hover:opacity-100" />
      </div>

      <h3 className="text-3xl font-black text-[var(--foreground)]">
        {value}
      </h3>

      <p className="mt-1 text-[10px] font-black uppercase tracking-widest text-[var(--muted-foreground)]">
        {title}
      </p>
    </div>
  );
}

function TableHead({ children }: { children: React.ReactNode }) {
  return (
    <th className="whitespace-nowrap px-6 py-4 text-[10px] font-black uppercase tracking-widest text-[var(--muted-foreground)]">
      {children}
    </th>
  );
}

function RoleBadge({ role }: { role: string }) {
  const styles: Record<string, string> = {
    OWNER: "border-amber-500/20 bg-amber-500/10 text-amber-500",
    INCHARGE: "border-purple-500/20 bg-purple-500/10 text-purple-500",
    EMPLOYEE: "border-blue-500/20 bg-blue-500/10 text-blue-500",
  };

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-xl border px-3 py-1.5 text-[10px] font-black uppercase tracking-widest ${
        styles[role] ??
        "border-[var(--border)] bg-[var(--background)] text-[var(--muted-foreground)]"
      }`}
    >
      <BadgeCheck className="h-3.5 w-3.5" />
      {role}
    </span>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    ACTIVE: "border-emerald-500/20 bg-emerald-500/10 text-emerald-500",
    PENDING_APPROVAL:
      "border-amber-500/20 bg-amber-500/10 text-amber-500",
    PENDING_EMAIL: "border-blue-500/20 bg-blue-500/10 text-blue-500",
    REJECTED: "border-red-500/20 bg-red-500/10 text-red-500",
    SUSPENDED: "border-slate-500/20 bg-slate-500/10 text-slate-500",
  };

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-xl border px-3 py-1.5 text-[10px] font-black uppercase tracking-widest ${
        styles[status] ??
        "border-[var(--border)] bg-[var(--background)] text-[var(--muted-foreground)]"
      }`}
    >
      <CircleDot className="h-3 w-3" />
      {status.replaceAll("_", " ")}
    </span>
  );
}