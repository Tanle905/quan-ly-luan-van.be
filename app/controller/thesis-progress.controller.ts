import { Request, Response } from "express";
import { ThesisProgressModel } from "../model/thesis-progress.model";

export const thesisProgressController = {
  getThesisProgress: async (req: Request, res: Response) => {
    const { MSSV } = req.body;
    try {
      if (!MSSV) return res.status(400).json({ message: "MSSV is required!" });

      const eventDocuments = await ThesisProgressModel.findOne({ MSSV });

      if (!eventDocuments)
        return res.status(404).json({ message: "No documents were found!" });

      return res.status(200).json({ data: eventDocuments });
    } catch (error) {
      return res.status(500).json({ message: error });
    }
  },
  addEvent: async (req: Request, res: Response) => {
    try {
      if (
        Object.values(req.body).find(
          (value) => value === undefined || value === null
        )
      )
        return res.status(400).json({ message: "Missing required property!" });

      const thesisProgressDocument = await ThesisProgressModel.findOneAndUpdate(
        {
          MSSV: req.body.MSSV,
        },
        {
          $push: {
            events: req.body,
          },
        },
        {
          new: true,
          upsert: true,
          setDefaultsOnInsert: true,
          returnDocument: "after",
        }
      );

      return res
        .status(200)
        .json({ data: thesisProgressDocument.toObject().events });
    } catch (error) {
      return res.status(500).json({ message: error });
    }
  },
};
