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

function totalGroups(report: any) {
  return (
    (report.whatsappGroupsJoined ?? 0) +
    (report.telegramGroupsJoined ?? 0) +
    (report.facebookGroupsJoined ?? 0)
  );
}

function totalPosts(report: any) {
  return (
    (report.whatsappPostsDone ?? 0) +
    (report.telegramPostsDone ?? 0) +
    (report.facebookPostsDone ?? 0)
  );
}

function formatCountry(country: string) {
  if (country === "NORTH_AMERICA") return "North America";
  if (country === "EUROPE") return "Europe";
  if (country === "AUSTRALIA") return "Australia";
  return country.replaceAll("_", " ");
}

export async function getOwnerMarketingUserAnalytics({
  userId,
  filter = "ALL",
  status = "ALL",
}: {
  userId: string;
  filter?: string;
  status?: string;
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
        type: DepartmentType.MARKETING,
      },
    },

    select: {
      id: true,
      employeeCode: true,
      profileImageUrl: true,
      coverImageUrl: true,
      fullName: true,
      email: true,
      username: true,
      phone: true,
      status: true,
      createdAt: true,
      department: {
        select: {
          name: true,
          type: true,
        },
      },
    },
  });

  if (!employee) {
    return null;
  }

  const dateRange = getDateRange(filter);

  const where: any = {
    userId,
  };

  if (dateRange) {
    where.reportDate = dateRange;
  }

  if (status !== "ALL") {
    where.status = status;
  }

  const reports = await prisma.marketingReport.findMany({
    where,

    include: {
      user: {
        select: {
          id: true,
          employeeCode: true,
          profileImageUrl: true,
          fullName: true,
          username: true,
          email: true,
          phone: true,
        },
      },
    },

    orderBy: {
      reportDate: "asc",
    },
  });

  const summary = reports.reduce(
    (acc, report) => {
      acc.totalReports += 1;

      acc.whatsappGroups += report.whatsappGroupsJoined ?? 0;
      acc.whatsappPosts += report.whatsappPostsDone ?? 0;

      acc.telegramGroups += report.telegramGroupsJoined ?? 0;
      acc.telegramPosts += report.telegramPostsDone ?? 0;

      acc.facebookGroups += report.facebookGroupsJoined ?? 0;
      acc.facebookPosts += report.facebookPostsDone ?? 0;

      acc.resourceLogin += report.resourceLogin ?? 0;
      acc.accountClean += report.accountClean ?? 0;

      acc.totalGroups += totalGroups(report);
      acc.totalPosts += totalPosts(report);

      if (report.status === "APPROVED") acc.approved += 1;
      if (report.status === "PENDING") acc.pending += 1;
      if (report.status === "REJECTED") acc.rejected += 1;

      return acc;
    },
    {
      totalReports: 0,

      whatsappGroups: 0,
      whatsappPosts: 0,

      telegramGroups: 0,
      telegramPosts: 0,

      facebookGroups: 0,
      facebookPosts: 0,

      resourceLogin: 0,
      accountClean: 0,

      totalGroups: 0,
      totalPosts: 0,

      approved: 0,
      pending: 0,
      rejected: 0,
    }
  );

  const approvalRate =
    summary.totalReports > 0
      ? Math.round((summary.approved / summary.totalReports) * 100)
      : 0;

  const countryMap = new Map<string, any>();

  for (const report of reports) {
    if (!countryMap.has(report.country)) {
      countryMap.set(report.country, {
        country: report.country,
        countryLabel: formatCountry(report.country),
        totalReports: 0,
        groups: 0,
        posts: 0,
        login: 0,
        clean: 0,
        approved: 0,
        pending: 0,
        rejected: 0,
      });
    }

    const row = countryMap.get(report.country);

    row.totalReports += 1;
    row.groups += totalGroups(report);
    row.posts += totalPosts(report);
    row.login += report.resourceLogin ?? 0;
    row.clean += report.accountClean ?? 0;

    if (report.status === "APPROVED") row.approved += 1;
    if (report.status === "PENDING") row.pending += 1;
    if (report.status === "REJECTED") row.rejected += 1;
  }

  const chartMap = new Map<string, any>();

  for (const report of reports) {
    const date = new Date(report.reportDate).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
    });

    if (!chartMap.has(date)) {
      chartMap.set(date, {
        date,
        whatsappGroups: 0,
        whatsappPosts: 0,
        telegramGroups: 0,
        telegramPosts: 0,
        facebookGroups: 0,
        facebookPosts: 0,
        resourceLogin: 0,
        accountClean: 0,
        totalGroups: 0,
        totalPosts: 0,
      });
    }

    const row = chartMap.get(date);

    row.whatsappGroups += report.whatsappGroupsJoined ?? 0;
    row.whatsappPosts += report.whatsappPostsDone ?? 0;

    row.telegramGroups += report.telegramGroupsJoined ?? 0;
    row.telegramPosts += report.telegramPostsDone ?? 0;

    row.facebookGroups += report.facebookGroupsJoined ?? 0;
    row.facebookPosts += report.facebookPostsDone ?? 0;

    row.resourceLogin += report.resourceLogin ?? 0;
    row.accountClean += report.accountClean ?? 0;

    row.totalGroups =
      row.whatsappGroups + row.telegramGroups + row.facebookGroups;

    row.totalPosts =
      row.whatsappPosts + row.telegramPosts + row.facebookPosts;
  }

  return {
    employee,
    summary,
    approvalRate,
    countries: Array.from(countryMap.values()),
    chartData: Array.from(chartMap.values()),
    reports: reports.map((report) => ({
      ...report,
      countryLabel: formatCountry(report.country),
      totalGroups: totalGroups(report),
      totalPosts: totalPosts(report),
    })),
  };
}