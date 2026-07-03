import Link from "next/link";

export default function OperationEmployeeAnalyticsFilter({
  status,
  from,
  to,
  resetHref,
}: {
  status?: string;
  from?: string;
  to?: string;
  resetHref: string;
}) {
  return (
    <form className="flex flex-wrap gap-3 rounded-[24px] border border-[var(--border)] bg-[var(--card)]/40 p-4 shadow-sm backdrop-blur-xl">
      <select
        name="status"
        defaultValue={status ?? "ALL"}
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
        name="from"
        defaultValue={from ?? ""}
        className="rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-sm font-semibold outline-none"
      />

      <input
        type="date"
        name="to"
        defaultValue={to ?? ""}
        className="rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-sm font-semibold outline-none"
      />

      <button
        type="submit"
        className="rounded-xl bg-[var(--primary)] px-5 py-3 text-sm font-black text-white"
      >
        Filter
      </button>

      <Link
        href={resetHref}
        className="rounded-xl border border-[var(--border)] px-5 py-3 text-sm font-black text-[var(--foreground)]"
      >
        Reset
      </Link>
    </form>
  );
}