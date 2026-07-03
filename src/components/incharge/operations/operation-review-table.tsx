import OperationReviewActions from "@/components/incharge/operations/operation-review-actions";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function OperationReviewTable({
  reports,
}: {
  reports: any[];
}) {
  return (
    <section className="rounded-[32px] border border-[var(--border)] bg-[var(--card)]/40 p-8 shadow-sm backdrop-blur-xl">
      <div className="mb-8">
        <h2 className="text-2xl font-black text-[var(--foreground)]">
          Operations Report Review Queue
        </h2>

        <p className="mt-2 text-sm font-medium text-[var(--muted-foreground)]">
          Review submitted employee operation reports and approve, reject, or request correction.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-[3140px] w-full text-left">
          <thead>
            <tr className="border-b border-[var(--border)]">
              <TableHead>Date</TableHead>
              <TableHead>Employee ID</TableHead>
              <TableHead>Employee Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Query Generated</TableHead>
              <TableHead>Deals Done</TableHead>
              <TableHead>Deals Amount</TableHead>
              <TableHead>Tutor Assigned</TableHead>
              <TableHead>Work Notes</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Submitted At</TableHead>
              <TableHead>Review Remarks</TableHead>
              <TableHead>Details</TableHead>
              <TableHead>Action</TableHead>
            </tr>
          </thead>

          <tbody className="divide-y divide-[var(--border)]/60">
            {reports.length === 0 ? (
              <tr>
                <td
                  colSpan={15}
                  className="px-4 py-16 text-center text-sm font-semibold text-[var(--muted-foreground)]"
                >
                  No operation reports found.
                </td>
              </tr>
            ) : (
              reports.map((report) => (
                <tr
                  key={report.id}
                  className="align-top transition hover:bg-[var(--background)]/60"
                >
                  <TableCell bold>
                    {report.reportDate.toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </TableCell>

                  <TableCell mono>
                    EMP-{report.user.id.substring(0, 6).toUpperCase()}
                  </TableCell>

                  <TableCell bold>{report.user.fullName}</TableCell>

                  <TableCell>{report.user.email}</TableCell>

                  <TableCell>{report.user.phone || "-"}</TableCell>

                  <TableCell mono>{report.queryGenerated}</TableCell>

                  <TableCell mono>{report.dealsDone}</TableCell>

                  <TableCell mono>
                    ₹{report.dealsDoneAmount.toLocaleString("en-IN")}
                  </TableCell>

                  <TableCell mono>{report.tutorAssigned}</TableCell>

                  <TableCell>{report.workNotes || "-"}</TableCell>

                  <TableCell>
                    <StatusBadge status={report.status} />
                  </TableCell>

                  <TableCell>
                    {report.submittedAt
                      ? report.submittedAt.toLocaleString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "Not submitted"}
                  </TableCell>

                  <TableCell>{report.reviewRemarks || "-"}</TableCell>

                  <TableCell>
                <Link
                    href={`/incharge/operations/reports/${report.id}`}
                    className="inline-flex items-center gap-2 rounded-xl bg-[var(--primary)] px-4 py-2 text-xs font-black text-white"
                >
                    View
                    <ArrowRight className="h-3.5 w-3.5" />
                </Link>
                </TableCell>

                  <TableCell>
                    <OperationReviewActions
                      reportId={report.id}
                      status={report.status}
                    />
                  </TableCell>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function TableHead({ children }: { children: React.ReactNode }) {
  return (
    <th className="whitespace-nowrap px-4 py-4 text-[10px] font-black uppercase tracking-widest text-[var(--muted-foreground)]">
      {children}
    </th>
  );
}

function TableCell({
  children,
  mono,
  bold,
}: {
  children: React.ReactNode;
  mono?: boolean;
  bold?: boolean;
}) {
  return (
    <td
      className={`max-w-[260px] whitespace-nowrap px-4 py-5 text-sm ${
        mono ? "font-mono" : ""
      } ${
        bold
          ? "font-black text-[var(--foreground)]"
          : "text-[var(--muted-foreground)]"
      }`}
    >
      <div className="truncate">{children}</div>
    </td>
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