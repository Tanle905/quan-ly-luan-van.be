import mongoose from "mongoose";
import { MatchedTeacher } from "../util/calculation.util";
import { Request } from "./request.interface";
import { FreeTime } from "./schedule.interface";
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
  suitableThesisDefenseTeacherList?: MatchedTeacher[];
  thesisDefenseTime: FreeTime;
}
