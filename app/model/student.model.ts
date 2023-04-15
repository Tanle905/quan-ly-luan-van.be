import mongoose, { Schema } from "mongoose";
import { Student } from "../interface/student.interface";
import { UserModel } from "./user.model";
import { ThesisStatus } from "../constants and enums/variable";
import { CalendarEventDataSchema } from "./calendar.model";

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
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
    },
    sentRequestsList: [
      {
        type: String,
      },
    ],
    topic: {
      type: Schema.Types.ObjectId,
    },
    grade: {
      type: Number,
    },
    status: {
      type: Schema.Types.Mixed,
      enum: ThesisStatus,
      default: null,
    },
    reportSchedule: {
      type: CalendarEventDataSchema,
      default: null,
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
