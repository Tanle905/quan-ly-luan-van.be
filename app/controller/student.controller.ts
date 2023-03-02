import { Request, Response } from "express";
import { cloneDeep } from "lodash";
import { ObjectId } from "mongodb";
import { SortOrder } from "mongoose";
import { StudentModel } from "../model/student.model";

export const studentController = {
  post: async (req: Request, res: Response) => {
    const { search, sortBy, isAscSorting } = req.query;
    const { userId } = res.locals;

    try {
      const studentDocuments = await StudentModel.find({
        teacher: new ObjectId(userId),
        ...(search
          ? {
              $or: [
                { firstName: { $regex: search, $options: "i" } },
                { lastName: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } },
                { MSSV: { $regex: search, $options: "i" } },
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
            : { MSSV: 1 }
        )
        .limit(10);

      return res.status(200).json({
        data: studentDocuments,
      });
    } catch (error) {
      return res.status(500).json({ message: "Internal Error" });
    }
  },
  exportStudent: async (req: Request, res: Response) => {
    const { userId } = res.locals;

    try {
      const studentDocuments = await StudentModel.find({
        teacher: new ObjectId(userId),
      }).select(
        "-_id -password -username -imageUrl -roles -sentRequestList -createdAt -updatedAt -__v -teacher -notification -notificationCount"
      );

      return res.status(200).json({
        data: studentDocuments.map((doc) => {
          const clonedDoc = cloneDeep(doc.toObject()) as any;
          clonedDoc.topicName = clonedDoc.sentTopic?.topicName;
          delete clonedDoc.__t;
          delete clonedDoc.sentTopic;

          return {
            ...clonedDoc,
            ["Cho phép báo cáo"]: "",
            ["Nhận diểm I"]: "",
          };
        }),
      });
    } catch (error) {
      return res.status(500).json({ message: "Internal Error" });
    }
  },
};
