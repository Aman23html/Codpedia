"use server";

import mongoose from "mongoose";

import { connectDB } from "@/lib/mongodb";
import { getCurrentUser } from "@/lib/current-user";
import { User } from "@/models/User";
import { EmployeeOperationReport } from "@/models/EmployeeOperationReport";
import { DepartmentType, Role } from "@/constants/enums";

export async function getOperationReportDetails(reportId: string) {
  await connectDB();

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

  if (!mongoose.Types.ObjectId.isValid(reportId)) {
    return null;
  }

  const departmentUsers = await User.find({
    department: currentUser.departmentId,
    role: Role.EMPLOYEE,
  })
    .select("_id")
    .lean();

  const userIds = departmentUsers.map((user: any) => user._id);

  const report = await EmployeeOperationReport.findOne({
    _id: reportId,
    user: {
      $in: userIds,
    },
  })
    .populate({
      path: "user",
      select:
        "employeeCode profileImageUrl coverImageUrl fullName username email phone status createdAt department",
      populate: {
        path: "department",
        select: "name type departmentCode shortCode",
      },
    })
    .lean();

  return report ? JSON.parse(JSON.stringify(report)) : null;
}