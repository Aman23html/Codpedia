"use server";

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
  await connectDB();

  const currentUser = await getCurrentUser();

  if (!currentUser || currentUser.role !== Role.OWNER) {
    throw new Error("Unauthorized");
  }

  const filter = searchParams?.filter ?? "ALL";
  const search = searchParams?.search?.trim() ?? "";
  const status = searchParams?.status ?? "ALL";

  const dateRange = getDateRange(filter);

  const marketingDepartment = await Department.findOne({
    type: DepartmentType.MARKETING,
  }).lean();

  if (!marketingDepartment) {
    return {
      totalEmployees: 0,
      totalReports: 0,
      approvedReports: 0,
      pendingReports: 0,
      rejectedReports: 0,
      approvalRate: 0,
      northAmerica: 0,
      europe: 0,
      australia: 0,
      totalGroupsJoined: 0,
      totalPostsDone: 0,
      totalResourceLogin: 0,
      totalAccountClean: 0,
      employees: [],
    };
  }

  const userQuery: any = {
    role: Role.EMPLOYEE,
    department: marketingDepartment._id,
  };

  if (search) {
    userQuery.$or = [
      { employeeCode: { $regex: search, $options: "i" } },
      { fullName: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
      { username: { $regex: search, $options: "i" } },
      { phone: { $regex: search, $options: "i" } },
    ];
  }

  const marketingUsers = await User.find(userQuery)
    .select("employeeCode profileImageUrl fullName email username phone")
    .lean();

  const userIds = marketingUsers.map((user: any) => user._id);

  const reportQuery: any = {
    user: {
      $in: userIds,
    },
  };

  if (dateRange) {
    reportQuery.reportDate = dateRange;
  }

  if (status !== "ALL") {
    reportQuery.status = status;
  }

  const [reports, totalEmployees] = await Promise.all([
    MarketingReport.find(reportQuery)
      .populate({
        path: "user",
        select: "employeeCode profileImageUrl fullName email username phone",
      })
      .sort({
        reportDate: -1,
      })
      .lean(),

    User.countDocuments({
      role: Role.EMPLOYEE,
      department: marketingDepartment._id,
    }),
  ]);

  const employeeMap = new Map<string, any>();

  for (const report of reports as any[]) {
    const reportUser = report.user;

    if (!reportUser) continue;

    const userId = reportUser._id.toString();

    if (!employeeMap.has(userId)) {
      employeeMap.set(userId, {
        userId,
        employeeCode: reportUser.employeeCode,
        profileImageUrl: reportUser.profileImageUrl || null,
        fullName: reportUser.fullName,
        email: reportUser.email,
        username: reportUser.username,
        phone: reportUser.phone,
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

    const row = employeeMap.get(userId);

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
    lastReportDate: row.lastReportDate
      ? new Date(row.lastReportDate).toISOString()
      : null,
  }));

  const totalReports = reports.length;

  const approvedReports = reports.filter(
    (report: any) => report.status === "APPROVED"
  ).length;

  const pendingReports = reports.filter(
    (report: any) => report.status === "PENDING"
  ).length;

  const rejectedReports = reports.filter(
    (report: any) => report.status === "REJECTED"
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
      (report: any) => report.country === "NORTH_AMERICA"
    ).length,

    europe: reports.filter((report: any) => report.country === "EUROPE").length,

    australia: reports.filter(
      (report: any) => report.country === "AUSTRALIA"
    ).length,

    totalGroupsJoined: reports.reduce(
      (sum: number, report: any) => sum + getTotalGroups(report),
      0
    ),

    totalPostsDone: reports.reduce(
      (sum: number, report: any) => sum + getTotalPosts(report),
      0
    ),

    totalResourceLogin: reports.reduce(
      (sum: number, report: any) => sum + (report.resourceLogin ?? 0),
      0
    ),

    totalAccountClean: reports.reduce(
      (sum: number, report: any) => sum + (report.accountClean ?? 0),
      0
    ),

    employees: employeeRows,
  };
}