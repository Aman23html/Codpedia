"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/current-user";

export async function getMyLeaves() {
  const currentUser =
    await getCurrentUser();

  if (!currentUser) {
    throw new Error("Unauthorized");
  }

  return prisma.leave.findMany({
    where: {
      userId: currentUser.id,
    },

    orderBy: {
      createdAt: "desc",
    },
  });
}