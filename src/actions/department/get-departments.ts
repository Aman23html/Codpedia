"use server";

import { prisma } from "@/lib/prisma";

export async function getDepartments() {
  try {
    const departments = await prisma.department.findMany({
      orderBy: {
        name: "asc",
      },
    });

    return departments;
  } catch (error) {
    console.error(error);
    return [];
  }
}