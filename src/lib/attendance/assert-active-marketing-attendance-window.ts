import { connectDB } from "@/lib/mongodb";
import { Attendance } from "@/models/Attendance";
import { ATTENDANCE_WINDOW_HOURS } from "@/constants/attendance";
import { getAttendanceWindowEnd } from "@/lib/attendance/attendance-window";

export async function assertActiveMarketingAttendanceWindow(userId: string) {
  await connectDB();

  const latestAttendance: any = await Attendance.findOne({
    user: userId,
  })
    .sort({ checkIn: -1 })
    .lean();

  if (!latestAttendance?.checkIn) {
    throw new Error("Please check in first before submitting marketing work.");
  }

  const windowEnd = getAttendanceWindowEnd(latestAttendance.checkIn);
  const now = new Date();

  if (now > windowEnd) {
    throw new Error(
      `Your ${ATTENDANCE_WINDOW_HOURS}-hour attendance window has expired. Please check in again to start a new marketing work cycle.`
    );
  }

  return {
    attendance: latestAttendance,
    windowEnd,
  };
}