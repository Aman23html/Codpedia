import React from "react";
import { 
  Search, Download, Filter, Users, 
  CheckCircle2, XCircle, Calendar, 
  MoreVertical, Eye, Edit, ChevronLeft, ChevronRight,
  Printer, Clock, ArrowDownToLine, Plus, AlertTriangle
} from "lucide-react";

// --- Server Actions ---
import { getAttendance } from "@/actions/incharge/get-attendance";
import { getAttendanceStats } from "@/actions/incharge/get-attendance-stats";

// --- Types ---
type AttendanceRecord = {
  id: string;
  user: { 
    id: string; 
    fullName: string; 
    employeeCode?: string | null; 
    avatar?: string;
    department?: { name: string };
  };
  date?: Date;
  checkIn: Date | null;
  checkOut: Date | null;
  status: "PRESENT" | "ABSENT" | "LATE" | "LEAVE" | "HALF_DAY";
};

// --- Helper Functions ---
function getWorkHours(checkIn: Date | null, checkOut: Date | null) {
  if (!checkIn || !checkOut) return "-";
  const diff = checkOut.getTime() - checkIn.getTime();
  const hours = Math.floor(diff / 1000 / 60 / 60);
  const minutes = Math.floor(diff / 1000 / 60) % 60;
  return `${hours}h ${minutes}m`;
}

