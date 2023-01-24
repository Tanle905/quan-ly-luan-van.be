import mongoose from "mongoose";
import { Request } from "./request.interface";
import { User } from "./user_and_roles.interface";

export interface Teacher extends User {
  MSCB: string;
  major: any;
  receivedRequestList: Request[];
  studentList: mongoose.Types.ObjectId[];
  reportSchedule: any[];
}
