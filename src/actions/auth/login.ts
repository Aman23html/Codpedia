"use server";

import bcrypt from "bcryptjs";
import { cookies } from "next/headers";

import { prisma } from "@/lib/prisma";
import { createToken } from "@/lib/jwt";

export async function loginUser(
  identifier: string,
  password: string
) {
  try {
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: identifier },
          { username: identifier },
        ],
      },
    });

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

    if (user.status !== "ACTIVE") {
      return {
        success: false,
        message:
          "Your account is not approved yet.",
      };
    }

    const token = createToken({
      userId: user.id,
      role: user.role,
      departmentId: user.departmentId,
    });

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
    console.error(error);

    return {
      success: false,
      message: "Something went wrong",
    };
  }
}