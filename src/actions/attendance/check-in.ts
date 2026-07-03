"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/current-user";
import { AttendanceStatus, Role } from "@prisma/client";
import {
  getAttendanceDateFromCheckIn,
  getAttendanceWindowEnd,
} from "@/lib/attendance/attendance-window";

export async function checkIn() {
  const currentUser = await getCurrentUser();

  if (!currentUser || currentUser.role !== Role.EMPLOYEE) {
    throw new Error("Unauthorized");
  }

  const now = new Date();

  const latestAttendance = await prisma.attendance.findFirst({
    where: {
      userId: currentUser.id,
    },
    orderBy: {
      checkIn: "desc",
    },
  });

  if (latestAttendance?.checkIn) {
    const windowEnd = getAttendanceWindowEnd(latestAttendance.checkIn);

    if (now <= windowEnd) {
      throw new Error(
        "You already have an active attendance window. New check-in is allowed only after 24 hours from your last check-in."
      );
    }
  }

  const attendanceDate = getAttendanceDateFromCheckIn(now);

  const hour = now.getHours();

  const status =
    hour >= 13 ? AttendanceStatus.HALF_DAY : AttendanceStatus.PRESENT;

  await prisma.attendance.create({
    data: {
      userId: currentUser.id,
      attendanceDate,
      checkIn: now,
      status,
    },
  });

  return {
    success: true,
  };
}