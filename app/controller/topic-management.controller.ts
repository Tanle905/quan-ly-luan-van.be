import { Request, Response } from "express";
import { SortOrder } from "mongoose";
import { TopicModel } from "../model/topic.model";

export const topicManagementController = {
  getTopics: async (req: Request, res: Response) => {
    const { search, sortBy, isAscSorting } = req.query;

    try {
      const topicDocuments = await TopicModel.find({
        ...(search
          ? {
              $or: [
                { MSSV: { $regex: search, $options: "i" } },
                { MSCB: { $regex: search, $options: "i" } },
                { topicName: { $regex: search, $options: "i" } },
                { topicEnglishName: { $regex: search, $options: "i" } },
                { studentName: { $regex: search, $options: "i" } },
              ],
            }
          : {}),
      })
        .select("-password")
        .sort(
          sortBy
            ? {
                [sortBy as string]: parseInt(
                  isAscSorting as string
                ) as SortOrder,
              }
            : { topicName: 1 }
        );

      return res.status(200).json({
        data: topicDocuments,
      });
    } catch (error) {
      return res.status(500).json({ message: "Internal Error" });
    }
  },
};
