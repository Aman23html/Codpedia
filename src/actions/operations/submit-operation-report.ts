"use server";

import { revalidatePath } from "next/cache";
import { assertActiveAttendanceWindow } from "@/lib/operations/operation-attendance-guard";

import { connectDB } from "@/lib/mongodb";
import { getCurrentUser } from "@/lib/current-user";
import { EmployeeOperationReport } from "@/models/EmployeeOperationReport";

import {
  DepartmentType,
  OperationReportStatus,
  Role,
} from "@/constants/enums";

function getTodayRange() {
  const start = new Date();
  start.setHours(0, 0, 0, 0);

  const end = new Date(start);
  end.setDate(end.getDate() + 1);

  return { start, end };
}

function toNumber(value: FormDataEntryValue | null) {
  const number = Number(value);
  return Number.isFinite(number) && number >= 0 ? number : 0;
}

export async function submitOperationReport(formData: FormData) {
  await connectDB();

  const user = await getCurrentUser();

  if (!user || user.role !== Role.EMPLOYEE) {
    throw new Error("Unauthorized");
  }

  if (!user.department || user.department.type !== DepartmentType.OPERATIONS) {
    throw new Error("Only Operations employees can submit operations reports");
  }

  await assertActiveAttendanceWindow(user.id);

  const { start, end } = getTodayRange();

  const queryGenerated = toNumber(formData.get("queryGenerated"));
  const dealsDone = toNumber(formData.get("dealsDone"));
  const tutorAssigned = toNumber(formData.get("tutorAssigned"));
  const dealsDoneAmount = toNumber(formData.get("dealsDoneAmount"));
  const workNotes = String(formData.get("workNotes") || "").trim();

  const existingReport = await EmployeeOperationReport.findOne({
    user: user.id,
    reportDate: {
      $gte: start,
      $lt: end,
    },
  });

  if (existingReport) {
    await EmployeeOperationReport.findByIdAndUpdate(
      existingReport._id,
      {
        queryGenerated,
        dealsDone,
        tutorAssigned,
        dealsDoneAmount,
        workNotes,

        status: OperationReportStatus.SUBMITTED,
        submittedAt: new Date(),
        lockedAt: null,

        reviewRemarks: null,
        reviewedBy: null,
        reviewedAt: null,
      },
      {
        returnDocument: "after",
      }
    );
  } else {
    await EmployeeOperationReport.create({
      user: user.id,
      reportDate: start,
      queryGenerated,
      dealsDone,
      tutorAssigned,
      dealsDoneAmount,
      workNotes,
      status: OperationReportStatus.SUBMITTED,
      submittedAt: new Date(),
    });
  }

  revalidatePath("/employee/operations");
  revalidatePath("/incharge/operations/reports");
  revalidatePath("/incharge/operations/analytics");

  return {
    success: true,
    message: "Report submitted again for review",
  };
}