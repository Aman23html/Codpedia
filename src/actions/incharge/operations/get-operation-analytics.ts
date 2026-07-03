"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/current-user";
import { DepartmentType, OperationReportStatus, Role } from "@prisma/client";

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
    filter.gte = start;
  }

  if (to) {
    const end = new Date(to);
    end.setHours(23, 59, 59, 999);
    filter.lte = end;
  }

  return filter;
}

export async function getInchargeOperationAnalytics(
  filters: OperationAnalyticsFilters = {}
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

  const where: any = {
    user: {
      departmentId: currentUser.departmentId,
      role: Role.EMPLOYEE,
    },
  };

  if (filters.search) {
    where.user.OR = [
      {
        fullName: {
          contains: filters.search,
          mode: "insensitive",
        },
      },
      {
        email: {
          contains: filters.search,
          mode: "insensitive",
        },
      },
      {
        phone: {
          contains: filters.search,
          mode: "insensitive",
        },
      },
      {
        id: {
          contains: filters.search,
          mode: "insensitive",
        },
      },
    ];
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

  const dateFilter = getDateFilter(filters.from, filters.to);

  if (dateFilter) {
    where.reportDate = dateFilter;
  }

  const reports = await prisma.employeeOperationReport.findMany({
    where,
    include: {
      user: {
        select: {
          id: true,
          fullName: true,
          email: true,
          phone: true,
        },
      },
    },
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

  const employeeMap = new Map<string, any>();

  for (const report of reports) {
    const userId = report.user.id;

    if (!employeeMap.has(userId)) {
      employeeMap.set(userId, {
        employee: report.user,
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
    row.queryGenerated += report.queryGenerated;
    row.dealsDone += report.dealsDone;
    row.tutorAssigned += report.tutorAssigned;
    row.dealsDoneAmount += report.dealsDoneAmount;

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
    const key = report.reportDate.toISOString().slice(0, 10);

    if (!dailyMap.has(key)) {
      dailyMap.set(key, {
        date: report.reportDate.toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
        }),
        fullDate: report.reportDate.toLocaleDateString("en-IN", {
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

    day.queryGenerated += report.queryGenerated;
    day.dealsDone += report.dealsDone;
    day.tutorAssigned += report.tutorAssigned;
    day.dealsDoneAmount += report.dealsDoneAmount;
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