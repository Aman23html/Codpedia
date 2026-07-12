"use server";

import { connectDB } from "@/lib/mongodb";
import { getCurrentUser } from "@/lib/current-user";

import { Department } from "@/models/Department";
import { User } from "@/models/User";
import { EmployeeOperationReport } from "@/models/EmployeeOperationReport";

import {
  DepartmentType,
  OperationReportStatus,
  Role,
} from "@/constants/enums";

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

export async function getOwnerOperationsAnalytics(searchParams?: {
  filter?: string;
  status?: string;
  search?: string;
}) {
  await connectDB();

  const currentUser = await getCurrentUser();

  if (!currentUser || currentUser.role !== Role.OWNER) {
    throw new Error("Unauthorized");
  }

  const filter = searchParams?.filter ?? "ALL";
  const status = searchParams?.status ?? "ALL";
  const search = searchParams?.search?.trim() ?? "";

  const dateRange = getDateRange(filter);

  const operationsDepartment = await Department.findOne({
    type: DepartmentType.OPERATIONS,
  }).lean();

  if (!operationsDepartment) {
    return {
      totalEmployees: 0,
      totalReports: 0,
      approvedReports: 0,
      pendingReports: 0,
      rejectedReports: 0,
      draftReports: 0,
      approvalRate: 0,
      totalQueryGenerated: 0,
      totalDealsDone: 0,
      totalTutorAssigned: 0,
      totalDealsDoneAmount: 0,
      employees: [],
    };
  }

  const userQuery: any = {
    role: Role.EMPLOYEE,
    department: operationsDepartment._id,
  };

  if (search) {
    userQuery.$or = [
      { fullName: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
      { username: { $regex: search, $options: "i" } },
      { employeeCode: { $regex: search, $options: "i" } },
      { phone: { $regex: search, $options: "i" } },
    ];
  }

  const operationsUsers = await User.find(userQuery)
    .select("employeeCode fullName email username phone")
    .lean();

  const userIds = operationsUsers.map((user: any) => user._id);

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
    EmployeeOperationReport.find(reportQuery)
      .populate({
        path: "user",
        select: "employeeCode fullName email username phone",
      })
      .sort({
        reportDate: -1,
      })
      .lean(),

    User.countDocuments({
      role: Role.EMPLOYEE,
      department: operationsDepartment._id,
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
        fullName: reportUser.fullName,
        email: reportUser.email,
        username: reportUser.username,
        phone: reportUser.phone,

        totalReports: 0,
        approved: 0,
        pending: 0,
        rejected: 0,
        draft: 0,

        queryGenerated: 0,
        dealsDone: 0,
        tutorAssigned: 0,
        dealsDoneAmount: 0,

        lastReportDate: report.reportDate,
      });
    }

    const row = employeeMap.get(userId);

    row.totalReports += 1;

    row.queryGenerated += report.queryGenerated ?? 0;
    row.dealsDone += report.dealsDone ?? 0;
    row.tutorAssigned += report.tutorAssigned ?? 0;
    row.dealsDoneAmount += report.dealsDoneAmount ?? 0;

    if (report.status === OperationReportStatus.VERIFIED) row.approved += 1;
    if (report.status === OperationReportStatus.SUBMITTED) row.pending += 1;
    if (report.status === OperationReportStatus.REJECTED) row.rejected += 1;
    if (report.status === OperationReportStatus.DRAFT) row.draft += 1;

    if (new Date(report.reportDate) > new Date(row.lastReportDate)) {
      row.lastReportDate = report.reportDate;
    }
  }

  const employeeRows = Array.from(employeeMap.values()).map((row) => ({
    ...row,
    lastReportDate: row.lastReportDate
      ? new Date(row.lastReportDate).toISOString()
      : null,
  }));

  const totalReports = reports.length;

  const approvedReports = reports.filter(
    (report: any) => report.status === OperationReportStatus.VERIFIED
  ).length;

  const pendingReports = reports.filter(
    (report: any) => report.status === OperationReportStatus.SUBMITTED
  ).length;

  const rejectedReports = reports.filter(
    (report: any) => report.status === OperationReportStatus.REJECTED
  ).length;

  const draftReports = reports.filter(
    (report: any) => report.status === OperationReportStatus.DRAFT
  ).length;

  const approvalRate =
    totalReports > 0 ? Math.round((approvedReports / totalReports) * 100) : 0;

  return {
    totalEmployees,
    totalReports,
    approvedReports,
    pendingReports,
    rejectedReports,
    draftReports,
    approvalRate,

    totalQueryGenerated: reports.reduce(
      (sum: number, report: any) => sum + (report.queryGenerated ?? 0),
      0
    ),

    totalDealsDone: reports.reduce(
      (sum: number, report: any) => sum + (report.dealsDone ?? 0),
      0
    ),

    totalTutorAssigned: reports.reduce(
      (sum: number, report: any) => sum + (report.tutorAssigned ?? 0),
      0
    ),

    totalDealsDoneAmount: reports.reduce(
      (sum: number, report: any) => sum + (report.dealsDoneAmount ?? 0),
      0
    ),

    employees: employeeRows,
  };
}