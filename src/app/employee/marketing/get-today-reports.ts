"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/current-user";

export async function getTodayReports() {
  const user = await getCurrentUser();

  if (!user) {
    return [];
  }

  const today = new Date();

  today.setHours(0, 0, 0, 0);

  return prisma.marketingReport.findMany({
    where: {
      userId: user.id,
      reportDate: today,
    },
    orderBy: {
      country: "asc",
    },
  });
}