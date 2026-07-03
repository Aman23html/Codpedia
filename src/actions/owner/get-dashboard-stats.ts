"use server";

import { prisma } from "@/lib/prisma";
import { Role, UserStatus } from "@prisma/client";

export async function getOwnerDashboardStats() {
  const [
    totalDepartments,
    totalUsers,
    totalEmployees,
    totalIncharges,
    pendingApprovals,
  ] = await Promise.all([
    prisma.department.count(),

    prisma.user.count(),

    prisma.user.count({
      where: {
        role: Role.EMPLOYEE,
      },
    }),

    prisma.user.count({
      where: {
        role: Role.INCHARGE,
      },
    }),

    prisma.user.count({
      where: {
        status: UserStatus.PENDING_APPROVAL,
      },
    }),
  ]);

  return {
    totalDepartments,
    totalUsers,
    totalEmployees,
    totalIncharges,
    pendingApprovals,
  };
}