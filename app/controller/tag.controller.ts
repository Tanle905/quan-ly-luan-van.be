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
  addMajorTag: async (req: Request, res: Response) => {
    const { value, color } = req.body;
    try {
      const tagDocument = await TagModel.findOne({ name: "majorTags" });
      tagDocument.list.push({ value, color: color ?? "yellow" });

      await tagDocument.save();

      return res.status(200).json({ message: "Added tag complete" });
    } catch (error) {
      return res.status(500).json({ message: "Internal Error" });
    }
  },
};
