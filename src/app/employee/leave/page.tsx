import { getMyLeaves } from "@/actions/leave/get-my-leaves";
import { LeaveForm } from "@/components/leave/leave-form";
import { Calendar, Clock, CheckCircle2, XCircle, AlertCircle, Plane } from "lucide-react";

// Professional Status Badge Helper
function getStatusStyle(status: string) {
  switch (status.toUpperCase()) {
    case "APPROVED": return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
    case "REJECTED": return "bg-red-500/10 text-red-500 border-red-500/20";
    default: return "bg-amber-500/10 text-amber-500 border-amber-500/20";
  }
}

export default async function EmployeeLeavePage() {
  const leaves = await getMyLeaves();

  return (
    <div className="min-h-screen bg-[var(--background)] px-6 pt-32 pb-24 lg:px-12 max-w-[1400px] mx-auto space-y-10">
      
      {/* 1. HEADER */}
      <header>
        <h1 className="text-4xl font-black tracking-tight text-[var(--foreground)] mb-3">Leave Management</h1>
        <p className="text-[var(--muted-foreground)] font-medium">Manage your balance and track your request history.</p>
      </header>

      {/* 2. SUMMARY DASHBOARD */}
      <section className="grid lg:grid-cols-3 gap-8">
        {/* Quick Stats */}
        <div className="space-y-6">
          <div className="p-8 rounded-[32px] border border-[var(--border)] bg-[var(--card)]/40 backdrop-blur-xl">
             <h3 className="text-[10px] font-black text-[var(--muted-foreground)] uppercase tracking-widest mb-4">Time Off Balance</h3>
             <div className="flex items-baseline gap-2">
                <span className="text-6xl font-black">12</span>
                <span className="font-bold text-[var(--muted-foreground)]">Days Remaining</span>
             </div>
          </div>
          <div className="p-8 rounded-[32px] border border-[var(--border)] bg-[var(--card)]/40 backdrop-blur-xl">
             <h3 className="text-[10px] font-black text-[var(--muted-foreground)] uppercase tracking-widest mb-4">Upcoming</h3>
             <p className="text-sm font-bold">No upcoming leaves scheduled.</p>
          </div>
        </div>

        {/* Request Form */}
        <div className="lg:col-span-2 p-10 rounded-[32px] border border-[var(--border)] bg-[var(--card)]/40 backdrop-blur-xl">
          <h2 className="text-xl font-bold mb-8 flex items-center gap-3">
            <Plane className="w-5 h-5 text-[var(--primary)]" /> Submit New Request
          </h2>
          <LeaveForm />
        </div>
      </section>

      {/* 3. LEAVE HISTORY LEDGER */}
      <section className="rounded-[32px] border border-[var(--border)] bg-[var(--card)]/40 backdrop-blur-xl overflow-hidden shadow-sm">
        <div className="px-10 py-6 border-b border-[var(--border)]">
          <h2 className="font-black text-lg tracking-tight">Request History</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[var(--card)]/30 border-b border-[var(--border)]">
                {['Date Range', 'Reason', 'Status'].map(h => (
                  <th key={h} className="px-10 py-5 text-[10px] font-black uppercase tracking-widest text-[var(--muted-foreground)]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {leaves.length === 0 ? (
                <tr><td colSpan={3} className="px-10 py-12 text-center text-[var(--muted-foreground)]">No records found.</td></tr>
              ) : (
                leaves.map((leave: any) => (
                  <tr
                    key={String(leave.id || leave._id)}
                    className="hover:bg-[var(--card)]/50 transition-colors"
                  >
                    <td className="px-10 py-6 font-bold">
                      {new Date(leave.fromDate).toLocaleDateString("en-IN", {day:'2-digit', month:'short'})} 
                      <span className="text-[var(--muted-foreground)] px-2">→</span>
                      {new Date(leave.toDate).toLocaleDateString("en-IN", {day:'2-digit', month:'short'})}
                    </td>
                    <td className="px-10 py-6 text-[var(--muted-foreground)] font-medium">{leave.reason}</td>
                    <td className="px-10 py-6">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest border ${getStatusStyle(leave.status)}`}>
                        {leave.status === 'APPROVED' && <CheckCircle2 className="w-3 h-3"/>}
                        {leave.status === 'REJECTED' && <XCircle className="w-3 h-3"/>}
                        {leave.status === 'PENDING' && <Clock className="w-3 h-3"/>}
                        {leave.status}
                      </span>
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