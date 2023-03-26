import mongoose from "mongoose";

export interface CalendarEvent {
  id: mongoose.Types.ObjectId;
  start?: Date;
  end?: Date;
  title?: string;
  allDay?: boolean;
  display?: string;
  backgroundColor?: string;
  borderColor?: string;
  editable?: boolean;
  textColor?: string;
  description?: string;
}
