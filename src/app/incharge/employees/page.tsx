import { getDepartmentEmployees } from "@/actions/incharge/get-department-employees";
import { 
  Users, 
  Search, 
  Filter, 
  UserCircle, 
  Phone, 
  Mail, 
  ShieldCheck, 
  MoreVertical, 
  Eye, 
  MessageSquare,
  CheckCircle2,
  AlertCircle
} from "lucide-react";

// ============================================================================
// HELPER FUNCTIONS (UNCHANGED LOGIC)
// ============================================================================

function getInitials(name: string) {
  if (!name) return "U";
  return name.split(" ").map((n) => n[0]).join("").substring(0, 2).toUpperCase();
}

function getStatusStyle(status?: string) {
  const s = (status || "ACTIVE").toUpperCase();
  if (s === "ACTIVE" || s === "APPROVED") {
    return "text-emerald-600 bg-emerald-500/10 border-emerald-500/20 dark:text-emerald-400";
  }
  if (s === "PENDING_APPROVAL") {
    return "text-amber-600 bg-amber-500/10 border-amber-500/20 dark:text-amber-400";
  }
  if (s === "SUSPENDED" || s === "INACTIVE") {
    return "text-red-600 bg-red-500/10 border-red-500/20 dark:text-red-400";
  }
  return "text-slate-600 bg-slate-500/10 border-slate-500/20 dark:text-slate-400";
}

// ============================================================================
// MAIN PAGE COMPONENT
// ============================================================================

