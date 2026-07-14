"use server";

import { connectDB } from "@/lib/mongodb";
import { getCurrentUser } from "@/lib/current-user";
import { User } from "@/models/User";
import { Attendance } from "@/models/Attendance";
import "@/models/Department";

import { Role, AttendanceStatus } from "@/constants/enums";

const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000;

function getISTDayStart(date: Date) {
  const istDate = new Date(date.getTime() + IST_OFFSET_MS);
  istDate.setUTCHours(0, 0, 0, 0);
  return new Date(istDate.getTime() - IST_OFFSET_MS);
}

function addDays(date: Date, days: number) {
  const newDate = new Date(date);
  newDate.setUTCDate(newDate.getUTCDate() + days);
  return newDate;
}

function getDateRangeIST(dateRange: string) {
  const now = new Date();

  let startDate: Date | undefined;
  let endDate: Date | undefined;

  if (dateRange === "today") {
    startDate = getISTDayStart(now);
    endDate = addDays(startDate, 1);
  } else if (dateRange === "yesterday") {
    const todayStart = getISTDayStart(now);
    startDate = addDays(todayStart, -1);
    endDate = todayStart;
  } else if (dateRange === "week") {
    const todayStart = getISTDayStart(now);
    startDate = addDays(todayStart, -7);
    endDate = addDays(todayStart, 1);
  } else if (dateRange === "month") {
    const istNow = new Date(now.getTime() + IST_OFFSET_MS);

    const istMonthStart = new Date(
      Date.UTC(istNow.getUTCFullYear(), istNow.getUTCMonth(), 1, 0, 0, 0, 0)
    );

    startDate = new Date(istMonthStart.getTime() - IST_OFFSET_MS);

    const nextMonthStart = new Date(
      Date.UTC(istNow.getUTCFullYear(), istNow.getUTCMonth() + 1, 1, 0, 0, 0, 0)
    );

    endDate = new Date(nextMonthStart.getTime() - IST_OFFSET_MS);
  }

  return { startDate, endDate };
}

function serializeAttendance(record: any) {
  return {
    id: record._id.toString(),
    _id: record._id.toString(),

   user: {
  id: record.user?._id?.toString?.() || record.user?.id || "",
  _id: record.user?._id?.toString?.() || record.user?.id || "",

  employeeCode: record.user?.employeeCode || null,
  fullName: record.user?.fullName || "Unknown Employee",
  username: record.user?.username || "",
  email: record.user?.email || "",
  phone: record.user?.phone || "",
  role: record.user?.role || "",
  status: record.user?.status || "",

  department: record.user?.department
    ? {
        id:
          record.user.department._id?.toString?.() ||
          record.user.department.id ||
          "",
        _id:
          record.user.department._id?.toString?.() ||
          record.user.department.id ||
          "",
        name: record.user.department.name || "",
        type: record.user.department.type || "",
        departmentCode: record.user.department.departmentCode || "",
        shortCode: record.user.department.shortCode || "",
      }
    : {
        id: "",
        _id: "",
        name: "N/A",
        type: "",
        departmentCode: "",
        shortCode: "",
      },
},

    attendanceDate: record.attendanceDate
      ? record.attendanceDate.toISOString()
      : null,

    checkIn: record.checkIn ? record.checkIn.toISOString() : null,

    checkOut: record.checkOut ? record.checkOut.toISOString() : null,

    status: record.status,
    remarks: record.remarks || null,

    createdAt: record.createdAt ? record.createdAt.toISOString() : null,
    updatedAt: record.updatedAt ? record.updatedAt.toISOString() : null,
  };
}

export async function getAttendance(searchParams?: {
  [key: string]: string | string[] | undefined;
}) {
  await connectDB();

  const currentUser = await getCurrentUser();

  if (!currentUser || currentUser.role !== Role.INCHARGE) {
    throw new Error("Unauthorized");
  }

  if (!currentUser.departmentId) {
    throw new Error("Department not found");
  }

  const search = (searchParams?.search as string) || "";
  const dateRange = (searchParams?.dateRange as string) || "today";
  const statusFilter = (searchParams?.status as string) || "all";

  const { startDate, endDate } = getDateRangeIST(dateRange);

  const userQuery: any = {
    department: currentUser.departmentId,
    role: Role.EMPLOYEE,
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

  if (startDate && endDate) {
    attendanceQuery.attendanceDate = {
      $gte: startDate,
      $lt: endDate,
    };
  } else if (startDate) {
    attendanceQuery.attendanceDate = {
      $gte: startDate,
    };
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
      select: "employeeCode fullName username email phone role status department",
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

  return attendance.map(serializeAttendance);
}