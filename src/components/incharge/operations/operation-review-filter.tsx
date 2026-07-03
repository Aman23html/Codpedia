import Link from "next/link";

export default function OperationReviewFilter({
  search,
  status,
  from,
  to,
}: {
  search?: string;
  status?: string;
  from?: string;
  to?: string;
}) {
  return (
    <section className="rounded-[28px] border border-[var(--border)] bg-[var(--card)]/40 p-6 shadow-sm backdrop-blur-xl">
      <form className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
        <input
          name="search"
          defaultValue={search ?? ""}
          placeholder="Search employee name, email, phone, ID..."
          className="rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-sm font-semibold outline-none xl:col-span-2"
        />

        <select
          name="status"
          defaultValue={status ?? "SUBMITTED"}
          className="rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-sm font-semibold outline-none"
        >
          <option value="ALL">All Status</option>
          <option value="SUBMITTED">Pending Review</option>
          <option value="APPROVED">Approved</option>
          <option value="REJECTED">Rejected</option>
          <option value="CORRECTION_REQUIRED">Correction Required</option>
          <option value="DRAFT">Draft</option>
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

        <div className="flex gap-3">
          <button
            type="submit"
            className="rounded-xl bg-[var(--primary)] px-6 py-3 text-sm font-black text-white"
          >
            Apply
          </button>

          <Link
            href="/incharge/operations/reports"
            className="rounded-xl border border-[var(--border)] px-6 py-3 text-sm font-black text-[var(--foreground)]"
          >
            Reset
          </Link>
        </div>
      </form>
    </section>
  );
}