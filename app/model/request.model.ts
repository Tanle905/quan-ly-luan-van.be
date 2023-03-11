import mongoose, { Schema } from "mongoose";
import { Request } from "../interface/request.interface";
import { studentDataSchema } from "./student.model";
import { teacherDataSchema } from "./teacher.model";
import { userDataSchema } from "./user.model";

export const requestDataSchema: Schema = new mongoose.Schema<Request>(
  {
    student: {
      type: studentDataSchema.add(userDataSchema),
      required: true,
    },
    isStudentAccepted: {
      type: Boolean,
      default: false,
    },
    isTeacherAccepted: {
      type: Boolean,
      default: false,
    },
    teacher: {
      type: teacherDataSchema.add(userDataSchema),
      required: true,
    },
    topic: {
      type: Schema.Types.ObjectId,
    },
  },
  {
    timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" },
  }
);

export const RequestModel = mongoose.model<Request>(
  "Request",
  requestDataSchema
);
