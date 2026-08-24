"use server";

import mongoose from "mongoose";
import { revalidatePath } from "next/cache";

import { connectDB } from "@/lib/mongodb";
import { getCurrentUser } from "@/lib/current-user";
import { User } from "@/models/User";
import { Leave } from "@/models/Leave";
import { LeaveStatus, Role } from "@/constants/enums";

export async function rejectLeave(leaveId: string) {
  await connectDB();

  const currentUser = await getCurrentUser();

  if (!currentUser || currentUser.role !== Role.INCHARGE) {
    throw new Error("Unauthorized");
  }

  if (!mongoose.Types.ObjectId.isValid(leaveId)) {
    throw new Error("Invalid leave ID");
  }

  const departmentUsers = await User.find({
    department: currentUser.departmentId,
    role: Role.EMPLOYEE,
  })
    .select("_id")
    .lean();

  const result = await Leave.updateOne(
    {
      _id: leaveId,
      user: { $in: departmentUsers.map((user: any) => user._id) },
      status: LeaveStatus.PENDING,
    },
    {
    status: LeaveStatus.REJECTED,
    approvedBy: currentUser.id,
    }
  );

  if (result.matchedCount === 0) {
    throw new Error("Pending leave request not found");
  }

  revalidatePath("/incharge/leaves");
  revalidatePath("/incharge");

  return {
    success: true,
  };
}