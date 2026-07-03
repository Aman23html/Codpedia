import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function OperationAnalyticsEmployeeTable({
  employees,
}: {
  employees: any[];
}) {
  return (
    <section className="rounded-[32px] border border-[var(--border)] bg-[var(--card)]/40 p-8 shadow-sm backdrop-blur-xl">
      <div className="mb-8">
        <h2 className="text-2xl font-black text-[var(--foreground)]">
          Employee Performance Ranking
        </h2>

        <p className="mt-2 text-sm font-medium text-[var(--muted-foreground)]">
          Employee-wise operations performance summary.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-[1300px] w-full text-left">
          <thead>
            <tr className="border-b border-[var(--border)]">
              <TableHead>Employee ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Reports</TableHead>
              <TableHead>Queries</TableHead>
              <TableHead>Deals</TableHead>
              <TableHead>Tutors</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Approved</TableHead>
              <TableHead>Pending</TableHead>
              <TableHead>Rejected</TableHead>
              <TableHead>Correction</TableHead>
              <TableHead>Details</TableHead>
            </tr>
          </thead>

          <tbody className="divide-y divide-[var(--border)]/60">
            {employees.length === 0 ? (
              <tr>
                <td
                  colSpan={12}
                  className="px-4 py-16 text-center text-sm font-semibold text-[var(--muted-foreground)]"
                >
                  No employee analytics found.
                </td>
              </tr>
            ) : (
              employees.map((row) => (
                <tr
                  key={row.employee.id}
                  className="transition hover:bg-[var(--background)]/60"
                >
                  <TableCell mono>
                    EMP-{row.employee.id.substring(0, 6).toUpperCase()}
                  </TableCell>

                  <TableCell bold>{row.employee.fullName}</TableCell>
                  <TableCell mono>{row.totalReports}</TableCell>
                  <TableCell mono>{row.queryGenerated}</TableCell>
                  <TableCell mono>{row.dealsDone}</TableCell>
                  <TableCell mono>{row.tutorAssigned}</TableCell>

                  <TableCell mono>
                    ₹{row.dealsDoneAmount.toLocaleString("en-IN")}
                  </TableCell>

                  <TableCell>{row.approved}</TableCell>
                  <TableCell>{row.submitted}</TableCell>
                  <TableCell>{row.rejected}</TableCell>
                  <TableCell>{row.correctionRequired}</TableCell>

                  <TableCell>
                    <Link
                      href={`/incharge/operations/analytics/${row.employee.id}`}
                      className="inline-flex items-center gap-2 rounded-xl bg-[var(--primary)] px-4 py-2 text-xs font-black text-white"
                    >
                      Analyze
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
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
      className={`whitespace-nowrap px-4 py-5 text-sm ${
        mono ? "font-mono" : ""
      } ${
        bold
          ? "font-black text-[var(--foreground)]"
          : "text-[var(--muted-foreground)]"
      }`}
    >
      {children}
    </td>
  );
}