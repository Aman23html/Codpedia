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
      checkIn: -1,
    })
    .limit(30)
    .lean();

  return attendance.map((record: any) => ({
    id: record._id.toString(),
    _id: record._id.toString(),

    attendanceDate: record.attendanceDate
      ? record.attendanceDate.toISOString()
      : null,

    checkIn: record.checkIn ? record.checkIn.toISOString() : null,

    checkOut: record.checkOut ? record.checkOut.toISOString() : null,

    status: record.status,
    remarks: record.remarks || null,

    createdAt: record.createdAt ? record.createdAt.toISOString() : null,
    updatedAt: record.updatedAt ? record.updatedAt.toISOString() : null,
  }));
}