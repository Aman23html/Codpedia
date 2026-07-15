"use server";

import { connectDB } from "@/lib/mongodb";
import { getCurrentUser } from "@/lib/current-user";
import { Attendance } from "@/models/Attendance";
import { Role } from "@/constants/enums";
import { getAttendanceWindowEnd } from "@/lib/attendance/attendance-window";

export async function getTodayAttendance() {
  await connectDB();

  const currentUser = await getCurrentUser();

  if (!currentUser || currentUser.role !== Role.EMPLOYEE) {
    return null;
  }

  const latestAttendance: any = await Attendance.findOne({
    user: currentUser.id,
  })
    .sort({ checkIn: -1 })
    .lean();

  if (!latestAttendance?.checkIn) {
    return null;
  }

  const now = new Date();
  const windowEnd = getAttendanceWindowEnd(latestAttendance.checkIn);

  // IMPORTANT:
  // If old attendance window expired and employee did not check out,
  // do not return it to dashboard/card.
  // This allows "Start Check-In" to show again.
  if (now > windowEnd) {
    return null;
  }

  return {
    id: latestAttendance._id.toString(),
    _id: latestAttendance._id.toString(),

    user: latestAttendance.user?.toString?.() || String(latestAttendance.user),

    attendanceDate: latestAttendance.attendanceDate
      ? latestAttendance.attendanceDate.toISOString()
      : null,

    checkIn: latestAttendance.checkIn
      ? latestAttendance.checkIn.toISOString()
      : null,

    checkOut: latestAttendance.checkOut
      ? latestAttendance.checkOut.toISOString()
      : null,

    status: latestAttendance.status,
    remarks: latestAttendance.remarks || null,

    createdAt: latestAttendance.createdAt
      ? latestAttendance.createdAt.toISOString()
      : null,

    updatedAt: latestAttendance.updatedAt
      ? latestAttendance.updatedAt.toISOString()
      : null,

    windowEnd: windowEnd.toISOString(),
    isWindowActive: now <= windowEnd,
  };
}