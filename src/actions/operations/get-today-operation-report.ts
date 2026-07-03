"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/current-user";
import { DepartmentType, Role } from "@prisma/client";

function getTodayRange() {
  const start = new Date();
  start.setHours(0, 0, 0, 0);

  const end = new Date(start);
  end.setDate(end.getDate() + 1);

  return { start, end };
}

export async function getTodayOperationReport() {
  const user = await getCurrentUser();

  if (!user || user.role !== Role.EMPLOYEE) {
    throw new Error("Unauthorized");
  }

  if (!user.department || user.department.type !== DepartmentType.OPERATIONS) {
    throw new Error("Only Operations employees can access this module");
  }

  const { start, end } = getTodayRange();

  return prisma.employeeOperationReport.findFirst({
    where: {
      userId: user.id,
      reportDate: {
        gte: start,
        lt: end,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}