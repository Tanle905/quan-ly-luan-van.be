import { Request, Response } from "express";
import { SortOrder } from "mongoose";
import * as bcrypt from "bcryptjs";
import { RoleModel } from "../model/role.model";
import { ROLES } from "../constants and enums/variable";
import { TeacherModel } from "../model/teacher.model";

export const teacherManagementController = {
  getTeachers: async (req: Request, res: Response) => {
    const { search, sortBy, isAscSorting } = req.query;

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
            : { MSCB: 1 }
        );

      return res.status(200).json({
        data: teacherDocuments,
      });
    } catch (error) {
      return res.status(500).json({ message: "Internal Error" });
    }
  },
  addTeacher: async (req: Request, res: Response) => {
    const password =
      req.body?.password && bcrypt.hashSync(req.body?.password, 8);

    try {
      const roleDocument = await RoleModel.findOne({ name: ROLES.STUDENT });

      await TeacherModel.findOneAndUpdate(
        { MSCB: req.body.MSCB },
        {
          ...req.body,
          ...(password && { password }),
          roles: roleDocument._id,
        },
        {
          upsert: true,
        }
      );

      return res.status(200).json({ message: "Teacher added complete" });
    } catch (error) {
      return res.status(500).json({ message: "Internal Error" });
    }
  },
  deleteTeacherByMSCB: async (req: Request, res: Response) => {
    const { MSCB } = req.params;

    try {
      await TeacherModel.deleteOne({ MSCB });

      return res.status(200).json({ message: "Delete teacher completed" });
    } catch (error) {
      return res.status(500).json({ message: "Internal Error" });
    }
  },
};