export default async function EmployeesPage(props: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;
  
  // Data fetching
  const employees = await getDepartmentEmployees(searchParams);

  const currentSearch = (searchParams?.search as string) || "";
  const currentStatus = (searchParams?.status as string) || "all";

  // Calculate Metrics
  const total = employees.length;
  const activeCount = employees.filter((e: any) => e.status === "ACTIVE" || e.status === "APPROVED").length;

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-[1400px] flex-col gap-4 px-4 py-8 pt-20 sm:gap-6 sm:px-5 sm:py-12 md:pt-24 lg:gap-8 lg:px-6">
      
      {/* ========================================== */}
      {/* 1. HEADER & METRICS                        */}
      {/* ========================================== */}
      <header className="flex flex-col gap-4 rounded-xl border border-[var(--border)] bg-[var(--card)] p-4 shadow-sm sm:gap-5 sm:p-5 md:flex-row md:items-start md:justify-between">
        <div className="flex min-w-0 flex-1 flex-col items-start gap-1.5">
          <div className="inline-flex items-center gap-1.5 rounded-md bg-[var(--primary)]/10 px-2 py-0.5 text-[10px] font-medium text-[var(--primary)] sm:text-xs">
            <Users className="h-3 w-3 shrink-0" />
            <span>Personnel Directory</span>
          </div>

          <h1 className="text-xl font-semibold tracking-tight text-[var(--foreground)] sm:text-2xl">
            Department Employees
          </h1>

          <p className="max-w-2xl text-sm text-[var(--muted-foreground)]">
            Manage your department roster, view contact details, and audit account statuses.
          </p>
        </div>

        {/* Compact Metrics Row */}
        <div className="grid shrink-0 grid-cols-2 gap-2 w-full md:w-auto md:flex md:flex-row md:gap-3">
          <div className="flex flex-col items-start justify-center rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 shadow-sm md:min-w-[120px]">
            <div className="mb-0.5 flex items-center gap-1.5 text-[var(--muted-foreground)]">
              <UserCircle className="h-3.5 w-3.5" />
              <span className="text-[9px] font-semibold uppercase tracking-wider md:text-[10px]">Total</span>
            </div>
            <p className="text-base font-semibold text-[var(--foreground)] sm:text-lg">{total}</p>
          </div>

          <div className="flex flex-col items-start justify-center rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 shadow-sm md:min-w-[120px]">
            <div className="mb-0.5 flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span className="text-[9px] font-semibold uppercase tracking-wider md:text-[10px]">Active</span>
            </div>
            <p className="text-base font-semibold text-[var(--foreground)] sm:text-lg">{activeCount}</p>
          </div>
        </div>
      </header>

      {/* ========================================== */}
      {/* 2. SEARCH & FILTER TOOLBAR                 */}
      {/* ========================================== */}
      <section className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4 shadow-sm sm:p-5">
        <form method="GET" className="flex flex-col gap-3 sm:flex-row sm:items-center">
          
          <div className="relative flex-1 min-w-0">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted-foreground)]" />
            <input 
              type="text" 
              name="search"
              defaultValue={currentSearch}
              placeholder="Search by name or email..." 
              className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] py-2 pl-9 pr-3 text-sm font-medium text-[var(--foreground)] outline-none transition focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] placeholder:text-[var(--muted-foreground)]"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <div className="relative flex-1 sm:flex-none">
              <select 
                name="status" 
                defaultValue={currentStatus}
                className="w-full appearance-none rounded-lg border border-[var(--border)] bg-[var(--background)] py-2 pl-3 pr-8 text-sm font-medium text-[var(--foreground)] outline-none transition focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] sm:w-[160px]"
              >
                <option value="all">All Status</option>
                <option value="ACTIVE">Active</option>
                <option value="PENDING_APPROVAL">Pending Approval</option>
              </select>
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-[var(--muted-foreground)]">▼</span>
            </div>

            <button 
              type="submit" 
              className="flex w-full flex-1 sm:flex-none items-center justify-center gap-1.5 rounded-lg bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2"
            >
              <Filter className="h-4 w-4" />
              Filter
            </button>
          </div>
        </form>
      </section>

      {/* ========================================== */}
      {/* 3. DATA GRID (EMPLOYEE DIRECTORY)          */}
      {/* ========================================== */}
      <section className="flex flex-col overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--card)] shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] text-left text-sm">
            <thead className="bg-[var(--background)]">
              <tr>
                <th className="whitespace-nowrap px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-[var(--muted-foreground)] sm:px-5 sm:py-3.5">
                  Identity & Contact
                </th>
                <th className="whitespace-nowrap px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-[var(--muted-foreground)] sm:px-5 sm:py-3.5">
                  Phone Number
                </th>
                <th className="whitespace-nowrap px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-[var(--muted-foreground)] sm:px-5 sm:py-3.5">
                  Account Status
                </th>
                <th className="whitespace-nowrap px-4 py-3 text-right text-[10px] font-bold uppercase tracking-wider text-[var(--muted-foreground)] sm:px-5 sm:py-3.5">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {employees.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-10 text-center text-[var(--muted-foreground)]">
                    <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--background)]">
                      <Users className="h-5 w-5 text-[var(--muted-foreground)]" />
                    </div>
                    <p className="text-sm font-medium">No personnel found in the directory.</p>
                  </td>
                </tr>
              ) : (
                employees.map((employee: any) => (
                  <tr key={employee.id || employee._id || employee.email} className="group/row transition-colors hover:bg-[var(--background)]/50">
                    
                    {/* Identity & Email Column */}
                    <td className="px-4 py-3 sm:px-5 sm:py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-[var(--border)] bg-[var(--background)] text-[10px] font-bold text-[var(--foreground)] shadow-sm">
                          {getInitials(employee.fullName)}
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-[var(--foreground)] transition-colors group-hover/row:text-[var(--primary)]">
                            {employee.fullName}
                          </p>
                          <div className="mt-0.5 flex items-center gap-1.5 text-[var(--muted-foreground)]">
                            <Mail className="h-3 w-3 shrink-0" />
                            <span className="truncate text-[11px] font-medium">{employee.email}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Phone Column */}
                    <td className="px-4 py-3 sm:px-5 sm:py-3.5">
                      <div className="flex items-center gap-2 min-w-0 text-[var(--foreground)]">
                        <Phone className="h-3.5 w-3.5 shrink-0 text-[var(--muted-foreground)]" />
                        <span className="truncate text-sm font-medium">{employee.phone || "Not Provided"}</span>
                      </div>
                    </td>

                    {/* Status Column */}
                    <td className="whitespace-nowrap px-4 py-3 sm:px-5 sm:py-3.5">
                      <span className={`inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider shadow-sm ${getStatusStyle(employee.status)}`}>
                        {employee.status === "ACTIVE" || employee.status === "APPROVED" ? (
                          <CheckCircle2 className="h-3 w-3" />
                        ) : (
                          <AlertCircle className="h-3 w-3" />
                        )}
                        {employee.status?.replaceAll("_", " ") || "Active"}
                      </span>
                    </td>

                    {/* Actions Column */}
                    <td className="whitespace-nowrap px-4 py-3 text-right sm:px-5 sm:py-3.5">
                      <div className="flex items-center justify-end gap-1 opacity-100 transition-opacity md:opacity-0 md:group-hover/row:opacity-100">
                        <button className="flex h-8 w-8 items-center justify-center rounded-md text-[var(--muted-foreground)] transition-colors hover:bg-[var(--background)] hover:text-[var(--primary)] focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-[var(--primary)]" title="View Profile">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button className="flex h-8 w-8 items-center justify-center rounded-md text-[var(--muted-foreground)] transition-colors hover:bg-[var(--background)] hover:text-emerald-500 focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-emerald-500" title="Message">
                          <MessageSquare className="h-4 w-4" />
                        </button>
                        <button className="flex h-8 w-8 items-center justify-center rounded-md text-[var(--muted-foreground)] transition-colors hover:bg-[var(--background)] hover:text-[var(--foreground)] focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-[var(--primary)]" title="More Options">
                          <MoreVertical className="h-4 w-4" />
                        </button>
                      </div>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
      
    </div>
  );
}