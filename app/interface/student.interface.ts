import mongoose from "mongoose";
import { Request } from "./request.interface";
import { User } from "./user_and_roles.interface";

export interface Student extends User {
  MSSV: string;
  class: string;
  major: string;
  department: string;
  sentRequestList?: Request[];
  topic?: any;
  teacher?: mongoose.Types.ObjectId;
  thesisProgress?: any;
  reportSchedule?: any;
}
