import { z } from "zod";

export const registerSchema = z.object({
  fullName: z
    .string()
    .min(3, "Full name must be at least 3 characters"),

  username: z
    .string()
    .min(4, "Username must be at least 4 characters")
    .max(30),

  email: z
    .email("Invalid email address"),

  phone: z
    .string()
    .regex(/^[0-9]{10}$/, "Phone number must be 10 digits"),

  departmentId: z.string().min(1, "Department is required"),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Must contain an uppercase letter")
    .regex(/[a-z]/, "Must contain a lowercase letter")
    .regex(/[0-9]/, "Must contain a number"),
});

export type RegisterInput = z.infer<typeof registerSchema>;