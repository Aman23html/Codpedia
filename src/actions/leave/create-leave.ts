"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/current-user";

export async function createLeave(
  fromDate: string,
  toDate: string,
  reason: string
) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    throw new Error("Unauthorized");
  }

  await prisma.leave.create({
    data: {
      userId: currentUser.id,
      fromDate: new Date(fromDate),
      toDate: new Date(toDate),
      reason,
    },
  });

  return {
    success: true,
  };
}