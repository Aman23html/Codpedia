"use server";

import { connectDB } from "@/lib/mongodb";
import { getCurrentUser } from "@/lib/current-user";
import { Leave } from "@/models/Leave";

export async function createLeave(
  fromDate: string,
  toDate: string,
  reason: string
) {
  await connectDB();

  const currentUser = await getCurrentUser();

  if (!currentUser) {
    throw new Error("Unauthorized");
  }

  await Leave.create({
    user: currentUser.id,
    fromDate: new Date(fromDate),
    toDate: new Date(toDate),
    reason,
  });

  return {
    success: true,
  };
}