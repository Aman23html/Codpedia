"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/current-user";
import { ReportStatus, Role } from "@prisma/client";

type ReviewAction = "APPROVE" | "REJECT";

export async function reviewMultipleReports(
  reportIds: string[],
  action: ReviewAction,
  remarks?: string
) {
  const currentUser = await getCurrentUser();

  if (!currentUser || currentUser.role !== Role.INCHARGE) {
    throw new Error("Unauthorized");
  }

  if (!reportIds || reportIds.length === 0) {
    throw new Error("No reports selected.");
  }

  const status =
    action === "APPROVE" ? ReportStatus.APPROVED : ReportStatus.REJECTED;

  await prisma.marketingReport.updateMany({
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
      remarks: action === "REJECT" ? remarks || "Rejected by incharge." : null,
    },
  });

  revalidatePath("/incharge");
  revalidatePath("/incharge/analytics");
  revalidatePath("/incharge/reports");
  revalidatePath("/employee/marketing");

  return {
    success: true,
    updatedReports: reportIds.length,
  };
}