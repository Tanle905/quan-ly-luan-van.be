import { Request, Response } from "express";
import { NotificationModel } from "../model/notification.model";
import { UserModel } from "../model/user.model";

export const notificationController = {
  getNotification: async (req: Request, res: Response) => {
    const { userId } = res.locals;

    try {
      const notificationDocuments = await NotificationModel.find({
        receiver: userId,
      }).sort({ createdAt: -1 });

      return res.status(200).json(notificationDocuments);
    } catch (error) {
      return res.status(500).json(error);
    }
  },
  addNotification: async (req: Request, res: Response) => {
    const { userId } = res.locals;
    const { receiver, content, type } = req.body;

    try {
      const notificationDocument = new NotificationModel({
        sender: userId,
        receiver,
        content,
        type,
      });
      const receiverDocument = await UserModel.findById(receiver);
      
      receiverDocument.notificationCount += 1;

      Promise.all([notificationDocument.save(), receiverDocument.save()]);

      return res.status(200).json({ message: "Notification sent!" });
    } catch (error) {
      return res.status(500).json(error);
    }
  },
  setIsReadNotification: async (req: Request, res: Response) => {
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
