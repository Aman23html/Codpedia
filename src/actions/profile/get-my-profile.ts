"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/current-user";
import { Role } from "@prisma/client";

export async function getMyProfile() {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    throw new Error("Unauthorized");
  }

  if (
    currentUser.role !== Role.EMPLOYEE &&
    currentUser.role !== Role.INCHARGE
  ) {
    throw new Error("Only employee or incharge profile is available here.");
  }

  return prisma.user.findUnique({
    where: {
      id: currentUser.id,
    },
    select: {
      id: true,
      employeeCode: true,
      fullName: true,
      username: true,
      email: true,
      phone: true,
      role: true,
      status: true,
      profileImageUrl: true,
      coverImageUrl: true,
      department: {
        select: {
          name: true,
          type: true,
        },
      },
      createdAt: true,
    },
  });
}