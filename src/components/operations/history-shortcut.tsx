import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function HistoryShortcut() {
  return (
    <section className="rounded-[28px] border border-[var(--border)] bg-[var(--card)]/60 p-6">
      <h2 className="mb-3 text-lg font-black text-[var(--foreground)]">
        Previous Reports
      </h2>

      <p className="mb-5 text-sm text-[var(--muted-foreground)]">
        View locked historical operations submissions.
      </p>

      <Link
        href="/employee/operations/history"
        className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-bold text-white hover:bg-blue-700"
      >
        View History
        <ArrowRight className="h-4 w-4" />
      </Link>
    </section>
  );
}