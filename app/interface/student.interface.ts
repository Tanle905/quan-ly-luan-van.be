import mongoose from "mongoose";
import { MatchedTeacher } from "../util/calculation.util";
import { FreeTime } from "./schedule.interface";
import { Topic } from "./topic.interface";
import { User } from "./user_and_roles.interface";

export interface Student extends User {
  MSSV: string;
  class: string;
  major: string;
  department: string;
  teacher?: mongoose.Types.ObjectId;
  sentRequestsList?: string[];
  sentTopic?: Topic;
  reportSchedule?: any;
  suitableThesisDefenseTeacherList?: MatchedTeacher[];
  thesisDefenseTime: FreeTime;
}
