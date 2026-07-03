"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/current-user";

export async function getAttendanceHistory() {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    throw new Error("Unauthorized");
  }

  return prisma.attendance.findMany({
    where: {
      userId: currentUser.id,
    },

    orderBy: {
      attendanceDate: "desc",
    },

    take: 30,
  });
}