"use server";

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/User";
import { UserStatus } from "@/constants/enums";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is missing in .env");
}

export async function loginUser(identifier: string, password: string) {
  try {
    await connectDB();

    const loginValue = identifier.trim().toLowerCase();

    const user: any = await User.findOne({
      $or: [{ email: loginValue }, { username: loginValue }],
    }).lean();

    if (!user) {
      return {
        success: false,
        message: "Invalid credentials",
      };
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      user.passwordHash
    );

    if (!isPasswordValid) {
      return {
        success: false,
        message: "Invalid credentials",
      };
    }

    if (user.status !== UserStatus.ACTIVE) {
      return {
        success: false,
        message: `Your account is ${user.status}. Please wait for approval.`,
      };
    }

    const token = jwt.sign(
      {
        id: user._id.toString(),
        role: user.role,
      },
      JWT_SECRET!,
      {
        expiresIn: "7d",
      }
    );

    const cookieStore = await cookies();

    cookieStore.set("ems_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return {
      success: true,
      message: "Login successful",
      role: user.role,
    };
  } catch (error) {
    console.error("Login error:", error);

    return {
      success: false,
      message: "Server error during login",
    };
  }
}