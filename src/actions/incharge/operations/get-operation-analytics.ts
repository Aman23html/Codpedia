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

export type OperationAnalyticsFilters = {
  status?: string;
  from?: string;
  to?: string;
  search?: string;
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

export async function getInchargeOperationAnalytics(
  filters: OperationAnalyticsFilters = {}
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
    throw new Error("Only Operations incharge can access this analytics");
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

  const users = await User.find(userQuery)
    .select("_id fullName email phone username employeeCode")
    .lean();

  const userIds = users.map((user: any) => user._id);

  const reportQuery: any = {
    user: { $in: userIds },
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
      select: "fullName email phone username employeeCode",
    })
    .sort({ reportDate: 1 })
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

  const employeeMap = new Map<string, any>();

  for (const report of reports) {
    if (!report.user) continue;

    const userId = report.user._id.toString();

    if (!employeeMap.has(userId)) {
      employeeMap.set(userId, {
        employee: {
          id: userId,
          fullName: report.user.fullName,
          email: report.user.email,
          phone: report.user.phone,
          username: report.user.username,
          employeeCode: report.user.employeeCode,
        },
        totalReports: 0,
        queryGenerated: 0,
        dealsDone: 0,
        tutorAssigned: 0,
        dealsDoneAmount: 0,
        approved: 0,
        submitted: 0,
        rejected: 0,
        correctionRequired: 0,
      });
    }

    const row = employeeMap.get(userId);

    row.totalReports += 1;
    row.queryGenerated += report.queryGenerated ?? 0;
    row.dealsDone += report.dealsDone ?? 0;
    row.tutorAssigned += report.tutorAssigned ?? 0;
    row.dealsDoneAmount += report.dealsDoneAmount ?? 0;

    if (report.status === "VERIFIED") row.approved += 1;
    if (report.status === "SUBMITTED") row.submitted += 1;
    if (report.status === "REJECTED") row.rejected += 1;
    if (report.status === "CORRECTION_REQUIRED") row.correctionRequired += 1;
  }

  const employees = Array.from(employeeMap.values()).sort(
    (a, b) => b.dealsDoneAmount - a.dealsDoneAmount
  );

  const dailyMap = new Map<string, any>();

  for (const report of reports) {
    const reportDate = new Date(report.reportDate);
    const key = reportDate.toISOString().slice(0, 10);

    if (!dailyMap.has(key)) {
      dailyMap.set(key, {
        date: reportDate.toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
        }),
        fullDate: reportDate.toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
        queryGenerated: 0,
        dealsDone: 0,
        tutorAssigned: 0,
        dealsDoneAmount: 0,
      });
    }

    const day = dailyMap.get(key);

    day.queryGenerated += report.queryGenerated ?? 0;
    day.dealsDone += report.dealsDone ?? 0;
    day.tutorAssigned += report.tutorAssigned ?? 0;
    day.dealsDoneAmount += report.dealsDoneAmount ?? 0;
  }

  const chartData = Array.from(dailyMap.values());

  const approvalRate =
    totals.totalReports > 0
      ? Math.round((totals.approved / totals.totalReports) * 100)
      : 0;

  return {
    totals,
    employees,
    chartData,
    approvalRate,
  };
}