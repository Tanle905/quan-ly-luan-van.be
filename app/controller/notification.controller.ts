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
};
