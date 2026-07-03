"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/current-user";
import { Role } from "@prisma/client";
import {
  getMarketingDateRange,
  parseMarketingFilters,
  MarketingAnalyticsSearchParams,
} from "@/lib/marketing/marketing-filter";

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

function getDateKey(date: Date) {
  return date.toLocaleDateString("en-CA");
}

export async function getInchargeReportSheet(
  searchParams?: MarketingAnalyticsSearchParams
) {
  const currentUser = await getCurrentUser();

  if (!currentUser || currentUser.role !== Role.INCHARGE) {
    throw new Error("Unauthorized");
  }

  const filters = parseMarketingFilters(searchParams);

  const where: any = {
    user: {
      departmentId: currentUser.departmentId,
    },
  };

  const dateFilter = getMarketingDateRange(filters);

  if (dateFilter) {
    where.reportDate = dateFilter;
  }

  if (filters.search) {
    where.user.OR = [
      {
        employeeCode: {
          contains: filters.search,
          mode: "insensitive",
        },
      },
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
        username: {
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
    ];
  }

  if (filters.status && filters.status !== "ALL") {
    where.status = filters.status;
  }

  if (filters.country && filters.country !== "ALL") {
    where.country = filters.country;
  }

  if (filters.platform && filters.platform !== "ALL") {
    where.platform = filters.platform;
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
          email: true,
          username: true,
          phone: true,
        },
      },
    },

    orderBy: [
      {
        reportDate: "desc",
      },
      {
        updatedAt: "desc",
      },
    ],
  });

  const dateWiseMap = new Map<string, any>();

  for (const report of reports) {
    const dateKey = getDateKey(report.reportDate);
    const mapKey = `${report.userId}-${dateKey}`;

    if (!dateWiseMap.has(mapKey)) {
      dateWiseMap.set(mapKey, {
        rowId: mapKey,

        userId: report.userId,
        employeeCode: report.user.employeeCode,
        employeeName: report.user.fullName,
        email: report.user.email,
        username: report.user.username,
        phone: report.user.phone,
        profileImageUrl: report.user.profileImageUrl,

        reportDate: report.reportDate,
        lastReportDate: report.reportDate,
        lastUpdatedAt: report.updatedAt,

        countriesSet: new Set<string>(),
        reportIds: [report.id],

        totalGroupsJoined: 0,
        totalPostsDone: 0,
        totalResourceLogin: 0,
        totalAccountClean: 0,

        totalReports: 0,
        approvedReports: 0,
        pendingReports: 0,
        rejectedReports: 0,
      });
    }

    const row = dateWiseMap.get(mapKey);

    row.totalReports += 1;
    row.totalGroupsJoined += totalGroups(report);
    row.totalPostsDone += totalPosts(report);
    row.totalResourceLogin += report.resourceLogin ?? 0;
    row.totalAccountClean += report.accountClean ?? 0;

    if (report.status === "APPROVED") row.approvedReports += 1;
    if (report.status === "PENDING") row.pendingReports += 1;
    if (report.status === "REJECTED") row.rejectedReports += 1;

    if (report.country) {
      row.countriesSet.add(report.country);
    }

    if (report.updatedAt > row.lastUpdatedAt) {
      row.lastUpdatedAt = report.updatedAt;
      row.lastReportDate = report.reportDate;
    }
  }

  let rows = Array.from(dateWiseMap.values()).map((row) => ({
    ...row,
    countries: Array.from(row.countriesSet).join(", ") || "-",
  }));

  rows = rows.map((row) => {
    delete row.countriesSet;
    return row;
  });

  rows = rows.filter((row) => {
    if (
      typeof filters.minGroups === "number" &&
      row.totalGroupsJoined < filters.minGroups
    ) {
      return false;
    }

    if (
      typeof filters.maxGroups === "number" &&
      row.totalGroupsJoined > filters.maxGroups
    ) {
      return false;
    }

    if (
      typeof filters.minPosts === "number" &&
      row.totalPostsDone < filters.minPosts
    ) {
      return false;
    }

    if (
      typeof filters.maxPosts === "number" &&
      row.totalPostsDone > filters.maxPosts
    ) {
      return false;
    }

    if (
      typeof filters.minLogin === "number" &&
      row.totalResourceLogin < filters.minLogin
    ) {
      return false;
    }

    if (
      typeof filters.maxLogin === "number" &&
      row.totalResourceLogin > filters.maxLogin
    ) {
      return false;
    }

    if (
      typeof filters.minClean === "number" &&
      row.totalAccountClean < filters.minClean
    ) {
      return false;
    }

    if (
      typeof filters.maxClean === "number" &&
      row.totalAccountClean > filters.maxClean
    ) {
      return false;
    }

    return true;
  });

  rows.sort((a, b) => {
    const sortBy = filters.sortBy;
    const order = filters.sortOrder === "asc" ? 1 : -1;

    if (sortBy === "employeeName") {
      return a.employeeName.localeCompare(b.employeeName) * order;
    }

    if (sortBy === "totalReports") {
      return (a.totalReports - b.totalReports) * order;
    }

    if (sortBy === "groups") {
      return (a.totalGroupsJoined - b.totalGroupsJoined) * order;
    }

    if (sortBy === "posts") {
      return (a.totalPostsDone - b.totalPostsDone) * order;
    }

    if (sortBy === "login") {
      return (a.totalResourceLogin - b.totalResourceLogin) * order;
    }

    if (sortBy === "clean") {
      return (a.totalAccountClean - b.totalAccountClean) * order;
    }

    return (
      (new Date(a.lastReportDate).getTime() -
        new Date(b.lastReportDate).getTime()) *
      order
    );
  });

  return rows;
}