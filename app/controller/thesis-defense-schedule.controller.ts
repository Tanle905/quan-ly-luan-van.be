import { Request, Response } from "express";
import { ThesisStatus } from "../constants and enums/variable";
import { Student } from "../interface/student.interface";
import { ScheduleModel } from "../model/schedule.model";

export const thesisDefenseScheduleController = {
  studentList: {
    import: async (req: Request, res: Response) => {
      const { data } = req.body;
      const scheduleDocument = await ScheduleModel.findOne({});

      scheduleDocument.studentLists = data;

      //If schedule is not yet created, create a new one
      if (scheduleDocument) {
        const newSchedule = new ScheduleModel({ studentLists: data });
      }
      return res.status(200).json({ message: "" });
    },
  },
};
