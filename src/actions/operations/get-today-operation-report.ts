"use server";

import { connectDB } from "@/lib/mongodb";
import { getCurrentUser } from "@/lib/current-user";
import { EmployeeOperationReport } from "@/models/EmployeeOperationReport";
import { DepartmentType, Role } from "@/constants/enums";

function getTodayRange() {
  const start = new Date();
  start.setHours(0, 0, 0, 0);

  const end = new Date(start);
  end.setDate(end.getDate() + 1);

  return { start, end };
}

export async function getTodayOperationReport() {
  await connectDB();

  const user = await getCurrentUser();

  if (!user || user.role !== Role.EMPLOYEE) {
    throw new Error("Unauthorized");
  }

  if (!user.department || user.department.type !== DepartmentType.OPERATIONS) {
    throw new Error("Only Operations employees can access this module");
  }

  const { start, end } = getTodayRange();

  const report = await EmployeeOperationReport.findOne({
    user: user.id,
    reportDate: {
      $gte: start,
      $lt: end,
    },
  })
    .sort({
      createdAt: -1,
    })
    .lean();

  return JSON.parse(JSON.stringify(report));
}