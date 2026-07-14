"use server";

import { connectDB } from "@/lib/mongodb";
import { getCurrentUser } from "@/lib/current-user";
import { Attendance } from "@/models/Attendance";
import { Role } from "@/constants/enums";
import { ATTENDANCE_WINDOW_HOURS } from "@/constants/attendance";
import { getAttendanceWindowEnd } from "@/lib/attendance/attendance-window";

export async function checkOut() {
  await connectDB();

  const currentUser = await getCurrentUser();

  if (!currentUser || currentUser.role !== Role.EMPLOYEE) {
    throw new Error("Unauthorized");
  }

  const now = new Date();

  const attendance: any = await Attendance.findOne({
    user: currentUser.id,
  }).sort({
    checkIn: -1,
  });

  if (!attendance || !attendance.checkIn) {
    throw new Error("Check in first");
  }

  const windowEnd = getAttendanceWindowEnd(attendance.checkIn);

  if (now > windowEnd) {
    throw new Error(
       `Your ${ATTENDANCE_WINDOW_HOURS}-hour attendance window has expired. Please start a new check-in cycle.`
    );
  }

  if (attendance.checkOut) {
    throw new Error("Already checked out");
  }

  await Attendance.findByIdAndUpdate(attendance._id, {
    checkOut: now,
  });

  return {
    success: true,
  };
}