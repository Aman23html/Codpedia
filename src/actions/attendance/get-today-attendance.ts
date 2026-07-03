"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/current-user";
import { getAttendanceWindowEnd } from "@/lib/attendance/attendance-window";

export async function getTodayAttendance() {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    throw new Error("Unauthorized");
  }

  const latestAttendance = await prisma.attendance.findFirst({
    where: {
      userId: currentUser.id,
    },
    orderBy: {
      checkIn: "desc",
    },
  });

  if (!latestAttendance?.checkIn) {
    return null;
  }

  const now = new Date();
  const windowEnd = getAttendanceWindowEnd(latestAttendance.checkIn);

  if (now > windowEnd) {
    return null;
  }

  return latestAttendance;
}