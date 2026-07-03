"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/current-user";
import { DepartmentType, Role } from "@prisma/client";

function getGreeting() {
  const hour = new Date().getHours();

  if (hour < 12) return "Good Morning";
  if (hour < 17) return "Good Afternoon";
  return "Good Evening";
}

function getTodayRange() {
  const start = new Date();
  start.setHours(0, 0, 0, 0);

  const end = new Date(start);
  end.setDate(end.getDate() + 1);

  return { start, end };
}

async function getDepartmentReportCount(userId: string, department?: DepartmentType) {
  if (department === DepartmentType.OPERATIONS) {
    return prisma.employeeOperationReport.count({
      where: {
        userId,
      },
    });
  }

  if (department === DepartmentType.MARKETING) {
    return prisma.marketingReport.count({
      where: {
        userId,
      },
    });
  }

  return 0;
}

export async function getDashboardData() {
  const user = await getCurrentUser();

  if (!user || user.role !== Role.EMPLOYEE) {
    return null;
  }

  const { start, end } = getTodayRange();

  const [todayAttendance, totalReports] = await Promise.all([
    prisma.attendance.findFirst({
      where: {
        userId: user.id,
        attendanceDate: {
          gte: start,
          lt: end,
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    }),

    getDepartmentReportCount(user.id, user.department?.type),
  ]);

  return {
    employee: user,

    greeting: getGreeting(),

    todayAttendance,

    stats: {
      attendancePercentage: 0,
      totalReports,
      leaveBalance: 0,
      performance: "Good",
    },
  };
}