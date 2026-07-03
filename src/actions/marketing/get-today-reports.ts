"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/current-user";
import { getTodayAttendance } from "@/actions/attendance/get-today-attendance";

export async function getTodayReports() {
  const user = await getCurrentUser();

  if (!user) {
    return [];
  }

  const attendance = await getTodayAttendance();

  if (!attendance?.checkIn) {
    return [];
  }

  const windowEnd = new Date(attendance.checkIn);
  windowEnd.setHours(windowEnd.getHours() + 24);

  return prisma.marketingReport.findMany({
    where: {
      userId: user.id,
      createdAt: {
        gte: attendance.checkIn,
        lte: windowEnd,
      },
    },

    include: {
      user: {
        select: {
          id: true,
          employeeCode: true,
          profileImageUrl: true,
          fullName: true,
          username: true,
          email: true,
          phone: true,
          role: true,
          status: true,
          department: {
            select: {
              id: true,
              name: true,
              type: true,
            },
          },
        },
      },
    },

    orderBy: {
      country: "asc",
    },
  });
}