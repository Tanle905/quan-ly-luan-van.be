import { Request, Response } from "express";
import { ObjectId } from "mongodb";
import { TeacherModel } from "../model/teacher.model";
import { TopicModel } from "../model/topic.model";
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
          if ((userClone as any).topic) {
            const topicDocument = await TopicModel.findById(
              (userClone as any).topic
            );

            userClone["topic"] = topicDocument.toObject();
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
          if ((userClone as any).topic) {
            const topicDocument = await TopicModel.findById(
              (userClone as any).topic
            );

            userClone["topic"] = topicDocument.toObject();
          }

          return res.status(200).json({ ...userClone, roles: authorities });
        });
    } catch (error) {
      return res.status(500).json({ message: "Internal Error" });
    }
  },
  put: async (req: Request, res: Response) => {
    const { userId } = res.locals;
    const profileData = req.body;

    const isTeacher = profileData.MSCB ? true : false;

    try {
      const userDocument = isTeacher
        ? await TeacherModel.findByIdAndUpdate(new ObjectId(userId), {
            $set: profileData,
          })
        : await UserModel.findByIdAndUpdate(new ObjectId(userId), {
            $set: profileData,
          });

      if (!userDocument)
        return res.status(404).json({ message: "User Not found!" });

      return res.status(200).json({ message: "Update Profile Complete" });
    } catch (error) {
      res.status(500).json({ message: "Internal Error" });
    }
  },
  modifyMajorTags: async (req: Request, res: Response) => {
    const userId = res.locals;
    const { majorTags } = req.params;

    try {
      const teacherDocument = await TeacherModel.findOne({ _id: userId });

      teacherDocument.majorTags = JSON.parse(majorTags);

      await teacherDocument.save();

      return res.status(200).json({ message: "Update Tag Complete" });
    } catch (error) {
      return res.status(500).json({ message: "Internal Error" });
    }
  },
};
