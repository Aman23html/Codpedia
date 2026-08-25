import React from "react";
import { 
  Search, Filter, Users,
  CheckCircle2, XCircle, Calendar, 
  MoreVertical, Eye, Edit, ChevronLeft, ChevronRight,
  Clock, ArrowDownToLine, Plus, AlertTriangle
} from "lucide-react";
import { formatDateIST, formatTimeIST } from "@/lib/format-date";

// --- Server Actions ---
import { getAttendance } from "@/actions/incharge/get-attendance";
import { getAttendanceStats } from "@/actions/incharge/get-attendance-stats";

// --- Types ---
type AttendanceRecord = {
  id?: string;
  _id?: string;
  user: {
    id?: string;
    _id?: string;
    fullName: string;
    employeeCode?: string | null;
    avatar?: string;
    department?: { name: string };
  };
  date?: Date | string;
  attendanceDate?: Date | string;
  checkIn: Date | string | null;
  checkOut: Date | string | null;
  status: "PRESENT" | "ABSENT" | "LATE" | "LEAVE" | "HALF_DAY";
};

// --- Helper Functions ---
function getWorkHours(
  checkIn: Date | string | null,
  checkOut: Date | string | null
) {
  if (!checkIn || !checkOut) return "-";

  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);

  const diff = checkOutDate.getTime() - checkInDate.getTime();

  if (!Number.isFinite(diff) || diff < 0) return "-";

  const hours = Math.floor(diff / 1000 / 60 / 60);
  const minutes = Math.floor(diff / 1000 / 60) % 60;

  return `${hours}h ${minutes}m`;
}

function getInitials(name: string) {
  if (!name) return "U";
  return name.split(" ").map((n) => n[0]).join("").substring(0, 2).toUpperCase();
}

