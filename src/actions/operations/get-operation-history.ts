"use server";

import { connectDB } from "@/lib/mongodb";
import { getCurrentUser } from "@/lib/current-user";
import { EmployeeOperationReport } from "@/models/EmployeeOperationReport";
import { parseDateOnlyIST, startOfDayIST } from "@/lib/format-date";
import {
  DepartmentType,
  OperationReportStatus,
  Role,
} from "@/constants/enums";

type Filter = {
  status?: string;
  date?: string;
};

export async function getOperationHistory(filter: Filter = {}) {
  await connectDB();

  const user = await getCurrentUser();

  if (!user || user.role !== Role.EMPLOYEE) {
    throw new Error("Unauthorized");
  }

  if (!user.department || user.department.type !== DepartmentType.OPERATIONS) {
    throw new Error("Only Operations employees can access this module");
  }

  const query: any = {
    user: user.id,
  };

  if (
    filter.status &&
    filter.status !== "ALL" &&
    Object.values(OperationReportStatus).includes(filter.status as any)
  ) {
    query.status = filter.status;
  }

  if (filter.date) {
    const start = startOfDayIST(parseDateOnlyIST(filter.date));
    const end = new Date(start.getTime() + 24 * 60 * 60 * 1000);

    query.reportDate = {
      $gte: start,
      $lt: end,
    };
  }

  const reports = await EmployeeOperationReport.find(query)
    .sort({
      reportDate: -1,
    })
    .limit(30)
    .lean();

  return JSON.parse(JSON.stringify(reports));
}