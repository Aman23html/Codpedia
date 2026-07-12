"use server";

import mongoose from "mongoose";

import { connectDB } from "@/lib/mongodb";
import { getCurrentUser } from "@/lib/current-user";

import { User } from "@/models/User";
import { Department } from "@/models/Department";
import { MarketingReport } from "@/models/MarketingReport";

import { DepartmentType, Role } from "@/constants/enums";

function getDateRange(filter?: string) {
  const now = new Date();

  if (filter === "TODAY") {
    const start = new Date();
    start.setHours(0, 0, 0, 0);

    const end = new Date();
    end.setHours(23, 59, 59, 999);

    return { $gte: start, $lte: end };
  }

  if (filter === "7_DAYS") {
    const start = new Date();
    start.setDate(now.getDate() - 7);
    start.setHours(0, 0, 0, 0);

    return { $gte: start };
  }

  if (filter === "30_DAYS") {
    const start = new Date();
    start.setDate(now.getDate() - 30);
    start.setHours(0, 0, 0, 0);

    return { $gte: start };
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
  await connectDB();

  const currentUser = await getCurrentUser();

  if (!currentUser || currentUser.role !== Role.OWNER) {
    throw new Error("Unauthorized");
  }

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return null;
  }

  const marketingDepartment = await Department.findOne({
    type: DepartmentType.MARKETING,
  }).lean();

  if (!marketingDepartment) {
    return null;
  }

  const employee: any = await User.findOne({
    _id: userId,
    role: Role.EMPLOYEE,
    department: marketingDepartment._id,
  })
    .populate({
      path: "department",
      select: "name type departmentCode shortCode",
    })
    .select(
      "employeeCode profileImageUrl coverImageUrl fullName email username phone status createdAt department"
    )
    .lean();

  if (!employee) {
    return null;
  }

  const dateRange = getDateRange(filter);

  const reportQuery: any = {
    user: employee._id,
  };

  if (dateRange) {
    reportQuery.reportDate = dateRange;
  }

  if (status !== "ALL") {
    reportQuery.status = status;
  }

  const reports: any[] = await MarketingReport.find(reportQuery)
    .populate({
      path: "user",
      select: "employeeCode profileImageUrl fullName username email phone",
    })
    .sort({
      reportDate: 1,
    })
    .lean();

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

  const plainEmployee = {
    id: employee._id.toString(),
    employeeCode: employee.employeeCode,
    profileImageUrl: employee.profileImageUrl,
    coverImageUrl: employee.coverImageUrl,
    fullName: employee.fullName,
    email: employee.email,
    username: employee.username,
    phone: employee.phone,
    status: employee.status,
    createdAt: employee.createdAt?.toISOString(),
    department: employee.department
      ? {
          id: employee.department._id.toString(),
          name: employee.department.name,
          type: employee.department.type,
          departmentCode: employee.department.departmentCode,
          shortCode: employee.department.shortCode,
        }
      : null,
  };

  return {
    employee: plainEmployee,
    summary,
    approvalRate,
    countries: Array.from(countryMap.values()),
    chartData: Array.from(chartMap.values()),

    reports: reports.map((report) => ({
      id: report._id.toString(),
      userId: report.user?._id?.toString() || employee._id.toString(),
      user: report.user
        ? {
            id: report.user._id.toString(),
            employeeCode: report.user.employeeCode,
            profileImageUrl: report.user.profileImageUrl,
            fullName: report.user.fullName,
            username: report.user.username,
            email: report.user.email,
            phone: report.user.phone,
          }
        : null,

      reportDate: report.reportDate?.toISOString(),
      country: report.country,
      countryLabel: formatCountry(report.country),

      whatsappGroupsJoined: report.whatsappGroupsJoined ?? 0,
      whatsappPostsDone: report.whatsappPostsDone ?? 0,
      telegramGroupsJoined: report.telegramGroupsJoined ?? 0,
      telegramPostsDone: report.telegramPostsDone ?? 0,
      facebookGroupsJoined: report.facebookGroupsJoined ?? 0,
      facebookPostsDone: report.facebookPostsDone ?? 0,
      resourceLogin: report.resourceLogin ?? 0,
      accountClean: report.accountClean ?? 0,

      status: report.status,
      remarks: report.remarks,

      totalGroups: totalGroups(report),
      totalPosts: totalPosts(report),

      createdAt: report.createdAt?.toISOString(),
      updatedAt: report.updatedAt?.toISOString(),
    })),
  };
}