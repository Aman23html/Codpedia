"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/current-user";
import { DepartmentType, OperationReportStatus, Role } from "@prisma/client";

function getDateRange(filter?: string) {
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

export async function getOwnerOperationsAnalytics(searchParams?: {
  filter?: string;
  status?: string;
  search?: string;
}) {
  const currentUser = await getCurrentUser();

  if (!currentUser || currentUser.role !== Role.OWNER) {
    throw new Error("Unauthorized");
  }

  const filter = searchParams?.filter ?? "ALL";
  const status = searchParams?.status ?? "ALL";
  const search = searchParams?.search ?? "";

  const dateRange = getDateRange(filter);

  const where: any = {
    user: {
      department: {
        type: DepartmentType.OPERATIONS,
      },
    },
  };

  if (dateRange) {
    where.reportDate = dateRange;
  }

  if (status !== "ALL") {
    where.status = status;
  }

  if (search) {
    where.user.OR = [
      {
        fullName: {
          contains: search,
          mode: "insensitive",
        },
      },
      {
        email: {
          contains: search,
          mode: "insensitive",
        },
      },
      {
        username: {
          contains: search,
          mode: "insensitive",
        },
      },
    ];
  }

  const [reports, totalEmployees] = await Promise.all([
    prisma.employeeOperationReport.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            employeeCode: true,
            fullName: true,
            email: true,
            username: true,
          },
        },
      },
      orderBy: {
        reportDate: "desc",
      },
    }),

    prisma.user.count({
      where: {
        role: Role.EMPLOYEE,
        department: {
          type: DepartmentType.OPERATIONS,
        },
      },
    }),
  ]);

  const employeeMap = new Map<string, any>();

  for (const report of reports) {
    if (!employeeMap.has(report.userId)) {
      employeeMap.set(report.userId, {
        userId: report.userId,
        employeeCode: report.user.employeeCode,
        fullName: report.user.fullName,
        email: report.user.email,
        username: report.user.username,

        totalReports: 0,
        approved: 0,
        pending: 0,
        rejected: 0,
        draft: 0,

        queryGenerated: 0,
        dealsDone: 0,
        tutorAssigned: 0,
        dealsDoneAmount: 0,

        lastReportDate: report.reportDate,
      });
    }

    const row = employeeMap.get(report.userId);

    row.totalReports += 1;

    row.queryGenerated += report.queryGenerated ?? 0;
    row.dealsDone += report.dealsDone ?? 0;
    row.tutorAssigned += report.tutorAssigned ?? 0;
    row.dealsDoneAmount += report.dealsDoneAmount ?? 0;

    if (report.status === OperationReportStatus.VERIFIED) row.approved += 1;
    if (report.status === OperationReportStatus.SUBMITTED) row.pending += 1;
    if (report.status === OperationReportStatus.REJECTED) row.rejected += 1;
    if (report.status === OperationReportStatus.DRAFT) row.draft += 1;

    if (new Date(report.reportDate) > new Date(row.lastReportDate)) {
      row.lastReportDate = report.reportDate;
    }
  }

  const employeeRows = Array.from(employeeMap.values());

  const totalReports = reports.length;

  const approvedReports = reports.filter(
    (report) => report.status === OperationReportStatus.VERIFIED
  ).length;

  const pendingReports = reports.filter(
    (report) => report.status === OperationReportStatus.SUBMITTED
  ).length;

  const rejectedReports = reports.filter(
    (report) => report.status === OperationReportStatus.REJECTED
  ).length;

  const draftReports = reports.filter((report) => report.status === "DRAFT")
    .length;

  const approvalRate =
    totalReports > 0 ? Math.round((approvedReports / totalReports) * 100) : 0;

  return {
    totalEmployees,
    totalReports,
    approvedReports,
    pendingReports,
    rejectedReports,
    draftReports,
    approvalRate,

    totalQueryGenerated: reports.reduce(
      (sum, report) => sum + (report.queryGenerated ?? 0),
      0
    ),

    totalDealsDone: reports.reduce(
      (sum, report) => sum + (report.dealsDone ?? 0),
      0
    ),

    totalTutorAssigned: reports.reduce(
      (sum, report) => sum + (report.tutorAssigned ?? 0),
      0
    ),

    totalDealsDoneAmount: reports.reduce(
      (sum, report) => sum + (report.dealsDoneAmount ?? 0),
      0
    ),

    employees: employeeRows,
  };
}