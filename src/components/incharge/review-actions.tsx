"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  CheckCircle2,
  XCircle,
  Loader2,
  MessageSquareText,
  ShieldCheck,
} from "lucide-react";

import { reviewReport } from "@/actions/marketing/review-report";

export default function ReviewActions({ reportId }: { reportId: string }) {
  const router = useRouter();

  const [remarks, setRemarks] = useState("");
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  function approve() {
    setMessage("");

    startTransition(async () => {
      try {
        await reviewReport(reportId, "APPROVE");

        setMessage("Report approved successfully.");
        router.push("/incharge");
        router.refresh();
      } catch (error: any) {
        setMessage(error.message || "Failed to approve report.");
      }
    });
  }

  function reject() {
    setMessage("");

    startTransition(async () => {
      try {
        await reviewReport(reportId, "REJECT", remarks);

        setMessage("Report rejected successfully.");
        router.push("/incharge");
        router.refresh();
      } catch (error: any) {
        setMessage(error.message || "Failed to reject report.");
      }
    });
  }

  return (
    <section className="mt-8 rounded-[30px] border border-[var(--border)] bg-[var(--card)]/40 p-7 shadow-sm backdrop-blur-xl">
      <div className="mb-6 flex items-start gap-4 border-b border-[var(--border)]/60 pb-5">
        <div className="rounded-2xl border border-[var(--primary)]/20 bg-[var(--primary)]/10 p-3 text-[var(--primary)]">
          <ShieldCheck className="h-5 w-5" />
        </div>

        <div>
          <h2 className="text-xl font-black text-[var(--foreground)]">
            Incharge Review Panel
          </h2>

          <p className="mt-1 text-sm font-medium leading-6 text-[var(--muted-foreground)]">
            Approve clean reports or reject with remarks when correction is
            required.
          </p>
        </div>
      </div>

      <div className="mb-5">
        <label className="mb-2 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[var(--muted-foreground)]">
          <MessageSquareText className="h-3.5 w-3.5" />
          Review Remarks
        </label>

        <textarea
          value={remarks}
          onChange={(event) => setRemarks(event.target.value)}
          placeholder="Add remarks here. Required mainly when rejecting..."
          rows={5}
          className="w-full rounded-2xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-sm font-semibold text-[var(--foreground)] outline-none transition focus:border-[var(--primary)]"
        />
      </div>

      {message && (
        <p className="mb-5 rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-sm font-semibold text-[var(--foreground)]">
          {message}
        </p>
      )}

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
        <button
          onClick={reject}
          disabled={isPending}
          className="inline-flex items-center justify-center gap-2 rounded-2xl border border-red-500/20 bg-red-500/10 px-6 py-3 text-sm font-black text-red-500 transition hover:bg-red-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <XCircle className="h-4 w-4" />
          )}
          Reject Report
        </button>

        <button
          onClick={approve}
          disabled={isPending}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-6 py-3 text-sm font-black text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <CheckCircle2 className="h-4 w-4" />
          )}
          Approve Report
        </button>
      </div>
    </section>
  );
}