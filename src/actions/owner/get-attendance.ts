"use server";

import { prisma } from "@/lib/prisma";

export async function getAttendance() {
  return prisma.attendance.findMany({
    include: {
      user: {
        include: {
          department: true,
        },
      },
    },

    orderBy: {
      attendanceDate: "desc",
    },
  });
}