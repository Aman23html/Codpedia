import Image from "next/image";

import { getUsers } from "@/actions/owner/get-users";
import { UserRowActions } from "@/components/owner/user-row-actions";
import {
  Users,
  Search,
  ShieldAlert,
  Building2,
  Mail,
  Shield,
  Calendar,
  Filter,
  Crown,
  UserCog,
  UserCheck,
  ArrowRight,
  Fingerprint,
} from "lucide-react";

function getInitials(name: string) {
  if (!name) return "U";

  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();
}

function getRoleStyle(role?: string) {
  const r = (role || "EMPLOYEE").toUpperCase();

  if (r === "OWNER") {
    return "text-amber-500 bg-amber-500/10 border-amber-500/20";
  }

  if (r === "INCHARGE") {
    return "text-purple-500 bg-purple-500/10 border-purple-500/20";
  }

  return "text-blue-500 bg-blue-500/10 border-blue-500/20";
}

function getStatusStyle(status?: string) {
  const s = (status || "ACTIVE").toUpperCase();

  if (s === "ACTIVE") {
    return "text-emerald-500 bg-emerald-500/10 border-emerald-500/20";
  }

  if (s === "PENDING_APPROVAL" || s === "PENDING_EMAIL") {
    return "text-amber-500 bg-amber-500/10 border-amber-500/20";
  }

  if (s === "SUSPENDED" || s === "REJECTED") {
    return "text-red-500 bg-red-500/10 border-red-500/20";
  }

  return "text-slate-500 bg-slate-500/10 border-slate-500/20";
}

function normalizeSearchParams(
  searchParams?: { [key: string]: string | string[] | undefined }
) {
  return {
    search: typeof searchParams?.search === "string" ? searchParams.search : "",
    department:
      typeof searchParams?.department === "string"
        ? searchParams.department
        : "",
    sortDate:
      typeof searchParams?.sortDate === "string"
        ? searchParams.sortDate
        : "desc",
  };
}

function getVisibleIdLabel(role?: string) {
  if (role === "INCHARGE") return "Incharge ID";
  if (role === "OWNER") return "Owner ID";
  return "Employee ID";
}

function getVisibleEmployeeCode(user: any) {
  return user.employeeCode || "Not Generated";
}

