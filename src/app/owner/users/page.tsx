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

// ============================================================================
// HELPER FUNCTIONS (UNCHANGED LOGIC)
// ============================================================================

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
    return "text-amber-600 bg-amber-500/10 border-amber-500/20 dark:text-amber-400";
  }

  if (r === "INCHARGE") {
    return "text-purple-600 bg-purple-500/10 border-purple-500/20 dark:text-purple-400";
  }

  return "text-blue-600 bg-blue-500/10 border-blue-500/20 dark:text-blue-400";
}

function getStatusStyle(status?: string) {
  const s = (status || "ACTIVE").toUpperCase();

  if (s === "ACTIVE") {
    return "text-emerald-600 bg-emerald-500/10 border-emerald-500/20 dark:text-emerald-400";
  }

  if (s === "PENDING_APPROVAL" || s === "PENDING_EMAIL") {
    return "text-amber-600 bg-amber-500/10 border-amber-500/20 dark:text-amber-400";
  }

  if (s === "SUSPENDED" || s === "REJECTED") {
    return "text-red-600 bg-red-500/10 border-red-500/20 dark:text-red-400";
  }

  return "text-slate-600 bg-slate-500/10 border-slate-500/20 dark:text-slate-400";
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

// ============================================================================
// MAIN PAGE COMPONENT
// ============================================================================

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
    <div className="mx-auto flex min-h-screen w-full max-w-[1400px] flex-col gap-6 px-4 py-8 pt-20 sm:gap-8 sm:px-5 sm:py-12 md:pt-24 lg:px-6">
      
      {/* ========================================== */}
      {/* HEADER SECTION                             */}
      {/* ========================================== */}
      <header className="flex flex-col gap-5 rounded-xl border border-[var(--border)] bg-[var(--card)] p-4 shadow-sm sm:p-5 md:flex-row md:items-start md:justify-between">
        <div className="flex min-w-0 flex-1 flex-col items-start gap-1.5">
          <div className="inline-flex items-center gap-1.5 rounded-md bg-[var(--primary)]/10 px-2 py-0.5 text-[10px] font-medium text-[var(--primary)] sm:text-xs">
            <ShieldAlert className="h-3 w-3 shrink-0" />
            <span>Identity & Access Management</span>
          </div>

          <h1 className="text-xl font-semibold tracking-tight text-[var(--foreground)] sm:text-2xl">
            System Directory
          </h1>

          <p className="max-w-2xl text-sm text-[var(--muted-foreground)]">
            Manage Owner, Incharge, and Employee accounts separately with department access, status control, and role-based hierarchy.
          </p>
        </div>

        {/* Compact Metrics Row */}
        <div className="grid shrink-0 grid-cols-3 gap-2 w-full md:w-auto md:flex md:flex-row md:gap-3">
          <HeaderMetric title="Owners" value={owners.length} icon={Crown} />
          <HeaderMetric title="Incharges" value={incharges.length} icon={UserCog} />
          <HeaderMetric title="Employees" value={employees.length} icon={Users} />
        </div>
      </header>

      {/* ========================================== */}
      {/* FILTER CONTROLS                            */}
      {/* ========================================== */}
      <section className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4 shadow-sm sm:p-5">
        <form method="GET" className="flex flex-col gap-3 lg:flex-row lg:items-center">
          
          <div className="relative flex-1 min-w-0">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted-foreground)]" />
            <input
              type="text"
              name="search"
              defaultValue={filters.search}
              placeholder="Search by ID, name, email or phone..."
              className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] py-2 pl-9 pr-3 text-sm font-medium text-[var(--foreground)] outline-none transition focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)]"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 lg:gap-3">
            <div className="relative flex-1 sm:flex-none">
              <Building2 className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted-foreground)]" />
              <select
                name="department"
                defaultValue={filters.department}
                className="w-full appearance-none rounded-lg border border-[var(--border)] bg-[var(--background)] py-2 pl-9 pr-8 text-sm font-medium text-[var(--foreground)] outline-none transition focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] sm:w-[180px]"
              >
                <option value="">All Departments</option>
                <option value="MARKETING">Marketing</option>
                <option value="OPERATIONS">Operations</option>
                <option value="TUTOR">Tutor</option>
                <option value="ACCOUNTS">Accounts</option>
                <option value="DIGITAL_MARKETING">Digital Marketing</option>
              </select>
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-[var(--muted-foreground)]">▼</span>
            </div>

            <div className="relative flex-1 sm:flex-none">
              <Calendar className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted-foreground)]" />
              <select
                name="sortDate"
                defaultValue={filters.sortDate}
                className="w-full appearance-none rounded-lg border border-[var(--border)] bg-[var(--background)] py-2 pl-9 pr-8 text-sm font-medium text-[var(--foreground)] outline-none transition focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] sm:w-[150px]"
              >
                <option value="desc">Newest First</option>
                <option value="asc">Oldest First</option>
              </select>
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-[var(--muted-foreground)]">▼</span>
            </div>

            <div className="flex w-full sm:w-auto gap-2">
              <button
                type="submit"
                className="flex flex-1 sm:flex-none items-center justify-center gap-1.5 rounded-lg bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2"
              >
                <Filter className="h-4 w-4" />
                Apply
              </button>
              <a
                href="/owner/users"
                className="flex flex-1 sm:flex-none items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--background)] px-4 py-2 text-sm font-semibold text-[var(--foreground)] transition hover:bg-[var(--card)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]"
              >
                Reset
              </a>
            </div>
          </div>
        </form>
      </section>

      {/* ========================================== */}
      {/* ROLE OVERVIEW CARDS                        */}
      {/* ========================================== */}
      <section className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
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

      {/* ========================================== */}
      {/* USER DATA SECTIONS                         */}
      {/* ========================================== */}
      <RoleSection
        title="Owner Accounts"
        description="Highest-level access accounts with full system control."
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
    amber: "bg-amber-500/10 text-amber-600 border-amber-500/20 dark:text-amber-400",
    purple: "bg-purple-500/10 text-purple-600 border-purple-500/20 dark:text-purple-400",
    blue: "bg-blue-500/10 text-blue-600 border-blue-500/20 dark:text-blue-400",
  };

  return (
    <div className="group relative flex min-w-0 flex-col rounded-xl border border-[var(--border)] bg-[var(--card)] p-4 transition-all duration-200 hover:-translate-y-[1px] hover:border-[var(--primary)]/30 hover:shadow-sm sm:p-5">
      <div className="mb-3 flex items-start justify-between sm:mb-4">
        <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-md border sm:h-9 sm:w-9 ${styles[tone]}`}>
          <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
        </div>
        <ArrowRight className="h-4 w-4 shrink-0 text-[var(--muted-foreground)] opacity-100 transition-all duration-200 group-hover:text-[var(--primary)] md:opacity-0 md:group-hover:opacity-100" />
      </div>

      <div className="mt-auto min-w-0">
        <h3 className="truncate text-xl font-semibold leading-tight text-[var(--foreground)] sm:text-2xl">
          {value}
        </h3>
        <p className="mt-0.5 truncate text-[10px] font-bold uppercase tracking-wider text-[var(--muted-foreground)]">
          {title}
        </p>
        <p className="mt-1.5 truncate text-xs text-[var(--muted-foreground)]">
          {description}
        </p>
      </div>
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
    amber: "bg-amber-500/10 text-amber-600 border-amber-500/20 dark:text-amber-400",
    purple: "bg-purple-500/10 text-purple-600 border-purple-500/20 dark:text-purple-400",
    blue: "bg-blue-500/10 text-blue-600 border-blue-500/20 dark:text-blue-400",
  };

  return (
    <section className="flex flex-col overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--card)] shadow-sm">
      <div className="flex flex-col gap-3 border-b border-[var(--border)] p-4 sm:p-5 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-md border sm:h-9 sm:w-9 ${toneStyles[tone]}`}>
            <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
          </div>
          <div>
            <h2 className="text-base font-semibold tracking-tight text-[var(--foreground)] sm:text-lg">
              {title}
            </h2>
            <p className="mt-0.5 text-xs text-[var(--muted-foreground)] sm:text-sm">
              {description}
            </p>
          </div>
        </div>

        <div className="inline-flex self-start md:self-auto items-center justify-center rounded-md border border-[var(--border)] bg-[var(--background)] px-2.5 py-1 text-xs font-semibold text-[var(--foreground)]">
          {users.length} {users.length === 1 ? "Record" : "Records"}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead className="bg-[var(--background)]">
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

          <tbody className="divide-y divide-[var(--border)]">
            {users.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-[var(--muted-foreground)]">
                  <p className="text-sm font-medium">{emptyMessage}</p>
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
    <tr className="group/row transition-colors hover:bg-[var(--background)]/50">
      <td className="px-4 py-3 sm:px-5 sm:py-3.5">
        <div className="flex items-center gap-3">
          <div className="relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-md border border-[var(--border)] bg-[var(--background)] text-[10px] font-bold text-[var(--foreground)] shadow-sm">
            {user.profileImageUrl ? (
              <Image
                src={user.profileImageUrl}
                alt={user.fullName || "User Avatar"}
                fill
                unoptimized
                className="object-cover"
              />
            ) : (
              getInitials(user.fullName)
            )}
          </div>

          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-[var(--foreground)] transition-colors group-hover/row:text-[var(--primary)]">
              {user.fullName}
            </p>
            <p className="truncate text-[11px] font-medium text-[var(--muted-foreground)]">
              @{user.username || "username"}
            </p>
          </div>
        </div>
      </td>

      <td className="px-4 py-3 sm:px-5 sm:py-3.5">
        <div className="min-w-0">
          <p className="mb-0.5 flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-wider text-[var(--muted-foreground)]">
            <Fingerprint className="h-3 w-3 shrink-0 text-[var(--primary)]" />
            <span className="truncate">{visibleIdLabel}</span>
          </p>
          <p className="truncate font-mono text-xs font-semibold text-[var(--foreground)] sm:text-sm">
            {visibleCode}
          </p>
        </div>
      </td>

      <td className="px-4 py-3 sm:px-5 sm:py-3.5">
        <div className="space-y-1 min-w-0">
          <div className="flex items-center gap-2 text-xs font-medium text-[var(--muted-foreground)]">
            <Mail className="h-3.5 w-3.5 shrink-0 opacity-70" />
            <span className="truncate">{user.email || "No Email"}</span>
          </div>
          {user.phone && (
            <div className="flex items-center gap-2 text-xs font-medium text-[var(--muted-foreground)]">
              <span className="h-3.5 w-3.5 shrink-0 opacity-70">📞</span> {/* Fallback if Phone icon not imported locally in scope, kept simple */}
              <span className="truncate">{user.phone}</span>
            </div>
          )}
        </div>
      </td>

      <td className="whitespace-nowrap px-4 py-3 sm:px-5 sm:py-3.5">
        <span className="inline-flex items-center gap-1.5 rounded-md border border-[var(--border)] bg-[var(--background)] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[var(--muted-foreground)] shadow-sm">
          <Building2 className="h-3 w-3 shrink-0 text-[var(--primary)]" />
          <span className="truncate max-w-[120px]">{user.department?.name || "Unassigned"}</span>
        </span>
      </td>

      <td className="whitespace-nowrap px-4 py-3 sm:px-5 sm:py-3.5">
        <span
          className={`inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider shadow-sm ${getRoleStyle(
            user.role
          )}`}
        >
          <Shield className="h-3 w-3 shrink-0" />
          {user.role}
        </span>
      </td>

      <td className="whitespace-nowrap px-4 py-3 sm:px-5 sm:py-3.5">
        <span
          className={`inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider shadow-sm ${getStatusStyle(
            user.status
          )}`}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-current shrink-0" />
          {user.status?.replaceAll("_", " ")}
        </span>
      </td>

      <td className="px-4 py-3 text-right sm:px-5 sm:py-3.5">
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
      className={`whitespace-nowrap px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-[var(--muted-foreground)] sm:px-5 sm:py-3.5 ${
        alignRight ? "text-right" : "text-left"
      }`}
    >
      {children}
    </th>
  );
}