"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/current-user";
import { Role } from "@prisma/client";
import { getAttendanceWindowEnd } from "@/lib/attendance/attendance-window";

export async function checkOut() {
  const currentUser = await getCurrentUser();

  if (!currentUser || currentUser.role !== Role.EMPLOYEE) {
    throw new Error("Unauthorized");
  }

  const now = new Date();

  const attendance = await prisma.attendance.findFirst({
    where: {
      userId: currentUser.id,
    },
    orderBy: {
      checkIn: "desc",
    },
  });

  if (!attendance || !attendance.checkIn) {
    throw new Error("Check in first");
  }

  const windowEnd = getAttendanceWindowEnd(attendance.checkIn);

  if (now > windowEnd) {
    throw new Error(
      "Your 24-hour attendance window has expired. Please start a new check-in cycle."
    );
  }

  if (attendance.checkOut) {
    throw new Error("Already checked out");
  }

  await prisma.attendance.update({
    where: {
      id: attendance.id,
    },
    data: {
      checkOut: now,
    },
  });

  return {
    success: true,
  };
}