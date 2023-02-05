import { Request, Response } from "express";
import { TagModel } from "../model/tag.model";

export const tagController = {
  getMajorTags: async (req: Request, res: Response) => {
    try {
      const tagDocument = await TagModel.findOne({ name: "majorTags" });

      return res.status(200).json({ data: tagDocument.list });
    } catch (error) {
      return res.status(500).json({ message: "Internal Error" });
    }
  },
};
