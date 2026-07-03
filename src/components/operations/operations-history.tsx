import Link from "next/link";
import type { EmployeeOperationReport } from "@prisma/client";

export default function OperationsHistory({
  reports,
}: {
  reports: EmployeeOperationReport[];
}) {
  return (
    <section className="rounded-[32px] border border-[var(--border)] bg-[var(--card)]/40 p-8 shadow-sm backdrop-blur-xl">
      <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-2xl font-black text-[var(--foreground)]">
            Operations History
          </h2>

          <p className="mt-2 text-sm text-[var(--muted-foreground)]">
            Previous operations submissions. Amount is hidden from employee history.
          </p>
        </div>

        <form className="flex flex-wrap gap-3">
          <select
            name="status"
            defaultValue="ALL"
            className="rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-sm font-semibold outline-none"
          >
            <option value="ALL">All Status</option>
            <option value="DRAFT">Draft</option>
            <option value="SUBMITTED">Submitted</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
            <option value="CORRECTION_REQUIRED">Correction Required</option>
          </select>

          <input
            type="date"
            name="date"
            className="rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-sm font-semibold outline-none"
          />

          <button
            type="submit"
            className="rounded-xl bg-[var(--primary)] px-5 py-3 text-sm font-bold text-white"
          >
            Filter
          </button>

          <Link
            href="/employee/operations"
            className="rounded-xl border border-[var(--border)] px-5 py-3 text-sm font-bold text-[var(--foreground)]"
          >
            Reset
          </Link>
        </form>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-[900px] w-full text-left">
          <thead>
            <tr className="border-b border-[var(--border)]">
              <th className="px-4 py-4 text-[10px] font-black uppercase tracking-widest text-[var(--muted-foreground)]">
                Date
              </th>
              <th className="px-4 py-4 text-[10px] font-black uppercase tracking-widest text-[var(--muted-foreground)]">
                Query Generated
              </th>
              <th className="px-4 py-4 text-[10px] font-black uppercase tracking-widest text-[var(--muted-foreground)]">
                Deals Done
              </th>
              <th className="px-4 py-4 text-[10px] font-black uppercase tracking-widest text-[var(--muted-foreground)]">
                Tutor Assigned
              </th>
              <th className="px-4 py-4 text-[10px] font-black uppercase tracking-widest text-[var(--muted-foreground)]">
                Status
              </th>
              <th className="px-4 py-4 text-[10px] font-black uppercase tracking-widest text-[var(--muted-foreground)]">
                Submitted
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-[var(--border)]/60">
            {reports.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-12 text-center text-sm font-semibold text-[var(--muted-foreground)]"
                >
                  No operations history found.
                </td>
              </tr>
            ) : (
              reports.map((report) => (
                <tr
                  key={report.id}
                  className="transition hover:bg-[var(--background)]/60"
                >
                  <td className="px-4 py-5 text-sm font-bold text-[var(--foreground)]">
                    {report.reportDate.toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>

                  <td className="px-4 py-5 font-mono text-sm">
                    {report.queryGenerated}
                  </td>

                  <td className="px-4 py-5 font-mono text-sm">
                    {report.dealsDone}
                  </td>

                  <td className="px-4 py-5 font-mono text-sm">
                    {report.tutorAssigned}
                  </td>

                  <td className="px-4 py-5">
                    <StatusBadge status={report.status} />
                  </td>

                  <td className="px-4 py-5 text-sm text-[var(--muted-foreground)]">
                    {report.submittedAt
                      ? report.submittedAt.toLocaleString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "Not submitted"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    DRAFT: "bg-slate-500/10 text-slate-500 border-slate-500/20",
    SUBMITTED: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    APPROVED: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    REJECTED: "bg-red-500/10 text-red-500 border-red-500/20",
    CORRECTION_REQUIRED:
      "bg-amber-500/10 text-amber-500 border-amber-500/20",
  };

  return (
    <span
      className={`inline-flex rounded-lg border px-3 py-1.5 text-[10px] font-black uppercase tracking-widest ${
        styles[status] ?? styles.DRAFT
      }`}
    >
      {status.replaceAll("_", " ")}
    </span>
  );
}