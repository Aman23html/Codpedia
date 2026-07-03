"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/current-user";
import { LeaveStatus } from "@prisma/client";


import {
  ReportStatus,
  Role,
  UserStatus,
} from "@prisma/client";

export async function getDashboardStats() {
  const currentUser = await getCurrentUser();

  if (!currentUser || currentUser.role !== Role.INCHARGE) {
    throw new Error("Unauthorized");
  }

  const startOfDay = new Date();

  startOfDay.setHours(0, 0, 0, 0);



const [
  totalEmployees,
  todayReports,
  pendingReports,
  approvedReports,
  rejectedReports,
  pendingEmployeeApprovals,
  pendingLeaves,
] = await Promise.all([
  prisma.user.count({
    where: {
      departmentId: currentUser.departmentId,
      role: Role.EMPLOYEE,
    },
  }),

  prisma.marketingReport.count({
    where: {
      reportDate: {
        gte: startOfDay,
      },

      user: {
        departmentId: currentUser.departmentId,
      },
    },
  }),

  prisma.marketingReport.count({
    where: {
      status: ReportStatus.PENDING,

      user: {
        departmentId: currentUser.departmentId,
      },
    },
  }),

  prisma.marketingReport.count({
    where: {
      status: ReportStatus.APPROVED,

      user: {
        departmentId: currentUser.departmentId,
      },
    },
  }),

  prisma.marketingReport.count({
    where: {
      status: ReportStatus.REJECTED,

      user: {
        departmentId: currentUser.departmentId,
      },
    },
  }),

  prisma.user.count({
    where: {
      departmentId: currentUser.departmentId,
      role: Role.EMPLOYEE,
      status: UserStatus.PENDING_APPROVAL,
    },
  }),

  prisma.leave.count({
    where: {
      status: LeaveStatus.PENDING,

      user: {
        departmentId: currentUser.departmentId,
      },
    },
  }),
]);
  return {
    totalEmployees,
    todayReports,
    pendingReports,
    approvedReports,
    rejectedReports,
    pendingEmployeeApprovals,
    pendingLeaves,
  };
}