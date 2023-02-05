import { Request, Response } from "express";
import { SortOrder } from "mongoose";
import { TeacherModel } from "../model/teacher.model";

export const teacherController = {
  get: async (req: Request, res: Response) => {
    const { search, majorTags, sortBy, isAscSorting } = req.query;
    const majorTagsList = majorTags && (majorTags as string).split(",");

    try {
      const teacherDocuments = await TeacherModel.find({
        ...(search
          ? {
              $or: [
                { firstName: { $regex: search, $options: "i" } },
                { lastName: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } },
                { MSCB: { $regex: search, $options: "i" } },
              ],
            }
          : {
              ...(majorTagsList
                ? {
                    majorTags: {
                      $in: majorTagsList,
                    },
                  }
                : {}),
            }),
      })
        .sort(
          sortBy
            ? {
                [sortBy as string]: parseInt(
                  isAscSorting as string
                ) as SortOrder,
              }
            : { MSCB: 1 }
        )
        .limit(10);

      return res.status(200).json({ data: teacherDocuments });
    } catch (error) {
      return res.status(500).json({ message: "Internal Error" });
    }
  },
};
