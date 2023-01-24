import mongoose, { Schema } from "mongoose";
import { Student } from "../interface/student.interface";
import { requestDataSchema } from "./request.model";
import { UserModel } from "./user.model";

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

export const StudentModel = UserModel.discriminator<Student>(
  "Student",
  studentDataSchema
);
