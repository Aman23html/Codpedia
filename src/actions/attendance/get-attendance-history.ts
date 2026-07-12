"use server";

import { connectDB } from "@/lib/mongodb";
import { getCurrentUser } from "@/lib/current-user";
import { Attendance } from "@/models/Attendance";

export async function getAttendanceHistory() {
  await connectDB();

  const currentUser = await getCurrentUser();

  if (!currentUser) {
    throw new Error("Unauthorized");
  }

  const attendance = await Attendance.find({
    user: currentUser.id,
  })
    .sort({
      attendanceDate: -1,
    })
    .limit(30)
    .lean();

  return JSON.parse(JSON.stringify(attendance));
}