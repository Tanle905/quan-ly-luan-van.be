import { Request, Response } from "express";
import { TeacherModel } from "../model/teacher.model";

export const teacherController = {
  get: async (req: Request, res: Response) => {
    try {
      const teacherDocuments = await TeacherModel.find({}).populate({
        path: "profile",
        select: "-password -_id",
      });

      return res.status(200).json({ data: teacherDocuments });
    } catch (error) {
      return res.status(500).json(error);
    }
  },
};
