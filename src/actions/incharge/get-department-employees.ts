"use server";

import { connectDB } from "@/lib/mongodb";
import { getCurrentUser } from "@/lib/current-user";
import { User } from "@/models/User";
import { Role } from "@/constants/enums";

export async function getDepartmentEmployees(searchParams?: {
  [key: string]: string | string[] | undefined;
}) {
  await connectDB();

  const currentUser = await getCurrentUser();

  if (!currentUser || currentUser.role !== Role.INCHARGE) {
    throw new Error("Unauthorized");
  }

  const search = (searchParams?.search as string) || "";
  const statusFilter = (searchParams?.status as string) || "all";

  const query: any = {
    department: currentUser.departmentId,
    role: Role.EMPLOYEE,
  };

  if (search) {
    query.$or = [
      { fullName: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
      { username: { $regex: search, $options: "i" } },
      { employeeCode: { $regex: search, $options: "i" } },
      { phone: { $regex: search, $options: "i" } },
    ];
  }

  if (statusFilter !== "all") {
    query.status = statusFilter.toUpperCase();
  }

  const employees = await User.find(query)
    .populate({
      path: "department",
      select: "name type departmentCode shortCode",
    })
    .sort({
      fullName: 1,
    })
    .lean();

  return JSON.parse(JSON.stringify(employees));
}