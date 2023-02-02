import { Request, Response } from "express";
import { ObjectId } from "mongodb";
import { TeacherModel } from "../model/teacher.model";
import { UserModel } from "../model/user.model";

export const userProfileController = {
  get: async (req: Request, res: Response) => {
    const { userId } = res.locals;

    try {
      UserModel.findById(new ObjectId(userId))
        .select("-password")
        .populate("roles", "-__v")
        .exec(async (error, user: any) => {
          if (error) return res.status(400).json({ message: "Internal Error" });
          if (!user)
            return res.status(404).json({ message: "User Not found!" });
          const authorities = [];
          for (let i = 0; i < user.roles.length; i++) {
            authorities.push(user.roles[i].name);
          }

          const userClone = user.toObject();

          if (userClone.teacher) {
            const teacherDocument = await TeacherModel.findById(
              userClone.teacher
            ).select("MSCB firstName lastName email");

            userClone.teacher = teacherDocument.toObject();
          }

          return res.status(200).json({ ...userClone, roles: authorities });
        });
    } catch (error) {
      return res.status(500).json({ message: "Internal Error" });
    }
  },
  getById: async (req: Request, res: Response) => {
    const { userId } = req.params;

    try {
      UserModel.findById(new ObjectId(userId))
        .select("-password")
        .populate("roles", "-__v")
        .exec((error, user: any) => {
          if (error) return res.status(400).json({ message: "Internal Error" });
          if (!user)
            return res.status(404).json({ message: "User Not found!" });
          const authorities = [];
          for (let i = 0; i < user.roles.length; i++) {
            authorities.push(user.roles[i].name);
          }
          return res
            .status(200)
            .json({ ...user.toObject(), roles: authorities });
        });
    } catch (error) {
      return res.status(500).json({ message: "Internal Error" });
    }
  },
  put: async (req: Request, res: Response) => {
    const { userId } = res.locals;

    try {
      const profileData = req.body;
      UserModel.findByIdAndUpdate(
        new ObjectId(userId),
        {
          $set: profileData,
        },
        {
          returnDocument: "after",
        }
      )
        .select("-password")
        .populate("roles", "-__v")
        .exec(async (error, user: any) => {
          if (error) return res.status(400).json({ message: "Internal Error" });
          if (!user)
            return res.status(404).json({ message: "User Not found!" });
          const authorities = [];

          for (let i = 0; i < user.roles.length; i++) {
            authorities.push(user.roles[i].name);
          }
          return res
            .status(200)
            .json({ ...user.toObject(), roles: authorities });
        });
    } catch (error) {
      res.status(500).json({ message: "Internal Error" });
    }
  },
};
