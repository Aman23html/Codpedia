"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/current-user";
import { Role, UserStatus } from "@prisma/client";

export async function approveEmployee(
  employeeId: string
) {
  const currentUser = await getCurrentUser();

  if (!currentUser || currentUser.role !== Role.INCHARGE) {
    throw new Error("Unauthorized");
  }

  const employee = await prisma.user.findUnique({
    where: {
      id: employeeId,
    },
  });

  if (!employee) {
    throw new Error("Employee not found");
  }

  if (
    employee.departmentId !== currentUser.departmentId
  ) {
    throw new Error("Forbidden");
  }

  await prisma.user.update({
    where: {
      id: employeeId,
    },

    data: {
      status: UserStatus.ACTIVE,
      approvedById: currentUser.id,
    },
  });

  return {
    success: true,
  };
}