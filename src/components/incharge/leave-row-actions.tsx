"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";

import { approveLeave } from "@/actions/incharge/approve-leave";
import { rejectLeave } from "@/actions/incharge/reject-leave";

export function LeaveRowActions({
  leaveId,
}: {
  leaveId: string;
}) {
  const router = useRouter();

  const [isPending, startTransition] =
    useTransition();

  function handleApprove() {
    startTransition(async () => {
      await approveLeave(leaveId);
      router.refresh();
    });
  }

  function handleReject() {
    startTransition(async () => {
      await rejectLeave(leaveId);
      router.refresh();
    });
  }

  return (
    <div className="flex gap-2">
      <button
        disabled={isPending}
        onClick={handleApprove}
        className="rounded-lg bg-green-600 px-3 py-2 text-white"
      >
        Approve
      </button>

      <button
        disabled={isPending}
        onClick={handleReject}
        className="rounded-lg bg-red-600 px-3 py-2 text-white"
      >
        Reject
      </button>
    </div>
  );
}