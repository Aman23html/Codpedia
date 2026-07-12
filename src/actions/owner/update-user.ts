"use server";

import mongoose from "mongoose";

import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/User";
import { getCurrentUser } from "@/lib/current-user";
import { Role, UserStatus } from "@/constants/enums";

export async function updateUser(
  userId: string,
  role: string,
  status: string
) {
  await connectDB();

  const currentUser = await getCurrentUser();

  if (!currentUser || currentUser.role !== Role.OWNER) {
    throw new Error("Unauthorized");
  }

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new Error("Invalid user ID");
  }

  if (!Object.values(Role).includes(role as any)) {
    throw new Error("Invalid role");
  }

  if (!Object.values(UserStatus).includes(status as any)) {
    throw new Error("Invalid status");
  }

  if (currentUser.id === userId && role !== Role.OWNER) {
    throw new Error("Owner cannot change their own role");
  }

  await User.findByIdAndUpdate(
    userId,
    {
      role,
      status,
    },
    {
      returnDocument: "after",
    }
  );

  return {
    success: true,
  };
}