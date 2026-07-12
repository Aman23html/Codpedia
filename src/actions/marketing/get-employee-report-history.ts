"use server";

import { connectDB } from "@/lib/mongodb";
import { getCurrentUser } from "@/lib/current-user";
import { MarketingReport } from "@/models/MarketingReport";

export async function getEmployeeReportHistory(filter: string = "ALL") {
  await connectDB();

  const user = await getCurrentUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const today = new Date();

  const query: any = {
    user: user.id,
  };

  if (filter === "TODAY") {
    const start = new Date();
    start.setHours(0, 0, 0, 0);

    query.createdAt = {
      $gte: start,
    };
  } else if (filter === "7_DAYS") {
    const start = new Date();
    start.setDate(today.getDate() - 7);

    query.createdAt = {
      $gte: start,
    };
  } else if (filter === "30_DAYS") {
    const start = new Date();
    start.setDate(today.getDate() - 30);

    query.createdAt = {
      $gte: start,
    };
  }

  const reports = await MarketingReport.find(query)
    .populate({
      path: "user",
      select: "employeeCode profileImageUrl fullName username email phone",
    })
    .sort({
      createdAt: -1,
    })
    .lean();

  return JSON.parse(JSON.stringify(reports));
}