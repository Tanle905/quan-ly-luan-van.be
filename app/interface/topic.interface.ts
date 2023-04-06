import mongoose from "mongoose";
import { TopicStatus } from "../constants and enums/variable";
import { TagDetails } from "./tag.interface";

export interface Topic {
  _id?: mongoose.Types.ObjectId;
  MSSV: string;
  MSCB: string;
  studentName: string;
  topicName: string;
  topicEnglishName?: string;
  topicDescription: string;
  topicStatus?: TopicStatus;
  majorTag?: TagDetails[];
  history?: { updatedAt: Date; updatedBy: string }[];
  fileList?: string[];
}
