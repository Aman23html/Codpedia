import { prisma } from "@/lib/prisma";

export async function assertActiveAttendanceWindow(userId: string) {
  const latestAttendance = await prisma.attendance.findFirst({
    where: {
      userId,
    },
    orderBy: {
      checkIn: "desc",
    },
  });

  if (!latestAttendance?.checkIn) {
    throw new Error("Please check in first before submitting operations work.");
  }

  const windowEnd = new Date(latestAttendance.checkIn);
  windowEnd.setHours(windowEnd.getHours() + 24);

  const now = new Date();

  if (now > windowEnd) {
    throw new Error(
      "Your 24-hour attendance window has expired. Please check in again to start a new work cycle."
    );
  }

  return latestAttendance;
}