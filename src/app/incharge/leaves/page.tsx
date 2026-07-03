import { getPendingLeaves } from "@/actions/incharge/get-pending-leaves";
import { LeaveRowActions } from "@/components/incharge/leave-row-actions";
import { CalendarDays, AlertCircle, Clock } from "lucide-react";

export default async function InchargeLeavesPage() {
  const leaves = await getPendingLeaves();

  return (
    <div className="min-h-screen bg-[var(--background)] px-6 pt-28 pb-16 lg:pt-32 lg:px-12 max-w-[1600px] mx-auto">
      
      {/* Header Section */}
      <header className="mb-10">
        <div className="flex items-center gap-3 mb-3">
          <h1 className="text-4xl font-extrabold tracking-tight text-[var(--foreground)]">
            Leave Requests
          </h1>
          <span className="px-3 py-1 text-[10px] font-black uppercase tracking-wider rounded-full bg-[var(--primary)]/10 text-[var(--primary)] border border-[var(--primary)]/20">
            {leaves.length} Pending
          </span>
        </div>
        <p className="text-[var(--muted-foreground)] font-medium max-w-lg">
          Manage and review pending time-off requests submitted by your team members.
        </p>
      </header>

      {/* Empty State */}
      {leaves.length === 0 ? (
        <div className="rounded-[24px] border border-[var(--border)] bg-[var(--card)]/30 p-12 text-center">
          <p className="text-[var(--muted-foreground)] font-medium">All leave requests have been processed.</p>
        </div>
      ) : (
        /* Data Table Container */
        <div className="rounded-[24px] border border-[var(--border)] bg-[var(--card)]/40 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[900px]">
              <thead>
                <tr className="border-b border-[var(--border)] bg-[var(--card)]/50">
                  <th className="px-8 py-4 text-[11px] font-bold uppercase tracking-widest text-[var(--muted-foreground)]">Employee</th>
                  <th className="px-8 py-4 text-[11px] font-bold uppercase tracking-widest text-[var(--muted-foreground)]">Duration</th>
                  <th className="px-8 py-4 text-[11px] font-bold uppercase tracking-widest text-[var(--muted-foreground)]">Reason</th>
                  <th className="px-8 py-4 text-[11px] font-bold uppercase tracking-widest text-[var(--muted-foreground)] text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {leaves.map((leave) => (
                  <tr
                    key={leave.id}
                    className="group hover:bg-[var(--primary)]/5 transition-colors"
                  >
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[var(--background)] border border-[var(--border)] flex items-center justify-center text-[10px] font-bold text-[var(--muted-foreground)]">
                          {leave.user.fullName.substring(0, 2).toUpperCase()}
                        </div>
                        <span className="text-sm font-semibold text-[var(--foreground)]">
                          {leave.user.fullName}
                        </span>
                      </div>
                    </td>

                    <td className="px-8 py-5">
                      <div className="flex items-center gap-2 text-xs font-medium text-[var(--muted-foreground)]">
                        <span className="px-2 py-1 bg-[var(--background)] rounded-md border border-[var(--border)]">
                          {new Date(leave.fromDate).toLocaleDateString("en-IN", { day: '2-digit', month: 'short' })}
                        </span>
                        <span className="opacity-50">—</span>
                        <span className="px-2 py-1 bg-[var(--background)] rounded-md border border-[var(--border)]">
                          {new Date(leave.toDate).toLocaleDateString("en-IN", { day: '2-digit', month: 'short' })}
                        </span>
                      </div>
                    </td>

                    <td className="px-8 py-5">
                      <div className="max-w-xs text-sm text-[var(--foreground)] font-medium truncate" title={leave.reason}>
                        {leave.reason}
                      </div>
                    </td>

                    <td className="px-8 py-5 text-right">
                      <LeaveRowActions leaveId={leave.id} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}