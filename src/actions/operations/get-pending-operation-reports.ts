"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/current-user";
import { DepartmentType, OperationReportStatus, Role } from "@prisma/client";

export async function getPendingOperationReports() {
  const user = await getCurrentUser();

  if (!user || user.role !== Role.INCHARGE) {
    throw new Error("Unauthorized");
  }

  if (!user.department || user.department.type !== DepartmentType.OPERATIONS) {
    return [];
  }

  return prisma.employeeOperationReport.findMany({
    where: {
      status: OperationReportStatus.SUBMITTED,
      user: {
        departmentId: user.departmentId,
      },
    },
    include: {
      user: {
        select: {
          id: true,
          fullName: true,
          email: true,
          phone: true,
          department: {
            select: {
              id: true,
              name: true,
              type: true,
            },
          },
        },
      },
    },
    orderBy: {
      submittedAt: "desc",
    },
  });
}