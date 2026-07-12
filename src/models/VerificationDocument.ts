import mongoose, { Schema, models, model } from "mongoose";

const VerificationDocumentSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },

    documentName: {
      type: String,
      required: true,
      trim: true,
    },

    documentType: {
      type: String,
      required: true,
      trim: true,
    },

    documentUrl: {
      type: String,
      required: true,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    uploadedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: false,
  }
);

export const VerificationDocument =
  models.VerificationDocument ||
  model("VerificationDocument", VerificationDocumentSchema);