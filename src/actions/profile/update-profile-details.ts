"use server";

import { revalidatePath } from "next/cache";

import { connectDB } from "@/lib/mongodb";
import { getCurrentUser } from "@/lib/current-user";
import { User } from "@/models/User";
import { Role } from "@/constants/enums";

function cleanValue(value: FormDataEntryValue | null) {
  return String(value || "").trim();
}

export async function updateProfileDetails(formData: FormData) {
  await connectDB();

  const currentUser = await getCurrentUser();

  if (!currentUser) {
    throw new Error("Unauthorized");
  }

  if (
    currentUser.role !== Role.EMPLOYEE &&
    currentUser.role !== Role.INCHARGE
  ) {
    throw new Error("Only employee or incharge can update profile.");
  }

  const fullName = cleanValue(formData.get("fullName"));
  const email = cleanValue(formData.get("email")).toLowerCase();
  const phone = cleanValue(formData.get("phone"));

  if (!fullName) {
    throw new Error("Full name is required.");
  }

  if (!email) {
    throw new Error("Email is required.");
  }

  if (!phone) {
    throw new Error("Phone number is required.");
  }

  const existingEmail = await User.findOne({
    email,
    _id: {
      $ne: currentUser.id,
    },
  })
    .select("_id")
    .lean();

  if (existingEmail) {
    throw new Error("This email is already used by another user.");
  }

  const existingPhone = await User.findOne({
    phone,
    _id: {
      $ne: currentUser.id,
    },
  })
    .select("_id")
    .lean();

  if (existingPhone) {
    throw new Error("This phone number is already used by another user.");
  }

  await User.findByIdAndUpdate(
    currentUser.id,
    {
      fullName,
      email,
      phone,
    },
    {
      returnDocument: "after",
    }
  );

  revalidatePath("/employee/profile");
  revalidatePath("/incharge/profile");
  revalidatePath("/employee");
  revalidatePath("/incharge");

  return {
    success: true,
    message: "Profile details updated successfully.",
  };
}