"use server";

import { connectDB } from "@/lib/mongodb";
import { getCurrentUser } from "@/lib/current-user";
import { Attendance } from "@/models/Attendance";
import { AttendanceStatus, Role } from "@/constants/enums";
import {
  getAttendanceDateFromCheckIn,
  getAttendanceWindowEnd,
} from "@/lib/attendance/attendance-window";

export async function checkIn() {
  await connectDB();

  const currentUser = await getCurrentUser();

  if (!currentUser || currentUser.role !== Role.EMPLOYEE) {
    throw new Error("Unauthorized");
  }

  const now = new Date();

  const latestAttendance = await Attendance.findOne({
    user: currentUser.id,
  })
    .sort({
      checkIn: -1,
    })
    .lean();

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

  await Attendance.create({
    user: currentUser.id,
    attendanceDate,
    checkIn: now,
    status,
  });

  return {
    success: true,
  };
}