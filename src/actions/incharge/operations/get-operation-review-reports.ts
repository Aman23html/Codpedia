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

export type OperationReviewFilters = {
  search?: string;
  status?: string;
  from?: string;
  to?: string;
};

function getDateFilter(from?: string, to?: string) {
  if (!from && !to) return undefined;

  const filter: any = {};

  if (from) {
    const start = new Date(from);
    start.setHours(0, 0, 0, 0);
    filter.$gte = start;
  }

  if (to) {
    const end = new Date(to);
    end.setHours(23, 59, 59, 999);
    filter.$lte = end;
  }

  return filter;
}

export async function getOperationReviewReports(
  filters: OperationReviewFilters = {}
) {
  await connectDB();

  const currentUser = await getCurrentUser();

  if (!currentUser || currentUser.role !== Role.INCHARGE) {
    throw new Error("Unauthorized");
  }

  if (
    !currentUser.department ||
    currentUser.department.type !== DepartmentType.OPERATIONS
  ) {
    throw new Error("Only Operations incharge can access this page");
  }

  const userQuery: any = {
    department: currentUser.departmentId,
    role: Role.EMPLOYEE,
  };

  if (filters.search) {
    userQuery.$or = [
      { fullName: { $regex: filters.search, $options: "i" } },
      { email: { $regex: filters.search, $options: "i" } },
      { phone: { $regex: filters.search, $options: "i" } },
      { username: { $regex: filters.search, $options: "i" } },
      { employeeCode: { $regex: filters.search, $options: "i" } },
    ];
  }

  const users = await User.find(userQuery).select("_id").lean();
  const userIds = users.map((user: any) => user._id);

  const reportQuery: any = {
    user: {
      $in: userIds,
    },
  };

  if (
    filters.status &&
    filters.status !== "ALL" &&
    Object.values(OperationReportStatus).includes(filters.status as any)
  ) {
    reportQuery.status = filters.status;
  }

  const dateFilter = getDateFilter(filters.from, filters.to);

  if (dateFilter) {
    reportQuery.reportDate = dateFilter;
  }

  const reports: any[] = await EmployeeOperationReport.find(reportQuery)
    .populate({
      path: "user",
      select: "fullName email phone username employeeCode department",
      populate: {
        path: "department",
        select: "name type departmentCode shortCode",
      },
    })
    .sort({ reportDate: -1 })
    .lean();

  const totals = reports.reduce(
    (acc, report) => {
      acc.totalReports += 1;
      acc.queryGenerated += report.queryGenerated ?? 0;
      acc.dealsDone += report.dealsDone ?? 0;
      acc.tutorAssigned += report.tutorAssigned ?? 0;
      acc.dealsDoneAmount += report.dealsDoneAmount ?? 0;

      if (report.status === "DRAFT") acc.draft += 1;
      if (report.status === "SUBMITTED") acc.submitted += 1;
      if (report.status === "VERIFIED") acc.approved += 1;
      if (report.status === "REJECTED") acc.rejected += 1;
      if (report.status === "CORRECTION_REQUIRED") acc.correctionRequired += 1;

      return acc;
    },
    {
      totalReports: 0,
      queryGenerated: 0,
      dealsDone: 0,
      tutorAssigned: 0,
      dealsDoneAmount: 0,
      draft: 0,
      submitted: 0,
      approved: 0,
      rejected: 0,
      correctionRequired: 0,
    }
  );

  return {
    reports: JSON.parse(JSON.stringify(reports)),
    totals,
  };
}