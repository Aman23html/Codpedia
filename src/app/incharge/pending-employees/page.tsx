import Link from "next/link";
import { getPendingEmployees } from "@/actions/incharge/get-pending-employees";
import { PendingEmployeeActions } from "@/components/incharge/pending-employee-actions";
import { 
  Users, 
  FileText, 
  AlertCircle, 
  CheckCircle, 
  ExternalLink,
  ShieldCheck,
  Search
} from "lucide-react";

// Helper for initials
function getInitials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").substring(0, 2).toUpperCase();
}

export default async function PendingEmployeesPage() {
  const employees = await getPendingEmployees();

  return (
    <div className="min-h-screen bg-[var(--background)] px-6 pt-28 pb-16 lg:pt-32 lg:px-12 max-w-[1600px] mx-auto">
      
      {/* HEADER */}
      <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[var(--border)]/50 pb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-5 rounded-full bg-amber-500/10 border border-amber-500/20">
            <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
            <span className="text-[11px] font-extrabold tracking-widest uppercase text-amber-500">
              Pending Verification
            </span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-black tracking-tight leading-none mb-3">
            Approval Center
          </h1>
          <p className="text-[var(--muted-foreground)] text-base font-medium max-w-2xl">
            Review pending employee registrations, audit documents, and authorize access to the system.
          </p>
        </div>

        <div className="flex items-center gap-4 px-5 py-3 rounded-2xl bg-[var(--card)] border border-[var(--border)] shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-[var(--muted-foreground)] uppercase tracking-wider">Pending Action</span>
            <span className="text-xl font-black text-[var(--foreground)] leading-none">{employees.length}</span>
          </div>
        </div>
      </header>

      {/* DATA GRID */}
      <div className="relative rounded-[24px] border border-[var(--border)] bg-[var(--card)]/40 backdrop-blur-xl shadow-sm overflow-hidden">
        
        <div className="px-6 py-4 border-b border-[var(--border)]/50 flex items-center justify-between bg-[var(--card)]/50">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)]" />
            <input 
              placeholder="Filter registrations..." 
              disabled
              className="pl-9 pr-4 py-2 text-sm bg-[var(--background)]/50 border border-[var(--border)] rounded-xl w-full opacity-50 cursor-not-allowed" 
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead className="bg-[var(--card)]/80 border-b border-[var(--border)]/60">
              <tr>
                <th className="px-6 py-4 text-[10px] font-extrabold uppercase tracking-widest text-[var(--muted-foreground)]">Personnel Identity</th>
                <th className="px-6 py-4 text-[10px] font-extrabold uppercase tracking-widest text-[var(--muted-foreground)]">Contact</th>
                <th className="px-6 py-4 text-[10px] font-extrabold uppercase tracking-widest text-[var(--muted-foreground)]">Department</th>
                <th className="px-6 py-4 text-[10px] font-extrabold uppercase tracking-widest text-[var(--muted-foreground)]">Documents</th>
                <th className="px-6 py-4 text-[10px] font-extrabold uppercase tracking-widest text-[var(--muted-foreground)] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]/40">
              {employees.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center text-[var(--muted-foreground)]">
                    <p className="text-sm font-medium">All employees verified. No pending tasks.</p>
                  </td>
                </tr>
              ) : (
                employees.map((employee) => (
                  <tr key={employee.id} className="hover:bg-[var(--primary)]/5 transition-colors group">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-white shadow-sm">
                          {getInitials(employee.fullName)}
                        </div>
                        <span className="text-sm font-bold">{employee.fullName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-[var(--muted-foreground)]">{employee.email}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-md text-[10px] font-bold bg-[var(--background)] border border-[var(--border)]">
                        {employee.department.name}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {employee.documents.length > 0 ? (
                        <Link
                          href={employee.documents[0].documentUrl}
                          target="_blank"
                          className="inline-flex items-center gap-2 text-xs font-bold text-[var(--primary)] hover:underline"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          Review Docs
                          <ExternalLink className="w-3 h-3 opacity-50" />
                        </Link>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-red-500">
                          <AlertCircle className="w-3.5 h-3.5" /> Missing
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <PendingEmployeeActions employeeId={employee.id} />
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