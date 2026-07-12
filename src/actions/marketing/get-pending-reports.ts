"use server";

import { connectDB } from "@/lib/mongodb";
import { getCurrentUser } from "@/lib/current-user";
import { MarketingReport } from "@/models/MarketingReport";
import { User } from "@/models/User";
import { ReportStatus, Role } from "@/constants/enums";

export async function getPendingReports() {
  await connectDB();

  const currentUser = await getCurrentUser();

  if (!currentUser || currentUser.role !== Role.INCHARGE) {
    throw new Error("Unauthorized");
  }

  const users = await User.find({
    department: currentUser.departmentId,
    role: Role.EMPLOYEE,
  })
    .select("_id")
    .lean();

  const userIds = users.map((user: any) => user._id);

  const reports = await MarketingReport.find({
    status: ReportStatus.PENDING,
    user: {
      $in: userIds,
    },
  })
    .populate({
      path: "user",
      populate: {
        path: "department",
      },
    })
    .sort({
      createdAt: -1,
    })
    .lean();

  return JSON.parse(JSON.stringify(reports));
}