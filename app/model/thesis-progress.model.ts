import mongoose from "mongoose";
import { ThesisProgress } from "../interface/thesis-progress.interface";
import { CalendarEventDataSchema } from "./calendar.model";

export const ThesisProgressDataSchema = new mongoose.Schema<ThesisProgress>({
  MSSV: {
    type: String,
    required: true,
  },
  MSCB: {
    type: String,
    required: true,
  },
  events: {
    type: [CalendarEventDataSchema],
    default: [],
  },
  files: {
    type: [],
    default: [],
  },
});

export const ThesisProgressModel = mongoose.model(
  "ThesisProgress",
  ThesisProgressDataSchema
);
