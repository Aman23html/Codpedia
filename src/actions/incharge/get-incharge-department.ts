"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/current-user";
import { Role } from "@prisma/client";

export async function getInchargeDepartment() {
  const currentUser = await getCurrentUser();

  if (!currentUser || currentUser.role !== Role.INCHARGE) {
    throw new Error("Unauthorized");
  }

  const department = await prisma.department.findUnique({
    where: {
      id: currentUser.departmentId,
    },
    select: {
      id: true,
      name: true,
      type: true,
    },
  });

  return department;
}