import { Request, Response } from "express";
import { ObjectId } from "mongodb";
import { SortOrder } from "mongoose";
import { StudentModel } from "../model/student.model";

export const studentManagementController = {
  post: async (req: Request, res: Response) => {
    const { search, sortBy, isAscSorting } = req.query;

    try {
      const studentDocuments = await StudentModel.find({
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
        data: studentDocuments.map((doc) => {
          return {
            ...doc.toObject(),
          };
        }),
      });
    } catch (error) {
      return res.status(500).json({ message: "Internal Error" });
    }
  },
};
