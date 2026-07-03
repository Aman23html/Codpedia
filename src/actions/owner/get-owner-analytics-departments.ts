"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/current-user";
import { DepartmentType, Role } from "@prisma/client";

async function getDepartmentReportCount(
  departmentId: string,
  type: DepartmentType
) {
  if (type === DepartmentType.MARKETING) {
    return prisma.marketingReport.count({
      where: {
        user: {
          departmentId,
        },
      },
    });
  }

  if (type === DepartmentType.OPERATIONS) {
    return prisma.employeeOperationReport.count({
      where: {
        user: {
          departmentId,
        },
      },
    });
  }

  return 0;
}

export async function getOwnerAnalyticsDepartments() {
  const user = await getCurrentUser();

  if (!user || user.role !== Role.OWNER) {
    throw new Error("Unauthorized");
  }

  const departments = await prisma.department.findMany({
    select: {
      id: true,
      name: true,
      type: true,
      users: {
        select: {
          id: true,
          role: true,
          status: true,
        },
      },
    },
    orderBy: {
      name: "asc",
    },
  });

  const data = await Promise.all(
    departments.map(async (department) => {
      const totalReports = await getDepartmentReportCount(
        department.id,
        department.type
      );

      const employees = department.users.filter(
        (user) => user.role === Role.EMPLOYEE
      ).length;

      const incharges = department.users.filter(
        (user) => user.role === Role.INCHARGE
      ).length;

      const activeUsers = department.users.filter(
        (user) => user.status === "ACTIVE"
      ).length;

      return {
        id: department.id,
        name: department.name,
        type: department.type,
        totalUsers: department.users.length,
        employees,
        incharges,
        activeUsers,
        totalReports,
      };
    })
  );

  return data;
}