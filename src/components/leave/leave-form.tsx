"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { createLeave } from "@/actions/leave/create-leave";

export function LeaveForm() {
  const router = useRouter();

  const [fromDate, setFromDate] =
    useState("");

  const [toDate, setToDate] =
    useState("");

  const [reason, setReason] =
    useState("");

  const [isPending, startTransition] =
    useTransition();

  function handleSubmit(
    e: React.FormEvent
  ) {
    e.preventDefault();

    startTransition(async () => {
      await createLeave(
        fromDate,
        toDate,
        reason
      );

      setFromDate("");
      setToDate("");
      setReason("");

      router.refresh();
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-2xl border border-white/10 bg-slate-900 p-6"
    >
      <input
        type="date"
        value={fromDate}
        onChange={(e) =>
          setFromDate(e.target.value)
        }
        className="w-full rounded-lg bg-slate-800 p-3 text-white"
        required
      />

      <input
        type="date"
        value={toDate}
        onChange={(e) =>
          setToDate(e.target.value)
        }
        className="w-full rounded-lg bg-slate-800 p-3 text-white"
        required
      />

      <textarea
        value={reason}
        onChange={(e) =>
          setReason(e.target.value)
        }
        className="w-full rounded-lg bg-slate-800 p-3 text-white"
        placeholder="Reason"
        required
      />

      <button
        disabled={isPending}
        className="rounded-lg bg-blue-600 px-4 py-2 text-white"
      >
        Submit Leave Request
      </button>
    </form>
  );
}