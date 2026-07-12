import mongoose, { Schema, models, model } from "mongoose";
import { OperationReportStatus } from "@/constants/enums";

const EmployeeOperationReportSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    reportDate: {
      type: Date,
      required: true,
      index: true,
    },

    queryGenerated: {
      type: Number,
      default: 0,
      min: 0,
    },

    dealsDone: {
      type: Number,
      default: 0,
      min: 0,
    },

    tutorAssigned: {
      type: Number,
      default: 0,
      min: 0,
    },

    dealsDoneAmount: {
      type: Number,
      default: 0,
      min: 0,
    },

    workNotes: {
      type: String,
      default: null,
      trim: true,
    },

    status: {
      type: String,
      enum: Object.values(OperationReportStatus),
      default: OperationReportStatus.DRAFT,
      index: true,
    },

    submittedAt: {
      type: Date,
      default: null,
    },

    lockedAt: {
      type: Date,
      default: null,
    },

    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    reviewedAt: {
      type: Date,
      default: null,
    },

    reviewRemarks: {
      type: String,
      default: null,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

EmployeeOperationReportSchema.index(
  {
    user: 1,
    reportDate: 1,
  },
  {
    unique: true,
  }
);

EmployeeOperationReportSchema.index({ reportDate: 1 });
EmployeeOperationReportSchema.index({ status: 1 });

export const EmployeeOperationReport =
  models.EmployeeOperationReport ||
  model("EmployeeOperationReport", EmployeeOperationReportSchema);