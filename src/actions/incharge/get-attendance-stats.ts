"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/current-user";
import { Role, AttendanceStatus } from "@prisma/client";

export async function getAttendanceStats() {
  const currentUser = await getCurrentUser();

  if (!currentUser || currentUser.role !== Role.INCHARGE) {
    throw new Error("Unauthorized");
  }

  // Start of today
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Start of tomorrow
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const dateFilter = {
    gte: today,
    lt: tomorrow,
  };

  const [
    totalEmployees,
    present,
    absent,
    halfDay,
    leave,
    totalRecords,
  ] = await Promise.all([
    // Total Employees
    prisma.user.count({
      where: {
        departmentId: currentUser.departmentId,
        role: Role.EMPLOYEE,
      },
    }),

    // Present
    prisma.attendance.count({
      where: {
        status: AttendanceStatus.PRESENT,
        attendanceDate: dateFilter,
        user: {
          departmentId: currentUser.departmentId,
        },
      },
    }),

    // Absent
    prisma.attendance.count({
      where: {
        status: AttendanceStatus.ABSENT,
        attendanceDate: dateFilter,
        user: {
          departmentId: currentUser.departmentId,
        },
      },
    }),

    // Half Day
    prisma.attendance.count({
      where: {
        status: AttendanceStatus.HALF_DAY,
        attendanceDate: dateFilter,
        user: {
          departmentId: currentUser.departmentId,
        },
      },
    }),

    // Leave
    prisma.attendance.count({
      where: {
        status: AttendanceStatus.LEAVE,
        attendanceDate: dateFilter,
        user: {
          departmentId: currentUser.departmentId,
        },
      },
    }),

    // Total Attendance Records Today
    prisma.attendance.count({
      where: {
        attendanceDate: dateFilter,
        user: {
          departmentId: currentUser.departmentId,
        },
      },
    }),
  ]);

  return {
    totalEmployees,
    present,
    absent,
    halfDay,
    leave,
    totalRecords,
  };
}