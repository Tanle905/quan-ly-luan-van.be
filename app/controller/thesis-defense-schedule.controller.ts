import { Request, Response } from "express";
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
          console.log(error);
          return res.status(500).json({ message: "Internal Error" });
        }
      },
    },
  },
};
