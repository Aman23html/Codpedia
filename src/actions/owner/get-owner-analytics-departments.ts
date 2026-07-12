"use server";

import { connectDB } from "@/lib/mongodb";
import { getCurrentUser } from "@/lib/current-user";

import { Department } from "@/models/Department";
import { User } from "@/models/User";
import { MarketingReport } from "@/models/MarketingReport";
import { EmployeeOperationReport } from "@/models/EmployeeOperationReport";

import { DepartmentType, Role } from "@/constants/enums";

async function getDepartmentReportCount(
  departmentId: string,
  type: string
) {
  const users = await User.find({
    department: departmentId,
  })
    .select("_id")
    .lean();

  const userIds = users.map((user: any) => user._id);

  if (userIds.length === 0) {
    return 0;
  }

  if (type === DepartmentType.MARKETING) {
    return MarketingReport.countDocuments({
      user: {
        $in: userIds,
      },
    });
  }

  if (type === DepartmentType.OPERATIONS) {
    return EmployeeOperationReport.countDocuments({
      user: {
        $in: userIds,
      },
    });
  }

  return 0;
}

export async function getOwnerAnalyticsDepartments() {
  await connectDB();

  const currentUser = await getCurrentUser();

  if (!currentUser || currentUser.role !== Role.OWNER) {
    throw new Error("Unauthorized");
  }

  const departments = await Department.find()
    .sort({
      name: 1,
    })
    .lean();

  const data = await Promise.all(
    departments.map(async (department: any) => {
      const users = await User.find({
        department: department._id,
      })
        .select("role status")
        .lean();

      const totalReports = await getDepartmentReportCount(
        department._id.toString(),
        department.type
      );

      const employees = users.filter(
        (user: any) => user.role === Role.EMPLOYEE
      ).length;

      const incharges = users.filter(
        (user: any) => user.role === Role.INCHARGE
      ).length;

      const activeUsers = users.filter(
        (user: any) => user.status === "ACTIVE"
      ).length;

      return {
        id: department._id.toString(),
        name: department.name,
        type: department.type,
        departmentCode: department.departmentCode,
        shortCode: department.shortCode,
        totalUsers: users.length,
        employees,
        incharges,
        activeUsers,
        totalReports,
      };
    })
  );

  return data;
}