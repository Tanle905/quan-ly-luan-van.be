import mongoose from "mongoose";
import { CalendarEvent } from "../interface/calendar.interface";

export const CalendarEventDataSchema = new mongoose.Schema<CalendarEvent>({
  id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    auto: true,
  },
  end: {
    type: Date,
  },
  start: {
    type: Date,
  },
  backgroundColor: { type: String, default: "#ad9734" },
  borderColor: { type: String, default: "#ad9734" },
  editable: { type: Boolean, default: false },
  textColor: { type: String, default: "#fffffff" },
  allDay: {
    type: Boolean,
    default: true,
  },
  title: { type: String },
  description: {
    type: String,
  },
});
