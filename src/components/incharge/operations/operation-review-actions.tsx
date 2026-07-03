"use client";

import { useState, useTransition } from "react";
import { CheckCircle2, RotateCcw, XCircle } from "lucide-react";

import { reviewOperationReport } from "@/actions/incharge/operations/review-operation-report";

export default function OperationReviewActions({
  reportId,
  status,
}: {
  reportId: string;
  status: string;
}) {
  const [remarks, setRemarks] = useState("");
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  const canReview = status === "SUBMITTED" || status === "CORRECTION_REQUIRED";

  function handleAction(action: string) {
    setMessage("");

    const formData = new FormData();
    formData.set("reportId", reportId);
    formData.set("action", action);
    formData.set("remarks", remarks);

    startTransition(async () => {
      try {
        const result = await reviewOperationReport(formData);
        setMessage(result.message);
      } catch (error: any) {
        setMessage(error.message || "Failed to review report");
      }
    });
  }

  if (!canReview) {
    return (
      <span className="rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-2 text-xs font-black text-[var(--muted-foreground)]">
        Reviewed
      </span>
    );
  }

  return (
    <div className="min-w-[360px] space-y-3">
      <textarea
        value={remarks}
        onChange={(event) => setRemarks(event.target.value)}
        rows={2}
        placeholder="Add review remarks..."
        className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-xs font-semibold outline-none focus:border-[var(--primary)]"
      />

      {message && (
        <p className="rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-xs font-bold text-[var(--foreground)]">
          {message}
        </p>
      )}

      <div className="flex flex-wrap gap-2">
        <button
          disabled={isPending}
          onClick={() => handleAction("APPROVE")}
          className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-2 text-xs font-black text-white disabled:opacity-60"
        >
          <CheckCircle2 className="h-3.5 w-3.5" />
          Approve
        </button>

        <button
          disabled={isPending}
          onClick={() => handleAction("CORRECTION_REQUIRED")}
          className="inline-flex items-center gap-1.5 rounded-lg bg-amber-500 px-3 py-2 text-xs font-black text-white disabled:opacity-60"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Correction
        </button>

        <button
          disabled={isPending}
          onClick={() => handleAction("REJECT")}
          className="inline-flex items-center gap-1.5 rounded-lg bg-red-600 px-3 py-2 text-xs font-black text-white disabled:opacity-60"
        >
          <XCircle className="h-3.5 w-3.5" />
          Reject
        </button>
      </div>
    </div>
  );
}