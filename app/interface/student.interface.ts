import mongoose, { Types } from "mongoose";
import { ThesisStatus } from "../constants and enums/variable";
import { User } from "./user_and_roles.interface";

export interface Student extends User {
  MSSV: string;
  class: string;
  major: string;
  department: string;
  teacher?: mongoose.Types.ObjectId;
  sentRequestsList?: string[];
  topic?: Types.ObjectId;
  reportSchedule?: any;
  status?: ThesisStatus;
  grade?: number;
}
