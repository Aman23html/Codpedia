"use server";

import { connectDB } from "@/lib/mongodb";
import { getCurrentUser } from "@/lib/current-user";
import { Leave } from "@/models/Leave";

export async function getMyLeaves() {
  await connectDB();

  const currentUser = await getCurrentUser();

  if (!currentUser) {
    throw new Error("Unauthorized");
  }

  const leaves = await Leave.find({
    user: currentUser.id,
  })
    .sort({
      createdAt: -1,
    })
    .lean();

  return JSON.parse(JSON.stringify(leaves));
}