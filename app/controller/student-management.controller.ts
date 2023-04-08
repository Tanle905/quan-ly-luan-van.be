import { Request, Response } from "express";
import { SortOrder } from "mongoose";
import { StudentModel } from "../model/student.model";
import { TopicModel } from "../model/topic.model";
import * as bcrypt from "bcryptjs";
import { RoleModel } from "../model/role.model";
import { ROLES } from "../constants and enums/variable";

export const studentManagementController = {
  getStudents: async (req: Request, res: Response) => {
    const { search, sortBy, isAscSorting, status } = req.query;

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
          ...status && {
            status: {$regex: status}
          }
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
        );
      const mappedStudentDocument = await Promise.all(
        studentDocuments.map(async (doc) => {
          const topic = await TopicModel.findById(doc.topic);
          return { ...doc.toObject(), topic };
        })
      );

      return res.status(200).json({
        data: mappedStudentDocument,
      });
    } catch (error) {
      return res.status(500).json({ message: "Internal Error" });
    }
  },
  addStudent: async (req: Request, res: Response) => {
    const password =
      req.body?.password && bcrypt.hashSync(req.body?.password, 8);

    try {
      const roleDocument = await RoleModel.findOne({ name: ROLES.STUDENT });

      await StudentModel.findOneAndUpdate(
        { MSSV: req.body.MSSV },
        {
          ...req.body,
          ...(password && { password }),
          roles: roleDocument._id,
        },
        {
          upsert: true,
        }
      );

      return res.status(200).json({ message: "Student added complete" });
    } catch (error) {
      return res.status(500).json({ message: "Internal Error" });
    }
  },
  deleteStudentByMSSV: async (req: Request, res: Response) => {
    const { MSSV } = req.params;

    try {
      await StudentModel.deleteOne({ MSSV });

      return res.status(200).json({ message: "Delete student completed" });
    } catch (error) {
      return res.status(500).json({ message: "Internal Error" });
    }
  },
};
