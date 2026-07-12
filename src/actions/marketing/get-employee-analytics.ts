"use server";

import { connectDB } from "@/lib/mongodb";
import { getCurrentUser } from "@/lib/current-user";
import { MarketingReport } from "@/models/MarketingReport";

type FilterType = "ALL" | "TODAY" | "7_DAYS" | "30_DAYS";

function getDateFilter(filter: FilterType) {
  const now = new Date();

  if (filter === "TODAY") {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    return { $gte: start };
  }

  if (filter === "7_DAYS") {
    const start = new Date();
    start.setDate(now.getDate() - 7);
    return { $gte: start };
  }

  if (filter === "30_DAYS") {
    const start = new Date();
    start.setDate(now.getDate() - 30);
    return { $gte: start };
  }

  return undefined;
}

export async function getEmployeeAnalytics(filter: FilterType = "ALL") {
  await connectDB();

  const user = await getCurrentUser();

  if (!user) throw new Error("Unauthorized");

  const dateFilter = getDateFilter(filter);

  const query: any = {
    user: user.id,
  };

  if (dateFilter) {
    query.createdAt = dateFilter;
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

  if (!reports.length) {
    return {
      reports: [],
      summary: {
        totalReports: 0,
        whatsappGroups: 0,
        whatsappPosts: 0,
        telegramGroups: 0,
        telegramPosts: 0,
        facebookGroups: 0,
        facebookPosts: 0,
        resourceLogin: 0,
        accountClean: 0,
      },
      filter,
    };
  }

  const summary = reports.reduce(
    (acc, r: any) => {
      acc.totalReports += 1;

      acc.whatsappGroups += r.whatsappGroupsJoined || 0;
      acc.whatsappPosts += r.whatsappPostsDone || 0;

      acc.telegramGroups += r.telegramGroupsJoined || 0;
      acc.telegramPosts += r.telegramPostsDone || 0;

      acc.facebookGroups += r.facebookGroupsJoined || 0;
      acc.facebookPosts += r.facebookPostsDone || 0;

      acc.resourceLogin += r.resourceLogin || 0;
      acc.accountClean += r.accountClean || 0;

      return acc;
    },
    {
      totalReports: 0,
      whatsappGroups: 0,
      whatsappPosts: 0,
      telegramGroups: 0,
      telegramPosts: 0,
      facebookGroups: 0,
      facebookPosts: 0,
      resourceLogin: 0,
      accountClean: 0,
    }
  );

  return {
    reports: JSON.parse(JSON.stringify(reports)),
    summary,
    filter,
  };
}