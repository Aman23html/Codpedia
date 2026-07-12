"use server";

import { connectDB } from "@/lib/mongodb";
import { getCurrentUser } from "@/lib/current-user";
import { MarketingReport } from "@/models/MarketingReport";

export async function getTodayReports() {
  await connectDB();

  const user = await getCurrentUser();

  if (!user) {
    return [];
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const reports = await MarketingReport.find({
    user: user.id,
    reportDate: {
      $gte: today,
      $lt: tomorrow,
    },
  })
    .sort({
      country: 1,
    })
    .lean();

  return JSON.parse(JSON.stringify(reports));
}