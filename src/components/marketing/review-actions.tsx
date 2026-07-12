"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";

import {
  reviewReport,
  reviewMultipleReports,
} from "@/actions/marketing/review-report";

export default function ReviewActions({
  reportId,
  reportIds,
  redirectTo = "/incharge",
}: {
  reportId?: string;
  reportIds?: string[];
  redirectTo?: string;
}) {
  const router = useRouter();

  const [remarks, setRemarks] = useState("");
  const [isPending, startTransition] = useTransition();

  const ids =
    reportIds && reportIds.length > 0
      ? reportIds
      : reportId
      ? [reportId]
      : [];

  const isMultiple = ids.length > 1;

  function approve() {
    if (ids.length === 0) return;

    startTransition(async () => {
      const result = isMultiple
        ? await reviewMultipleReports(ids, "APPROVE")
        : await reviewReport(ids[0], "APPROVE");

      if (!result.success) {
        alert(result.message || "Something went wrong");
        return;
      }

      router.push(redirectTo);
      router.refresh();
    });
  }

  function reject() {
    if (ids.length === 0) return;

    startTransition(async () => {
      const result = isMultiple
        ? await reviewMultipleReports(ids, "REJECT", remarks)
        : await reviewReport(ids[0], "REJECT", remarks);

      if (!result.success) {
        alert(result.message || "Something went wrong");
        return;
      }

      router.push(redirectTo);
      router.refresh();
    });
  }

  return (
    <div className="space-y-5">
      <textarea
        value={remarks}
        onChange={(event) => setRemarks(event.target.value)}
        placeholder="Remarks for rejection..."
        rows={4}
        className="w-full resize-none rounded-2xl border border-[var(--border)] bg-[var(--background)] p-4 text-sm font-semibold text-[var(--foreground)] outline-none transition placeholder:text-[var(--muted-foreground)] focus:border-[var(--primary)]"
      />

      {isMultiple && (
        <div className="rounded-2xl border border-[var(--primary)]/20 bg-[var(--primary)]/10 p-4">
          <p className="text-xs font-bold text-[var(--primary)]">
            This action will update all {ids.length} combined reports.
          </p>
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-2">
        <button
          type="button"
          onClick={approve}
          disabled={isPending || ids.length === 0}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-6 py-3 text-sm font-black text-white shadow-lg transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <CheckCircle2 className="h-4 w-4" />
          )}
          {isMultiple ? "Approve All" : "Approve"}
        </button>

        <button
          type="button"
          onClick={reject}
          disabled={isPending || ids.length === 0}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-red-600 px-6 py-3 text-sm font-black text-white shadow-lg transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <XCircle className="h-4 w-4" />
          )}
          {isMultiple ? "Reject All" : "Reject"}
        </button>
      </div>
    </div>
  );
}