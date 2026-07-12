"use server";

import { connectDB } from "@/lib/mongodb";
import { getCurrentUser } from "@/lib/current-user";
import { User } from "@/models/User";
import { EmployeeOperationReport } from "@/models/EmployeeOperationReport";
import {
  DepartmentType,
  OperationReportStatus,
  Role,
} from "@/constants/enums";

export async function getPendingOperationReports() {
  await connectDB();

  const user = await getCurrentUser();

  if (!user || user.role !== Role.INCHARGE) {
    throw new Error("Unauthorized");
  }

  if (!user.department || user.department.type !== DepartmentType.OPERATIONS) {
    return [];
  }

  const departmentUsers = await User.find({
    department: user.departmentId,
  })
    .select("_id")
    .lean();

  const userIds = departmentUsers.map((item: any) => item._id);

  const reports = await EmployeeOperationReport.find({
    status: OperationReportStatus.SUBMITTED,
    user: {
      $in: userIds,
    },
  })
    .populate({
      path: "user",
      select: "fullName email phone department",
      populate: {
        path: "department",
        select: "name type departmentCode shortCode",
      },
    })
    .sort({
      submittedAt: -1,
    })
    .lean();

  return JSON.parse(JSON.stringify(reports));
}