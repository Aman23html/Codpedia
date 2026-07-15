// "use server";

// import { connectDB } from "@/lib/mongodb";
// import { getCurrentUser } from "@/lib/current-user";

// import { Attendance } from "@/models/Attendance";
// import { MarketingReport } from "@/models/MarketingReport";
// import { EmployeeOperationReport } from "@/models/EmployeeOperationReport";

// import { DepartmentType, Role } from "@/constants/enums";

// function getGreeting() {
//   const hour = new Date().getHours();

//   if (hour < 12) return "Good Morning";
//   if (hour < 17) return "Good Afternoon";
//   return "Good Evening";
// }

// function getTodayRange() {
//   const start = new Date();
//   start.setHours(0, 0, 0, 0);

//   const end = new Date(start);
//   end.setDate(end.getDate() + 1);

//   return { start, end };
// }

// async function getDepartmentReportCount(
//   userId: string,
//   department?: string
// ) {
//   if (department === DepartmentType.OPERATIONS) {
//     return EmployeeOperationReport.countDocuments({
//       user: userId,
//     });
//   }

//   if (department === DepartmentType.MARKETING) {
//     return MarketingReport.countDocuments({
//       user: userId,
//     });
//   }

//   return 0;
// }

// export async function getDashboardData() {
//   await connectDB();

//   const user = await getCurrentUser();

//   if (!user || user.role !== Role.EMPLOYEE) {
//     return null;
//   }

//   const { start, end } = getTodayRange();

//   const [todayAttendance, totalReports] = await Promise.all([
//     Attendance.findOne({
//       user: user.id,
//       attendanceDate: {
//         $gte: start,
//         $lt: end,
//       },
//     })
//       .sort({
//         createdAt: -1,
//       })
//       .lean(),

//     getDepartmentReportCount(user.id, user.department?.type),
//   ]);

//   return {
//     employee: user,

//     greeting: getGreeting(),

//     todayAttendance: todayAttendance
//       ? JSON.parse(JSON.stringify(todayAttendance))
//       : null,

//     stats: {
//       attendancePercentage: 0,
//       totalReports,
//       leaveBalance: 0,
//       performance: "Good",
//     },
//   };
// }


"use server";

import { connectDB } from "@/lib/mongodb";
import { getCurrentUser } from "@/lib/current-user";

import { Attendance } from "@/models/Attendance";
import { MarketingReport } from "@/models/MarketingReport";
import { EmployeeOperationReport } from "@/models/EmployeeOperationReport";

import { DepartmentType, Role } from "@/constants/enums";
import { getAttendanceWindowEnd } from "@/lib/attendance/attendance-window";
import { APP_TIME_ZONE } from "@/constants/attendance";

function getGreeting() {
  const hour = Number(
    new Intl.DateTimeFormat("en-IN", {
      timeZone: APP_TIME_ZONE,
      hour: "2-digit",
      hour12: false,
    }).format(new Date())
  );

  if (hour < 12) return "Good Morning";
  if (hour < 17) return "Good Afternoon";
  return "Good Evening";
}

async function getDepartmentReportCount(userId: string, department?: string) {
  if (department === DepartmentType.OPERATIONS) {
    return EmployeeOperationReport.countDocuments({
      user: userId,
    });
  }

  if (department === DepartmentType.MARKETING) {
    return MarketingReport.countDocuments({
      user: userId,
    });
  }

  return 0;
}

function serializeAttendance(attendance: any) {
  if (!attendance?.checkIn) return null;

  const now = new Date();
  const windowEnd = getAttendanceWindowEnd(attendance.checkIn);

  // IMPORTANT:
  // If attendance window expired and employee did not check out,
  // do not send this old record to dashboard card.
  // Dashboard will show "Start Check-In" again.
  if (now > windowEnd) {
  return null;
} 

  return {
    id: attendance._id.toString(),
    _id: attendance._id.toString(),

    user: attendance.user?.toString?.() || String(attendance.user),

    attendanceDate: attendance.attendanceDate
      ? attendance.attendanceDate.toISOString()
      : null,

    checkIn: attendance.checkIn ? attendance.checkIn.toISOString() : null,

    checkOut: attendance.checkOut ? attendance.checkOut.toISOString() : null,

    status: attendance.status,
    remarks: attendance.remarks || null,

    createdAt: attendance.createdAt ? attendance.createdAt.toISOString() : null,
    updatedAt: attendance.updatedAt ? attendance.updatedAt.toISOString() : null,

    windowEnd: windowEnd.toISOString(),
    isWindowActive: now <= windowEnd,
  };
}

export async function getDashboardData() {
  await connectDB();

  const user = await getCurrentUser();

  if (!user || user.role !== Role.EMPLOYEE) {
    return null;
  }

  const [latestAttendance, totalReports] = await Promise.all([
    Attendance.findOne({
      user: user.id,
    })
      .sort({
        checkIn: -1,
      })
      .lean(),

    getDepartmentReportCount(user.id, user.department?.type),
  ]);

  const todayAttendance = serializeAttendance(latestAttendance);

  return {
    employee: user,

    greeting: getGreeting(),

    todayAttendance,

    stats: {
      attendancePercentage: 0,
      totalReports,
      leaveBalance: 0,
      performance: "Good",
    },
  };
}