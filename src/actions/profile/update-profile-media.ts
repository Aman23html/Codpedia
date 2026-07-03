"use server";

import fs from "fs/promises";
import path from "path";
import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/current-user";
import { Role } from "@prisma/client";

const MAX_FILE_SIZE = 3 * 1024 * 1024;

async function saveImageFile(file: File, userId: string, type: "profile" | "cover") {
  if (!file || file.size === 0) {
    return null;
  }

  if (!file.type.startsWith("image/")) {
    throw new Error("Only image files are allowed.");
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new Error("Image size must be less than 3MB.");
  }

  const extension = file.name.split(".").pop() || "png";

  const fileName = `${userId}-${type}-${Date.now()}.${extension}`;

  const uploadDir = path.join(process.cwd(), "public", "uploads", "profiles");

  await fs.mkdir(uploadDir, {
    recursive: true,
  });

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const filePath = path.join(uploadDir, fileName);

  await fs.writeFile(filePath, buffer);

  return `/uploads/profiles/${fileName}`;
}

export async function updateProfileMedia(formData: FormData) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    throw new Error("Unauthorized");
  }

  if (
    currentUser.role !== Role.EMPLOYEE &&
    currentUser.role !== Role.INCHARGE
  ) {
    throw new Error("Only employee or incharge can update profile media.");
  }

  const profileImage = formData.get("profileImage") as File | null;
  const coverImage = formData.get("coverImage") as File | null;

  const data: {
    profileImageUrl?: string;
    coverImageUrl?: string;
  } = {};

  if (profileImage && profileImage.size > 0) {
    const profileImageUrl = await saveImageFile(
      profileImage,
      currentUser.id,
      "profile"
    );

    if (profileImageUrl) {
      data.profileImageUrl = profileImageUrl;
    }
  }

  if (coverImage && coverImage.size > 0) {
    const coverImageUrl = await saveImageFile(
      coverImage,
      currentUser.id,
      "cover"
    );

    if (coverImageUrl) {
      data.coverImageUrl = coverImageUrl;
    }
  }

  if (Object.keys(data).length === 0) {
    throw new Error("Please select at least one image.");
  }

  await prisma.user.update({
    where: {
      id: currentUser.id,
    },
    data,
  });

  revalidatePath("/employee/profile");
  revalidatePath("/incharge/profile");
  revalidatePath("/employee");
  revalidatePath("/incharge");

  return {
    success: true,
    message: "Profile media updated successfully.",
  };
}