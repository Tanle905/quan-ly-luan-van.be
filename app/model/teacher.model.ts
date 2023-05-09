import mongoose, { Schema } from "mongoose";
import { Teacher } from "../interface/teacher.interface";
import { UserModel } from "./user.model";

export const teacherDataSchema: Schema = new mongoose.Schema<Teacher>(
  {
    MSCB: {
      type: String,
      required: true,
      unique: true,
    },
    majorTags: [
      {
        type: String,
        default: [],
      },
    ],
    studentList: [{ type: mongoose.Schema.Types.ObjectId }],
    reportSchedule: [
      {
        type: Object,
      },
    ],
    isImportedStudentListToSystem: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" },
  }
);

export const TeacherModel = UserModel.discriminator<Teacher>(
  "Teacher",
  teacherDataSchema
);
