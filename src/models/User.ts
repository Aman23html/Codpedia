import mongoose, { Schema, models, model } from "mongoose";
import { Role, UserStatus } from "@/constants/enums";

const UserSchema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    phone: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },

    passwordHash: {
      type: String,
      required: true,
    },

    employeeCode: {
      type: String,
      unique: true,
      sparse: true,
      default: null,
      index: true,
    },

    profileImageUrl: {
      type: String,
      default: null,
    },

    coverImageUrl: {
      type: String,
      default: null,
    },

    role: {
      type: String,
      enum: Object.values(Role),
      default: Role.EMPLOYEE,
      index: true,
    },

    status: {
      type: String,
      enum: Object.values(UserStatus),
      default: UserStatus.PENDING_EMAIL,
      index: true,
    },

    emailVerified: {
      type: Boolean,
      default: false,
    },

    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      required: true,
      index: true,
    },

    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export const User = models.User || model("User", UserSchema);