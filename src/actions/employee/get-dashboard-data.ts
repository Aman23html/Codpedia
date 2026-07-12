"use server";

import { connectDB } from "@/lib/mongodb";
import { getCurrentUser } from "@/lib/current-user";

import { Attendance } from "@/models/Attendance";
import { MarketingReport } from "@/models/MarketingReport";
import { EmployeeOperationReport } from "@/models/EmployeeOperationReport";

import { DepartmentType, Role } from "@/constants/enums";

function getGreeting() {
  const hour = new Date().getHours();

  if (hour < 12) return "Good Morning";
  if (hour < 17) return "Good Afternoon";
  return "Good Evening";
}

function getTodayRange() {
  const start = new Date();
  start.setHours(0, 0, 0, 0);

  const end = new Date(start);
  end.setDate(end.getDate() + 1);

  return { start, end };
}

async function getDepartmentReportCount(
  userId: string,
  department?: string
) {
  if (department === DepartmentType.OPERATIONS) {
    return EmployeeOperationReport.countDocuments({
      user: userId,
    });
  }

  if (department === DepartmentType.MARKETING) {
    return MarketingReport.countDocuments({
      user: userId,
    });
  }

  return 0;
}

export async function getDashboardData() {
  await connectDB();

  const user = await getCurrentUser();

  if (!user || user.role !== Role.EMPLOYEE) {
    return null;
  }

  const { start, end } = getTodayRange();

  const [todayAttendance, totalReports] = await Promise.all([
    Attendance.findOne({
      user: user.id,
      attendanceDate: {
        $gte: start,
        $lt: end,
      },
    })
      .sort({
        createdAt: -1,
      })
      .lean(),

    getDepartmentReportCount(user.id, user.department?.type),
  ]);

  return {
    employee: user,

    greeting: getGreeting(),

    todayAttendance: todayAttendance
      ? JSON.parse(JSON.stringify(todayAttendance))
      : null,

    stats: {
      attendancePercentage: 0,
      totalReports,
      leaveBalance: 0,
      performance: "Good",
    },
  };
}