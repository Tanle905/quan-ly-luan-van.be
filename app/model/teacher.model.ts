import mongoose, { Schema } from "mongoose";
import { Teacher } from "../interface/teacher.interface";
import { studentDataSchema } from "./student.model";
import { userDataSchema } from "./user.model";

export const teacherDataSchema: Schema = new mongoose.Schema<Teacher>(
  {
    ...userDataSchema.obj,
    MSCB: {
      type: String,
      required: true,
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
    timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" },
  }
);

export const TeacherModel = mongoose.model<Teacher>(
  "Teacher",
  teacherDataSchema
);
