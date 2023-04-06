import dayjs from "dayjs";
import { Request, Response } from "express";
import { ROLES, TopicStatus } from "../constants and enums/variable";
import { TopicModel } from "../model/topic.model";

export const topicController = {
  getTopicById: async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: "Topic id is required" });

    try {
      const topicDocument = await TopicModel.findById(id);

      return res.status(200).json({ data: topicDocument });
    } catch (error) {
      return res.status(500).json({ message: "Internal Error" });
    }
  },
  editTopic: async (req: Request, res: Response) => {
    const { id } = req.params;
    const {
      topicName,
      topicEnglishName,
      majorTag,
      topicDescription,
      role,
      updatedBy,
    } = req.body;

    try {
      const topicDocument = await TopicModel.findById(id);

      if (role === ROLES.STUDENT)
        topicDocument.topicStatus = TopicStatus.Pending;

      topicDocument.topicName = topicName;
      topicDocument.topicEnglishName = topicEnglishName;
      topicDocument.majorTag = majorTag;
      topicDocument.topicDescription = topicDescription;
      topicDocument.history.unshift({
        updatedAt: dayjs().toDate(),
        updatedBy: updatedBy ?? "No data",
      });

      await topicDocument.save();

      return res.status(200).json({ data: topicDocument });
    } catch (error) {
      return res.status(500).json({ message: "Internal Error" });
    }
  },
  requestChangeTopic: async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!id) return res.status(400).json({ message: "Topic id is required !" });

    try {
      const topicDocument = await TopicModel.findById(id);

      topicDocument.topicStatus = TopicStatus.RequestChange;

      await topicDocument.save();

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
      const topicDocument = await TopicModel.findById(id);

      topicDocument.topicStatus = TopicStatus.Accepted;

      await topicDocument.save();

      return res.status(200).json({ message: "Accepted topic complete !" });
    } catch (error) {
      return res.status(500).json({ message: "Internal Error" });
    }
  },
  updateFile: async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
      const topicDocument = await TopicModel.findById(id);

      topicDocument.fileList = req.body.file;

      await topicDocument.save();

      return res.status(200).json({ message: "Save file complete." });
    } catch (error) {
      return res.status(500).json({ message: "Internal Error" });
    }
  },
};
