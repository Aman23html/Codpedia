"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";

import { approveEmployee } from "@/actions/incharge/approve-employee";
import { rejectEmployee } from "@/actions/incharge/reject-employee";

export function PendingEmployeeActions({
  employeeId,
}: {
  employeeId: string;
}) {
  const router = useRouter();

  const [isPending, startTransition] =
    useTransition();

  function handleApprove() {
    startTransition(async () => {
      await approveEmployee(employeeId);
      router.refresh();
    });
  }

  function handleReject() {
    startTransition(async () => {
      await rejectEmployee(employeeId);
      router.refresh();
    });
  }

  return (
    <div className="flex gap-2">
      <button
        disabled={isPending}
        onClick={handleApprove}
        className="rounded-lg bg-green-600 px-3 py-2 text-sm text-white"
      >
        Approve
      </button>

      <button
        disabled={isPending}
        onClick={handleReject}
        className="rounded-lg bg-red-600 px-3 py-2 text-sm text-white"
      >
        Reject
      </button>
    </div>
  );
}