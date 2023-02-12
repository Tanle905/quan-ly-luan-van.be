import mongoose, { Schema } from "mongoose";
import { Teacher } from "../interface/teacher.interface";
import { requestDataSchema } from "./request.model";
import { topicDataSchema } from "./topic.model";
import { UserModel } from "./user.model";

export const teacherDataSchema: Schema = new mongoose.Schema<Teacher>(
  {
    MSCB: {
      type: String,
      required: true,
    },
    majorTags: [
      {
        type: String,
        default: [],
      },
    ],
    receivedRequestList: [{ type: requestDataSchema }],
    studentList: [{ type: mongoose.Schema.Types.ObjectId }],
    reportSchedule: [
      {
        type: Object,
      },
    ],
  },
  {
    timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" },
  }
);

export const TeacherModel = UserModel.discriminator<Teacher>(
  "Teacher",
  teacherDataSchema
);
