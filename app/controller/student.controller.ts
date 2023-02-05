import { Request, Response } from "express";
import { StudentModel } from "../model/student.model";

export const studentController = {
  get: async (req: Request, res: Response) => {
    const { studentList } = req.body;
    
    try {
      const teacherDocuments = await StudentModel.find({
        _id: {
          $in: studentList,
        },
      });

      return res.status(200).json({ data: teacherDocuments });
    } catch (error) {
      return res.status(500).json({ message: "Internal Error" });
    }
  },
};
