import mongoose from "mongoose";
import { CalendarEvent } from "../interface/calendar.interface";

export const CalendarEventDataSchema = new mongoose.Schema<CalendarEvent>({
  backgroundColor: { type: String },
  borderColor: { type: String },
  editable: { type: Boolean },
  end: {
    type: Date,
  },
  start: {
    type: Date,
  },
  textColor: { type: String },
  title: { type: String },
});
