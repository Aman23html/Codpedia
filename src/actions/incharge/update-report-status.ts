"use server";

import { revalidatePath } from "next/cache";

import { connectDB } from "@/lib/mongodb";
import { getCurrentUser } from "@/lib/current-user";
import { User } from "@/models/User";
import { MarketingReport } from "@/models/MarketingReport";
import { ReportStatus, Role } from "@/constants/enums";

export async function updateReportStatus(
  reportIdOrIds: string | string[],
  status: string,
  remarks?: string
) {
  await connectDB();

  const currentUser = await getCurrentUser();

  if (!currentUser || currentUser.role !== Role.INCHARGE) {
    return {
      success: false,
      message: "Unauthorized",
    };
  }

  if (!Object.values(ReportStatus).includes(status as any)) {
    return {
      success: false,
      message: "Invalid report status.",
    };
  }

  const reportIds = Array.isArray(reportIdOrIds)
    ? Array.from(new Set(reportIdOrIds.filter(Boolean)))
    : [reportIdOrIds];

  if (reportIds.length === 0) {
    return {
      success: false,
      message: "No reports selected.",
    };
  }

  const departmentUsers = await User.find({
    department: currentUser.departmentId,
  })
    .select("_id")
    .lean();

  const userIds = departmentUsers.map((user: any) => user._id);

  const result = await MarketingReport.updateMany(
    {
      _id: {
        $in: reportIds,
      },
      user: {
        $in: userIds,
      },
    },
    {
      status,
      remarks: remarks?.trim() || null,
      approvedBy: currentUser.id,
    }
  );

  revalidatePath("/incharge");
  revalidatePath("/incharge/reports");
  revalidatePath("/incharge/analytics");
  revalidatePath("/employee/marketing");

  return {
    success: true,
    message: `${result.modifiedCount} report updated successfully.`,
    updatedReports: result.modifiedCount,
  };
}