"use server";

import { connectDB } from "@/lib/mongodb";
import { getCurrentUser } from "@/lib/current-user";
import { User } from "@/models/User";
import { Leave } from "@/models/Leave";
import { LeaveStatus, Role } from "@/constants/enums";

export async function getPendingLeaves() {
  await connectDB();

  const currentUser = await getCurrentUser();

  if (!currentUser || currentUser.role !== Role.INCHARGE) {
    throw new Error("Unauthorized");
  }

  const users = await User.find({
    department: currentUser.departmentId,
  })
    .select("_id")
    .lean();

  const userIds = users.map((user: any) => user._id);

  const leaves = await Leave.find({
    status: LeaveStatus.PENDING,
    user: {
      $in: userIds,
    },
  })
    .populate({
      path: "user",
      select:
        "employeeCode fullName username email phone role status department",
    })
    .sort({
      createdAt: -1,
    })
    .lean();

  return JSON.parse(JSON.stringify(leaves));
}