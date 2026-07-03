"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/current-user";
import { DepartmentType, Role } from "@prisma/client";

export async function getOperationReportDetails(reportId: string) {
  const currentUser = await getCurrentUser();

  if (!currentUser || currentUser.role !== Role.INCHARGE) {
    throw new Error("Unauthorized");
  }

  if (
    !currentUser.department ||
    currentUser.department.type !== DepartmentType.OPERATIONS
  ) {
    throw new Error("Only operations incharge can view this report.");
  }

  return prisma.employeeOperationReport.findFirst({
    where: {
      id: reportId,
      user: {
        departmentId: currentUser.departmentId,
        department: {
          type: DepartmentType.OPERATIONS,
        },
      },
    },

    include: {
      user: {
        select: {
          id: true,
          employeeCode: true,
          profileImageUrl: true,
          coverImageUrl: true,

          fullName: true,
          username: true,
          email: true,
          phone: true,
          status: true,
          createdAt: true,

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
  });
}