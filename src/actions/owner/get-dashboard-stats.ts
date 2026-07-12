"use server";

import { connectDB } from "@/lib/mongodb";
import { Department } from "@/models/Department";
import { User } from "@/models/User";
import { Role, UserStatus } from "@/constants/enums";

export async function getOwnerDashboardStats() {
  try {
    await connectDB();

    const [
      totalDepartments,
      totalUsers,
      totalEmployees,
      totalIncharges,
      pendingApprovals,
    ] = await Promise.all([
      Department.countDocuments(),

      User.countDocuments(),

      User.countDocuments({
        role: Role.EMPLOYEE,
      }),

      User.countDocuments({
        role: Role.INCHARGE,
      }),

      User.countDocuments({
        status: UserStatus.PENDING_APPROVAL,
      }),
    ]);

    return {
      totalDepartments,
      totalUsers,
      totalEmployees,
      totalIncharges,
      pendingApprovals,
    };
  } catch (error) {
    console.error("Get owner dashboard stats error:", error);

    return {
      totalDepartments: 0,
      totalUsers: 0,
      totalEmployees: 0,
      totalIncharges: 0,
      pendingApprovals: 0,
    };
  }
}