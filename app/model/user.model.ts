import mongoose, { Schema } from "mongoose";
import { User } from "../interface/user_and_roles.interface";

export const userDataSchema: Schema = new mongoose.Schema<User>(
  {
    username: {
      type: String,
      unique: true,
    },
    password: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    imageUrl: {
      type: String,
    },
    phoneNumber: {
      type: String,
    },
    roles: [{ type: mongoose.Schema.Types.ObjectId, ref: "Role" }],
    isDeactivated: {
      type: Boolean,
    },
    ethnic: {
      type: String,
    },
    religion: {
      type: String,
    },
    CCCD: {
      type: String,
    },
    notificationCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" },
  }
);

export const UserModel = mongoose.model<User>("User", userDataSchema);
