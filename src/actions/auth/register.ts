"use server";

import bcrypt from "bcryptjs";
import mongoose from "mongoose";

import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/User";
import { Department } from "@/models/Department";
import { firebaseAdminAuth } from "@/lib/firebase-admin";
import { Role, UserStatus } from "@/constants/enums";
import { generateEmployeeCode } from "@/lib/users/generate-employee-code";

type RegisterInput = {
  fullName: string;
  username: string;
  email: string;
  phone: string;
  password: string;
  departmentId: string;
};

export async function registerUser(data: RegisterInput) {
  let firebaseUid: string | null = null;

  try {
    await connectDB();

    const fullName = data.fullName?.trim();
    const username = data.username?.trim().toLowerCase();
    const email = data.email?.trim().toLowerCase();
    const phone = data.phone?.trim();
    const password = data.password;
    const departmentId = data.departmentId;

    if (!fullName || !username || !email || !phone || !password || !departmentId) {
      return {
        success: false,
        message: "All fields are required.",
      };
    }

    if (fullName.length < 3) {
      return {
        success: false,
        message: "Full name must be at least 3 characters.",
      };
    }

    if (username.length < 3) {
      return {
        success: false,
        message: "Username must be at least 3 characters.",
      };
    }

    if (!/^[a-z0-9._-]+$/.test(username)) {
      return {
        success: false,
        message: "Username can only contain letters, numbers, dot, underscore, and hyphen.",
      };
    }

    if (!email.includes("@") || !email.includes(".")) {
      return {
        success: false,
        message: "Invalid email address.",
      };
    }

    if (!/^[0-9]{10}$/.test(phone)) {
      return {
        success: false,
        message: "Phone number must be exactly 10 digits.",
      };
    }

    if (password.length < 8) {
      return {
        success: false,
        message: "Password must be at least 8 characters.",
      };
    }

    if (!mongoose.Types.ObjectId.isValid(departmentId)) {
      return {
        success: false,
        message: "Invalid department.",
      };
    }

    const department = await Department.findById(departmentId).lean();

    if (!department) {
      return {
        success: false,
        message: "Department not found.",
      };
    }

    const existingMongoUser = await User.findOne({
      $or: [{ email }, { username }, { phone }],
    }).lean();

    if (existingMongoUser) {
      if (existingMongoUser.email === email) {
        return {
          success: false,
          message: "Email already registered.",
        };
      }

      if (existingMongoUser.username === username) {
        return {
          success: false,
          message: "Username already taken.",
        };
      }

      if (existingMongoUser.phone === phone) {
        return {
          success: false,
          message: "Phone number already registered.",
        };
      }

      return {
        success: false,
        message: "User already exists.",
      };
    }

    try {
      const existingFirebaseUser = await firebaseAdminAuth.getUserByEmail(email);

      if (existingFirebaseUser) {
        return {
          success: false,
          message: "Email already exists.",
        };
      }
    } catch (error: any) {
      if (error?.code !== "auth/user-not-found") {
        console.error("Email check error:", error);

        return {
          success: false,
          message: "Account check failed.",
        };
      }
    }

    const firebaseUser = await firebaseAdminAuth.createUser({
      email,
      password,
      displayName: fullName,
      disabled: false,
    });

    firebaseUid = firebaseUser.uid;

    const passwordHash = await bcrypt.hash(password, 12);
    const employeeCode = await generateEmployeeCode(departmentId);

    await User.create({
      fullName,
      username,
      email,
      phone,
      passwordHash,
      employeeCode,
      role: Role.EMPLOYEE,
      status: UserStatus.PENDING_APPROVAL,
      emailVerified: true,
      department: departmentId,
      firebaseUid,
    });

    return {
      success: true,
      message: "Registration successful. Please wait for admin approval.",
    };
  } catch (error: any) {
    console.error("REGISTER USER ERROR:", error);

    if (firebaseUid) {
      try {
        await firebaseAdminAuth.deleteUser(firebaseUid);
      } catch (deleteError) {
        console.error("Firebase rollback failed:", deleteError);
      }
    }

    if (error?.code === 11000) {
      const field = Object.keys(error.keyPattern || {})[0];

      return {
        success: false,
        message: `${field || "User"} already exists.`,
      };
    }

    if (error?.code === "auth/email-already-exists") {
      return {
        success: false,
        message: "Email already exists.",
      };
    }

    if (error?.code === "auth/invalid-password") {
      return {
        success: false,
        message: "Password is invalid.",
      };
    }

    if (error?.code === "auth/invalid-email") {
      return {
        success: false,
        message: "EMSmail is invalid.",
      };
    }

    return {
      success: false,
      message: "Registration failed due to server error.",
    };
  }
}