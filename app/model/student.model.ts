import mongoose, { Schema } from "mongoose";
import { Student } from "../interface/student.interface";

export const studentDataSchema: Schema = new mongoose.Schema<Student>(
  {
    MSSV: {
      type: String,
      required: true,
    },
    isRequestSent: {
      type: Boolean,
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

export const StudentModel = mongoose.model<Student>(
  "Student",
  studentDataSchema
);
