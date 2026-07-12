"use server";

import { connectDB } from "@/lib/mongodb";
import { Department } from "@/models/Department";
import { User } from "@/models/User";

export async function getDepartmentsWithStats() {
  try {
    await connectDB();

    const departments = await Department.find()
      .sort({ name: 1 })
      .lean();

    const result = await Promise.all(
      departments.map(async (department: any) => {
        const [employeeCount, inchargeCount] = await Promise.all([
          User.countDocuments({
            department: department._id,
            role: "EMPLOYEE",
          }),

          User.countDocuments({
            department: department._id,
            role: "INCHARGE",
          }),
        ]);

        return {
          id: department._id.toString(),
          name: department.name,
          type: department.type,
          departmentCode: department.departmentCode,
          shortCode: department.shortCode,
          employeeCount,
          inchargeCount,
        };
      })
    );

    return result;
  } catch (error) {
    console.error("Get departments with stats error:", error);
    return [];
  }
}