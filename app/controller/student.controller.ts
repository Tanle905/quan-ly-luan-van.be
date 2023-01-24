import { Request, Response } from "express";
import { StudentModel } from "../model/student.model";

export const studentController = {
  get: async (req: Request, res: Response) => {
    try {
      const teacherDocuments = await StudentModel.find({});

      return res.status(200).json({ data: teacherDocuments });
    } catch (error) {
      return res.status(500).json(error);
    }
  },
};
