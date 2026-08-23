"use server";

import { connectDB } from "@/lib/mongodb";
import { getCurrentUser } from "@/lib/current-user";
import { EmployeeOperationReport } from "@/models/EmployeeOperationReport";
import { startOfDayIST } from "@/lib/format-date";
import { DepartmentType, Role } from "@/constants/enums";

function getTodayRange() {
  const start = startOfDayIST();
  const end = new Date(start.getTime() + 24 * 60 * 60 * 1000);

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