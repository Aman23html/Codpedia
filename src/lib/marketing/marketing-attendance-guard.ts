import { connectDB } from "@/lib/mongodb";
import { Attendance } from "@/models/Attendance";

export async function assertActiveMarketingAttendanceWindow(userId: string) {
  await connectDB();

  const latestAttendance: any = await Attendance.findOne({
    user: userId,
  })
    .sort({
      checkIn: -1,
    })
    .lean();

  if (!latestAttendance?.checkIn) {
    throw new Error("Please check in first before submitting marketing work.");
  }

  const windowEnd = new Date(latestAttendance.checkIn);
  windowEnd.setHours(windowEnd.getHours() + 24);

  const now = new Date();

  if (now > windowEnd) {
    throw new Error(
      "Your  attendance window has expired. Please check in again to start a new marketing work cycle."
    );
  }

  return {
    attendance: latestAttendance,
    windowEnd,
  };
}