function formatTime(date: Date | null) {
  if (!date) return null;
  return new Date(date).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

// --- Components ---
const StatusBadge = ({ status }: { status: string }) => {
  const configs = {
    PRESENT: { color: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20", icon: CheckCircle2 },
    ABSENT: { color: "bg-red-500/10 text-red-600 border-red-500/20", icon: XCircle },
    LATE: { color: "bg-amber-500/10 text-amber-600 border-amber-500/20", icon: AlertTriangle },
    LEAVE: { color: "bg-purple-500/10 text-purple-600 border-purple-500/20", icon: Calendar },
    HALF_DAY: { color: "bg-blue-500/10 text-blue-600 border-blue-500/20", icon: Clock },
  };
  const config = configs[status as keyof typeof configs] || configs.PRESENT;
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider border ${config.color}`}>
      <Icon className="w-3 h-3" />
      {status.replace("_", " ")}
    </span>
  );
};

export default async function AttendancePage(props: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  // 1. Await search params for filtering
  const searchParams = await props.searchParams;

  // 2. Pass searchParams to the backend function
  // Make sure your `getAttendance` action accepts and uses these params in its Prisma query
  const records: AttendanceRecord[] = await getAttendance(searchParams);
  const stats = await getAttendanceStats();

  const totalEmployees = stats?.totalEmployees || 0;
  const presentCount = stats?.present || 0;
  const absentCount = stats?.absent || 0;
  const leaveCount = stats?.leave || 0;
  const totalRecordsCount = stats?.totalRecords || records.length;

  return (
    <div className="min-h-screen bg-[var(--background)] px-4 sm:px-6 pt-24 pb-16 lg:pt-28 lg:px-12 max-w-[1600px] mx-auto">
      
      {/* 1. Header & Actions */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl lg:text-4xl font-black text-[var(--foreground)] tracking-tight mb-2">
            Department Attendance
          </h1>
          <p className="text-[var(--muted-foreground)] text-sm font-medium">
            Real-time tracking of team check-ins, working hours, and daily operational status.
          </p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-[var(--card)] border border-[var(--border)] rounded-xl text-xs font-bold hover:bg-[var(--primary)]/10 text-[var(--foreground)] transition-colors">
            <ArrowDownToLine className="w-4 h-4" /> Export CSV
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-xl text-xs font-bold hover:opacity-90 transition-opacity">
            <Plus className="w-4 h-4" /> Mark Attendance
          </button>
        </div>
      </header>

      {/* 2. Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Employees", value: totalEmployees, icon: Users, color: "text-blue-500", bg: "bg-blue-500/10" },
          { label: "Present", value: presentCount, icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-500/10" },
          { label: "Absent", value: absentCount, icon: XCircle, color: "text-red-500", bg: "bg-red-500/10" },
          { label: "On Leave", value: leaveCount, icon: Calendar, color: "text-purple-500", bg: "bg-purple-500/10" },
        ].map((stat, i) => (
          <div key={i} className="p-5 rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-sm flex items-center gap-4">
            <div className={`p-3 rounded-xl ${stat.bg}`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-[var(--muted-foreground)] uppercase tracking-wider mb-1">{stat.label}</p>
              <p className="text-2xl font-black text-[var(--foreground)] leading-none">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* 3. Filters Bar (WIRED TO SEARCH PARAMS) */}
      <form method="GET" className="flex flex-col md:flex-row gap-4 mb-6 p-3 rounded-2xl border border-[var(--border)] bg-[var(--card)]/50 backdrop-blur-xl">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)]" />
          <input 
            type="text" 
            name="search"
            defaultValue={(searchParams?.search as string) || ""}
            placeholder="Search by name or Employee ID..." 
            className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-[var(--border)] bg-[var(--background)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50 text-[var(--foreground)] placeholder:text-[var(--muted-foreground)]/50 transition-all shadow-inner"
          />
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <select 
            name="dateRange" 
            defaultValue={(searchParams?.dateRange as string) || "today"} 
            className="px-4 py-2.5 text-sm rounded-xl border border-[var(--border)] bg-[var(--background)] font-bold text-[var(--foreground)] outline-none focus:ring-2 focus:ring-[var(--primary)]/50 shadow-inner appearance-none cursor-pointer"
          >
            <option value="today">Today</option>
            <option value="yesterday">Yesterday</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </select>
          <select 
            name="status" 
            defaultValue={(searchParams?.status as string) || "all"} 
            className="px-4 py-2.5 text-sm rounded-xl border border-[var(--border)] bg-[var(--background)] font-bold text-[var(--foreground)] outline-none focus:ring-2 focus:ring-[var(--primary)]/50 shadow-inner appearance-none cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="PRESENT">Present</option>
            <option value="ABSENT">Absent</option>
            <option value="LATE">Late</option>
            <option value="LEAVE">Leave</option>
          </select>
          <button type="submit" className="px-6 py-2.5 rounded-xl bg-[var(--foreground)] dark:bg-[var(--primary)] text-[var(--background)] dark:text-white text-sm font-bold flex items-center gap-2 hover:opacity-90 transition-opacity">
            <Filter className="w-4 h-4" /> Apply Filters
          </button>
        </div>
      </form>

      {/* 4. Desktop Table (Hidden on Mobile) */}
      <div className="hidden lg:block rounded-[24px] border border-[var(--border)] bg-[var(--card)]/40 backdrop-blur-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto max-h-[600px] overflow-y-auto relative scrollbar-hide">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead className="sticky top-0 bg-[var(--card)]/90 backdrop-blur-md shadow-sm z-10">
              <tr className="border-b border-[var(--border)]">
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-[var(--muted-foreground)]">Employee</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-[var(--muted-foreground)]">Shift</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-[var(--muted-foreground)]">In / Out</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-[var(--muted-foreground)]">Work Hours</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-[var(--muted-foreground)]">Status</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-[var(--muted-foreground)] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]/40">
              {records.length > 0 ? records.map((record) => (
                <tr key={record.id} className="hover:bg-[var(--primary)]/5 transition-colors group">
                  <td className="px-8 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-blue-500/10 text-blue-500 font-black flex items-center justify-center text-sm border border-blue-500/20">
                        {record.user.avatar || record.user.fullName.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-sm text-[var(--foreground)] group-hover:text-[var(--primary)] transition-colors">{record.user.fullName}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] text-[var(--muted-foreground)] font-mono bg-[var(--background)] px-1.5 py-0.5 rounded border border-[var(--border)] font-bold">
                            {record.user.employeeCode || "Not Generated"}
                          </span>
                          <span className="text-[11px] font-bold text-[var(--muted-foreground)] uppercase">
                            {record.user.department?.name || "N/A"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-4 text-sm text-[var(--muted-foreground)] font-bold">General Shift</td>
                  <td className="px-8 py-4">
                    {record.checkIn ? (
                      <div className="flex flex-col gap-1.5">
                        <span className="text-xs font-bold text-emerald-500 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> {formatTime(record.checkIn)}
                        </span>
                        {record.checkOut ? (
                           <span className="text-xs font-bold text-blue-500 flex items-center gap-1.5">
                           <span className="w-1.5 h-1.5 rounded-full bg-blue-500" /> {formatTime(record.checkOut)}
                         </span>
                        ) : (
                          <span className="text-xs font-bold text-[var(--muted-foreground)] flex items-center gap-1.5 opacity-50">
                            <span className="w-1.5 h-1.5 rounded-full bg-[var(--muted-foreground)]" /> Pending
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="text-sm font-bold text-[var(--muted-foreground)] opacity-50">-</span>
                    )}
                  </td>
                  <td className="px-8 py-4">
                    {record.checkIn && record.checkOut ? (
                      <p className="font-black text-sm text-[var(--foreground)] font-mono">
                        {getWorkHours(record.checkIn, record.checkOut)}
                      </p>
                    ) : (
                      <span className="text-sm font-bold text-[var(--muted-foreground)] opacity-50">-</span>
                    )}
                  </td>
                  <td className="px-8 py-4">
                    <StatusBadge status={record.status} />
                  </td>
                  <td className="px-8 py-4 text-right">
                    <div className="flex items-center justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 hover:bg-[var(--background)] rounded-lg text-[var(--muted-foreground)] hover:text-[var(--primary)] border border-transparent hover:border-[var(--border)] transition-all" title="View Details">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-2 hover:bg-[var(--background)] rounded-lg text-[var(--muted-foreground)] hover:text-amber-500 border border-transparent hover:border-[var(--border)] transition-all" title="Edit Record">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-2 hover:bg-[var(--background)] rounded-lg text-[var(--muted-foreground)] hover:text-[var(--foreground)] border border-transparent hover:border-[var(--border)] transition-all">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={6} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-16 h-16 rounded-full bg-[var(--background)] border border-[var(--border)] flex items-center justify-center mb-4">
                        <Filter className="w-8 h-8 text-[var(--muted-foreground)] opacity-50" />
                      </div>
                      <p className="text-lg font-bold text-[var(--foreground)]">No attendance records found</p>
                      <p className="text-sm font-medium text-[var(--muted-foreground)] mt-1">Try adjusting your search or date range filters.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Bottom */}
        <div className="flex items-center justify-between px-8 py-4 border-t border-[var(--border)] bg-[var(--card)]/50 backdrop-blur-md">
          <p className="text-xs text-[var(--muted-foreground)] font-bold uppercase tracking-wider">
            Showing <strong className="text-[var(--foreground)]">1-10</strong> of <strong className="text-[var(--foreground)]">{totalRecordsCount}</strong> entries
          </p>
          <div className="flex items-center gap-1">
            <button className="p-1.5 rounded-lg hover:bg-[var(--background)] border border-transparent hover:border-[var(--border)] text-[var(--muted-foreground)] disabled:opacity-50 transition-all"><ChevronLeft className="w-4 h-4"/></button>
            <button className="px-3 py-1.5 rounded-lg bg-[var(--primary)] text-white text-xs font-black shadow-sm">1</button>
            <button className="px-3 py-1.5 rounded-lg hover:bg-[var(--background)] border border-transparent hover:border-[var(--border)] text-xs font-black text-[var(--muted-foreground)] transition-all">2</button>
            <button className="px-3 py-1.5 rounded-lg hover:bg-[var(--background)] border border-transparent hover:border-[var(--border)] text-xs font-black text-[var(--muted-foreground)] transition-all">3</button>
            <span className="px-2 text-[var(--muted-foreground)] font-bold">...</span>
            <button className="p-1.5 rounded-lg hover:bg-[var(--background)] border border-transparent hover:border-[var(--border)] text-[var(--muted-foreground)] transition-all"><ChevronRight className="w-4 h-4"/></button>
          </div>
        </div>
      </div>

      {/* 5. Mobile View (Cards) */}
      <div className="lg:hidden flex flex-col gap-4">
        {records.length > 0 ? records.map((record) => (
          <div key={record.id} className="p-5 rounded-2xl border border-[var(--border)] bg-[var(--card)]/50 backdrop-blur-xl shadow-sm relative overflow-hidden">
            <div className="flex justify-between items-start mb-5">
              <div className="flex gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-500/10 text-blue-500 font-black flex items-center justify-center text-sm border border-blue-500/20">
                  {record.user.avatar || record.user.fullName.charAt(0)}
                </div>
                <div>
                  <p className="font-bold text-[var(--foreground)]">{record.user.fullName}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] text-[var(--muted-foreground)] font-mono font-bold">
                      {record.user.employeeCode || "Not Generated"}
                    </span>
                  </div>
                </div>
              </div>
              <StatusBadge status={record.status} />
            </div>
            
            <div className="grid grid-cols-2 gap-3 mb-5">
              <div className="bg-[var(--background)]/80 p-3 rounded-xl border border-[var(--border)] shadow-inner">
                <p className="text-[10px] font-black text-[var(--muted-foreground)] uppercase tracking-wider mb-1.5">Check In</p>
                <p className="font-mono text-sm font-bold text-emerald-500">{formatTime(record.checkIn) || "-"}</p>
              </div>
              <div className="bg-[var(--background)]/80 p-3 rounded-xl border border-[var(--border)] shadow-inner">
                <p className="text-[10px] font-black text-[var(--muted-foreground)] uppercase tracking-wider mb-1.5">Check Out</p>
                <p className="font-mono text-sm font-bold text-blue-500">{formatTime(record.checkOut) || "-"}</p>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-[var(--border)]/50 pt-4 mt-2">
              <div>
                <p className="text-[10px] font-black text-[var(--muted-foreground)] uppercase tracking-wider mb-0.5">Total Hours</p>
                <p className="font-mono font-black text-sm text-[var(--foreground)]">
                  {getWorkHours(record.checkIn, record.checkOut)}
                </p>
              </div>
              <div className="flex items-center gap-2">
                 <button className="p-2 bg-[var(--background)] rounded-lg text-[var(--muted-foreground)] border border-[var(--border)]"><Eye className="w-4 h-4"/></button>
                 <button className="p-2 bg-[var(--background)] rounded-lg text-[var(--muted-foreground)] border border-[var(--border)]"><Edit className="w-4 h-4"/></button>
              </div>
            </div>
          </div>
        )) : (
          <div className="p-8 rounded-2xl border border-[var(--border)] bg-[var(--card)]/50 text-center">
            <p className="font-bold text-[var(--muted-foreground)]">No records found.</p>
          </div>
        )}
      </div>

    </div>
  );
}