import { Request, Response } from "express";
import { ObjectId } from "mongodb";
import { StudentModel } from "../model/student.model";

export const studentController = {
  post: async (req: Request, res: Response) => {
    const { userId } = res.locals;

    try {
      const studentDocuments = await StudentModel.find({
        teacher: new ObjectId(userId),
      }).select(
        "-id -password -username -imageUrl -roles -__t -sentRequest -createdAt -updatedAt -__v -teacher -notification -notificationCount -sentTopic"
      );

      return res.status(200).json({ data: studentDocuments });
    } catch (error) {
      return res.status(500).json(error);
    }
  },
};
