"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/current-user";
import { DepartmentType, OperationReportStatus, Role } from "@prisma/client";

function getDateRange({
  filter,
  startDate,
  endDate,
}: {
  filter?: string;
  startDate?: string;
  endDate?: string;
}) {
  if (startDate || endDate) {
    const range: {
      gte?: Date;
      lte?: Date;
    } = {};

    if (startDate) {
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
      range.gte = start;
    }

    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      range.lte = end;
    }

    return range;
  }

  const now = new Date();

  if (filter === "TODAY") {
    const start = new Date();
    start.setHours(0, 0, 0, 0);

    const end = new Date();
    end.setHours(23, 59, 59, 999);

    return { gte: start, lte: end };
  }

  if (filter === "7_DAYS") {
    const start = new Date();
    start.setDate(now.getDate() - 7);
    start.setHours(0, 0, 0, 0);

    return { gte: start };
  }

  if (filter === "30_DAYS") {
    const start = new Date();
    start.setDate(now.getDate() - 30);
    start.setHours(0, 0, 0, 0);

    return { gte: start };
  }

  return undefined;
}

function isValidOperationStatus(
  status: string
): status is OperationReportStatus {
  return Object.values(OperationReportStatus).includes(
    status as OperationReportStatus
  );
}

export async function getOwnerOperationsUserAnalytics({
  userId,
  filter = "ALL",
  status = "ALL",
  startDate,
  endDate,
}: {
  userId: string;
  filter?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
}) {
  const currentUser = await getCurrentUser();

  if (!currentUser || currentUser.role !== Role.OWNER) {
    throw new Error("Unauthorized");
  }

  const employee = await prisma.user.findFirst({
    where: {
      id: userId,
      role: Role.EMPLOYEE,
      department: {
        type: DepartmentType.OPERATIONS,
      },
    },
    select: {
      id: true,
      fullName: true,
      email: true,
      username: true,
      phone: true,
      status: true,
      createdAt: true,
      department: {
        select: {
          id: true,
          name: true,
          type: true,
        },
      },
    },
  });

  if (!employee) {
    return null;
  }

  const dateRange = getDateRange({
    filter,
    startDate,
    endDate,
  });

  const where: any = {
    userId,
  };

  if (dateRange) {
    where.reportDate = dateRange;
  }

  if (status !== "ALL" && isValidOperationStatus(status)) {
    where.status = status;
  }

  const reports = await prisma.employeeOperationReport.findMany({
    where,
    orderBy: {
      reportDate: "asc",
    },
  });

  const summary = reports.reduce(
    (acc, report) => {
      acc.totalReports += 1;

      acc.queryGenerated += report.queryGenerated ?? 0;
      acc.dealsDone += report.dealsDone ?? 0;
      acc.tutorAssigned += report.tutorAssigned ?? 0;
      acc.dealsDoneAmount += report.dealsDoneAmount ?? 0;

      if (report.status === OperationReportStatus.VERIFIED) acc.verified += 1;
      if (report.status === OperationReportStatus.SUBMITTED) acc.pending += 1;
      if (report.status === OperationReportStatus.REJECTED) acc.rejected += 1;
      if (report.status === OperationReportStatus.DRAFT) acc.draft += 1;

      return acc;
    },
    {
      totalReports: 0,
      queryGenerated: 0,
      dealsDone: 0,
      tutorAssigned: 0,
      dealsDoneAmount: 0,
      verified: 0,
      pending: 0,
      rejected: 0,
      draft: 0,
    }
  );

  const approvalRate =
    summary.totalReports > 0
      ? Math.round((summary.verified / summary.totalReports) * 100)
      : 0;

  const chartMap = new Map<string, any>();

  for (const report of reports) {
    const date = new Date(report.reportDate).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
    });

    if (!chartMap.has(date)) {
      chartMap.set(date, {
        date,
        queryGenerated: 0,
        dealsDone: 0,
        tutorAssigned: 0,
        dealsDoneAmount: 0,
      });
    }

    const row = chartMap.get(date);

    row.queryGenerated += report.queryGenerated ?? 0;
    row.dealsDone += report.dealsDone ?? 0;
    row.tutorAssigned += report.tutorAssigned ?? 0;
    row.dealsDoneAmount += report.dealsDoneAmount ?? 0;
  }

  const statusRows = [
    {
      label: "Verified",
      value: summary.verified,
      status: OperationReportStatus.VERIFIED,
    },
    {
      label: "Pending",
      value: summary.pending,
      status: OperationReportStatus.SUBMITTED,
    },
    {
      label: "Rejected",
      value: summary.rejected,
      status: OperationReportStatus.REJECTED,
    },
    {
      label: "Draft",
      value: summary.draft,
      status: OperationReportStatus.DRAFT,
    },
  ];

  return {
    employee,
    summary,
    approvalRate,
    statusRows,
    chartData: Array.from(chartMap.values()),
    reports,
  };
}