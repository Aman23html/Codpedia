"use server";

import { connectDB } from "@/lib/mongodb";
import { getCurrentUser } from "@/lib/current-user";
import { User } from "@/models/User";
import { Leave } from "@/models/Leave";
import { LeaveStatus, Role } from "@/constants/enums";

export async function getInchargeLeaves() {
  await connectDB();

  const currentUser = await getCurrentUser();

  if (!currentUser || currentUser.role !== Role.INCHARGE) {
    throw new Error("Unauthorized");
  }

  if (!currentUser.departmentId) {
    return { pendingLeaves: [], historyLeaves: [] };
  }

  const users = await User.find({
    department: currentUser.departmentId,
    role: Role.EMPLOYEE,
  })
    .select("_id")
    .lean();

  const userIds = users.map((user: any) => user._id);

  const leaves = await Leave.find({ user: { $in: userIds } })
    .populate({
      path: "user",
      select:
        "employeeCode fullName username email phone role status department",
    })
    .populate({
      path: "approvedBy",
      select: "fullName employeeCode",
    })
    .sort({ createdAt: -1 })
    .lean();

  const serializedLeaves = JSON.parse(JSON.stringify(leaves));

  return {
    pendingLeaves: serializedLeaves.filter(
      (leave: any) => leave.status === LeaveStatus.PENDING
    ),
    historyLeaves: serializedLeaves.filter(
      (leave: any) =>
        leave.status === LeaveStatus.APPROVED ||
        leave.status === LeaveStatus.REJECTED
    ),
  };
}
