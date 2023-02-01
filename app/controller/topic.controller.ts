import { Request, Response } from "express";
import { ObjectId } from "mongodb";
import { StudentModel } from "../model/student.model";
import { TeacherModel } from "../model/teacher.model";

export const topicController = {
  getTopic: async (req: Request, res: Response) => {
    const { MSSV, MSCB } = req.query;

    if (!MSSV || !MSCB)
      return res.status(400).json({ message: "MSSV or MSCB is required!" });

    try {
      const studentDocument = await StudentModel.findOne({ MSSV });

      return res.status(200).json({ data: studentDocument.sentTopic });
    } catch (error) {
      return res.status(500).json({ message: error });
    }
  },
  requestTopic: async (req: Request, res: Response) => {
    const { MSSV, MSCB } = req.body;

    if (!MSSV || !MSCB)
      return res.status(400).json({ message: "MSSV or MSCB is required!" });

    try {
      const studentDocument = await StudentModel.findOne({ MSSV });
      const teacherDocument = await TeacherModel.findOne({ MSCB });

      studentDocument.sentTopic = req.body;
      teacherDocument.receivedTopicList.unshift(req.body);

      await Promise.all([studentDocument.save(), teacherDocument.save()]);

      return res.status(200).json({ data: studentDocument.sentTopic });
    } catch (error) {
      return res.status(500).json({ message: error });
    }
  },
  acceptTopic: async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!id) return res.status(400).json({ message: "Topic id is required !" });

    try {
      const studentDocument = await StudentModel.findOne({
        "sentTopic._id": new ObjectId(id),
      });

      return res.status(200).json();
    } catch (error) {
      return res.status(500).json({ message: error });
    }
  },
};
