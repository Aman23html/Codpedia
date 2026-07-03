"use server";

import { prisma } from "@/lib/prisma";

type SearchParams = {
  search?: string | string[];
  department?: string | string[];
  sortDate?: string | string[];
};

export async function getUsers(searchParams?: SearchParams) {
  const search =
    typeof searchParams?.search === "string"
      ? searchParams.search.trim()
      : "";

  const department =
    typeof searchParams?.department === "string"
      ? searchParams.department
      : "";

  const sortDate =
    typeof searchParams?.sortDate === "string"
      ? searchParams.sortDate
      : "desc";

  return await prisma.user.findMany({
    where: {
      ...(search
        ? {
            OR: [
              {
                employeeCode: {
                  contains: search,
                  mode: "insensitive",
                },
              },
              {
                fullName: {
                  contains: search,
                  mode: "insensitive",
                },
              },
              {
                username: {
                  contains: search,
                  mode: "insensitive",
                },
              },
              {
                email: {
                  contains: search,
                  mode: "insensitive",
                },
              },
              {
                phone: {
                  contains: search,
                  mode: "insensitive",
                },
              },
            ],
          }
        : {}),

      ...(department
        ? {
            department: {
              type: department as any,
            },
          }
        : {}),
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

    orderBy: {
      createdAt: sortDate === "asc" ? "asc" : "desc",
    },
  });
}