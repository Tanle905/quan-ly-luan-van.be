import mongoose, { Schema } from "mongoose";
import {
  StudentList,
  ThesisDefenseSchedule,
} from "../interface/schedule.interface";
import { studentDataSchema } from "./student.model";
import { userDataSchema } from "./user.model";

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
        },
      ],
    },
    {
      timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" },
    }
  );

export const ScheduleModel = mongoose.model<ThesisDefenseSchedule>("schedule", scheduleDataSchema);
