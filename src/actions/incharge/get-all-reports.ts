"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/current-user";
import { Role } from "@prisma/client";

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
  const currentUser = await getCurrentUser();

  if (!currentUser || currentUser.role !== Role.INCHARGE) {
    throw new Error("Unauthorized");
  }

  const searchQuery = getStringValue(searchParams?.search);
  const status = getStringValue(searchParams?.status) || "ALL";
  const from = getStringValue(searchParams?.from);
  const to = getStringValue(searchParams?.to);

  const where: any = {
    user: {
      departmentId: currentUser.departmentId,
    },
  };

  if (status !== "ALL") {
    where.status = status;
  }

  if (from || to) {
    where.reportDate = {};

    if (from) {
      where.reportDate.gte = startOfDay(new Date(from));
    }

    if (to) {
      where.reportDate.lte = endOfDay(new Date(to));
    }
  }

  if (searchQuery) {
    where.user.OR = [
      {
        employeeCode: {
          contains: searchQuery,
          mode: "insensitive",
        },
      },
      {
        fullName: {
          contains: searchQuery,
          mode: "insensitive",
        },
      },
      {
        username: {
          contains: searchQuery,
          mode: "insensitive",
        },
      },
      {
        email: {
          contains: searchQuery,
          mode: "insensitive",
        },
      },
      {
        phone: {
          contains: searchQuery,
          mode: "insensitive",
        },
      },
    ];
  }

  const reports = await prisma.marketingReport.findMany({
    where,

    include: {
      user: {
        select: {
          id: true,
          employeeCode: true,
          profileImageUrl: true,
          coverImageUrl: true,
          fullName: true,
          username: true,
          email: true,
          phone: true,
          role: true,
          status: true,
          department: {
            select: {
              id: true,
              name: true,
              type: true,
            },
          },
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
    const countryKey = report.country || "UNKNOWN";

    if (!dateWiseMap.has(mapKey)) {
      dateWiseMap.set(mapKey, {
        id: report.id,
        rowId: mapKey,

        userId: report.userId,
        user: report.user,

        reportDate: report.reportDate,
        combinedDateKey: dateKey,

        reportIds: [report.id],

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

        latestReportId: report.id,
        latestStatus: report.status,
        latestRemarks: report.remarks,
        latestUpdatedAt: report.updatedAt,
      });
    }

    const row = dateWiseMap.get(mapKey);

    row.reportIds.push(report.id);
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

    if (report.updatedAt > row.latestUpdatedAt) {
      row.id = report.id;
      row.reportDate = report.reportDate;
      row.status = report.status;
      row.remarks = report.remarks;

      row.latestReportId = report.id;
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

      country: countries.join(", ") || "-",
      countryLabels:
        countries.map((country) => formatCountry(country as string)).join(", ") || "-",

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

  return groupedReports;
}