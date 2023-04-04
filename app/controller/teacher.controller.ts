import { Request, Response } from "express";
import { SortOrder } from "mongoose";
import { TeacherModel } from "../model/teacher.model";
import { TopicModel } from "../model/topic.model";

export const teacherController = {
  get: async (req: Request, res: Response) => {
    const { search, majorTags, sortBy, isAscSorting } = req.query;
    const majorTagsList = majorTags && (majorTags as string).split(",");

    try {
      const teacherDocuments = await TeacherModel.find({
        ...(majorTagsList
          ? {
              majorTags: {
                $in: majorTagsList,
              },
            }
          : {}),
        ...(search
          ? {
              $or: [
                { firstName: { $regex: search, $options: "i" } },
                { lastName: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } },
                { MSCB: { $regex: search, $options: "i" } },
              ],
            }
          : {}),
      }).sort(
        sortBy
          ? {
              [sortBy as string]: parseInt(isAscSorting as string) as SortOrder,
            }
          : { MSCB: 1 }
      );

      return res.status(200).json({ data: teacherDocuments });
    } catch (error) {
      return res.status(500).json({ message: "Internal Error" });
    }
  },
  getTopicList: async (req: Request, res: Response) => {
    const { MSCB } = req.body;
    try {
      const topicDocuments = await TopicModel.find({ MSCB });

      return res.status(200).json({ data: topicDocuments });
    } catch (error) {
      return res.status(500).json({ message: "Internal Error" });
    }
  },
};
