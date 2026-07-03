import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";

export async function getCurrentUser() {
  const cookieStore = await cookies();

  const token = cookieStore.get("ems_token")?.value;

  if (!token) {
    return null;
  }

  const payload = verifyToken(token);

  if (!payload) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: {
      id: (payload as any).userId,
    },
    select: {
      id: true,
      employeeCode: true,
      fullName: true,
      username: true,
      email: true,
      phone: true,
      role: true,
      status: true,
      profileImageUrl: true,
      coverImageUrl: true,
      departmentId: true,

      department: {
        select: {
          id: true,
          name: true,
          type: true,
        },
      },

      createdAt: true,
      updatedAt: true,
    },
  });

  return user;
}