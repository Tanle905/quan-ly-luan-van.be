import mongoose, { Schema } from "mongoose";
import { Notification } from "../interface/notification.interface";

export const notificationDataSchema: Schema = new mongoose.Schema<Notification>(
  {
    sender: {
      type: String,
      required: true,
    },
    receiver: {
      type: String,
      required: true,
    },
    type: {
      type: String,
    },
    content: {
      type: String,
      required: true,
    },
    is_read: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" },
  }
);

export const NotificationModel = mongoose.model<Notification>(
  "Notification",
  notificationDataSchema
);
