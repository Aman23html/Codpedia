"use server";

import { connectDB } from "@/lib/mongodb";
import { getCurrentUser } from "@/lib/current-user";
import { User } from "@/models/User";
import { Attendance } from "@/models/Attendance";
import { Role, AttendanceStatus } from "@/constants/enums";

export async function getAttendance(searchParams?: {
  [key: string]: string | string[] | undefined;
}) {
  await connectDB();

  const currentUser = await getCurrentUser();

  if (!currentUser || currentUser.role !== Role.INCHARGE) {
    throw new Error("Unauthorized");
  }

  const search = (searchParams?.search as string) || "";
  const dateRange = (searchParams?.dateRange as string) || "today";
  const statusFilter = (searchParams?.status as string) || "all";

  const now = new Date();
  let startDate: Date | undefined;
  let endDate: Date | undefined;

  if (dateRange === "today") {
    startDate = new Date();
    startDate.setHours(0, 0, 0, 0);

    endDate = new Date();
    endDate.setHours(23, 59, 59, 999);
  } else if (dateRange === "yesterday") {
    startDate = new Date();
    startDate.setDate(startDate.getDate() - 1);
    startDate.setHours(0, 0, 0, 0);

    endDate = new Date(startDate);
    endDate.setHours(23, 59, 59, 999);
  } else if (dateRange === "week") {
    startDate = new Date();
    startDate.setDate(startDate.getDate() - 7);
    startDate.setHours(0, 0, 0, 0);
  } else if (dateRange === "month") {
    startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    startDate.setHours(0, 0, 0, 0);
  }

  const userQuery: any = {
    department: currentUser.departmentId,
  };

  if (search) {
    userQuery.$or = [
      { fullName: { $regex: search, $options: "i" } },
      { employeeCode: { $regex: search, $options: "i" } },
      { username: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
      { phone: { $regex: search, $options: "i" } },
    ];
  }

  const users = await User.find(userQuery).select("_id").lean();
  const userIds = users.map((user: any) => user._id);

  const attendanceQuery: any = {
    user: {
      $in: userIds,
    },
  };

  if (startDate) {
    attendanceQuery.attendanceDate = {
      $gte: startDate,
    };

    if (endDate) {
      attendanceQuery.attendanceDate.$lte = endDate;
    }
  }

  if (
    statusFilter !== "all" &&
    Object.values(AttendanceStatus).includes(statusFilter as any)
  ) {
    attendanceQuery.status = statusFilter;
  }

  const attendance = await Attendance.find(attendanceQuery)
    .populate({
      path: "user",
      select:
        "employeeCode fullName username email phone role status department",
      populate: {
        path: "department",
        select: "name type departmentCode shortCode",
      },
    })
    .sort({
      attendanceDate: -1,
      checkIn: -1,
    })
    .lean();

  return JSON.parse(JSON.stringify(attendance));
}