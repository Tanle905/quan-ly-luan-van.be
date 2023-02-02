import { Request, Response } from "express";
import { ObjectId } from "mongodb";
import { TopicStatus } from "../constants and enums/variable";
import { StudentModel } from "../model/student.model";

export const topicController = {
  getTopic: async (req: Request, res: Response) => {
    const { MSSV, MSCB } = req.query;

    if (!MSSV || !MSCB)
      return res.status(400).json({ message: "MSSV or MSCB is required!" });

    try {
      const studentDocument = await StudentModel.findOne({ MSSV });

      return res.status(200).json({ data: studentDocument.sentTopic });
    } catch (error) {
      return res.status(500).json({ message: "Internal Error" });
    }
  },
  sendTopic: async (req: Request, res: Response) => {
    const { MSSV, MSCB } = req.body;

    if (!MSSV || !MSCB)
      return res.status(400).json({ message: "MSSV or MSCB is required!" });

    try {
      const studentDocument = await StudentModel.findOne({ MSSV });

      studentDocument.sentTopic = req.body;
      studentDocument.sentTopic.topicStatus = TopicStatus.Pending;

      await studentDocument.save();

      return res.status(200).json({ data: studentDocument.sentTopic });
    } catch (error) {
      return res.status(500).json({ message: "Internal Error" });
    }
  },
  requestChangeTopic: async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!id) return res.status(400).json({ message: "Topic id is required !" });

    try {
      const studentDocument = await StudentModel.findOne({
        "sentTopic._id": new ObjectId(id),
      });

      studentDocument.sentTopic.topicStatus = TopicStatus.RequestChange;

      await studentDocument.save();

      return res
        .status(200)
        .json({ message: "Request change topic complete !" });
    } catch (error) {
      return res.status(500).json({ message: "Internal Error" });
    }
  },
  acceptTopic: async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!id) return res.status(400).json({ message: "Topic id is required !" });

    try {
      const studentDocument = await StudentModel.findOne({
        "sentTopic._id": new ObjectId(id),
      });

      studentDocument.sentTopic.topicStatus = TopicStatus.Accepted;

      await studentDocument.save();

      return res
        .status(200)
        .json({ message: "Accepted topic complete !" });
    } catch (error) {
      return res.status(500).json({ message: "Internal Error" });
    }
  },
};
