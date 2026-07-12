"use server";

import { connectDB } from "@/lib/mongodb";
import { getCurrentUser } from "@/lib/current-user";
import { User } from "@/models/User";
import { MarketingReport } from "@/models/MarketingReport";
import { Role } from "@/constants/enums";

export async function getInchargeAnalytics() {
  await connectDB();

  const user = await getCurrentUser();

  if (!user || user.role !== Role.INCHARGE) {
    throw new Error("Unauthorized");
  }

  const employees = await User.find({
    department: user.departmentId,
    role: Role.EMPLOYEE,
  })
    .select("employeeCode fullName profileImageUrl")
    .lean();

  if (employees.length === 0) {
    return {
      totalEmployees: 0,
      totalReports: 0,
      pendingReports: 0,
      approvedReports: 0,
      rejectedReports: 0,
      todayReports: 0,
      northAmerica: 0,
      europe: 0,
      australia: 0,
      totalGroupsJoined: 0,
      totalPostsDone: 0,
      totalResourceLogin: 0,
      totalAccountClean: 0,
      topPerformer: null,
      employeePerformance: [],
    };
  }

  const employeeMap = new Map(
    employees.map((employee: any) => [
      employee._id.toString(),
      {
        employeeCode: employee.employeeCode,
        employeeName: employee.fullName,
        profileImageUrl: employee.profileImageUrl,
      },
    ])
  );

  const employeeIds = employees.map((employee: any) => employee._id);

  const reports = await MarketingReport.find({
    user: {
      $in: employeeIds,
    },
  })
    .select(
      "user status createdAt country whatsappGroupsJoined telegramGroupsJoined facebookGroupsJoined whatsappPostsDone telegramPostsDone facebookPostsDone resourceLogin accountClean"
    )
    .lean();

  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  let pendingReports = 0;
  let approvedReports = 0;
  let rejectedReports = 0;
  let todayReports = 0;

  let northAmerica = 0;
  let europe = 0;
  let australia = 0;

  let totalGroupsJoined = 0;
  let totalPostsDone = 0;
  let totalResourceLogin = 0;
  let totalAccountClean = 0;

  const performanceMap: Record<string, any> = {};

  for (const r of reports as any[]) {
    if (r.status === "PENDING") pendingReports++;
    if (r.status === "APPROVED") approvedReports++;
    if (r.status === "REJECTED") rejectedReports++;

    if (new Date(r.createdAt) >= startOfDay) {
      todayReports++;
    }

    if (r.country === "NORTH_AMERICA") northAmerica++;
    if (r.country === "EUROPE") europe++;
    if (r.country === "AUSTRALIA") australia++;

    totalGroupsJoined +=
      (r.whatsappGroupsJoined ?? 0) +
      (r.telegramGroupsJoined ?? 0) +
      (r.facebookGroupsJoined ?? 0);

    totalPostsDone +=
      (r.whatsappPostsDone ?? 0) +
      (r.telegramPostsDone ?? 0) +
      (r.facebookPostsDone ?? 0);

    totalResourceLogin += r.resourceLogin ?? 0;
    totalAccountClean += r.accountClean ?? 0;

    const userId = r.user?.toString();
    const employee = employeeMap.get(userId);

    if (!performanceMap[userId]) {
      performanceMap[userId] = {
        employeeId: userId,
        employeeCode: employee?.employeeCode ?? null,
        employeeName: employee?.employeeName || "Unknown",
        profileImageUrl: employee?.profileImageUrl ?? null,
        total: 0,
        approved: 0,
        pending: 0,
        rejected: 0,
        approvalRate: 0,
      };
    }

    const emp = performanceMap[userId];

    emp.total++;

    if (r.status === "APPROVED") emp.approved++;
    if (r.status === "PENDING") emp.pending++;
    if (r.status === "REJECTED") emp.rejected++;
  }

  const employeePerformance = Object.values(performanceMap).map((emp: any) => ({
    ...emp,
    approvalRate:
      emp.total > 0 ? Math.round((emp.approved / emp.total) * 100) : 0,
  }));

  employeePerformance.sort((a: any, b: any) => b.approved - a.approved);

  const topPerformer =
    employeePerformance.length > 0 ? employeePerformance[0] : null;

  return {
    totalEmployees: employees.length,
    totalReports: reports.length,
    pendingReports,
    approvedReports,
    rejectedReports,
    todayReports,
    northAmerica,
    europe,
    australia,
    totalGroupsJoined,
    totalPostsDone,
    totalResourceLogin,
    totalAccountClean,
    topPerformer,
    employeePerformance,
  };
}