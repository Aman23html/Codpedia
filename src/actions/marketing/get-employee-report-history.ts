"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/current-user";

export async function getEmployeeReportHistory(filter: string = "ALL") {
  const user = await getCurrentUser();

  if (!user) throw new Error("Unauthorized");

  const today = new Date();

  const where: any = {
    userId: user.id,
  };

  if (filter === "TODAY") {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    where.createdAt = { gte: start };
  } else if (filter === "7_DAYS") {
    const start = new Date();
    start.setDate(today.getDate() - 7);
    where.createdAt = { gte: start };
  } else if (filter === "30_DAYS") {
    const start = new Date();
    start.setDate(today.getDate() - 30);
    where.createdAt = { gte: start };
  }

  return prisma.marketingReport.findMany({
    where,

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
        },
      },
    },

    orderBy: {
      createdAt: "desc",
    },
  });
}