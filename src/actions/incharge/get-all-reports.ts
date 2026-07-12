"use server";

import { connectDB } from "@/lib/mongodb";
import { getCurrentUser } from "@/lib/current-user";
import { User } from "@/models/User";
import { MarketingReport } from "@/models/MarketingReport";
import { Role } from "@/constants/enums";

type SearchParams = {
  [key: string]: string | string[] | undefined;
};

function getStringValue(value: string | string[] | undefined) {
  return typeof value === "string" ? value.trim() : "";
}

function startOfDay(date: Date) {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);
  return start;
}

function endOfDay(date: Date) {
  const end = new Date(date);
  end.setHours(23, 59, 59, 999);
  return end;
}

function getDateKey(date: Date) {
  return new Date(date).toLocaleDateString("en-CA", {
    timeZone: "Asia/Kolkata",
  });
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
  return country?.replaceAll("_", " ") || "-";
}

export async function getAllReports(searchParams?: SearchParams) {
  await connectDB();

  const currentUser = await getCurrentUser();

  if (!currentUser || currentUser.role !== Role.INCHARGE) {
    throw new Error("Unauthorized");
  }

  const searchQuery = getStringValue(searchParams?.search);
  const status = getStringValue(searchParams?.status) || "ALL";
  const from = getStringValue(searchParams?.from);
  const to = getStringValue(searchParams?.to);

  const userQuery: any = {
    department: currentUser.departmentId,
  };

  if (searchQuery) {
    userQuery.$or = [
      { employeeCode: { $regex: searchQuery, $options: "i" } },
      { fullName: { $regex: searchQuery, $options: "i" } },
      { username: { $regex: searchQuery, $options: "i" } },
      { email: { $regex: searchQuery, $options: "i" } },
      { phone: { $regex: searchQuery, $options: "i" } },
    ];
  }

  const users = await User.find(userQuery).select("_id").lean();
  const userIds = users.map((user: any) => user._id);

  const reportQuery: any = {
    user: {
      $in: userIds,
    },
  };

  if (status !== "ALL") {
    reportQuery.status = status;
  }

  if (from || to) {
    reportQuery.reportDate = {};

    if (from) {
      reportQuery.reportDate.$gte = startOfDay(new Date(from));
    }

    if (to) {
      reportQuery.reportDate.$lte = endOfDay(new Date(to));
    }
  }

  const reports: any[] = await MarketingReport.find(reportQuery)
    .populate({
      path: "user",
      select:
        "employeeCode profileImageUrl coverImageUrl fullName username email phone role status department",
      populate: {
        path: "department",
        select: "name type departmentCode shortCode",
      },
    })
    .sort({
      reportDate: -1,
      updatedAt: -1,
    })
    .lean();

  const dateWiseMap = new Map<string, any>();

  for (const report of reports) {
    const reportId = report._id.toString();
    const userId = report.user?._id?.toString();

    if (!userId) continue;

    const dateKey = getDateKey(report.reportDate);
    const mapKey = `${userId}-${dateKey}`;
    const countryKey = report.country || "UNKNOWN";

    if (!dateWiseMap.has(mapKey)) {
      dateWiseMap.set(mapKey, {
        id: reportId,
        rowId: mapKey,

        userId,
        user: {
          ...report.user,
          id: userId,
        },

        reportDate: report.reportDate,
        combinedDateKey: dateKey,

        reportIds: [reportId],

        countrySet: new Set<string>(),
        countryMap: new Map<string, any>(),

        whatsappGroupsJoined: 0,
        telegramGroupsJoined: 0,
        facebookGroupsJoined: 0,

        whatsappPostsDone: 0,
        telegramPostsDone: 0,
        facebookPostsDone: 0,

        resourceLogin: 0,
        accountClean: 0,

        totalGroupsJoined: 0,
        totalPostsDone: 0,

        totalReports: 0,
        approvedReports: 0,
        pendingReports: 0,
        rejectedReports: 0,

        status: report.status,
        remarks: report.remarks,

        latestReportId: reportId,
        latestStatus: report.status,
        latestRemarks: report.remarks,
        latestUpdatedAt: report.updatedAt,
      });
    }

    const row = dateWiseMap.get(mapKey);

    row.reportIds.push(reportId);
    row.totalReports += 1;

    row.countrySet.add(countryKey);

    row.whatsappGroupsJoined += report.whatsappGroupsJoined ?? 0;
    row.telegramGroupsJoined += report.telegramGroupsJoined ?? 0;
    row.facebookGroupsJoined += report.facebookGroupsJoined ?? 0;

    row.whatsappPostsDone += report.whatsappPostsDone ?? 0;
    row.telegramPostsDone += report.telegramPostsDone ?? 0;
    row.facebookPostsDone += report.facebookPostsDone ?? 0;

    row.resourceLogin += report.resourceLogin ?? 0;
    row.accountClean += report.accountClean ?? 0;

    row.totalGroupsJoined += totalGroups(report);
    row.totalPostsDone += totalPosts(report);

    if (report.status === "APPROVED") row.approvedReports += 1;
    if (report.status === "PENDING") row.pendingReports += 1;
    if (report.status === "REJECTED") row.rejectedReports += 1;

    if (!row.countryMap.has(countryKey)) {
      row.countryMap.set(countryKey, {
        country: countryKey,
        countryLabel: formatCountry(countryKey),

        reports: 0,

        whatsappGroupsJoined: 0,
        whatsappPostsDone: 0,

        telegramGroupsJoined: 0,
        telegramPostsDone: 0,

        facebookGroupsJoined: 0,
        facebookPostsDone: 0,

        resourceLogin: 0,
        accountClean: 0,

        totalGroupsJoined: 0,
        totalPostsDone: 0,

        approvedReports: 0,
        pendingReports: 0,
        rejectedReports: 0,
      });
    }

    const countryRow = row.countryMap.get(countryKey);

    countryRow.reports += 1;

    countryRow.whatsappGroupsJoined += report.whatsappGroupsJoined ?? 0;
    countryRow.whatsappPostsDone += report.whatsappPostsDone ?? 0;

    countryRow.telegramGroupsJoined += report.telegramGroupsJoined ?? 0;
    countryRow.telegramPostsDone += report.telegramPostsDone ?? 0;

    countryRow.facebookGroupsJoined += report.facebookGroupsJoined ?? 0;
    countryRow.facebookPostsDone += report.facebookPostsDone ?? 0;

    countryRow.resourceLogin += report.resourceLogin ?? 0;
    countryRow.accountClean += report.accountClean ?? 0;

    countryRow.totalGroupsJoined += totalGroups(report);
    countryRow.totalPostsDone += totalPosts(report);

    if (report.status === "APPROVED") countryRow.approvedReports += 1;
    if (report.status === "PENDING") countryRow.pendingReports += 1;
    if (report.status === "REJECTED") countryRow.rejectedReports += 1;

    if (new Date(report.updatedAt) > new Date(row.latestUpdatedAt)) {
      row.id = reportId;
      row.reportDate = report.reportDate;
      row.status = report.status;
      row.remarks = report.remarks;

      row.latestReportId = reportId;
      row.latestStatus = report.status;
      row.latestRemarks = report.remarks;
      row.latestUpdatedAt = report.updatedAt;
    }
  }

  const groupedReports = Array.from(dateWiseMap.values()).map((row) => {
    const countries = Array.from(row.countrySet);
    const countryBreakdown = Array.from(row.countryMap.values());

    delete row.countrySet;
    delete row.countryMap;

    return {
      ...row,

      reportDate: row.reportDate?.toISOString(),
      latestUpdatedAt: row.latestUpdatedAt?.toISOString(),

      country: countries.join(", ") || "-",
      countryLabels:
        countries.map((country) => formatCountry(country as string)).join(", ") ||
        "-",

      countries,
      countryBreakdown,

      reportIds: Array.from(new Set(row.reportIds)),
    };
  });

  groupedReports.sort((a, b) => {
    const dateDiff =
      new Date(b.reportDate).getTime() - new Date(a.reportDate).getTime();

    if (dateDiff !== 0) return dateDiff;

    return (
      new Date(b.latestUpdatedAt).getTime() -
      new Date(a.latestUpdatedAt).getTime()
    );
  });

  return JSON.parse(JSON.stringify(groupedReports));
}