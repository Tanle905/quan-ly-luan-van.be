import mongoose, { Schema } from "mongoose";
import { Student } from "../interface/student.interface";

export const studentDataSchema: Schema = new mongoose.Schema<Student>(
  {
    MSSV: {
      type: String,
      required: true,
    },
    sentRequestList: {
      type: [Object],
      default: []
    },
    topic: {
      type: Object,
    },
    teacher: {
      type: Object,
    },
    thesisProgress: {
      type: Object,
    },
    reportSchedule: {
      type: Object,
    },
  },
  {
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
