import mongoose, { Schema } from "mongoose";
import { Teacher } from "../interface/teacher.interface";
import { requestDataSchema } from "./request.model";

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
    receivedRequestList: [{ type: requestDataSchema }],
    studentList: [{ type: mongoose.Schema.Types.ObjectId, ref: "Student" }],
    reportSchedule: {
      type: [Object],
      default: [],
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
