"use server";

import { prisma } from "@/lib/prisma";

export async function getDepartments() {
  const departments = await prisma.department.findMany({
    include: {
      users: true,
    },
    orderBy: {
      name: "asc",
    },
  });

  return departments.map((department) => ({
    id: department.id,
    name: department.name,
    type: department.type,

    employeeCount: department.users.filter(
      (user) => user.role === "EMPLOYEE"
    ).length,

    inchargeCount: department.users.filter(
      (user) => user.role === "INCHARGE"
    ).length,
  }));
}