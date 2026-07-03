"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/current-user";
import { DepartmentType, Role } from "@prisma/client";

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

function getTotalGroups(report: any) {
  return (
    (report.whatsappGroupsJoined ?? 0) +
    (report.telegramGroupsJoined ?? 0) +
    (report.facebookGroupsJoined ?? 0)
  );
}

function getTotalPosts(report: any) {
  return (
    (report.whatsappPostsDone ?? 0) +
    (report.telegramPostsDone ?? 0) +
    (report.facebookPostsDone ?? 0)
  );
}

export async function getOwnerMarketingAnalytics(searchParams?: {
  filter?: string;
  search?: string;
  status?: string;
}) {
  const currentUser = await getCurrentUser();

  if (!currentUser || currentUser.role !== Role.OWNER) {
    throw new Error("Unauthorized");
  }

  const filter = searchParams?.filter ?? "ALL";
  const search = searchParams?.search ?? "";
  const status = searchParams?.status ?? "ALL";

  const dateRange = getDateRange(filter);

  const where: any = {
    user: {
      department: {
        type: DepartmentType.MARKETING,
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
        employeeCode: {
          contains: search,
          mode: "insensitive",
        },
      },
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
      {
        phone: {
          contains: search,
          mode: "insensitive",
        },
      },
    ];
  }

  const [reports, totalEmployees] = await Promise.all([
    prisma.marketingReport.findMany({
      where,

      include: {
        user: {
          select: {
            id: true,
            employeeCode: true,
            profileImageUrl: true,
            fullName: true,
            email: true,
            username: true,
            phone: true,
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
          type: DepartmentType.MARKETING,
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
        profileImageUrl: report.user.profileImageUrl,
        fullName: report.user.fullName,
        email: report.user.email,
        username: report.user.username,
        phone: report.user.phone,
        totalReports: 0,
        approved: 0,
        pending: 0,
        rejected: 0,
        totalGroups: 0,
        totalPosts: 0,
        totalResourceLogin: 0,
        totalAccountClean: 0,
        countries: new Set<string>(),
        lastReportDate: report.reportDate,
      });
    }

    const row = employeeMap.get(report.userId);

    row.totalReports += 1;
    row.totalGroups += getTotalGroups(report);
    row.totalPosts += getTotalPosts(report);
    row.totalResourceLogin += report.resourceLogin ?? 0;
    row.totalAccountClean += report.accountClean ?? 0;

    if (report.status === "APPROVED") row.approved += 1;
    if (report.status === "PENDING") row.pending += 1;
    if (report.status === "REJECTED") row.rejected += 1;

    if (report.country) {
      row.countries.add(report.country);
    }

    if (new Date(report.reportDate) > new Date(row.lastReportDate)) {
      row.lastReportDate = report.reportDate;
    }
  }

  const employeeRows = Array.from(employeeMap.values()).map((row) => ({
    ...row,
    countries: Array.from(row.countries).join(", ") || "-",
  }));

  const totalReports = reports.length;

  const approvedReports = reports.filter(
    (report) => report.status === "APPROVED"
  ).length;

  const pendingReports = reports.filter(
    (report) => report.status === "PENDING"
  ).length;

  const rejectedReports = reports.filter(
    (report) => report.status === "REJECTED"
  ).length;

  const approvalRate =
    totalReports > 0 ? Math.round((approvedReports / totalReports) * 100) : 0;

  return {
    totalEmployees,
    totalReports,
    approvedReports,
    pendingReports,
    rejectedReports,
    approvalRate,

    northAmerica: reports.filter(
      (report) => report.country === "NORTH_AMERICA"
    ).length,

    europe: reports.filter((report) => report.country === "EUROPE").length,

    australia: reports.filter((report) => report.country === "AUSTRALIA")
      .length,

    totalGroupsJoined: reports.reduce(
      (sum, report) => sum + getTotalGroups(report),
      0
    ),

    totalPostsDone: reports.reduce(
      (sum, report) => sum + getTotalPosts(report),
      0
    ),

    totalResourceLogin: reports.reduce(
      (sum, report) => sum + (report.resourceLogin ?? 0),
      0
    ),

    totalAccountClean: reports.reduce(
      (sum, report) => sum + (report.accountClean ?? 0),
      0
    ),

    employees: employeeRows,
  };
}