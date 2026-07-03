"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/current-user";
import {
  LeaveStatus,
  Role,
} from "@prisma/client";

export async function getPendingLeaves() {
  const currentUser =
    await getCurrentUser();

  if (
    !currentUser ||
    currentUser.role !== Role.INCHARGE
  ) {
    throw new Error("Unauthorized");
  }

  return prisma.leave.findMany({
    where: {
      status: LeaveStatus.PENDING,

      user: {
        departmentId:
          currentUser.departmentId,
      },
    },

    include: {
      user: true,
    },

    orderBy: {
      createdAt: "desc",
    },
  });
}