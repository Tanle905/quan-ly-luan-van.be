import mongoose from "mongoose";
import { Request } from "./request.interface";
import { Topic } from "./topic.interface";
import { User } from "./user_and_roles.interface";

export interface Teacher extends User {
  MSCB: string;
  majorTags: string[];
  receivedRequestList: Request[];
  studentList: mongoose.Types.ObjectId[];
  receivedTopicList: Topic[];
  reportSchedule: any[];
}
