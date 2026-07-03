"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/current-user";
import { DepartmentType, Role } from "@prisma/client";

export type OperationAnalyticsFilter = "TODAY" | "7_DAYS" | "30_DAYS" | "ALL";

function getDateRange(filter: OperationAnalyticsFilter) {
  const now = new Date();

  if (filter === "ALL") {
    return null;
  }

  const start = new Date();
  start.setHours(0, 0, 0, 0);

  if (filter === "TODAY") {
    const end = new Date(start);
    end.setDate(end.getDate() + 1);

    return {
      gte: start,
      lt: end,
    };
  }

  if (filter === "7_DAYS") {
    start.setDate(now.getDate() - 6);

    return {
      gte: start,
      lte: now,
    };
  }

  if (filter === "30_DAYS") {
    start.setDate(now.getDate() - 29);

    return {
      gte: start,
      lte: now,
    };
  }

  return null;
}

export async function getOperationAnalytics(
  filter: OperationAnalyticsFilter = "7_DAYS"
) {
  const user = await getCurrentUser();

  if (!user || user.role !== Role.EMPLOYEE) {
    throw new Error("Unauthorized");
  }

  if (!user.department || user.department.type !== DepartmentType.OPERATIONS) {
    throw new Error("Only Operations employees can access this analytics");
  }

  const dateRange = getDateRange(filter);

  const where: any = {
    userId: user.id,
  };

  if (dateRange) {
    where.reportDate = dateRange;
  }

  const reports = await prisma.employeeOperationReport.findMany({
    where,
    orderBy: {
      reportDate: "asc",
    },
    select: {
      id: true,
      reportDate: true,
      queryGenerated: true,
      dealsDone: true,
      tutorAssigned: true,
      dealsDoneAmount: true,
      status: true,
      submittedAt: true,
    },
  });

  const totals = reports.reduce(
    (acc, report) => {
      acc.queryGenerated += report.queryGenerated;
      acc.dealsDone += report.dealsDone;
      acc.tutorAssigned += report.tutorAssigned;
      acc.dealsDoneAmount += report.dealsDoneAmount;

      if (report.status === "SUBMITTED") acc.submitted += 1;
      if (report.status === "VERIFIED") acc.approved += 1;
      if (report.status === "REJECTED") acc.rejected += 1;
      if (report.status === "CORRECTION_REQUIRED") acc.correctionRequired += 1;
      if (report.status === "DRAFT") acc.draft += 1;

      return acc;
    },
    {
      queryGenerated: 0,
      dealsDone: 0,
      tutorAssigned: 0,
      dealsDoneAmount: 0,
      submitted: 0,
      approved: 0,
      rejected: 0,
      correctionRequired: 0,
      draft: 0,
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
  }));

  const average =
    reports.length > 0
      ? {
          queryGenerated: Math.round(totals.queryGenerated / reports.length),
          dealsDone: Math.round(totals.dealsDone / reports.length),
          tutorAssigned: Math.round(totals.tutorAssigned / reports.length),
        }
      : {
          queryGenerated: 0,
          dealsDone: 0,
          tutorAssigned: 0,
        };

  return {
    filter,
    reportsCount: reports.length,
    totals,
    average,
    chartData,
  };
}