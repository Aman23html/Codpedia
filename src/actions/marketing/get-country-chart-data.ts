"use server";

import { connectDB } from "@/lib/mongodb";
import { getCurrentUser } from "@/lib/current-user";
import { User } from "@/models/User";
import { MarketingReport } from "@/models/MarketingReport";

type SearchParams = {
  [key: string]: string | string[] | undefined;
};

type ChartRow = {
  date: string;
  [country: string]: string | number;
};

export async function getCountryChartData(searchParams?: SearchParams) {
  await connectDB();

  const currentUser = await getCurrentUser();

  if (!currentUser) {
    throw new Error("Unauthorized");
  }

  const range = (searchParams?.graphDateRange as string) ?? "month";

  const startDate = new Date();

  switch (range) {
    case "week":
      startDate.setDate(startDate.getDate() - 7);
      break;
    case "month":
      startDate.setMonth(startDate.getMonth() - 1);
      break;
    case "year":
      startDate.setFullYear(startDate.getFullYear() - 1);
      break;
    default:
      startDate.setMonth(startDate.getMonth() - 1);
  }

  const departmentUsers = await User.find({
    department: currentUser.departmentId,
  })
    .select("_id")
    .lean();

  const userIds = departmentUsers.map((user: any) => user._id);

  const reports = await MarketingReport.find({
    status: "APPROVED",
    createdAt: {
      $gte: startDate,
    },
    user: {
      $in: userIds,
    },
  })
    .select(
      "country createdAt whatsappGroupsJoined telegramGroupsJoined facebookGroupsJoined whatsappPostsDone telegramPostsDone facebookPostsDone"
    )
    .sort({
      createdAt: 1,
    })
    .lean();

  const groupsMap = new Map<string, ChartRow>();
  const postsMap = new Map<string, ChartRow>();

  for (const report of reports as any[]) {
    const date = new Date(report.createdAt).toLocaleDateString("en-CA");
    const country = report.country?.trim() || "Other";

    const groupsJoined =
      (report.whatsappGroupsJoined ?? 0) +
      (report.telegramGroupsJoined ?? 0) +
      (report.facebookGroupsJoined ?? 0);

    const postsDone =
      (report.whatsappPostsDone ?? 0) +
      (report.telegramPostsDone ?? 0) +
      (report.facebookPostsDone ?? 0);

    if (!groupsMap.has(date)) {
      groupsMap.set(date, { date });
    }

    if (!postsMap.has(date)) {
      postsMap.set(date, { date });
    }

    const groupEntry = groupsMap.get(date)!;
    const postEntry = postsMap.get(date)!;

    groupEntry[country] = ((groupEntry[country] as number) || 0) + groupsJoined;
    postEntry[country] = ((postEntry[country] as number) || 0) + postsDone;
  }

  return {
    groupsData: Array.from(groupsMap.values()),
    postsData: Array.from(postsMap.values()),
  };
}