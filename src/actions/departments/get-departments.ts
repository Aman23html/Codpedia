"use server";

import { connectDB } from "@/lib/mongodb";
import { Department } from "@/models/Department";

export async function getDepartments() {
  try {
    await connectDB();

    const departments = await Department.find()
      .sort({ name: 1 })
      .lean();

    return departments.map((department: any) => ({
      id: department._id.toString(),
      name: department.name,
      type: department.type,
      departmentCode: department.departmentCode,
      shortCode: department.shortCode,
    }));
  } catch (error) {
    console.error("Get departments error:", error);
    return [];
  }
}