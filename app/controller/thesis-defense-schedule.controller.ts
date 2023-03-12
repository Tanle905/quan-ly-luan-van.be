import dayjs from "dayjs";
import { Request, Response } from "express";
import { ScheduleEventType } from "../constants and enums/variable";
import { ScheduleEventTime } from "../interface/schedule.interface";
import { ScheduleModel } from "../model/schedule.model";
import { TeacherModel } from "../model/teacher.model";

export const thesisDefenseScheduleController = {
  studentList: {
    import: async (req: Request, res: Response) => {
      const { data } = req.body;

      try {
        const scheduleDocument = await ScheduleModel.findOne({});

        //If schedule is not yet created, create a new one
        if (!scheduleDocument) {
          const newSchedule = new ScheduleModel();

          newSchedule.studentLists.push(data);
          await newSchedule.save();
        } else {
          scheduleDocument.studentLists.push(data);
          await scheduleDocument.save();
        }
        const teacherDocument = await TeacherModel.findOne({ MSCB: data.MSCB });

        teacherDocument.isImportedStudentListToSystem = true;

        await teacherDocument.save();

        return res.status(200).json({ message: "Add student list completed." });
      } catch (error: any) {
        return res.status(500).json({ message: "Internal Error" });
      }
    },
  },
  calendar: {
    getCalendarEvents: async (req: Request, res: Response) => {
      const { MSCB, MSSV } = req.query;

      try {
        const scheduleDocument = await ScheduleModel.findOne({});

        if (MSCB) {
          const teacherBusyTimeList =
            scheduleDocument.calendar.scheduleEventList.filter(
              (event) =>
                event.type === ScheduleEventType.BusyEvent &&
                event.busyTimeData.MSCB === MSCB
            );
          const mappedBusyTimeList = teacherBusyTimeList.map((event) => {
            const day = dayjs(event.busyTimeData.start)
              .utcOffset(0)
              .startOf("day");

            return {
              id: event.busyTimeData.id,
              start: day,
              slots: event.busyTimeData.slots.map((slot, index) => {
                const startDur = slot + (slot > 5 ? 7 : 6);
                const endDur = startDur + 1;
                return {
                  slot,
                  title: "Buổi bận",
                  start: day.add(startDur, "hour").toDate(),
                  end: day.add(endDur, "hour").toDate(),
                };
              }),
            };
          });

          return res.status(200).json({ data: mappedBusyTimeList });
        }
      } catch (error: any) {
        console.log(error);
        return res.status(500).json({ message: "Internal Error" });
      }
    },

    busyTime: {
      import: async (req: Request, res: Response) => {
        const { type, busyTimeData } = req.body;

        try {
          const scheduleDocument = await ScheduleModel.findOne({});

          scheduleDocument.calendar.scheduleEventList.push({
            type,
            busyTimeData,
          });

          await scheduleDocument.save();

          return res.status(200).json({ message: "Add busy time complete." });
        } catch (error: any) {
          return res.status(500).json({ message: "Internal Error" });
        }
      },
      edit: async (req: Request, res: Response) => {
        const { id } = req.body;

        try {
          const scheduleDocument = await ScheduleModel.findOne({});

          scheduleDocument.calendar.scheduleEventList =
            scheduleDocument.calendar.scheduleEventList.map((event) => {
              if (
                event.type === ScheduleEventType.BusyEvent &&
                event.busyTimeData.id.toString() === id
              )
                return req.body as unknown as ScheduleEventTime;
              return event;
            });

          await scheduleDocument.save();

          return res.status(200).json({ message: "Edit busy time completed" });
        } catch (error: any) {
          return res.status(500).json({ message: "Internal Error" });
        }
      },
      delete: async (req: Request, res: Response) => {
        const { id } = req.body;

        try {
          const scheduleDocument = await ScheduleModel.findOne({});

          scheduleDocument.calendar.scheduleEventList =
            scheduleDocument.calendar.scheduleEventList.filter(
              (event) => event.busyTimeData.id.toString() !== id
            );

          await scheduleDocument.save();

          return res.status(200).json({ message: "Delete busy time completed" });
        } catch (error: any) {
          return res.status(500).json({ message: "Internal Error" });
        }
      },
    },
  },
};