// --- Components ---
const StatusBadge = ({ status }: { status: string }) => {
  const configs = {
    PRESENT: { color: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:text-emerald-400", icon: CheckCircle2 },
    ABSENT: { color: "bg-red-500/10 text-red-600 border-red-500/20 dark:text-red-400", icon: XCircle },
    LATE: { color: "bg-amber-500/10 text-amber-600 border-amber-500/20 dark:text-amber-400", icon: AlertTriangle },
    LEAVE: { color: "bg-purple-500/10 text-purple-600 border-purple-500/20 dark:text-purple-400", icon: Calendar },
    HALF_DAY: { color: "bg-blue-500/10 text-blue-600 border-blue-500/20 dark:text-blue-400", icon: Clock },
  };
  const config = configs[status as keyof typeof configs] || configs.PRESENT;
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border shadow-sm sm:px-2 sm:py-[2px] ${config.color}`}>
      <Icon className="w-3 h-3 shrink-0" />
      {status.replace("_", " ")}
    </span>
  );
};

export default async function AttendancePage(props: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;

  const records: AttendanceRecord[] = await getAttendance(searchParams);
  const stats = await getAttendanceStats();

  const totalEmployees = stats?.totalEmployees || 0;
  const presentCount = stats?.present || 0;
  const absentCount = stats?.absent || 0;
  const leaveCount = stats?.leave || 0;
  const totalRecordsCount = stats?.totalRecords || records.length;

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-[1400px] flex-col gap-4 px-4 py-5 pt-20 sm:gap-5 sm:px-5 md:pt-24 lg:px-6">
      
      {/* ========================================== */}
      {/* 1. COMPACT HEADER & ACTIONS                */}
      {/* ========================================== */}
      <header className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex min-w-0 flex-1 flex-col items-start gap-1">
          <div className="inline-flex items-center gap-1.5 rounded-md bg-[var(--primary)]/10 px-2 py-0.5 text-[10px] font-semibold text-[var(--primary)]">
            <Clock className="h-3 w-3 shrink-0" />
            <span>Attendance Log</span>
          </div>
          <h1 className="text-xl font-semibold tracking-tight text-[var(--foreground)] sm:text-2xl">
            Department Attendance
          </h1>
          <p className="max-w-2xl text-sm text-[var(--muted-foreground)]">
            Real-time tracking of team check-ins, working hours, and daily operational status.
          </p>
        </div>

        <div className="flex w-full shrink-0 flex-col gap-2 sm:flex-row md:w-auto">
          <button className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 text-[13px] font-medium text-[var(--foreground)] transition-colors hover:bg-[var(--accent)] hover:text-[var(--primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] shadow-sm">
            <ArrowDownToLine className="h-3.5 w-3.5 shrink-0" />
            Export CSV
          </button>
          <button className="inline-flex h-9 items-center justify-center gap-2 rounded-lg bg-[var(--primary)] px-3 text-[13px] font-medium text-white shadow-sm transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2">
            <Plus className="h-3.5 w-3.5 shrink-0" />
            Mark Manual
          </button>
        </div>
      </header>

      {/* ========================================== */}
      {/* 2. DENSE SUMMARY METRICS GRID              */}
      {/* ========================================== */}
      <section className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:gap-4 mt-1">
        <SummaryCard label="Total Employees" value={totalEmployees} icon={Users} tone="blue" />
        <SummaryCard label="Present" value={presentCount} icon={CheckCircle2} tone="emerald" />
        <SummaryCard label="Absent" value={absentCount} icon={XCircle} tone="red" />
        <SummaryCard label="On Leave" value={leaveCount} icon={Calendar} tone="purple" />
      </section>

      {/* ========================================== */}
      {/* 3. INLINE TOOLBAR                          */}
      {/* ========================================== */}
      <section>
        <form method="GET" className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <div className="relative flex-1 min-w-0">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted-foreground)]" />
            <input 
              type="text" 
              name="search"
              defaultValue={(searchParams?.search as string) || ""}
              placeholder="Search by name or ID..." 
              className="h-9 w-full rounded-lg border border-[var(--border)] bg-[var(--background)] py-1.5 pl-9 pr-3 text-[13px] font-medium text-[var(--foreground)] shadow-sm outline-none transition focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] placeholder:text-[var(--muted-foreground)]"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="relative flex-1 sm:flex-none">
              <select 
                name="dateRange" 
                defaultValue={(searchParams?.dateRange as string) || "today"} 
                className="h-9 w-full appearance-none rounded-lg border border-[var(--border)] bg-[var(--background)] py-1.5 pl-3 pr-8 text-[13px] font-medium text-[var(--foreground)] shadow-sm outline-none transition focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] sm:w-[130px]"
              >
                <option value="today">Today</option>
                <option value="yesterday">Yesterday</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
              </select>
              <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-[var(--muted-foreground)]">▼</span>
            </div>

            <div className="relative flex-1 sm:flex-none">
              <select 
                name="status" 
                defaultValue={(searchParams?.status as string) || "all"} 
                className="h-9 w-full appearance-none rounded-lg border border-[var(--border)] bg-[var(--background)] py-1.5 pl-3 pr-8 text-[13px] font-medium text-[var(--foreground)] shadow-sm outline-none transition focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] sm:w-[130px]"
              >
                <option value="all">All Statuses</option>
                <option value="PRESENT">Present</option>
                <option value="ABSENT">Absent</option>
                <option value="HALF_DAY">Half Day</option>
                <option value="LATE">Late</option>
                <option value="LEAVE">Leave</option>
              </select>
              <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-[var(--muted-foreground)]">▼</span>
            </div>

            <button type="submit" className="flex h-9 w-full flex-1 sm:flex-none items-center justify-center gap-1.5 rounded-lg border border-[var(--border)] bg-[var(--background)] px-4 text-[13px] font-medium text-[var(--foreground)] shadow-sm transition-colors hover:bg-[var(--accent)] hover:text-[var(--primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] sm:w-auto">
              <Filter className="h-3.5 w-3.5 shrink-0" />
              Apply
            </button>
          </div>
        </form>
      </section>

      {/* ========================================== */}
      {/* 4. HIGH DENSITY DATA CONTAINER             */}
      {/* ========================================== */}
      <section className="flex flex-col overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--card)] shadow-sm">
        
        {/* Desktop Table (Hidden on Mobile) */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full min-w-[850px] text-left text-sm">
            <thead className="border-b border-[var(--border)] bg-[var(--background)]/50">
              <tr>
                <th className="whitespace-nowrap px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">Employee</th>
                <th className="whitespace-nowrap px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">Date</th>
                <th className="whitespace-nowrap px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">Shift</th>
                <th className="whitespace-nowrap px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">In / Out</th>
                <th className="whitespace-nowrap px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">Work Hours</th>
                <th className="whitespace-nowrap px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">Status</th>
                <th className="whitespace-nowrap px-4 py-2.5 text-right text-[10px] font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]/60">
              {records.length > 0 ? records.map((record) => (
                <tr key={record.id || record._id} className="group transition-colors hover:bg-[var(--background)]/60">
                  <td className="px-4 py-2.5">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-[var(--border)] bg-[var(--background)] text-[10px] font-bold text-[var(--foreground)] shadow-sm">
                        {record.user.avatar || getInitials(record.user.fullName)}
                      </div>
                      <div className="min-w-0 flex flex-col">
                        <span className="truncate text-[13px] font-semibold text-[var(--foreground)] transition-colors group-hover:text-[var(--primary)]">
                          {record.user.fullName}
                        </span>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="truncate font-mono text-[10px] text-[var(--muted-foreground)]">
                            {record.user.employeeCode || "No ID"}
                          </span>
                          <span className="h-[3px] w-[3px] shrink-0 rounded-full bg-[var(--border)]"></span>
                          <span className="truncate text-[10px] font-medium text-[var(--muted-foreground)]">
                            {record.user.department?.name || "N/A"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-4 py-2.5 text-[12px] font-medium text-[var(--foreground)]">
                    {formatDateIST(record.attendanceDate || record.date)}
                  </td>
                  <td className="px-4 py-2.5 text-[12px] text-[var(--muted-foreground)]">
                    General
                  </td>
                  <td className="px-4 py-2.5">
                    {record.checkIn ? (
                      <div className="flex flex-col gap-0.5 min-w-0">
                        <span className="flex items-center gap-1.5 text-[12px] font-medium text-emerald-600 dark:text-emerald-400">
                          <span className="h-1 w-1 shrink-0 rounded-full bg-emerald-500" />
                          <span className="truncate font-mono">{formatTimeIST(record.checkIn)}</span>
                        </span>
                        {record.checkOut ? (
                           <span className="flex items-center gap-1.5 text-[12px] font-medium text-blue-600 dark:text-blue-400">
                           <span className="h-1 w-1 shrink-0 rounded-full bg-blue-500" />
                           <span className="truncate font-mono">{formatTimeIST(record.checkOut)}</span>
                         </span>
                        ) : (
                          <span className="flex items-center gap-1.5 text-[11px] text-[var(--muted-foreground)] opacity-70">
                            <span className="h-1 w-1 shrink-0 rounded-full bg-[var(--muted-foreground)]" />
                            Pending
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="text-[13px] text-[var(--muted-foreground)] opacity-50">-</span>
                    )}
                  </td>
                  <td className="px-4 py-2.5">
                    {record.checkIn && record.checkOut ? (
                      <span className="font-mono text-[12px] font-semibold text-[var(--foreground)]">
                        {getWorkHours(record.checkIn, record.checkOut)}
                      </span>
                    ) : (
                      <span className="text-[13px] text-[var(--muted-foreground)] opacity-50">-</span>
                    )}
                  </td>
                  <td className="px-4 py-2.5">
                    <StatusBadge status={record.status} />
                  </td>
                  <td className="px-4 py-2.5 text-right">
                    <div className="flex items-center justify-end gap-0.5 opacity-0 transition-opacity focus-within:opacity-100 group-hover:opacity-100">
                      <button className="flex h-7 w-7 items-center justify-center rounded-md text-[var(--muted-foreground)] transition-colors hover:bg-[var(--background)] hover:text-[var(--primary)] focus-visible:opacity-100" title="View Details">
                        <Eye className="h-3.5 w-3.5" />
                      </button>
                      <button className="flex h-7 w-7 items-center justify-center rounded-md text-[var(--muted-foreground)] transition-colors hover:bg-[var(--background)] hover:text-amber-500 focus-visible:opacity-100" title="Edit Record">
                        <Edit className="h-3.5 w-3.5" />
                      </button>
                      <button className="flex h-7 w-7 items-center justify-center rounded-md text-[var(--muted-foreground)] transition-colors hover:bg-[var(--background)] hover:text-[var(--foreground)] focus-visible:opacity-100">
                        <MoreVertical className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <EmptyState />
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile View (Compact Cards) */}
        <div className="flex flex-col md:hidden divide-y divide-[var(--border)]/60">
          {records.length > 0 ? (
            records.map((record) => (
              <MobileRecordCard key={record.id || record._id} record={record} />
            ))
          ) : (
            <div className="py-10"><EmptyState /></div>
          )}
        </div>

        {/* Dense Pagination Footer */}
        <div className="flex items-center justify-between border-t border-[var(--border)] bg-[var(--background)]/50 px-4 py-2.5">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
            Showing <strong className="text-[var(--foreground)]">1-10</strong> of <strong className="text-[var(--foreground)]">{totalRecordsCount}</strong>
          </p>
          <div className="flex items-center gap-1">
            <button className="flex h-7 w-7 items-center justify-center rounded-md border border-[var(--border)] bg-[var(--background)] text-[var(--muted-foreground)] transition-colors hover:text-[var(--foreground)] disabled:opacity-50">
              <ChevronLeft className="h-3.5 w-3.5"/>
            </button>
            <button className="flex h-7 w-7 items-center justify-center rounded-md bg-[var(--primary)] text-[11px] font-bold text-white shadow-sm">
              1
            </button>
            <button className="hidden sm:flex h-7 w-7 items-center justify-center rounded-md text-[11px] font-semibold text-[var(--muted-foreground)] transition-colors hover:bg-[var(--background)] hover:text-[var(--foreground)]">
              2
            </button>
            <span className="px-1.5 text-[11px] font-semibold text-[var(--muted-foreground)]">...</span>
            <button className="flex h-7 w-7 items-center justify-center rounded-md border border-[var(--border)] bg-[var(--background)] text-[var(--muted-foreground)] transition-colors hover:text-[var(--foreground)]">
              <ChevronRight className="h-3.5 w-3.5"/>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

function SummaryCard({
  label,
  value,
  icon: Icon,
  tone,
}: {
  label: string;
  value: number;
  icon: React.ComponentType<{ className?: string }>;
  tone: string;
}) {
  const styles: Record<string, string> = {
    blue: "text-blue-600 bg-blue-500/10 border-blue-500/20 dark:text-blue-400",
    emerald: "text-emerald-600 bg-emerald-500/10 border-emerald-500/20 dark:text-emerald-400",
    red: "text-red-600 bg-red-500/10 border-red-500/20 dark:text-red-400",
    purple: "text-purple-600 bg-purple-500/10 border-purple-500/20 dark:text-purple-400",
  };

  return (
    <div className="flex h-[72px] items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 py-3 shadow-sm transition-colors hover:bg-[var(--accent)]/50">
      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border ${styles[tone]}`}>
        <Icon className="h-4 w-4" />
      </div>
      <div className="flex min-w-0 flex-col">
        <p className="truncate text-[10px] font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
          {label}
        </p>
        <h3 className="mt-0.5 truncate text-[19px] font-bold leading-none tracking-tight text-[var(--foreground)]">
          {value}
        </h3>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <tr>
      <td colSpan={7} className="px-4 py-10 text-center">
        <div className="flex flex-col items-center justify-center">
          <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--background)] shadow-sm">
            <Filter className="h-4 w-4 text-[var(--muted-foreground)]" />
          </div>
          <p className="text-[13px] font-semibold text-[var(--foreground)]">No records found</p>
          <p className="mt-0.5 text-[11px] text-[var(--muted-foreground)]">Adjust your search or date filters.</p>
        </div>
      </td>
    </tr>
  );
}

