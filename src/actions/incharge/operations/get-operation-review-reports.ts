"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/current-user";
import { DepartmentType, OperationReportStatus, Role } from "@prisma/client";

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
    filter.gte = start;
  }

  if (to) {
    const end = new Date(to);
    end.setHours(23, 59, 59, 999);
    filter.lte = end;
  }

  return filter;
}

export async function getOperationReviewReports(
  filters: OperationReviewFilters = {}
) {
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
          department: {
            select: {
              id: true,
              name: true,
              type: true,
            },
          },
        },
      },
    },
    orderBy: {
      reportDate: "desc",
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

  return {
    reports,
    totals,
  };
}