"use server";

import mongoose from "mongoose";

import { connectDB } from "@/lib/mongodb";
import { getCurrentUser } from "@/lib/current-user";
import { User } from "@/models/User";
import { Role, UserStatus } from "@/constants/enums";

export async function approveEmployee(employeeId: string) {
  await connectDB();

  const currentUser = await getCurrentUser();

  if (!currentUser || currentUser.role !== Role.INCHARGE) {
    throw new Error("Unauthorized");
  }

  if (!mongoose.Types.ObjectId.isValid(employeeId)) {
    throw new Error("Invalid employee ID");
  }

  const employee: any = await User.findById(employeeId).lean();

  if (!employee) {
    throw new Error("Employee not found");
  }

  if (employee.department?.toString() !== currentUser.departmentId) {
    throw new Error("Forbidden");
  }

  await User.findByIdAndUpdate(employeeId, {
    status: UserStatus.ACTIVE,
    approvedBy: currentUser.id,
  });

  return {
    success: true,
  };
}