function MobileRecordCard({ record }: { record: AttendanceRecord }) {
  return (
    <div className="flex flex-col gap-3 p-3 transition-colors hover:bg-[var(--background)]/50 sm:p-4 bg-[var(--card)]">
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-[var(--border)] bg-[var(--background)] text-[10px] font-bold text-[var(--foreground)] shadow-sm">
            {record.user.avatar || getInitials(record.user.fullName)}
          </div>
          <div className="min-w-0 flex flex-col">
            <p className="truncate text-[13px] font-semibold text-[var(--foreground)] leading-tight">
              {record.user.fullName}
            </p>
            <div className="mt-0.5 flex items-center gap-1.5">
              <span className="truncate font-mono text-[10px] text-[var(--muted-foreground)]">
                {record.user.employeeCode || "No ID"}
              </span>
              <span className="h-[3px] w-[3px] shrink-0 rounded-full bg-[var(--border)]"></span>
              <span className="truncate text-[10px] font-medium text-[var(--muted-foreground)]">
                {record.user.department?.name || "N/A"}
              </span>
            </div>
          </div>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-1">
          <span className="text-[10px] font-medium text-[var(--muted-foreground)]">
            {formatDateIST(record.attendanceDate || record.date)}
          </span>
          <StatusBadge status={record.status} />
        </div>
      </div>
      
      <div className="grid grid-cols-3 items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--background)]/50 p-2 shadow-sm">
        <div className="flex flex-col">
          <span className="text-[9px] font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">In</span>
          {record.checkIn ? (
            <span className="font-mono text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">{formatTimeIST(record.checkIn)}</span>
          ) : (
            <span className="text-[11px] font-medium text-[var(--muted-foreground)]">-</span>
          )}
        </div>
        <div className="flex flex-col border-l border-[var(--border)]/60 pl-2">
          <span className="text-[9px] font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">Out</span>
          {record.checkOut ? (
            <span className="font-mono text-[11px] font-semibold text-blue-600 dark:text-blue-400">{formatTimeIST(record.checkOut)}</span>
          ) : (
            <span className="text-[11px] font-medium text-[var(--muted-foreground)]">-</span>
          )}
        </div>
        <div className="flex flex-col border-l border-[var(--border)]/60 pl-2">
          <span className="text-[9px] font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">Hours</span>
          <span className="font-mono text-[11px] font-semibold text-[var(--foreground)]">
             {record.checkIn && record.checkOut ? getWorkHours(record.checkIn, record.checkOut) : "-"}
          </span>
        </div>
      </div>
    </div>
  );
}