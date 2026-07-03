"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/current-user";
import { Role } from "@prisma/client";

export async function getDepartmentEmployees(searchParams?: { [key: string]: string | string[] | undefined }) {
  const currentUser = await getCurrentUser();

  if (!currentUser || currentUser.role !== Role.INCHARGE) {
    throw new Error("Unauthorized");
  }

  // 1. Extract filter parameters
  const search = (searchParams?.search as string) || "";
  const statusFilter = (searchParams?.status as string) || "all";

  // 2. Initialize Base Where Clause
  const whereClause: any = {
    departmentId: currentUser.departmentId,
    role: Role.EMPLOYEE,
  };

  // 3. Apply Search Filter (Name or Email)
  if (search) {
    whereClause.OR = [
      {
        fullName: {
          contains: search,
          mode: "insensitive", // Case-insensitive search
        },
      },
      {
        email: {
          contains: search,
          mode: "insensitive",
        },
      },
    ];
  }

  // 4. Apply Status Filter
  if (statusFilter !== "all") {
    // Forces uppercase to match standard database Enums (e.g., "ACTIVE", "PENDING")
    whereClause.status = statusFilter.toUpperCase();
  }

  // 5. Execute Query
  return prisma.user.findMany({
    where: whereClause,
    include: {
      department: true,
    },
    orderBy: {
      fullName: "asc",
    },
  });
}