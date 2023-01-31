import mongoose from "mongoose";

export interface CalendarEvent {
  id: mongoose.Types.ObjectId;
  start?: Date;
  end?: Date;
  title: string;
  description: string;
  allDay?: boolean;
  backgroundColor?: string;
  borderColor?: string;
  editable?: boolean;
  textColor?: string;
  description: string;
}
