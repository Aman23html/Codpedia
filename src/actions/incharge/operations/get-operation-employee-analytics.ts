"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/current-user";
import { DepartmentType, OperationReportStatus, Role } from "@prisma/client";

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
    filter.gte = start;
  }

  if (to) {
    const end = new Date(to);
    end.setHours(23, 59, 59, 999);
    filter.lte = end;
  }

  return filter;
}

export async function getOperationEmployeeAnalytics(
  employeeId: string,
  filters: OperationEmployeeAnalyticsFilters = {}
) {
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

  const employee = await prisma.user.findFirst({
    where: {
      id: employeeId,
      departmentId: currentUser.departmentId,
      role: Role.EMPLOYEE,
    },
    select: {
      id: true,
      fullName: true,
      email: true,
      phone: true,
      username: true,
      createdAt: true,
      department: {
        select: {
          name: true,
          type: true,
        },
      },
    },
  });

  if (!employee) {
    return null;
  }

  const where: any = {
    userId: employeeId,
  };

  const dateFilter = getDateFilter(filters.from, filters.to);

  if (dateFilter) {
    where.reportDate = dateFilter;
  }

  if (
    filters.status &&
    filters.status !== "ALL" &&
    Object.values(OperationReportStatus).includes(
      filters.status as OperationReportStatus
    )
  ) {
    where.status = filters.status;
  }

  const reports = await prisma.employeeOperationReport.findMany({
    where,
    orderBy: {
      reportDate: "asc",
    },
  });

  const totals = reports.reduce(
    (acc, report) => {
      acc.totalReports += 1;
      acc.queryGenerated += report.queryGenerated;
      acc.dealsDone += report.dealsDone;
      acc.tutorAssigned += report.tutorAssigned;
      acc.dealsDoneAmount += report.dealsDoneAmount;

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

  const chartData = reports.map((report) => ({
    date: report.reportDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
    }),
    fullDate: report.reportDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }),
    queryGenerated: report.queryGenerated,
    dealsDone: report.dealsDone,
    tutorAssigned: report.tutorAssigned,
    dealsDoneAmount: report.dealsDoneAmount,
  }));

  const approvalRate =
    totals.totalReports > 0
      ? Math.round((totals.approved / totals.totalReports) * 100)
      : 0;

  const average =
    totals.totalReports > 0
      ? {
          queryGenerated: Math.round(totals.queryGenerated / totals.totalReports),
          dealsDone: Math.round(totals.dealsDone / totals.totalReports),
          tutorAssigned: Math.round(totals.tutorAssigned / totals.totalReports),
          dealsDoneAmount: Math.round(totals.dealsDoneAmount / totals.totalReports),
        }
      : {
          queryGenerated: 0,
          dealsDone: 0,
          tutorAssigned: 0,
          dealsDoneAmount: 0,
        };

  return {
    employee,
    reports,
    totals,
    chartData,
    approvalRate,
    average,
  };
}