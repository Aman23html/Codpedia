"use server";

import { connectDB } from "@/lib/mongodb";
import { getCurrentUser } from "@/lib/current-user";
import { User } from "@/models/User";
import { Attendance } from "@/models/Attendance";
import { Role, AttendanceStatus } from "@/constants/enums";

export async function getAttendanceStats() {
  await connectDB();

  const currentUser = await getCurrentUser();

  if (!currentUser || currentUser.role !== Role.INCHARGE) {
    throw new Error("Unauthorized");
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const dateFilter = {
    $gte: today,
    $lt: tomorrow,
  };

  const departmentUsers = await User.find({
    department: currentUser.departmentId,
    role: Role.EMPLOYEE,
  })
    .select("_id")
    .lean();

  const userIds = departmentUsers.map((user: any) => user._id);

  const [
    totalEmployees,
    present,
    absent,
    halfDay,
    leave,
    totalRecords,
  ] = await Promise.all([
    User.countDocuments({
      department: currentUser.departmentId,
      role: Role.EMPLOYEE,
    }),

    Attendance.countDocuments({
      status: AttendanceStatus.PRESENT,
      attendanceDate: dateFilter,
      user: {
        $in: userIds,
      },
    }),

    Attendance.countDocuments({
      status: AttendanceStatus.ABSENT,
      attendanceDate: dateFilter,
      user: {
        $in: userIds,
      },
    }),

    Attendance.countDocuments({
      status: AttendanceStatus.HALF_DAY,
      attendanceDate: dateFilter,
      user: {
        $in: userIds,
      },
    }),

    Attendance.countDocuments({
      status: AttendanceStatus.LEAVE,
      attendanceDate: dateFilter,
      user: {
        $in: userIds,
      },
    }),

    Attendance.countDocuments({
      attendanceDate: dateFilter,
      user: {
        $in: userIds,
      },
    }),
  ]);

  return {
    totalEmployees,
    present,
    absent,
    halfDay,
    leave,
    totalRecords,
  };
}