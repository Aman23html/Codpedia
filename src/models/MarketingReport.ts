import mongoose, { Schema, models, model } from "mongoose";
import { Country, ReportStatus } from "@/constants/enums";

const MarketingReportSchema = new Schema(
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

    country: {
      type: String,
      enum: Object.values(Country),
      required: true,
      index: true,
    },

    whatsappGroupsJoined: {
      type: Number,
      default: 0,
      min: 0,
    },

    whatsappPostsDone: {
      type: Number,
      default: 0,
      min: 0,
    },

    telegramGroupsJoined: {
      type: Number,
      default: 0,
      min: 0,
    },

    telegramPostsDone: {
      type: Number,
      default: 0,
      min: 0,
    },

    facebookGroupsJoined: {
      type: Number,
      default: 0,
      min: 0,
    },

    facebookPostsDone: {
      type: Number,
      default: 0,
      min: 0,
    },

    resourceLogin: {
      type: Number,
      default: 0,
      min: 0,
    },

    accountClean: {
      type: Number,
      default: 0,
      min: 0,
    },

    status: {
      type: String,
      enum: Object.values(ReportStatus),
      default: ReportStatus.PENDING,
      index: true,
    },

    remarks: {
      type: String,
      default: null,
      trim: true,
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

MarketingReportSchema.index(
  {
    user: 1,
    country: 1,
    reportDate: 1,
  },
  {
    unique: true,
  }
);

export const MarketingReport =
  models.MarketingReport || model("MarketingReport", MarketingReportSchema);