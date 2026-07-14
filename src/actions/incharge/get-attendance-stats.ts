// "use server";

// import { connectDB } from "@/lib/mongodb";
// import { getCurrentUser } from "@/lib/current-user";
// import { User } from "@/models/User";
// import { Attendance } from "@/models/Attendance";
// import { Role, AttendanceStatus } from "@/constants/enums";

// export async function getAttendanceStats() {
//   await connectDB();

//   const currentUser = await getCurrentUser();

//   if (!currentUser || currentUser.role !== Role.INCHARGE) {
//     throw new Error("Unauthorized");
//   }

//   const today = new Date();
//   today.setHours(0, 0, 0, 0);

//   const tomorrow = new Date(today);
//   tomorrow.setDate(tomorrow.getDate() + 1);

//   const dateFilter = {
//     $gte: today,
//     $lt: tomorrow,
//   };

//   const departmentUsers = await User.find({
//     department: currentUser.departmentId,
//     role: Role.EMPLOYEE,
//   })
//     .select("_id")
//     .lean();

//   const userIds = departmentUsers.map((user: any) => user._id);

//   const [
//     totalEmployees,
//     present,
//     absent,
//     halfDay,
//     leave,
//     totalRecords,
//   ] = await Promise.all([
//     User.countDocuments({
//       department: currentUser.departmentId,
//       role: Role.EMPLOYEE,
//     }),

//     Attendance.countDocuments({
//       status: AttendanceStatus.PRESENT,
//       attendanceDate: dateFilter,
//       user: {
//         $in: userIds,
//       },
//     }),

//     Attendance.countDocuments({
//       status: AttendanceStatus.ABSENT,
//       attendanceDate: dateFilter,
//       user: {
//         $in: userIds,
//       },
//     }),

//     Attendance.countDocuments({
//       status: AttendanceStatus.HALF_DAY,
//       attendanceDate: dateFilter,
//       user: {
//         $in: userIds,
//       },
//     }),

//     Attendance.countDocuments({
//       status: AttendanceStatus.LEAVE,
//       attendanceDate: dateFilter,
//       user: {
//         $in: userIds,
//       },
//     }),

//     Attendance.countDocuments({
//       attendanceDate: dateFilter,
//       user: {
//         $in: userIds,
//       },
//     }),
//   ]);

//   return {
//     totalEmployees,
//     present,
//     absent,
//     halfDay,
//     leave,
//     totalRecords,
//   };
// }

"use server";

import { connectDB } from "@/lib/mongodb";
import { getCurrentUser } from "@/lib/current-user";
import { User } from "@/models/User";
import { Attendance } from "@/models/Attendance";
import { Role, AttendanceStatus } from "@/constants/enums";

const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000;

function getTodayRangeIST() {
  const now = new Date();

  const istNow = new Date(now.getTime() + IST_OFFSET_MS);
  istNow.setUTCHours(0, 0, 0, 0);

  const start = new Date(istNow.getTime() - IST_OFFSET_MS);

  const end = new Date(start);
  end.setUTCDate(end.getUTCDate() + 1);

  return { start, end };
}

export async function getAttendanceStats() {
  await connectDB();

  const currentUser = await getCurrentUser();

  if (!currentUser || currentUser.role !== Role.INCHARGE) {
    throw new Error("Unauthorized");
  }

  if (!currentUser.departmentId) {
    throw new Error("Department not found");
  }

  const { start, end } = getTodayRangeIST();

  const dateFilter = {
    $gte: start,
    $lt: end,
  };

  const departmentUsers = await User.find({
    department: currentUser.departmentId,
    role: Role.EMPLOYEE,
  })
    .select("_id")
    .lean();

  const userIds = departmentUsers.map((user: any) => user._id);

  const [totalEmployees, present, absent, halfDay, leave, totalRecords] =
    await Promise.all([
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