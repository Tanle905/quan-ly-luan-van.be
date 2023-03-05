import mongoose from "mongoose";
import { TopicStatus } from "../constants and enums/variable";

export interface Topic {
  _id?: mongoose.Types.ObjectId;
  MSSV: string;
  MSCB: string;
  studentName: string;
  topicName: string;
  topicEnglishName?: string;
  topicDescription: string;
  topicStatus?: TopicStatus;
  majorTag?: string;
}
