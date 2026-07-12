"use server";

import { connectDB } from "@/lib/mongodb";
import { getCurrentUser } from "@/lib/current-user";
import { MarketingReport } from "@/models/MarketingReport";
import { DepartmentType, ReportStatus, Role } from "@/constants/enums";
import { assertActiveMarketingAttendanceWindow } from "@/lib/attendance/assert-active-marketing-attendance-window";

type SaveMarketingReportInput = {
  country: string;
  platform?: string | null;

  whatsappGroupsJoined?: number;
  whatsappPostsDone?: number;

  telegramGroupsJoined?: number;
  telegramPostsDone?: number;

  facebookGroupsJoined?: number;
  facebookPostsDone?: number;

  resourceLogin?: number;
  accountClean?: number;
};

function toNumber(value: unknown) {
  const numberValue = Number(value);
  return Number.isFinite(numberValue) && numberValue >= 0 ? numberValue : 0;
}

function startOfDay(date: Date) {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);
  return start;
}

export async function saveMarketingReport(input: SaveMarketingReportInput) {
  await connectDB();

  const currentUser = await getCurrentUser();

  if (!currentUser || currentUser.role !== Role.EMPLOYEE) {
    return {
      success: false,
      message: "Unauthorized",
    };
  }

  if (
    !currentUser.department ||
    currentUser.department.type !== DepartmentType.MARKETING
  ) {
    return {
      success: false,
      message: "Only marketing employees can submit marketing reports.",
    };
  }

  const { attendance } = await assertActiveMarketingAttendanceWindow(
    currentUser.id
  );

  const reportDate = startOfDay(new Date(attendance.checkIn));

  const country = input.country;

  if (!country) {
    return {
      success: false,
      message: "Country is required.",
    };
  }

  const payload = {
    user: currentUser.id,
    reportDate,
    country,
    platform: input.platform || null,

    whatsappGroupsJoined: toNumber(input.whatsappGroupsJoined),
    whatsappPostsDone: toNumber(input.whatsappPostsDone),

    telegramGroupsJoined: toNumber(input.telegramGroupsJoined),
    telegramPostsDone: toNumber(input.telegramPostsDone),

    facebookGroupsJoined: toNumber(input.facebookGroupsJoined),
    facebookPostsDone: toNumber(input.facebookPostsDone),

    resourceLogin: toNumber(input.resourceLogin),
    accountClean: toNumber(input.accountClean),

    status: ReportStatus.PENDING,
    remarks: null,
    approvedBy: null,
  };

  const existingReport = await MarketingReport.findOne({
    user: currentUser.id,
    country,
    reportDate,
  });

  if (existingReport) {
    await MarketingReport.findByIdAndUpdate(existingReport._id, payload);

    return {
      success: true,
      message: "Marketing report updated and sent for review.",
    };
  }

  await MarketingReport.create(payload);

  return {
    success: true,
    message: "Marketing report submitted successfully.",
  };
}