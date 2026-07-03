"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/current-user";
import { Role } from "@prisma/client";

function cleanValue(value: FormDataEntryValue | null) {
  return String(value || "").trim();
}

export async function updateProfileDetails(formData: FormData) {
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
  const email = cleanValue(formData.get("email"));
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

  const existingEmail = await prisma.user.findFirst({
    where: {
      email,
      NOT: {
        id: currentUser.id,
      },
    },
    select: {
      id: true,
    },
  });

  if (existingEmail) {
    throw new Error("This email is already used by another user.");
  }

  const existingPhone = await prisma.user.findFirst({
    where: {
      phone,
      NOT: {
        id: currentUser.id,
      },
    },
    select: {
      id: true,
    },
  });

  if (existingPhone) {
    throw new Error("This phone number is already used by another user.");
  }

  await prisma.user.update({
    where: {
      id: currentUser.id,
    },
    data: {
      fullName,
      email,
      phone,
    },
  });

  revalidatePath("/employee/profile");
  revalidatePath("/incharge/profile");
  revalidatePath("/employee");
  revalidatePath("/incharge");

  return {
    success: true,
    message: "Profile details updated successfully.",
  };
}