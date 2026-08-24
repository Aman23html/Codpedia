"use server";

import { connectDB } from "@/lib/mongodb";
import { getCurrentUser } from "@/lib/current-user";

import { User } from "@/models/User";
import { MarketingReport } from "@/models/MarketingReport";
import { EmployeeOperationReport } from "@/models/EmployeeOperationReport";
import { Attendance } from "@/models/Attendance";

import {
  AttendanceStatus,
  DepartmentType,
  OperationReportStatus,
  ReportStatus,
  Role,
  UserStatus,
} from "@/constants/enums";

function getTodayRangeIST() {
  const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000;
  const now = new Date();
  const istNow = new Date(now.getTime() + IST_OFFSET_MS);
  istNow.setUTCHours(0, 0, 0, 0);

  const start = new Date(istNow.getTime() - IST_OFFSET_MS);
  const end = new Date(start);
  end.setUTCDate(end.getUTCDate() + 1);

  return { start, end };
}

export async function getDashboardStats() {
  await connectDB();

  const currentUser = await getCurrentUser();

  if (!currentUser || currentUser.role !== Role.INCHARGE) {
    throw new Error("Unauthorized");
  }

  if (!currentUser.departmentId) {
    throw new Error("Department not found");
  }

  const { start: startOfDay, end: endOfDay } = getTodayRangeIST();
  const isOperations =
    currentUser.department?.type === DepartmentType.OPERATIONS;
  const ReportModel = isOperations
    ? EmployeeOperationReport
    : MarketingReport;

  const departmentUsers = await User.find({
    department: currentUser.departmentId,
    role: Role.EMPLOYEE,
  })
    .select("_id status")
    .lean();

  const userIds = departmentUsers.map((user: any) => user._id);

  const [
    totalEmployees,
    activeEmployees,
    pendingEmployees,
    totalReports,
    pendingReports,
    approvedReports,
    rejectedReports,
    todayReports,
    todayAttendance,
    presentAttendance,
    absentAttendance,
    leaveAttendance,
    halfDayAttendance,
  ] = await Promise.all([
    User.countDocuments({
      department: currentUser.departmentId,
      role: Role.EMPLOYEE,
    }),

    User.countDocuments({
      department: currentUser.departmentId,
      role: Role.EMPLOYEE,
      status: UserStatus.ACTIVE,
    }),

    User.countDocuments({
      department: currentUser.departmentId,
      role: Role.EMPLOYEE,
      status: UserStatus.PENDING_APPROVAL,
    }),

    ReportModel.countDocuments({
      user: { $in: userIds },
    }),

    ReportModel.countDocuments({
      user: { $in: userIds },
      status: isOperations
        ? {
            $in: [
              OperationReportStatus.SUBMITTED,
              OperationReportStatus.CORRECTION_REQUIRED,
            ],
          }
        : ReportStatus.PENDING,
    }),

    ReportModel.countDocuments({
      user: { $in: userIds },
      status: isOperations
        ? OperationReportStatus.VERIFIED
        : ReportStatus.APPROVED,
    }),

    ReportModel.countDocuments({
      user: { $in: userIds },
      status: isOperations
        ? OperationReportStatus.REJECTED
        : ReportStatus.REJECTED,
    }),

    ReportModel.countDocuments({
      user: { $in: userIds },
      reportDate: {
        $gte: startOfDay,
        $lt: endOfDay,
      },
    }),

    Attendance.countDocuments({
      user: { $in: userIds },
      attendanceDate: {
        $gte: startOfDay,
        $lt: endOfDay,
      },
    }),

    Attendance.countDocuments({
      user: { $in: userIds },
      attendanceDate: { $gte: startOfDay, $lt: endOfDay },
      status: AttendanceStatus.PRESENT,
    }),

    Attendance.countDocuments({
      user: { $in: userIds },
      attendanceDate: { $gte: startOfDay, $lt: endOfDay },
      status: AttendanceStatus.ABSENT,
    }),

    Attendance.countDocuments({
      user: { $in: userIds },
      attendanceDate: { $gte: startOfDay, $lt: endOfDay },
      status: AttendanceStatus.LEAVE,
    }),

    Attendance.countDocuments({
      user: { $in: userIds },
      attendanceDate: { $gte: startOfDay, $lt: endOfDay },
      status: AttendanceStatus.HALF_DAY,
    }),
  ]);

  const teamHealth =
    totalEmployees > 0
      ? Math.min(
          100,
          Math.round(
            ((presentAttendance + halfDayAttendance * 0.5) / totalEmployees) *
              100
          )
        )
      : 0;

  return {
    totalEmployees,
    activeEmployees,
    pendingEmployees,

    totalReports,
    pendingReports,
    approvedReports,
    rejectedReports,
    todayReports,

    todayAttendance,
    presentAttendance,
    absentAttendance,
    leaveAttendance,
    halfDayAttendance,
    teamHealth,
  };
}