import mongoose from "mongoose";
import { Request } from "./request.interface";

export interface Teacher {
  MSCB: string;
  major: any;
  receivedRequestList: Request[];
  studentList: mongoose.Types.ObjectId[];
  reportSchedule: any[];
  createdAt?: Date;
  updatedAt?: Date;
}
