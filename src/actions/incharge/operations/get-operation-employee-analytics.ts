"use server";

import mongoose from "mongoose";

import { connectDB } from "@/lib/mongodb";
import { getCurrentUser } from "@/lib/current-user";
import { User } from "@/models/User";
import { EmployeeOperationReport } from "@/models/EmployeeOperationReport";

import {
  DepartmentType,
  OperationReportStatus,
  Role,
} from "@/constants/enums";

export type OperationEmployeeAnalyticsFilters = {
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

export async function getOperationEmployeeAnalytics(
  employeeId: string,
  filters: OperationEmployeeAnalyticsFilters = {}
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

  if (!mongoose.Types.ObjectId.isValid(employeeId)) {
    return null;
  }

  const employee: any = await User.findOne({
    _id: employeeId,
    department: currentUser.departmentId,
    role: Role.EMPLOYEE,
  })
    .populate({
      path: "department",
      select: "name type departmentCode shortCode",
    })
    .select("fullName email phone username employeeCode createdAt department")
    .lean();

  if (!employee) {
    return null;
  }

  const reportQuery: any = {
    user: employee._id,
  };

  const dateFilter = getDateFilter(filters.from, filters.to);

  if (dateFilter) {
    reportQuery.reportDate = dateFilter;
  }

  if (
    filters.status &&
    filters.status !== "ALL" &&
    Object.values(OperationReportStatus).includes(filters.status as any)
  ) {
    reportQuery.status = filters.status;
  }

  const reports: any[] = await EmployeeOperationReport.find(reportQuery)
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

  const chartData = reports.map((report) => {
    const reportDate = new Date(report.reportDate);

    return {
      date: reportDate.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
      }),
      fullDate: reportDate.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      queryGenerated: report.queryGenerated ?? 0,
      dealsDone: report.dealsDone ?? 0,
      tutorAssigned: report.tutorAssigned ?? 0,
      dealsDoneAmount: report.dealsDoneAmount ?? 0,
    };
  });

  const approvalRate =
    totals.totalReports > 0
      ? Math.round((totals.approved / totals.totalReports) * 100)
      : 0;

  const average =
    totals.totalReports > 0
      ? {
          queryGenerated: Math.round(
            totals.queryGenerated / totals.totalReports
          ),
          dealsDone: Math.round(totals.dealsDone / totals.totalReports),
          tutorAssigned: Math.round(
            totals.tutorAssigned / totals.totalReports
          ),
          dealsDoneAmount: Math.round(
            totals.dealsDoneAmount / totals.totalReports
          ),
        }
      : {
          queryGenerated: 0,
          dealsDone: 0,
          tutorAssigned: 0,
          dealsDoneAmount: 0,
        };

  return {
    employee: JSON.parse(JSON.stringify(employee)),
    reports: JSON.parse(JSON.stringify(reports)),
    totals,
    chartData,
    approvalRate,
    average,
  };
}