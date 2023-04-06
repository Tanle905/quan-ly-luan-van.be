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
    },
    topicEnglishName: {
      type: String,
    },
    topicDescription: {
      type: String,
    },
    topicStatus: {
      type: Schema.Types.Mixed,
      enum: TopicStatus,
      default: null,
    },
    majorTag: [
      {
        type: { color: String, value: String },
        default: [],
      },
    ],
    history: [
      {
        type: { updatedAt: Date, updatedBy: String },
        default: [],
      },
    ],
    fileList: [{ type: String, default: [] }],
  },
  {
    timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" },
  }
);

export const TopicModel = mongoose.model("Topic", topicDataSchema);
