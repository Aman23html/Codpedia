"use server";

import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/User";
import { Department } from "@/models/Department";

type SearchParams = {
  search?: string | string[];
  department?: string | string[];
  sortDate?: string | string[];
};

export async function getUsers(searchParams?: SearchParams) {
  try {
    await connectDB();

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

    const query: any = {};

    if (search) {
      query.$or = [
        { employeeCode: { $regex: search, $options: "i" } },
        { fullName: { $regex: search, $options: "i" } },
        { username: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
      ];
    }

    if (department) {
      const departmentDoc = await Department.findOne({
        type: department,
      }).lean();

      if (departmentDoc) {
        query.department = departmentDoc._id;
      } else {
        return [];
      }
    }

    const users = await User.find(query)
      .populate({
        path: "department",
        select: "name type departmentCode shortCode",
      })
      .select(
        "employeeCode fullName username email phone role status profileImageUrl coverImageUrl department createdAt updatedAt"
      )
      .sort({
        createdAt: sortDate === "asc" ? 1 : -1,
      })
      .lean();

    return users.map((user: any) => ({
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

      departmentId: user.department?._id?.toString() || "",

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
      updatedAt: user.updatedAt?.toISOString(),
    }));
  } catch (error) {
    console.error("Get users error:", error);
    return [];
  }
}