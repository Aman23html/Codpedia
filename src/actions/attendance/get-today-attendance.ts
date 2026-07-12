"use server";

import { connectDB } from "@/lib/mongodb";
import { getCurrentUser } from "@/lib/current-user";
import { Attendance } from "@/models/Attendance";
import { getAttendanceWindowEnd } from "@/lib/attendance/attendance-window";

export async function getTodayAttendance() {
  await connectDB();

  const currentUser = await getCurrentUser();

  if (!currentUser) {
    throw new Error("Unauthorized");
  }

  const latestAttendance = await Attendance.findOne({
    user: currentUser.id,
  })
    .sort({
      checkIn: -1,
    })
    .lean();

  if (!latestAttendance?.checkIn) {
    return null;
  }

  const now = new Date();
  const windowEnd = getAttendanceWindowEnd(latestAttendance.checkIn);

  if (now > windowEnd) {
    return null;
  }

  return JSON.parse(JSON.stringify(latestAttendance));
}