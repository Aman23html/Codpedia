import mongoose, { Schema, models, model } from "mongoose";
import { DepartmentType } from "@/constants/enums";

const DepartmentSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    type: {
      type: String,
      enum: Object.values(DepartmentType),
      required: true,
      unique: true,
      index: true,
    },

    departmentCode: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },

    shortCode: {
      type: String,
      required: true,
      trim: true,
    },

    incharge: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

DepartmentSchema.index(
  { incharge: 1 },
  {
    unique: true,
    sparse: true,
    partialFilterExpression: {
      incharge: { $type: "objectId" },
    },
  }
);

export const Department =
  models.Department || model("Department", DepartmentSchema);