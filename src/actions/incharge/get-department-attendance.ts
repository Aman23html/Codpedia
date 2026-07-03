"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/current-user";
import { Role } from "@prisma/client";

export async function getDepartmentAttendance() {
  const currentUser = await getCurrentUser();

  if (!currentUser || currentUser.role !== Role.INCHARGE) {
    throw new Error("Unauthorized");
  }

  return prisma.attendance.findMany({
    where: {
      user: {
        departmentId: currentUser.departmentId,
      },
    },

    include: {
      user: true,
    },

    orderBy: {
      attendanceDate: "desc",
    },
  });
}