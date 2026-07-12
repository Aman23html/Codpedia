"use server";

import { connectDB } from "@/lib/mongodb";
import { getCurrentUser } from "@/lib/current-user";
import { Attendance } from "@/models/Attendance";
import { User } from "@/models/User";
import { Role } from "@/constants/enums";

export async function getDepartmentAttendance() {
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

  const attendance = await Attendance.find({
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
      attendanceDate: -1,
    })
    .lean();

  return JSON.parse(JSON.stringify(attendance));
}