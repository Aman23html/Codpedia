// "use server";

// import { revalidatePath } from "next/cache";

// import { prisma } from "@/lib/prisma-backup";
// import { getCurrentUser } from "@/lib/current-user";
// import { Role } from "@prisma/client";

// type ReviewAction = "APPROVE" | "REJECT";

// function getReviewStatus(action: ReviewAction) {
//   return action === "APPROVE" ? "APPROVED" : "REJECTED";
// }

// function getReviewRemarks(action: ReviewAction, remarks?: string) {
//   if (action === "APPROVE") return null;
//   return remarks?.trim() || "Rejected by incharge.";
// }

// export async function reviewReport(
//   reportId: string,
//   action: ReviewAction,
//   remarks?: string
// ) {
//   const currentUser = await getCurrentUser();

//   if (!currentUser || currentUser.role !== Role.INCHARGE) {
//     return {
//       success: false,
//       message: "Unauthorized",
//     };
//   }

//   const existingReport = await prisma.marketingReport.findFirst({
//     where: {
//       id: reportId,
//       user: {
//         departmentId: currentUser.departmentId,
//       },
//     },
//     select: {
//       id: true,
//     },
//   });

//   if (!existingReport) {
//     return {
//       success: false,
//       message: "Report not found or not allowed.",
//     };
//   }

//   const status = getReviewStatus(action);

//   await prisma.marketingReport.update({
//     where: {
//       id: reportId,
//     },
//     data: {
//       status,
//       remarks: getReviewRemarks(action, remarks),
//       approvedById: currentUser.id,
//     },
//   });

//   revalidatePath("/incharge");
//   revalidatePath("/incharge/analytics");
//   revalidatePath("/incharge/reports");
//   revalidatePath("/employee/marketing");

//   return {
//     success: true,
//     message: action === "APPROVE" ? "Report Approved" : "Report Rejected",
//   };
// }

// export async function reviewMultipleReports(
//   reportIds: string[],
//   action: ReviewAction,
//   remarks?: string
// ) {
//   const currentUser = await getCurrentUser();

//   if (!currentUser || currentUser.role !== Role.INCHARGE) {
//     return {
//       success: false,
//       message: "Unauthorized",
//     };
//   }

//   const cleanReportIds = Array.from(new Set(reportIds.filter(Boolean)));

//   if (cleanReportIds.length === 0) {
//     return {
//       success: false,
//       message: "No reports selected.",
//     };
//   }

//   const status = getReviewStatus(action);

//   const result = await prisma.marketingReport.updateMany({
//     where: {
//       id: {
//         in: cleanReportIds,
//       },
//       user: {
//         departmentId: currentUser.departmentId,
//       },
//     },
//     data: {
//       status,
//       remarks: getReviewRemarks(action, remarks),
//       approvedById: currentUser.id,
//     },
//   });

//   revalidatePath("/incharge");
//   revalidatePath("/incharge/analytics");
//   revalidatePath("/incharge/reports");
//   revalidatePath("/employee/marketing");

//   return {
//     success: true,
//     message:
//       action === "APPROVE"
//         ? `${result.count} Report Approved`
//         : `${result.count} Report Rejected`,
//     updatedReports: result.count,
//   };
// }