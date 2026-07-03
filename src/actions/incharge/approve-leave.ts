"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/current-user";
import {
  LeaveStatus,
  Role,
} from "@prisma/client";

export async function approveLeave(
  leaveId: string
) {
  const currentUser =
    await getCurrentUser();

  if (
    !currentUser ||
    currentUser.role !== Role.INCHARGE
  ) {
    throw new Error("Unauthorized");
  }

  await prisma.leave.update({
    where: {
      id: leaveId,
    },

    data: {
      status: LeaveStatus.APPROVED,
      approvedById: currentUser.id,
    },
  });

  return {
    success: true,
  };
}