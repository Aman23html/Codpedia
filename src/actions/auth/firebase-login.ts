"use server";

import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

import { firebaseAdminAuth } from "@/lib/firebase-admin";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/User";
import "@/models/Department";
import { UserStatus } from "@/constants/enums";

const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET is missing in .env");
  }

  return secret;
};

export async function firebaseLogin(idToken: string) {
  try {
    await connectDB();

    const decodedToken = await firebaseAdminAuth.verifyIdToken(idToken);
    const email = decodedToken.email?.toLowerCase();

    if (!email) {
      return {
        success: false,
        message: "Account email not found.",
      };
    }

    const user: any = await User.findOne({ email })
      .populate({
        path: "department",
        select: "name type departmentCode shortCode",
      })
      .lean();

    if (!user) {
      return {
        success: false,
        message:
          "Login successful, but EMS account was not found. Please contact admin.",
      };
    }

    if (user.status !== UserStatus.ACTIVE) {
      return {
        success: false,
        message: `Your EMS account is ${user.status}. Please wait for approval.`,
      };
    }

    const token = jwt.sign(
      {
        id: user._id.toString(),
        role: user.role,
      },
      getJwtSecret(),
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
      message: "Login failed. Please check your email and password.",
    };
  }
}