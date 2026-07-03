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

// Helper for Initials Avatar
function getInitials(name: string) {
  if (!name) return "U";
  return name.split(" ").map((n) => n[0]).join("").substring(0, 2).toUpperCase();
}

// Helper for Status Badge Styling
function getStatusStyle(status?: string) {
  const s = (status || "ACTIVE").toUpperCase();
  if (s === "ACTIVE" || s === "APPROVED") return "text-emerald-500 bg-emerald-500/10 border-emerald-500/20";
  if (s === "PENDING_APPROVAL") return "text-amber-500 bg-amber-500/10 border-amber-500/20";
  if (s === "SUSPENDED" || s === "INACTIVE") return "text-red-500 bg-red-500/10 border-red-500/20";
  return "text-slate-500 bg-slate-500/10 border-slate-500/20";
}

export default async function EmployeesPage(props: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;
  
  // Note: Ensure getDepartmentEmployees accepts searchParams for backend filtering
  const employees = await getDepartmentEmployees(searchParams);

  const currentSearch = (searchParams?.search as string) || "";
  const currentStatus = (searchParams?.status as string) || "all";

  // Calculate Metrics (if doing frontend calculation, otherwise fetch from DB)
  const total = employees.length;
  const activeCount = employees.filter((e: any) => e.status === "ACTIVE" || e.status === "APPROVED").length;

  return (
    <div className="min-h-screen bg-[var(--background)] px-6 pt-28 pb-16 lg:pt-32 lg:px-12 max-w-[1600px] mx-auto text-[var(--foreground)]">
      
      {/* ========================================== */}
      {/* 1. HEADER & METRICS                        */}
      {/* ========================================== */}
      <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[var(--border)]/50 pb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-5 rounded-full bg-[var(--primary)]/10 border border-[var(--primary)]/20 shadow-inner">
            <Users className="w-3.5 h-3.5 text-[var(--primary)]" />
            <span className="text-[11px] font-extrabold tracking-widest uppercase text-[var(--primary)]">
              Personnel Directory
            </span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-black tracking-tight leading-none mb-3">
            Department Employees
          </h1>
          <p className="text-[var(--muted-foreground)] text-base font-medium max-w-2xl">
            Manage your department roster, view contact details, and audit account statuses.
          </p>
        </div>

        <div className="flex gap-4">
          <div className="flex items-center gap-4 px-5 py-3 rounded-2xl bg-[var(--card)]/80 backdrop-blur-xl border border-[var(--border)] shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-[var(--primary)]/10 flex items-center justify-center text-[var(--primary)]">
              <UserCircle className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-[var(--muted-foreground)] uppercase tracking-wider">Total Personnel</span>
              <span className="text-xl font-black text-[var(--foreground)] leading-none">{total}</span>
            </div>
          </div>
          
          <div className="hidden sm:flex items-center gap-4 px-5 py-3 rounded-2xl bg-[var(--card)]/80 backdrop-blur-xl border border-[var(--border)] shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-[var(--muted-foreground)] uppercase tracking-wider">Active</span>
              <span className="text-xl font-black text-[var(--foreground)] leading-none">{activeCount}</span>
            </div>
          </div>
        </div>
      </header>

      {/* ========================================== */}
      {/* 2. SEARCH & FILTER TOOLBAR                 */}
      {/* ========================================== */}
      <section className="mb-8">
        <form method="GET" className="flex flex-col sm:flex-row items-center gap-3 bg-[var(--card)]/50 p-2 rounded-2xl border border-[var(--border)] backdrop-blur-xl shadow-sm w-full md:w-fit">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)]" />
            <input 
              type="text" 
              name="search"
              defaultValue={currentSearch}
              placeholder="Search by name or email..." 
              className="w-full pl-9 pr-4 py-2.5 text-sm bg-[var(--background)]/80 border border-[var(--border)] rounded-xl outline-none focus:ring-2 focus:ring-[var(--primary)]/30 text-[var(--foreground)] placeholder:text-[var(--muted-foreground)]/50 transition-all shadow-inner"
            />
          </div>

          <div className="relative w-full sm:w-auto">
            <select 
              name="status" 
              defaultValue={currentStatus}
              className="w-full sm:w-40 pl-4 pr-8 py-2.5 text-sm font-bold bg-[var(--background)]/80 border border-[var(--border)] rounded-xl outline-none focus:ring-2 focus:ring-[var(--primary)]/30 text-[var(--foreground)] appearance-none cursor-pointer shadow-inner transition-all uppercase tracking-wider"
            >
              <option value="all">All Status</option>
              <option value="ACTIVE">Active</option>
              <option value="PENDING_APPROVAL">PENDING_APPROVAL</option>
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--muted-foreground)]">▼</div>
          </div>

          <button type="submit" className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 bg-[var(--foreground)] dark:bg-[var(--primary)] text-[var(--background)] dark:text-white text-sm font-bold rounded-xl transition-all shadow-[0_4px_14px_rgba(0,102,255,0.25)] hover:opacity-90">
            <Filter className="w-4 h-4" />
            Filter
          </button>
        </form>
      </section>

      {/* ========================================== */}
      {/* 3. DATA GRID (EMPLOYEE DIRECTORY)          */}
      {/* ========================================== */}
      <div className="rounded-[24px] border border-[var(--border)] bg-[var(--card)]/40 backdrop-blur-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead className="bg-[var(--card)]/80 border-b border-[var(--border)]/60">
              <tr>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-[var(--muted-foreground)]">Identity & Contact</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-[var(--muted-foreground)]">Phone Number</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-[var(--muted-foreground)]">Account Status</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-[var(--muted-foreground)] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]/40">
              {employees.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-8 py-16 text-center text-[var(--muted-foreground)]">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[var(--card)] border border-[var(--border)] flex items-center justify-center">
                      <Users className="w-6 h-6 opacity-40" />
                    </div>
                    <p className="text-sm font-bold">No personnel found in the directory.</p>
                  </td>
                </tr>
              ) : (
                employees.map((employee: any) => (
                  <tr key={employee.id} className="group/row hover:bg-[var(--primary)]/5 transition-colors duration-300">
                    
                    {/* Identity & Email Column */}
                    <td className="px-8 py-5 whitespace-nowrap">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-[var(--background)] border border-[var(--border)] flex items-center justify-center text-xs font-black text-[var(--foreground)] shadow-sm">
                          {getInitials(employee.fullName)}
                        </div>
                        <div>
                          <p className="font-bold text-sm text-[var(--foreground)] group-hover/row:text-[var(--primary)] transition-colors">
                            {employee.fullName}
                          </p>
                          <div className="flex items-center gap-1.5 mt-0.5 text-[var(--muted-foreground)]">
                            <Mail className="w-3 h-3" />
                            <span className="text-xs font-medium">{employee.email}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Phone Column */}
                    <td className="px-8 py-5 whitespace-nowrap">
                      <div className="flex items-center gap-2 text-sm font-medium text-[var(--foreground)]">
                        <Phone className="w-3.5 h-3.5 text-[var(--muted-foreground)]" />
                        {employee.phone || "Not Provided"}
                      </div>
                    </td>

                    {/* Status Column */}
                    <td className="px-8 py-5 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] text-[10px] font-black uppercase tracking-widest border shadow-sm ${getStatusStyle(employee.status)}`}>
                        {employee.status === "ACTIVE" || employee.status === "APPROVED" ? (
                          <CheckCircle2 className="w-3 h-3" />
                        ) : (
                          <AlertCircle className="w-3 h-3" />
                        )}
                        {employee.status || "Active"}
                      </span>
                    </td>

                    {/* Actions Column */}
                    <td className="px-8 py-5 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-1.5 opacity-0 group-hover/row:opacity-100 transition-opacity">
                        <button className="p-2 hover:bg-[var(--background)] rounded-lg text-[var(--muted-foreground)] hover:text-[var(--primary)] border border-transparent hover:border-[var(--border)] transition-all" title="View Profile">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-2 hover:bg-[var(--background)] rounded-lg text-[var(--muted-foreground)] hover:text-emerald-500 border border-transparent hover:border-[var(--border)] transition-all" title="Message">
                          <MessageSquare className="w-4 h-4" />
                        </button>
                        <button className="p-2 hover:bg-[var(--background)] rounded-lg text-[var(--muted-foreground)] hover:text-[var(--foreground)] border border-transparent hover:border-[var(--border)] transition-all">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      
    </div>
  );
}