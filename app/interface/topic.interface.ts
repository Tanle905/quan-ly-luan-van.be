import mongoose from "mongoose";
import { TopicStatus } from "../constants and enums/variable";
import { Tag } from "./tag.interface";

export interface Topic {
  _id?: mongoose.Types.ObjectId;
  MSSV: string;
  MSCB: string;
  studentName:string;
  topicName: string;
  topicDescription: string;
  topicStatus?: TopicStatus;
  tags?: Tag[];
}
