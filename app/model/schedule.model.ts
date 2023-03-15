import mongoose, { Schema } from "mongoose";
import { ScheduleEventType, Slot } from "../constants and enums/variable";
import {
  BusyTime,
  ScheduleCalendar,
  ScheduleEventTime,
  StudentList,
  ThesisDefenseSchedule,
  ThesisDefenseTime,
} from "../interface/schedule.interface";
import { CalendarEventDataSchema } from "./calendar.model";
import { studentDataSchema } from "./student.model";
import { userDataSchema } from "./user.model";

export const busyTimeDataSchema: Schema = new mongoose.Schema<BusyTime>({
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
  MSCB: {
    type: String,
    required: true,
  },
  teacherName: {
    type: String,
    required: true,
  },
  slots: [
    {
      type: Schema.Types.Mixed,
      enum: Slot,
      required: true,
    },
  ],
}).add(CalendarEventDataSchema);

export const thesisDefenseTimeDataSchema: Schema =
  new mongoose.Schema<ThesisDefenseTime>({
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
    MSCB: {
      type: String,
      required: true,
    },
    MSSV: {
      type: String,
      required: true,
    },
    teacherName: {
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
    slots: [
      {
        type: Schema.Types.Mixed,
        enum: Slot,
        required: true,
      },
    ],
  }).add(CalendarEventDataSchema);

export const scheduleEventTimeDataSchema: Schema =
  new mongoose.Schema<ScheduleEventTime>({
    type: {
      type: Schema.Types.Mixed,
      required: true,
      enum: ScheduleEventType,
    },
    editable: {
      type: Boolean,
      default: false,
    },
    busyTimeData: {
      type: busyTimeDataSchema,
    },
    thesisDefenseTimeData: {
      type: thesisDefenseTimeDataSchema,
    },
  });

export const scheduleCalendarDataSchema = new mongoose.Schema<ScheduleCalendar>(
  {
    scheduleEventList: [
      {
        type: scheduleEventTimeDataSchema,
        default: [],
      },
    ],
    reportPrepareWeek: {
      type: CalendarEventDataSchema,
    },
    thesisDefenseWeek: {
      type: Date,
    },
  }
);

export const studentListDataSchema: Schema = new mongoose.Schema<StudentList>(
  {
    MSCB: {
      type: String,
      required: true,
    },
    teacherName: {
      type: String,
      required: true,
    },
    students: [
      {
        type: studentDataSchema.add(userDataSchema),
        default: [],
      },
    ],
    incompleteStudents: [
      {
        type: studentDataSchema.add(userDataSchema),
        default: [],
      },
    ],
  },
  {
    timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" },
  }
);

export const scheduleDataSchema: Schema =
  new mongoose.Schema<ThesisDefenseSchedule>(
    {
      studentLists: [
        {
          type: studentListDataSchema,
          default: [],
        },
      ],
      calendar: {
        type: scheduleCalendarDataSchema,
        default: {
          scheduleEventList: [],
          reportPrepareWeek: null,
          thesisDefenseWeek: null,
        },
      },
    },
    {
      timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" },
    }
  );

export const ScheduleModel = mongoose.model<ThesisDefenseSchedule>(
  "schedule",
  scheduleDataSchema
);
