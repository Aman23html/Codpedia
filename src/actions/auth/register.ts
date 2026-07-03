"use server";

import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";
import { registerSchema } from "@/validations/register";
import { generateEmployeeCode } from "@/lib/users/generate-employee-code";

export async function registerUser(data: unknown) {
  try {
    const validatedData = registerSchema.parse(data);

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: validatedData.email },
          { username: validatedData.username },
          { phone: validatedData.phone },
        ],
      },
    });

    if (existingUser) {
      return {
        success: false,
        message:
          "Email, Username or Phone already exists",
      };
    }

    const passwordHash = await bcrypt.hash(
      validatedData.password,
      10
    );

    const employeeCode = await generateEmployeeCode(departmentId);

    const user = await prisma.user.create({
      data: {
        fullName: validatedData.fullName,
        username: validatedData.username,
        email: validatedData.email,
        phone: validatedData.phone,
        passwordHash,

        departmentId: validatedData.departmentId,
        employeecode,

        role: "EMPLOYEE",
        status: "PENDING_APPROVAL",
      },
    });

    return {
      success: true,
      message: "Registration successful",
      userId: user.id,
    };
  } catch (error) {
    console.error(error);

    return {
      success: false,
      message: "Registration failed",
    };
  }
}