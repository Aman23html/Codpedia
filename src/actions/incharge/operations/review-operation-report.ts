"use server";

import mongoose from "mongoose";
import { revalidatePath } from "next/cache";

import { connectDB } from "@/lib/mongodb";
import { getCurrentUser } from "@/lib/current-user";
import { User } from "@/models/User";
import { EmployeeOperationReport } from "@/models/EmployeeOperationReport";

import {
  DepartmentType,
  OperationReportStatus,
  Role,
} from "@/constants/enums";

export async function reviewOperationReport(formData: FormData) {
  await connectDB();

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

  if (!mongoose.Types.ObjectId.isValid(reportId)) {
    throw new Error("Invalid report ID");
  }

  let status: string;

  if (action === "APPROVE") {
    status = OperationReportStatus.VERIFIED;
  } else if (action === "REJECT") {
    status = OperationReportStatus.REJECTED;
  } else if (action === "CORRECTION_REQUIRED") {
    status = OperationReportStatus.CORRECTION_REQUIRED;
  } else {
    throw new Error("Invalid review action");
  }

  const departmentUsers = await User.find({
    department: currentUser.departmentId,
    role: Role.EMPLOYEE,
  })
    .select("_id")
    .lean();

  const userIds = departmentUsers.map((user: any) => user._id);

  const report: any = await EmployeeOperationReport.findOne({
    _id: reportId,
    user: {
      $in: userIds,
    },
  }).lean();

  if (!report) {
    throw new Error("Report not found");
  }

  if (report.status === OperationReportStatus.DRAFT) {
    throw new Error("Draft report cannot be reviewed");
  }

  await EmployeeOperationReport.findByIdAndUpdate(reportId, {
    status,
    reviewRemarks: remarks || null,
    reviewedBy: currentUser.id,
    reviewedAt: new Date(),
  });

  revalidatePath("/incharge/operations/reports");
  revalidatePath(`/incharge/operations/reports/${reportId}`);

  return {
    success: true,
    message: "Report reviewed successfully",
  };
}