"use server";

import { connectDB } from "@/lib/mongodb";
import { getCurrentUser } from "@/lib/current-user";
import { User } from "@/models/User";
import { MarketingReport } from "@/models/MarketingReport";
import { Role } from "@/constants/enums";
import {
  getMarketingDateRange,
  parseMarketingFilters,
  MarketingAnalyticsSearchParams,
} from "@/lib/marketing/marketing-filter";

function toMongoDateFilter(dateFilter: any) {
  if (!dateFilter) return undefined;

  const mongoFilter: any = {};

  if (dateFilter.gte) mongoFilter.$gte = dateFilter.gte;
  if (dateFilter.lte) mongoFilter.$lte = dateFilter.lte;
  if (dateFilter.lt) mongoFilter.$lt = dateFilter.lt;

  return mongoFilter;
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

function getDateKey(date: Date) {
  return new Date(date).toLocaleDateString("en-CA");
}

export async function getInchargeReportSheet(
  searchParams?: MarketingAnalyticsSearchParams
) {
  await connectDB();

  const currentUser = await getCurrentUser();

  if (!currentUser || currentUser.role !== Role.INCHARGE) {
    throw new Error("Unauthorized");
  }

  const filters = parseMarketingFilters(searchParams);

  const userQuery: any = {
    department: currentUser.departmentId,
  };

  if (filters.search) {
    userQuery.$or = [
      { employeeCode: { $regex: filters.search, $options: "i" } },
      { fullName: { $regex: filters.search, $options: "i" } },
      { email: { $regex: filters.search, $options: "i" } },
      { username: { $regex: filters.search, $options: "i" } },
      { phone: { $regex: filters.search, $options: "i" } },
    ];
  }

  const users = await User.find(userQuery).select("_id").lean();
  const userIds = users.map((user: any) => user._id);

  const query: any = {
    user: {
      $in: userIds,
    },
  };

  const dateFilter = toMongoDateFilter(getMarketingDateRange(filters));

  if (dateFilter) {
    query.reportDate = dateFilter;
  }

  if (filters.status && filters.status !== "ALL") {
    query.status = filters.status;
  }

  if (filters.country && filters.country !== "ALL") {
    query.country = filters.country;
  }

  if (filters.platform && filters.platform !== "ALL") {
    query.platform = filters.platform;
  }

  const reports: any[] = await MarketingReport.find(query)
    .populate({
      path: "user",
      select: "employeeCode profileImageUrl fullName email username phone",
    })
    .sort({
      reportDate: -1,
      updatedAt: -1,
    })
    .lean();

  const dateWiseMap = new Map<string, any>();

  for (const report of reports) {
    if (!report.user) continue;

    const userId = report.user._id.toString();
    const reportId = report._id.toString();
    const dateKey = getDateKey(report.reportDate);
    const mapKey = `${userId}-${dateKey}`;

    if (!dateWiseMap.has(mapKey)) {
      dateWiseMap.set(mapKey, {
        rowId: mapKey,

        userId,
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
        reportIds: [reportId],

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

    if (new Date(report.updatedAt) > new Date(row.lastUpdatedAt)) {
      row.lastUpdatedAt = report.updatedAt;
      row.lastReportDate = report.reportDate;
    }
  }

  let rows = Array.from(dateWiseMap.values()).map((row) => ({
    ...row,
    reportDate: row.reportDate?.toISOString(),
    lastReportDate: row.lastReportDate?.toISOString(),
    lastUpdatedAt: row.lastUpdatedAt?.toISOString(),
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