"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";


import { saveOperationDraft } from "@/actions/operations/save-operation-draft";
import { submitOperationReport } from "@/actions/operations/submit-operation-report";
import { Lock, Save, Send } from "lucide-react";

type EmployeeOperationReport = {
  id?: string;
  _id?: string;
  queryGenerated: number;
  dealsDone: number;
  tutorAssigned: number;
  dealsDoneAmount: number;
  workNotes?: string | null;
  status: string;
};

export default function OperationsForm({
  report,
  canSubmitWork,
}: {
  report: EmployeeOperationReport | null;
  canSubmitWork: boolean;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState("");

  function handleDraft(formData: FormData) {
    if (!canSubmitWork) {
      setMessage("Please check in first. Work submission is locked.");
      return;
    }

    setMessage("");

    startTransition(async () => {
      try {
        const result = await saveOperationDraft(formData);
        setMessage(result.message);
        router.refresh();
      } catch (error: any) {
        setMessage(error.message || "Failed to save draft");
      }
    });
  }

  function handleSubmitReport(formData: FormData) {
    if (!canSubmitWork) {
      setMessage("Please check in first. Work submission is locked.");
      return;
    }

    setMessage("");

    startTransition(async () => {
      try {
        const result = await submitOperationReport(formData);
        setMessage(result.message);
        router.refresh();
      } catch (error: any) {
        setMessage(error.message || "Failed to submit report");
      }
    });
  }

  return (
    <section className="relative overflow-hidden rounded-[34px] border border-[var(--border)] bg-[var(--card)]/40 p-8 shadow-sm backdrop-blur-xl lg:p-10">
      <div className="pointer-events-none absolute right-[-100px] top-[-100px] h-72 w-72 rounded-full bg-[var(--primary)]/10 blur-[90px]" />

      <div className="relative z-10 mb-8 flex flex-col gap-4 border-b border-[var(--border)]/60 pb-6 md:flex-row md:items-start md:justify-between">
        <div>
          <h2 className="text-2xl font-black text-[var(--foreground)]">
            Today's Operations Work
          </h2>

          <p className="mt-2 text-sm font-medium leading-6 text-[var(--muted-foreground)]">
            Fill daily operations data during your active attendance window.
            You can update and resubmit while the window is active.
          </p>
        </div>

        <span
          className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-[10px] font-black uppercase tracking-widest ${
            canSubmitWork
              ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-500"
              : "border-red-500/20 bg-red-500/10 text-red-500"
          }`}
        >
          {canSubmitWork ? (
            <>
              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
              Editable
            </>
          ) : (
            <>
              <Lock className="h-3.5 w-3.5" />
              Locked
            </>
          )}
        </span>
      </div>

      {!canSubmitWork && (
        <div className="relative z-10 mb-6 rounded-2xl border border-red-500/20 bg-red-500/10 p-5">
          <div className="flex items-start gap-3">
            <Lock className="mt-0.5 h-5 w-5 text-red-500" />

            <div>
              <p className="text-sm font-black text-[var(--foreground)]">
                Check-in required before filling work
              </p>

              <p className="mt-1 text-xs font-semibold leading-5 text-[var(--muted-foreground)]">
                Operations submission is available only after check-in .
              </p>
            </div>
          </div>
        </div>
      )}

      <form className="relative z-10 space-y-6">
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          <Field
            label="Query Generated"
            name="queryGenerated"
            defaultValue={report?.queryGenerated ?? 0}
            disabled={!canSubmitWork}
          />

          <Field
            label="Deals Done"
            name="dealsDone"
            defaultValue={report?.dealsDone ?? 0}
            disabled={!canSubmitWork}
          />

          <Field
            label="Tutor Assigned"
            name="tutorAssigned"
            defaultValue={report?.tutorAssigned ?? 0}
            disabled={!canSubmitWork}
          />

          <Field
            label="Deals Done Amount"
            name="dealsDoneAmount"
            defaultValue={report?.dealsDoneAmount ?? 0}
            disabled={!canSubmitWork}
          />
        </div>

        <div>
          <label className="mb-2 block text-xs font-black uppercase tracking-widest text-[var(--muted-foreground)]">
            Work Notes
          </label>

          <textarea
            name="workNotes"
            defaultValue={report?.workNotes ?? ""}
            disabled={!canSubmitWork}
            rows={5}
            placeholder={
              canSubmitWork
                ? "Add optional notes about today's operations work..."
                : "Check in first to unlock work notes..."
            }
            className="w-full rounded-2xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-sm outline-none transition focus:border-[var(--primary)] disabled:cursor-not-allowed disabled:opacity-60"
          />
        </div>

        {report?.status && report.status !== "DRAFT" && (
          <div className="rounded-xl border border-amber-500/20 bg-amber-500/10 px-4 py-3 text-sm font-semibold text-amber-500">
            Current status is {report.status.replaceAll("_", " ")}. Updating
            and submitting again will send it back for Incharge review.
          </div>
        )}

        {message && (
          <p className="rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-sm font-semibold text-[var(--foreground)]">
            {message}
          </p>
        )}

        <div className="flex flex-wrap justify-end gap-3 border-t border-[var(--border)] pt-6">
          <button
            type="submit"
            disabled={isPending || !canSubmitWork}
            formAction={handleDraft}
            className="inline-flex items-center gap-2 rounded-xl border border-[var(--border)] px-5 py-3 text-sm font-bold text-[var(--foreground)] transition hover:bg-[var(--background)] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Save className="h-4 w-4" />
            {isPending ? "Saving..." : "Save / Update Draft"}
          </button>

          <button
            type="submit"
            disabled={isPending || !canSubmitWork}
            formAction={handleSubmitReport}
            className="inline-flex items-center gap-2 rounded-xl bg-[var(--primary)] px-5 py-3 text-sm font-bold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Send className="h-4 w-4" />
            {isPending
              ? "Submitting..."
              : report
                ? "Update & Resubmit"
                : "Submit Report"}
          </button>
        </div>
      </form>
    </section>
  );
}

function Field({
  label,
  name,
  defaultValue,
  disabled,
}: {
  label: string;
  name: string;
  defaultValue: number;
  disabled: boolean;
}) {
  return (
    <div>
      <label className="mb-2 block text-xs font-black uppercase tracking-widest text-[var(--muted-foreground)]">
        {label}
      </label>

      <input
        type="number"
        min={0}
        name={name}
        defaultValue={defaultValue}
        disabled={disabled}
        placeholder="0"
        className="w-full rounded-2xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-sm outline-none transition focus:border-[var(--primary)] disabled:cursor-not-allowed disabled:opacity-60"
      />
    </div>
  );
}