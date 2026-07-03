"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/current-user";
import { Role, UserStatus } from "@prisma/client";

export async function updateUser(
  userId: string,
  role: Role,
  status: UserStatus
) {
  const currentUser = await getCurrentUser();
  console.log("CURRENT USER:", currentUser);

  if (!currentUser || currentUser.role !== Role.OWNER) {
    throw new Error("Unauthorized");
  }

  if (currentUser.id === userId && role !== Role.OWNER) {
    throw new Error("Owner cannot change their own role");
  }

  await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      role,
      status,
    },
  });

  return {
    success: true,
  };
}