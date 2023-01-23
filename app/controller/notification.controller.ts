import { Request, Response } from "express";
import { NotificationModel } from "../model/notification.model";

export const notificationController = {
  get: async (req: Request, res: Response) => {
    const { userId } = res.locals;
    try {
      const notificationDocuments = NotificationModel.find({
        receiver: userId,
      });

      return res.status(200).json(notificationDocuments);
    } catch (error) {
      return res.status(500).json(error);
    }
  },
  post: async (req: Request, res: Response) => {
    const { userId } = res.locals;
    const { receiver, content, type } = req.body;

    try {
      const notificationDocument = new NotificationModel({
        sender: userId,
        receiver,
        content,
        type,
      });

      notificationDocument.save();

      return res.status(200).json({ message: "Notification sent!" });
    } catch (error) {
      return res.status(500).json(error);
    }
  },
  put: async (req: Request, res: Response) => {
    const { userId } = res.locals;

    try {
      await NotificationModel.findOneAndUpdate(
        { receiver: userId },
        {
          $set: { is_read: true },
        }
      );

      return res.status(200);
    } catch (error) {
      return res.status(500).json(error);
    }
  },
};
