import mongoose from "mongoose";
import { ScheduleEventType, Slot } from "../constants and enums/variable";
import { CalendarEvent } from "./calendar.interface";
import { Student } from "./student.interface";

export interface BusyTime extends CalendarEvent {
  MSCB: string;
  teacherName: string;
  slots: Slot[];
}

export interface ThesisDefenseTime extends CalendarEvent {
  MSCB: string[];
  MSSV: string;
  studentName: string;
  teacherName: string;
  topic: mongoose.Types.ObjectId;
  slots: Slot;
}

export interface ScheduleEventTime {
  _id?: mongoose.Types.ObjectId;
  type: ScheduleEventType;
  editable?: boolean;
  busyTimeData?: BusyTime;
  thesisDefenseTimeData?: ThesisDefenseTime;
}

export interface ScheduleCalendar {
  scheduleEventList: ScheduleEventTime[];
  reportPrepareWeek: CalendarEvent;
  thesisDefenseWeek: CalendarEvent;
}

export interface ThesisDefenseSchedule {
  studentLists: StudentList[];
  /**
   * Data for client rendering.
   */
  calendar?: ScheduleCalendar;
  isOpenForGradeInput: boolean;
}

export interface StudentList {
  MSCB: string;
  teacherName: string;
  students: (Student & { isHaveThesisSchedule?: boolean })[];
  incompleteStudents: Student[];
  createdAt?: Date;
  updatedAt?: Date;
}
