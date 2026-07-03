"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/current-user";
import { DepartmentType, OperationReportStatus, Role } from "@prisma/client";

export async function reviewOperationReport(formData: FormData) {
  const currentUser = await getCurrentUser();

  if (!currentUser || currentUser.role !== Role.INCHARGE) {
    throw new Error("Unauthorized");
  }

  if (
    !currentUser.department ||
    currentUser.department.type !== DepartmentType.OPERATIONS
  ) {
    throw new Error("Only Operations incharge can review this report");
  }

  const reportId = String(formData.get("reportId") || "");
  const action = String(formData.get("action") || "");
  const remarks = String(formData.get("remarks") || "").trim();

  if (!reportId) {
    throw new Error("Report ID is required");
  }

  let status: OperationReportStatus;

  if (action === "APPROVE") {
    status = OperationReportStatus.VERIFIED;
  } else if (action === "REJECT") {
    status = OperationReportStatus.REJECTED;
  } else if (action === "CORRECTION_REQUIRED") {
    status = OperationReportStatus.CORRECTION_REQUIRED;
  } else {
    throw new Error("Invalid review action");
  }

  const report = await prisma.employeeOperationReport.findFirst({
    where: {
      id: reportId,
      user: {
        departmentId: currentUser.departmentId,
        role: Role.EMPLOYEE,
      },
    },
  });

  if (!report) {
    throw new Error("Report not found");
  }

  if (report.status === OperationReportStatus.DRAFT) {
    throw new Error("Draft report cannot be reviewed");
  }

  await prisma.employeeOperationReport.update({
    where: {
      id: reportId,
    },
    data: {
      status,
      reviewRemarks: remarks || null,
      reviewedById: currentUser.id,
      reviewedAt: new Date(),
    },
  });

  revalidatePath("/incharge/operations/reports");
  revalidatePath(`/incharge/operations/reports/${reportId}`);

  return {
    success: true,
    message: "Report reviewed successfully",
  };
}