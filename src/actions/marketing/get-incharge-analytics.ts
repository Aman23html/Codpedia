"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/current-user";
import { Role } from "@prisma/client";

export async function getInchargeAnalytics() {
  const user = await getCurrentUser();

  if (!user || user.role !== Role.INCHARGE) {
    throw new Error("Unauthorized");
  }

  const employees = await prisma.user.findMany({
    where: {
      departmentId: user.departmentId,
      role: Role.EMPLOYEE,
    },
    select: {
      id: true,
      employeeCode: true,
      fullName: true,
      profileImageUrl: true,
    },
  });

  if (employees.length === 0) {
    return {
      totalEmployees: 0,
      totalReports: 0,

      pendingReports: 0,
      approvedReports: 0,
      rejectedReports: 0,
      todayReports: 0,

      northAmerica: 0,
      europe: 0,
      australia: 0,

      totalGroupsJoined: 0,
      totalPostsDone: 0,
      totalResourceLogin: 0,
      totalAccountClean: 0,

      topPerformer: null,
      employeePerformance: [],
    };
  }

  const employeeMap = new Map(
    employees.map((employee) => [
      employee.id,
      {
        employeeCode: employee.employeeCode,
        employeeName: employee.fullName,
        profileImageUrl: employee.profileImageUrl,
      },
    ])
  );

  const reports = await prisma.marketingReport.findMany({
    where: {
      user: {
        departmentId: user.departmentId,
      },
    },

    select: {
      userId: true,
      status: true,
      createdAt: true,
      country: true,

      whatsappGroupsJoined: true,
      telegramGroupsJoined: true,
      facebookGroupsJoined: true,

      whatsappPostsDone: true,
      telegramPostsDone: true,
      facebookPostsDone: true,

      resourceLogin: true,
      accountClean: true,
    },
  });

  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  let pendingReports = 0;
  let approvedReports = 0;
  let rejectedReports = 0;
  let todayReports = 0;

  let northAmerica = 0;
  let europe = 0;
  let australia = 0;

  let totalGroupsJoined = 0;
  let totalPostsDone = 0;
  let totalResourceLogin = 0;
  let totalAccountClean = 0;

  const performanceMap: Record<
    string,
    {
      employeeId: string;
      employeeCode: string | null;
      employeeName: string;
      profileImageUrl: string | null;
      total: number;
      approved: number;
      pending: number;
      rejected: number;
      approvalRate: number;
    }
  > = {};

  for (const r of reports) {
    if (r.status === "PENDING") pendingReports++;
    if (r.status === "APPROVED") approvedReports++;
    if (r.status === "REJECTED") rejectedReports++;

    if (r.createdAt >= startOfDay) {
      todayReports++;
    }

    if (r.country === "NORTH_AMERICA") northAmerica++;
    if (r.country === "EUROPE") europe++;
    if (r.country === "AUSTRALIA") australia++;

    totalGroupsJoined +=
      (r.whatsappGroupsJoined ?? 0) +
      (r.telegramGroupsJoined ?? 0) +
      (r.facebookGroupsJoined ?? 0);

    totalPostsDone +=
      (r.whatsappPostsDone ?? 0) +
      (r.telegramPostsDone ?? 0) +
      (r.facebookPostsDone ?? 0);

    totalResourceLogin += r.resourceLogin ?? 0;
    totalAccountClean += r.accountClean ?? 0;

    const employee = employeeMap.get(r.userId);

    if (!performanceMap[r.userId]) {
      performanceMap[r.userId] = {
        employeeId: r.userId,
        employeeCode: employee?.employeeCode ?? null,
        employeeName: employee?.employeeName || "Unknown",
        profileImageUrl: employee?.profileImageUrl ?? null,
        total: 0,
        approved: 0,
        pending: 0,
        rejected: 0,
        approvalRate: 0,
      };
    }

    const emp = performanceMap[r.userId];

    emp.total++;

    if (r.status === "APPROVED") emp.approved++;
    if (r.status === "PENDING") emp.pending++;
    if (r.status === "REJECTED") emp.rejected++;
  }

  const employeePerformance = Object.values(performanceMap).map((emp) => ({
    ...emp,
    approvalRate:
      emp.total > 0 ? Math.round((emp.approved / emp.total) * 100) : 0,
  }));

  employeePerformance.sort((a, b) => b.approved - a.approved);

  const topPerformer =
    employeePerformance.length > 0 ? employeePerformance[0] : null;

  return {
    totalEmployees: employees.length,
    totalReports: reports.length,

    pendingReports,
    approvedReports,
    rejectedReports,
    todayReports,

    northAmerica,
    europe,
    australia,

    totalGroupsJoined,
    totalPostsDone,
    totalResourceLogin,
    totalAccountClean,

    topPerformer,
    employeePerformance,
  };
}