export default async function UsersPage(props: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;
  const filters = normalizeSearchParams(searchParams);

  const users = await getUsers(searchParams);

  const owners = users.filter((user: any) => user.role === "OWNER");
  const incharges = users.filter((user: any) => user.role === "INCHARGE");
  const employees = users.filter((user: any) => user.role === "EMPLOYEE");

  return (
    <div className="min-h-screen bg-[var(--background)] px-6 pt-28 pb-20 lg:pt-32 lg:px-12 max-w-[1700px] mx-auto space-y-10">
      <header className="relative overflow-hidden rounded-[36px] border border-[var(--border)] bg-[var(--card)]/45 p-8 shadow-sm backdrop-blur-xl lg:p-10">
        <div className="pointer-events-none absolute right-[-130px] top-[-130px] h-[360px] w-[360px] rounded-full bg-[var(--primary)]/10 blur-[90px]" />
        <div className="pointer-events-none absolute bottom-[-150px] left-[20%] h-[300px] w-[300px] rounded-full bg-purple-500/10 blur-[90px]" />

        <div className="relative z-10 flex flex-col gap-8 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[var(--primary)]/20 bg-[var(--primary)]/10 px-4 py-2 shadow-inner">
              <ShieldAlert className="h-3.5 w-3.5 text-[var(--primary)]" />

              <span className="text-[11px] font-black uppercase tracking-widest text-[var(--primary)]">
                Identity & Access Management
              </span>
            </div>

            <h1 className="mb-4 text-4xl font-black leading-none tracking-tight text-[var(--foreground)] lg:text-5xl">
              System Directory
            </h1>

            <p className="max-w-3xl text-base font-medium leading-7 text-[var(--muted-foreground)]">
              Manage Owner, Incharge, and Employee accounts separately with
              department access, status control, and role-based hierarchy.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <HeaderMetric title="Owners" value={owners.length} icon={Crown} />

            <HeaderMetric
              title="Incharges"
              value={incharges.length}
              icon={UserCog}
            />

            <HeaderMetric
              title="Employees"
              value={employees.length}
              icon={Users}
            />
          </div>
        </div>
      </header>

      <section className="rounded-[30px] border border-[var(--border)] bg-[var(--card)]/40 p-6 shadow-sm backdrop-blur-xl">
        <form
          method="GET"
          className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between"
        >
          <div className="relative w-full xl:max-w-md">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted-foreground)]" />

            <input
              type="text"
              name="search"
              defaultValue={filters.search}
              placeholder="Search by Employee ID, name, email or phone..."
              className="w-full rounded-2xl border border-[var(--border)] bg-[var(--background)] py-3 pl-11 pr-4 text-sm font-semibold text-[var(--foreground)] outline-none transition focus:border-[var(--primary)]"
            />
          </div>

          <div className="flex flex-wrap gap-3">
            <div className="relative">
              <Building2 className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--primary)]" />

              <select
                name="department"
                defaultValue={filters.department}
                className="w-full appearance-none rounded-2xl border border-[var(--border)] bg-[var(--background)] py-3 pl-10 pr-10 text-sm font-semibold text-[var(--foreground)] outline-none transition focus:border-[var(--primary)] sm:w-[210px]"
              >
                <option value="">All Departments</option>
                <option value="MARKETING">Marketing</option>
                <option value="OPERATIONS">Operations</option>
                <option value="TUTOR">Tutor</option>
                <option value="ACCOUNTS">Accounts</option>
                <option value="DIGITAL_MARKETING">Digital Marketing</option>
              </select>

              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[var(--muted-foreground)]">
                ▼
              </span>
            </div>

            <div className="relative">
              <Calendar className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--primary)]" />

              <select
                name="sortDate"
                defaultValue={filters.sortDate}
                className="w-full appearance-none rounded-2xl border border-[var(--border)] bg-[var(--background)] py-3 pl-10 pr-10 text-sm font-semibold text-[var(--foreground)] outline-none transition focus:border-[var(--primary)] sm:w-[180px]"
              >
                <option value="desc">Newest First</option>
                <option value="asc">Oldest First</option>
              </select>

              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[var(--muted-foreground)]">
                ▼
              </span>
            </div>

            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[var(--primary)] px-6 py-3 text-sm font-black text-white transition hover:opacity-90"
            >
              <Filter className="h-4 w-4" />
              Apply
            </button>

            <a
              href="/owner/users"
              className="inline-flex items-center justify-center rounded-2xl border border-[var(--border)] px-6 py-3 text-sm font-black text-[var(--foreground)] transition hover:bg-[var(--card)]"
            >
              Reset
            </a>
          </div>
        </form>
      </section>

      <section className="grid gap-6 md:grid-cols-3">
        <RoleOverviewCard
          title="Owner"
          value={owners.length}
          description="Global system controllers"
          icon={Crown}
          tone="amber"
        />

        <RoleOverviewCard
          title="Incharge"
          value={incharges.length}
          description="Department managers"
          icon={UserCog}
          tone="purple"
        />

        <RoleOverviewCard
          title="Employee"
          value={employees.length}
          description="Department workers"
          icon={Users}
          tone="blue"
        />
      </section>

      <RoleSection
        title="Owner Accounts"
        description="Highest-level access accounts with full EMS control."
        icon={Crown}
        users={owners}
        tone="amber"
        emptyMessage="No owner accounts found."
      />

      <RoleSection
        title="Incharge Accounts"
        description="Department-level managers responsible for employees, approvals, and reports."
        icon={UserCog}
        users={incharges}
        tone="purple"
        emptyMessage="No incharge accounts found."
      />

      <RoleSection
        title="Employee Accounts"
        description="Department employees who submit attendance, leaves, and daily reports."
        icon={UserCheck}
        users={employees}
        tone="blue"
        emptyMessage="No employee accounts found."
      />
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
    <div className="min-w-[120px] rounded-2xl border border-[var(--border)] bg-[var(--background)]/70 p-4 shadow-sm">
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

