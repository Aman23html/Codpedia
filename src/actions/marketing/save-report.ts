"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/current-user";
import { assertActiveMarketingAttendanceWindow } from "@/lib/marketing/marketing-attendance-guard";

import { DepartmentType, Role } from "@prisma/client";

type MarketingCountry = "NORTH_AMERICA" | "EUROPE" | "AUSTRALIA";

type SaveMarketingReportInput = {
  country: MarketingCountry;

  whatsappGroupsJoined: number;
  whatsappPostsDone: number;

  telegramGroupsJoined: number;
  telegramPostsDone: number;

  facebookGroupsJoined: number;
  facebookPostsDone: number;

  resourceLogin: number;
  accountClean: number;
};

function toNumber(value: unknown) {
  const number = Number(value);

  if (!Number.isFinite(number)) {
    return 0;
  }

  return Math.max(0, number);
}

export async function saveMarketingReport(input: SaveMarketingReportInput) {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  if (user.role !== Role.EMPLOYEE) {
    throw new Error("Only employees can submit marketing reports");
  }

  if (!user.department || user.department.type !== DepartmentType.MARKETING) {
    throw new Error("Only marketing employees can submit marketing reports");
  }

  const { attendance } = await assertActiveMarketingAttendanceWindow(user.id);

  if (!attendance || !attendance.checkIn) {
    throw new Error("No active attendance check-in found");
  }

  const reportDate = new Date(attendance.checkIn);
  reportDate.setHours(0, 0, 0, 0);

  const existingReport = await prisma.marketingReport.findFirst({
    where: {
      userId: user.id,
      country: input.country,
      reportDate,
    },
  });

  const data = {
    country: input.country,

    whatsappGroupsJoined: toNumber(input.whatsappGroupsJoined),
    whatsappPostsDone: toNumber(input.whatsappPostsDone),

    telegramGroupsJoined: toNumber(input.telegramGroupsJoined),
    telegramPostsDone: toNumber(input.telegramPostsDone),

    facebookGroupsJoined: toNumber(input.facebookGroupsJoined),
    facebookPostsDone: toNumber(input.facebookPostsDone),

    resourceLogin: toNumber(input.resourceLogin),
    accountClean: toNumber(input.accountClean),

    status: "PENDING" as const,
  };

  if (existingReport) {
    await prisma.marketingReport.update({
      where: {
        id: existingReport.id,
      },
      data,
    });
  } else {
    await prisma.marketingReport.create({
      data: {
        userId: user.id,
        reportDate,
        ...data,
      },
    });
  }

  revalidatePath("/employee/marketing");
  revalidatePath("/employee/analytics");
  revalidatePath("/incharge");
  revalidatePath("/incharge/reports");
  revalidatePath("/incharge/analytics");

  return {
    success: true,
    message: "Marketing report saved successfully",
  };
}