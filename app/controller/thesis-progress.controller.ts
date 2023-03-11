import { Request, Response } from "express";
import { ThesisProgressModel } from "../model/thesis-progress.model";

export const thesisProgressController = {
  getThesisProgress: async (req: Request, res: Response) => {
    const { MSSV } = req.body;
    try {
      if (!MSSV) return res.status(400).json({ message: "MSSV is required!" });

      const eventDocuments = await ThesisProgressModel.findOne(
        { MSSV },
        {},
        { upsert: true }
      );

      return res.status(200).json({ data: eventDocuments });
    } catch (error) {
      return res.status(500).json({ message: "Internal Error" });
    }
  },
  addEvent: async (req: Request, res: Response) => {
    if (
      Object.values(req.body).find(
        (value) => value === undefined || value === null
      )
    )
      return res.status(400).json({ message: "Missing required property!" });

    if (!req.body.MSSV)
      return res.status(400).json({ message: "MSSV is required!" });
    try {
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
      return res.status(500).json({ message: "Internal Error" });
    }
  },
  editEvent: async (req: Request, res: Response) => {
    if (
      Object.values(req.body).find(
        (value) => value === undefined || value === null
      )
    )
      return res.status(400).json({ message: "Missing required property!" });

    if (!req.body.MSSV)
      return res.status(400).json({ message: "MSSV is required!" });

    try {
      const thesisProgressDocument = await ThesisProgressModel.findOne({
        MSSV: req.body.MSSV,
      });
      const transformedEventList = thesisProgressDocument.events.map(
        (event) => {
          if (event.id.toString() === req.body.id)
            return { ...event, ...req.body };
          return event;
        }
      );
      thesisProgressDocument.events = transformedEventList;

      await thesisProgressDocument.save();

      return res.status(200).json({ message: "Event edited complete !" });
    } catch (error) {
      return res.status(500).json({ message: "Internal Error" });
    }
  },
  deleteEvent: async (req: Request, res: Response) => {
    if (!req.body.MSSV || !req.body.id)
      return res.status(400).json({ message: "MSSV and id is required!" });

    try {
      const thesisProgressDocument = await ThesisProgressModel.findOne({
        MSSV: req.body.MSSV,
      });
      const filteredEventList = thesisProgressDocument.events.filter(
        (event) => event.id.toString() !== req.body.id
      );
      thesisProgressDocument.events = filteredEventList;

      await thesisProgressDocument.save();

      return res.status(200).json({ message: "Event delete complete !" });
    } catch (error) {
      return res.status(500).json({ message: "Internal Error" });
    }
  },
};
