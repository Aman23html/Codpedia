"use server";

import { connectDB } from "@/lib/mongodb";
import { Attendance } from "@/models/Attendance";

export async function getAttendance() {
  try {
    await connectDB();

    const attendance = await Attendance.find()
      .populate({
        path: "user",
        select:
          "employeeCode fullName username email phone role status department",
        populate: {
          path: "department",
          select: "name type departmentCode shortCode",
        },
      })
      .sort({
        attendanceDate: -1,
      })
      .lean();

    return JSON.parse(JSON.stringify(attendance));
  } catch (error) {
    console.error("Get attendance error:", error);
    return [];
  }
}