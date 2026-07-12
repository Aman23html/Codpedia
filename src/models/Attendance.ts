import mongoose, { Schema, models, model } from "mongoose";
import { AttendanceStatus } from "@/constants/enums";

const AttendanceSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    attendanceDate: {
      type: Date,
      required: true,
      index: true,
    },

    checkIn: {
      type: Date,
      default: null,
    },

    checkOut: {
      type: Date,
      default: null,
    },

    status: {
      type: String,
      enum: Object.values(AttendanceStatus),
      default: AttendanceStatus.PRESENT,
      index: true,
    },

    remarks: {
      type: String,
      default: null,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

AttendanceSchema.index(
  {
    user: 1,
    attendanceDate: 1,
  },
  {
    unique: true,
  }
);

export const Attendance =
  models.Attendance || model("Attendance", AttendanceSchema);