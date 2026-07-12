"use server";

import mongoose from "mongoose";

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

function getDateRange({
  filter,
  startDate,
  endDate,
}: {
  filter?: string;
  startDate?: string;
  endDate?: string;
}) {
  if (startDate || endDate) {
    const range: {
      $gte?: Date;
      $lte?: Date;
    } = {};

    if (startDate) {
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
      range.$gte = start;
    }

    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      range.$lte = end;
    }

    return range;
  }

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

function isValidOperationStatus(status: string) {
  return Object.values(OperationReportStatus).includes(status as any);
}

export async function getOwnerOperationsUserAnalytics({
  userId,
  filter = "ALL",
  status = "ALL",
  startDate,
  endDate,
}: {
  userId: string;
  filter?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
}) {
  await connectDB();

  const currentUser = await getCurrentUser();

  if (!currentUser || currentUser.role !== Role.OWNER) {
    throw new Error("Unauthorized");
  }

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return null;
  }

  const operationsDepartment = await Department.findOne({
    type: DepartmentType.OPERATIONS,
  }).lean();

  if (!operationsDepartment) {
    return null;
  }

  const employee: any = await User.findOne({
    _id: userId,
    role: Role.EMPLOYEE,
    department: operationsDepartment._id,
  })
    .populate({
      path: "department",
      select: "name type departmentCode shortCode",
    })
    .select("fullName email username phone status createdAt department")
    .lean();

  if (!employee) {
    return null;
  }

  const dateRange = getDateRange({
    filter,
    startDate,
    endDate,
  });

  const reportQuery: any = {
    user: employee._id,
  };

  if (dateRange) {
    reportQuery.reportDate = dateRange;
  }

  if (status !== "ALL" && isValidOperationStatus(status)) {
    reportQuery.status = status;
  }

  const reports: any[] = await EmployeeOperationReport.find(reportQuery)
    .sort({
      reportDate: 1,
    })
    .lean();

  const summary = reports.reduce(
    (acc, report) => {
      acc.totalReports += 1;

      acc.queryGenerated += report.queryGenerated ?? 0;
      acc.dealsDone += report.dealsDone ?? 0;
      acc.tutorAssigned += report.tutorAssigned ?? 0;
      acc.dealsDoneAmount += report.dealsDoneAmount ?? 0;

      if (report.status === OperationReportStatus.VERIFIED) acc.verified += 1;
      if (report.status === OperationReportStatus.SUBMITTED) acc.pending += 1;
      if (report.status === OperationReportStatus.REJECTED) acc.rejected += 1;
      if (report.status === OperationReportStatus.DRAFT) acc.draft += 1;

      return acc;
    },
    {
      totalReports: 0,
      queryGenerated: 0,
      dealsDone: 0,
      tutorAssigned: 0,
      dealsDoneAmount: 0,
      verified: 0,
      pending: 0,
      rejected: 0,
      draft: 0,
    }
  );

  const approvalRate =
    summary.totalReports > 0
      ? Math.round((summary.verified / summary.totalReports) * 100)
      : 0;

  const chartMap = new Map<string, any>();

  for (const report of reports) {
    const date = new Date(report.reportDate).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
    });

    if (!chartMap.has(date)) {
      chartMap.set(date, {
        date,
        queryGenerated: 0,
        dealsDone: 0,
        tutorAssigned: 0,
        dealsDoneAmount: 0,
      });
    }

    const row = chartMap.get(date);

    row.queryGenerated += report.queryGenerated ?? 0;
    row.dealsDone += report.dealsDone ?? 0;
    row.tutorAssigned += report.tutorAssigned ?? 0;
    row.dealsDoneAmount += report.dealsDoneAmount ?? 0;
  }

  const statusRows = [
    {
      label: "Verified",
      value: summary.verified,
      status: OperationReportStatus.VERIFIED,
    },
    {
      label: "Pending",
      value: summary.pending,
      status: OperationReportStatus.SUBMITTED,
    },
    {
      label: "Rejected",
      value: summary.rejected,
      status: OperationReportStatus.REJECTED,
    },
    {
      label: "Draft",
      value: summary.draft,
      status: OperationReportStatus.DRAFT,
    },
  ];

  const plainEmployee = {
    id: employee._id.toString(),
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
    statusRows,
    chartData: Array.from(chartMap.values()),

    reports: reports.map((report) => ({
      id: report._id.toString(),
      userId: report.user?.toString(),
      reportDate: report.reportDate?.toISOString(),

      queryGenerated: report.queryGenerated ?? 0,
      dealsDone: report.dealsDone ?? 0,
      tutorAssigned: report.tutorAssigned ?? 0,
      dealsDoneAmount: report.dealsDoneAmount ?? 0,

      workNotes: report.workNotes,
      status: report.status,

      submittedAt: report.submittedAt?.toISOString(),
      lockedAt: report.lockedAt?.toISOString(),
      reviewedBy: report.reviewedBy?.toString() || null,
      reviewedAt: report.reviewedAt?.toISOString(),
      reviewRemarks: report.reviewRemarks,

      createdAt: report.createdAt?.toISOString(),
      updatedAt: report.updatedAt?.toISOString(),
    })),
  };
}