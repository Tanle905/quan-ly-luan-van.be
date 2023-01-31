import mongoose from "mongoose";
import { Request } from "./request.interface";
import { Topic } from "./topic.interface";
import { User } from "./user_and_roles.interface";

export interface Student extends User {
  MSSV: string;
  class: string;
  major: string;
  department: string;
  sentRequestList?: Request[];
  teacher?: mongoose.Types.ObjectId;
  sentTopic?: Topic;
  reportSchedule?: any;
}
