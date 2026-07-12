"use server";

import { connectDB } from "@/lib/mongodb";
import { getCurrentUser } from "@/lib/current-user";
import { Department } from "@/models/Department";
import { Role } from "@/constants/enums";

export async function getInchargeDepartment() {
  await connectDB();

  const currentUser = await getCurrentUser();

  if (!currentUser || currentUser.role !== Role.INCHARGE) {
    throw new Error("Unauthorized");
  }

  const department: any = await Department.findById(currentUser.departmentId)
    .select("name type departmentCode shortCode")
    .lean();

  if (!department) {
    return null;
  }

  return {
    id: department._id.toString(),
    name: department.name,
    type: department.type,
    departmentCode: department.departmentCode,
    shortCode: department.shortCode,
  };
}