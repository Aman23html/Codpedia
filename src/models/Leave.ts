import mongoose, { Schema, models, model } from "mongoose";
import { LeaveStatus } from "@/constants/enums";

const LeaveSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    fromDate: {
      type: Date,
      required: true,
      index: true,
    },

    toDate: {
      type: Date,
      required: true,
      index: true,
    },

    reason: {
      type: String,
      required: true,
      trim: true,
    },

    status: {
      type: String,
      enum: Object.values(LeaveStatus),
      default: LeaveStatus.PENDING,
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

export const Leave = models.Leave || model("Leave", LeaveSchema);