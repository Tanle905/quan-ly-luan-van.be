import mongoose, { Schema } from "mongoose";
import { Student } from "../interface/student.interface";
import { requestDataSchema } from "./request.model";

export const studentDataSchema: Schema = new mongoose.Schema<Student>(
  {
    MSSV: {
      type: String,
      required: true,
    },
    class: {
      type: String,
      required: true,
    },
    department: {
      type: String,
      required: true,
    },
    major: {
      type: String,
      required: true,
    },
    sentRequestList: [{ type: requestDataSchema }],
    topic: {
      type: Object,
    },
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher",
    },

    thesisProgress: {
      type: Object,
    },
    reportSchedule: {
      type: Object,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" },
  }
);

studentDataSchema.virtual("profile", {
  ref: "User",
  localField: "MSSV",
  foreignField: "MSSV",
  justOne: true,
});

export const StudentModel = mongoose.model<Student>(
  "Student",
  studentDataSchema
);
