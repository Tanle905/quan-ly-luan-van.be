import mongoose, { Schema } from "mongoose";
import { Request } from "../interface/request.interface";

export const requestDataSchema: Schema = new mongoose.Schema<Request>(
  {
    MSCB: {
      type: String,
      required: true,
    },
    MSSV: {
      type: String,
      required: true,
    },
    studentId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    teacherId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    studentName: {
      type: String,
      required: true,
    },
    studentEmail: {
      type: String,
      required: true,
    },
    teacherName: {
      type: String,
      required: true,
    },
    teacherEmail: {
      type: String,
      required: true,
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
