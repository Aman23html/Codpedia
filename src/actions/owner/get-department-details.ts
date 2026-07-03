"use server";

import { prisma } from "@/lib/prisma";

export async function getDepartmentDetails(
  departmentId: string
) {
  return prisma.department.findUnique({
    where: {
      id: departmentId,
    },

    include: {
      users: {
        orderBy: {
          fullName: "asc",
        },
      },
    },
  });
}