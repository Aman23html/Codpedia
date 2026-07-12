"use server";

import { connectDB } from "@/lib/mongodb";
import { getCurrentUser } from "@/lib/current-user";
import { User } from "@/models/User";
import { Role } from "@/constants/enums";

export async function getMyProfile() {
  await connectDB();

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

  const user: any = await User.findById(currentUser.id)
    .populate({
      path: "department",
      select: "name type departmentCode shortCode",
    })
    .select(
      "employeeCode fullName username email phone role status profileImageUrl coverImageUrl department createdAt"
    )
    .lean();

  if (!user) {
    return null;
  }

  return {
    id: user._id.toString(),
    employeeCode: user.employeeCode,
    fullName: user.fullName,
    username: user.username,
    email: user.email,
    phone: user.phone,
    role: user.role,
    status: user.status,
    profileImageUrl: user.profileImageUrl,
    coverImageUrl: user.coverImageUrl,
    department: user.department
      ? {
          id: user.department._id.toString(),
          name: user.department.name,
          type: user.department.type,
          departmentCode: user.department.departmentCode,
          shortCode: user.department.shortCode,
        }
      : null,
    createdAt: user.createdAt?.toISOString(),
  };
}