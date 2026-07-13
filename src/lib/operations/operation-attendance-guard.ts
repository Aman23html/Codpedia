import { connectDB } from "@/lib/mongodb";
import { Attendance } from "@/models/Attendance";

export async function assertActiveAttendanceWindow(userId: string) {
  await connectDB();

  const latestAttendance: any = await Attendance.findOne({
    user: userId,
  })
    .sort({
      checkIn: -1,
    })
    .lean();

  if (!latestAttendance?.checkIn) {
    throw new Error("Please check in first before submitting operations work.");
  }

  const windowEnd = new Date(latestAttendance.checkIn);
  windowEnd.setHours(windowEnd.getHours() + 24);

  const now = new Date();

  if (now > windowEnd) {
    throw new Error(
      "Your  attendance window has expired. Please check in again to start a new work cycle."
    );
  }

  return latestAttendance;
}