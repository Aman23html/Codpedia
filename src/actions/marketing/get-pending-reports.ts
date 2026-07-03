"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/current-user";
import { ReportStatus, Role } from "@prisma/client";

export async function getPendingReports() {
  const currentUser = await getCurrentUser();

  if (!currentUser || currentUser.role !== Role.INCHARGE) {
    throw new Error("Unauthorized");
  }

  return prisma.marketingReport.findMany({
    where: {
      status: ReportStatus.PENDING,

      user: {
        departmentId: currentUser.departmentId,
      },
    },

    include: {
      user: {
        include: {
          department: true,
        },
      },
    },

    orderBy: {
      createdAt: "desc",
    },
  });
}