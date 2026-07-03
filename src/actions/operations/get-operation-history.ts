"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/current-user";
import { DepartmentType, OperationReportStatus, Role } from "@prisma/client";

type Filter = {
  status?: string;
  date?: string;
};

export async function getOperationHistory(filter: Filter = {}) {
  const user = await getCurrentUser();

  if (!user || user.role !== Role.EMPLOYEE) {
    throw new Error("Unauthorized");
  }

  if (!user.department || user.department.type !== DepartmentType.OPERATIONS) {
    throw new Error("Only Operations employees can access this module");
  }

  const where: any = {
    userId: user.id,
  };

  if (
    filter.status &&
    filter.status !== "ALL" &&
    Object.values(OperationReportStatus).includes(
      filter.status as OperationReportStatus
    )
  ) {
    where.status = filter.status;
  }

  if (filter.date) {
    const start = new Date(filter.date);
    start.setHours(0, 0, 0, 0);

    const end = new Date(start);
    end.setDate(end.getDate() + 1);

    where.reportDate = {
      gte: start,
      lt: end,
    };
  }

  return prisma.employeeOperationReport.findMany({
    where,
    orderBy: {
      reportDate: "desc",
    },
    take: 30,
  });
}