"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/current-user";
import { Role, AttendanceStatus } from "@prisma/client";

export async function getAttendance(searchParams?: { [key: string]: string | string[] | undefined }) {
  const currentUser = await getCurrentUser();

  if (!currentUser || currentUser.role !== Role.INCHARGE) {
    throw new Error("Unauthorized");
  }

  // 1. Extract filter parameters
  const search = (searchParams?.search as string) || "";
  const dateRange = (searchParams?.dateRange as string) || "today";
  const statusFilter = (searchParams?.status as string) || "all";

  // 2. Build Date Filters
  const now = new Date();
  let startDate: Date | undefined;
  let endDate: Date | undefined;

  if (dateRange === "today") {
    startDate = new Date(now.setHours(0, 0, 0, 0));
    endDate = new Date(now.setHours(23, 59, 59, 999));
  } else if (dateRange === "yesterday") {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    startDate = new Date(yesterday.setHours(0, 0, 0, 0));
    endDate = new Date(yesterday.setHours(23, 59, 59, 999));
  } else if (dateRange === "week") {
    startDate = new Date();
    startDate.setDate(startDate.getDate() - 7);
    startDate.setHours(0, 0, 0, 0);
  } else if (dateRange === "month") {
    startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    startDate.setHours(0, 0, 0, 0);
  }

  // 3. Initialize Base Where Clause
  const whereClause: any = {
    user: {
      departmentId: currentUser.departmentId,
    },
  };

  // 4. Apply Date Filter
  if (startDate) {
    whereClause.attendanceDate = { gte: startDate };
    if (endDate) {
      whereClause.attendanceDate.lte = endDate;
    }
  }

  // 5. Apply Status Filter
  if (statusFilter !== "all") {
    // Ensure the string matches a valid Prisma Enum to prevent crashes
    if (Object.values(AttendanceStatus).includes(statusFilter as AttendanceStatus)) {
      whereClause.status = statusFilter as AttendanceStatus;
    }
  }

  // 6. Apply Search Filter (Name)
  if (search) {
    whereClause.user.OR = [
      {
        fullName: {
          contains: search,
          mode: "insensitive",
        },
      }
      // Note: If you added an `employeeCode` to your Prisma schema, 
      // you can uncomment the line below to search by ID as well:
      // , { employeeCode: { contains: search, mode: "insensitive" } }
    ];
  }

  // 7. Execute Query
  return prisma.attendance.findMany({
    where: whereClause,
    include: {
      user: {
        include: {
          department: true, // Included so the UI can display the department name
        }
      },
    },
    orderBy: [
      { attendanceDate: "desc" },
      { checkIn: "desc" }
    ],
  });
}