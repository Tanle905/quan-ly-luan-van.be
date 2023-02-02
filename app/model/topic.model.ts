import mongoose, { Schema } from "mongoose";
import { TopicStatus } from "../constants and enums/variable";
import { Topic } from "../interface/topic.interface";

export const topicDataSchema = new mongoose.Schema<Topic>(
  {
    MSSV: {
      type: String,
      required: true,
    },
    MSCB: {
      type: String,
      required: true,
    },
    studentName: {
      type: String,
      required: true,
    },
    topicName: {
      type: String,
      required: true,
    },
    topicDescription: {
      type: String,
      required: true,
    },
    topicStatus: {
      type: Schema.Types.Mixed,
      enum: TopicStatus,
      default: TopicStatus.Pending,
    },
  },
  {
    timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" },
  }
);