function RoleOverviewCard({
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
  tone: "amber" | "purple" | "blue";
}) {
  const styles = {
    amber: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    purple: "bg-purple-500/10 text-purple-500 border-purple-500/20",
    blue: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  };

  return (
    <div className="rounded-[28px] border border-[var(--border)] bg-[var(--card)]/40 p-6 shadow-sm backdrop-blur-xl">
      <div className="mb-6 flex items-center justify-between">
        <div className={`rounded-2xl border p-3 ${styles[tone]}`}>
          <Icon className="h-6 w-6" />
        </div>

        <ArrowRight className="h-4 w-4 text-[var(--muted-foreground)]" />
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

function RoleSection({
  title,
  description,
  icon: Icon,
  users,
  tone,
  emptyMessage,
}: {
  title: string;
  description: string;
  icon: React.ElementType;
  users: any[];
  tone: "amber" | "purple" | "blue";
  emptyMessage: string;
}) {
  const toneStyles = {
    amber: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    purple: "bg-purple-500/10 text-purple-500 border-purple-500/20",
    blue: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  };

  return (
    <section className="overflow-hidden rounded-[32px] border border-[var(--border)] bg-[var(--card)]/40 shadow-sm backdrop-blur-xl">
      <div className="flex flex-col gap-4 border-b border-[var(--border)]/60 bg-[var(--card)]/40 px-6 py-6 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <div className={`rounded-2xl border p-3 ${toneStyles[tone]}`}>
            <Icon className="h-6 w-6" />
          </div>

          <div>
            <h2 className="text-2xl font-black tracking-tight text-[var(--foreground)]">
              {title}
            </h2>

            <p className="mt-1 text-sm font-medium text-[var(--muted-foreground)]">
              {description}
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-[var(--border)] bg-[var(--background)] px-4 py-2 text-sm font-black text-[var(--foreground)]">
          {users.length} Records
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[1150px] text-left">
          <thead className="border-b border-[var(--border)]/60 bg-[var(--background)]/50">
            <tr>
              <TableHead>Identity</TableHead>
              <TableHead>Employee ID</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead alignRight>Actions</TableHead>
            </tr>
          </thead>

          <tbody className="divide-y divide-[var(--border)]/50">
            {users.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-6 py-14 text-center text-sm font-semibold text-[var(--muted-foreground)]"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              users.map((user: any) => <UserRow key={user.id} user={user} />)
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function UserRow({ user }: { user: any }) {
  const visibleCode = getVisibleEmployeeCode(user);
  const visibleIdLabel = getVisibleIdLabel(user.role);

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
              @{user.username || "username"}
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
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-sm font-medium text-[var(--muted-foreground)]">
            <Mail className="h-4 w-4 opacity-60" />
            {user.email}
          </div>

          {user.phone && (
            <p className="text-xs font-semibold text-[var(--muted-foreground)]">
              {user.phone}
            </p>
          )}
        </div>
      </td>

      <td className="whitespace-nowrap px-6 py-5">
        <span className="inline-flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-[var(--muted-foreground)]">
          <Building2 className="h-3.5 w-3.5 text-[var(--primary)]" />
          {user.department?.name || "Unassigned"}
        </span>
      </td>

      <td className="whitespace-nowrap px-6 py-5">
        <span
          className={`inline-flex items-center gap-2 rounded-xl border px-3 py-1.5 text-[10px] font-black uppercase tracking-widest ${getRoleStyle(
            user.role
          )}`}
        >
          <Shield className="h-3.5 w-3.5" />
          {user.role}
        </span>
      </td>

      <td className="whitespace-nowrap px-6 py-5">
        <span
          className={`inline-flex items-center gap-2 rounded-xl border px-3 py-1.5 text-[10px] font-black uppercase tracking-widest ${getStatusStyle(
            user.status
          )}`}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-current" />
          {user.status?.replaceAll("_", " ")}
        </span>
      </td>

      <td className="whitespace-nowrap px-6 py-5 text-right">
        <div className="flex justify-end">
          <UserRowActions user={user} />
        </div>
      </td>
    </tr>
  );
}

function TableHead({
  children,
  alignRight,
}: {
  children: React.ReactNode;
  alignRight?: boolean;
}) {
  return (
    <th
      className={`whitespace-nowrap px-6 py-4 text-[10px] font-black uppercase tracking-widest text-[var(--muted-foreground)] ${
        alignRight ? "text-right" : "text-left"
      }`}
    >
      {children}
    </th>
  );
}