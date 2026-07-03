"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/current-user";
import { ReportStatus, Role } from "@prisma/client";

export async function updateReportStatus(
  reportIdOrIds: string | string[],
  status: ReportStatus,
  remarks?: string
) {
  const currentUser = await getCurrentUser();

  if (!currentUser || currentUser.role !== Role.INCHARGE) {
    return {
      success: false,
      message: "Unauthorized",
    };
  }

  const reportIds = Array.isArray(reportIdOrIds)
    ? Array.from(new Set(reportIdOrIds.filter(Boolean)))
    : [reportIdOrIds];

  if (reportIds.length === 0) {
    return {
      success: false,
      message: "No reports selected.",
    };
  }

  const result = await prisma.marketingReport.updateMany({
    where: {
      id: {
        in: reportIds,
      },
      user: {
        departmentId: currentUser.departmentId,
      },
    },
    data: {
      status,
      remarks: remarks?.trim() || null,
      approvedById: currentUser.id,
    },
  });

  revalidatePath("/incharge");
  revalidatePath("/incharge/reports");
  revalidatePath("/incharge/analytics");
  revalidatePath("/employee/marketing");

  return {
    success: true,
    message: `${result.count} report updated successfully.`,
    updatedReports: result.count,
  };
}