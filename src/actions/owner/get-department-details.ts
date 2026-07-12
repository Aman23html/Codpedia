"use server";

import mongoose from "mongoose";

import { connectDB } from "@/lib/mongodb";
import { Department } from "@/models/Department";
import { User } from "@/models/User";

export async function getDepartmentDetails(departmentId: string) {
  try {
    await connectDB();

    if (!mongoose.Types.ObjectId.isValid(departmentId)) {
      return null;
    }

    const department = await Department.findById(departmentId).lean();

    if (!department) {
      return null;
    }

    const users = await User.find({
      department: department._id,
    })
      .sort({ fullName: 1 })
      .lean();

    return JSON.parse(
      JSON.stringify({
        ...department,
        id: department._id,
        users,
      })
    );
  } catch (error) {
    console.error("Get department details error:", error);
    return null;
  }
}