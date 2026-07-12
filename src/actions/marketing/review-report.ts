"use server";

import { revalidatePath } from "next/cache";

import { connectDB } from "@/lib/mongodb";
import { getCurrentUser } from "@/lib/current-user";
import { User } from "@/models/User";
import { MarketingReport } from "@/models/MarketingReport";
import { Role } from "@/constants/enums";

type ReviewAction = "APPROVE" | "REJECT";

function getReviewStatus(action: ReviewAction) {
  return action === "APPROVE" ? "APPROVED" : "REJECTED";
}

function getReviewRemarks(action: ReviewAction, remarks?: string) {
  if (action === "APPROVE") return null;
  return remarks?.trim() || "Rejected by incharge.";
}

export async function reviewReport(
  reportId: string,
  action: ReviewAction,
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

  const users = await User.find({
    department: currentUser.departmentId,
  })
    .select("_id")
    .lean();

  const userIds = users.map((user: any) => user._id);

  const existingReport = await MarketingReport.findOne({
    _id: reportId,
    user: {
      $in: userIds,
    },
  })
    .select("_id")
    .lean();

  if (!existingReport) {
    return {
      success: false,
      message: "Report not found or not allowed.",
    };
  }

  const status = getReviewStatus(action);

  await MarketingReport.findByIdAndUpdate(reportId, {
    status,
    remarks: getReviewRemarks(action, remarks),
    approvedBy: currentUser.id,
  });

  revalidatePath("/incharge");
  revalidatePath("/incharge/analytics");
  revalidatePath("/incharge/reports");
  revalidatePath("/employee/marketing");

  return {
    success: true,
    message: action === "APPROVE" ? "Report Approved" : "Report Rejected",
  };
}

export async function reviewMultipleReports(
  reportIds: string[],
  action: ReviewAction,
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

  const cleanReportIds = Array.from(new Set(reportIds.filter(Boolean)));

  if (cleanReportIds.length === 0) {
    return {
      success: false,
      message: "No reports selected.",
    };
  }

  const users = await User.find({
    department: currentUser.departmentId,
  })
    .select("_id")
    .lean();

  const userIds = users.map((user: any) => user._id);

  const status = getReviewStatus(action);

  const result = await MarketingReport.updateMany(
    {
      _id: {
        $in: cleanReportIds,
      },
      user: {
        $in: userIds,
      },
    },
    {
      status,
      remarks: getReviewRemarks(action, remarks),
      approvedBy: currentUser.id,
    }
  );

  revalidatePath("/incharge");
  revalidatePath("/incharge/analytics");
  revalidatePath("/incharge/reports");
  revalidatePath("/employee/marketing");

  return {
    success: true,
    message:
      action === "APPROVE"
        ? `${result.modifiedCount} Report Approved`
        : `${result.modifiedCount} Report Rejected`,
    updatedReports: result.modifiedCount,
  };
}