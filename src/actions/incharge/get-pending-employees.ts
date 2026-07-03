"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/current-user";
import { Role, UserStatus } from "@prisma/client";

export async function getPendingEmployees() {
  const currentUser = await getCurrentUser();

  if (!currentUser || currentUser.role !== Role.INCHARGE) {
    throw new Error("Unauthorized");
  }

  return prisma.user.findMany({
    where: {
      departmentId: currentUser.departmentId,
      role: Role.EMPLOYEE,
      status: UserStatus.PENDING_APPROVAL,
    },

    include: {
      department: true,
      documents: true,
    },

    orderBy: {
      createdAt: "desc",
    },
  });
}