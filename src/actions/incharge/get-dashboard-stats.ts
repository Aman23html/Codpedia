"use server";

import { connectDB } from "@/lib/mongodb";
import { getCurrentUser } from "@/lib/current-user";

import { User } from "@/models/User";
import { MarketingReport } from "@/models/MarketingReport";
import { Attendance } from "@/models/Attendance";

import { ReportStatus, Role, UserStatus } from "@/constants/enums";

export async function getDashboardStats() {
  await connectDB();

  const currentUser = await getCurrentUser();

  console.log("DASHBOARD CURRENT USER:", currentUser);

  if (!currentUser || currentUser.role !== Role.INCHARGE) {
    throw new Error("Unauthorized");
  }

  if (!currentUser.departmentId) {
    throw new Error("Department not found");
  }

  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);

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

    MarketingReport.countDocuments({
      user: { $in: userIds },
    }),

    MarketingReport.countDocuments({
      user: { $in: userIds },
      status: ReportStatus.PENDING,
    }),

    MarketingReport.countDocuments({
      user: { $in: userIds },
      status: ReportStatus.APPROVED,
    }),

    MarketingReport.countDocuments({
      user: { $in: userIds },
      status: ReportStatus.REJECTED,
    }),

    MarketingReport.countDocuments({
      user: { $in: userIds },
      reportDate: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
    }),

    Attendance.countDocuments({
      user: { $in: userIds },
      attendanceDate: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
    }),
  ]);

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
  };
}