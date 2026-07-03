"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ReportStatus } from "@prisma/client";
import { Loader2, Save } from "lucide-react";

import { updateReportStatus } from "@/actions/incharge/update-report-status";

interface Props {
  reportId: string;
  reportIds?: string[];
  currentStatus: ReportStatus;
  currentRemarks: string | null;
}

export function ReportRowActions({
  reportId,
  reportIds,
  currentStatus,
  currentRemarks,
}: Props) {
  const router = useRouter();

  const [status, setStatus] = useState<ReportStatus>(currentStatus);
  const [remarks, setRemarks] = useState(currentRemarks ?? "");
  const [isPending, startTransition] = useTransition();

  const ids =
    reportIds && reportIds.length > 0
      ? Array.from(new Set(reportIds.filter(Boolean)))
      : [reportId];

  const isMultiple = ids.length > 1;

  function handleSave() {
    startTransition(async () => {
      try {
        const result = await updateReportStatus(ids, status, remarks);

        if (!result.success) {
          alert(result.message || "Failed to update report");
          return;
        }

        router.refresh();
      } catch (error) {
        console.error(error);
        alert("Failed to update report");
      }
    });
  }

  return (
    <div className="flex min-w-[520px] items-center justify-end gap-2">
      <select
        value={status}
        onChange={(event) => setStatus(event.target.value as ReportStatus)}
        disabled={isPending}
        className="h-10 rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 text-xs font-black uppercase tracking-widest text-[var(--foreground)] outline-none transition focus:border-[var(--primary)] disabled:opacity-60"
      >
        {Object.values(ReportStatus).map((value) => (
          <option key={value} value={value}>
            {value}
          </option>
        ))}
      </select>

      <input
        value={remarks}
        onChange={(event) => setRemarks(event.target.value)}
        placeholder="Remarks"
        disabled={isPending}
        className="h-10 w-44 rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 text-xs font-semibold text-[var(--foreground)] outline-none transition placeholder:text-[var(--muted-foreground)] focus:border-[var(--primary)] disabled:opacity-60"
      />

      {isMultiple && (
        <span className="rounded-xl border border-[var(--primary)]/20 bg-[var(--primary)]/10 px-3 py-2 text-[10px] font-black uppercase tracking-widest text-[var(--primary)]">
          {ids.length} Reports
        </span>
      )}

      <button
        type="button"
        onClick={handleSave}
        disabled={isPending || ids.length === 0}
        className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-[var(--primary)] px-4 text-xs font-black uppercase tracking-widest text-white shadow-sm transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Save className="h-4 w-4" />
        )}

        {isPending ? "Saving" : isMultiple ? "Save All" : "Save"}
      </button>
    </div>
  );
}