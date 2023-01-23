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
      type: String,
      required: true,
    },
    teacherId: {
      type: String,
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
