import mongoose, { Schema } from "mongoose";
import { Teacher } from "../interface/teacher.interface";
import { studentDataSchema } from "./student.model";

export const teacherDataSchema: Schema = new mongoose.Schema<Teacher>(
  {
    MSCB: {
      type: String,
      required: true,
      ref: "User",
    },
    major: {
      type: Object,
    },
    receivedRequestList: {
      type: [Object],
    },
    studentList: {
      type: [studentDataSchema],
    },
    reportSchedule: {
      type: [Object],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" },
  }
);

teacherDataSchema.virtual("profile", {
  ref: "User",
  localField: "MSCB",
  foreignField: "MSCB",
  justOne: true,
  
});

export const TeacherModel = mongoose.model<Teacher>(
  "Teacher",
  teacherDataSchema
);
