import { Types } from "mongoose";
import { Topic } from "./topic.interface";

export interface Request {
  _id: string;
  MSSV: string;
  MSCB: string;
  studentId: Types.ObjectId;
  teacherId: Types.ObjectId;
  studentName: string;
  teacherName: string;
  studentEmail: string;
  teacherEmail: string;
  topic?: Topic;
  createdAt?: Date;
  updatedAt?: Date;
}
