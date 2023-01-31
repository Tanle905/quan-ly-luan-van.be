import mongoose from "mongoose";
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
    isTopicAccepted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" },
  }
);
