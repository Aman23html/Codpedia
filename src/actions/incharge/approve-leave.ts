"use server";

import mongoose from "mongoose";

import { connectDB } from "@/lib/mongodb";
import { getCurrentUser } from "@/lib/current-user";
import { Leave } from "@/models/Leave";
import { LeaveStatus, Role } from "@/constants/enums";

export async function approveLeave(leaveId: string) {
  await connectDB();

  const currentUser = await getCurrentUser();

  if (!currentUser || currentUser.role !== Role.INCHARGE) {
    throw new Error("Unauthorized");
  }

  if (!mongoose.Types.ObjectId.isValid(leaveId)) {
    throw new Error("Invalid leave ID");
  }

  await Leave.findByIdAndUpdate(leaveId, {
    status: LeaveStatus.APPROVED,
    approvedBy: currentUser.id,
  });

  return {
    success: true,
  };
}