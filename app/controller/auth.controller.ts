import { UserModel } from "../model/user.model";
import * as bcrypt from "bcryptjs";
import { Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import { config } from "../config";
import { TeacherModel } from "../model/teacher.model";
import { ObjectId } from "mongodb";

export const authController = {
  signin: async (req: Request, res: Response) => {
    try {
      const userDocument = await UserModel.findOne({
        username: req.body.username,
      }).populate("roles", "-__v");

      if (!userDocument)
        return res.status(404).json({ message: "User Not found." });

      let userClone = userDocument.toObject();
      const passwordIsValid = bcrypt.compareSync(
        req.body.password,
        userClone.password
      );
      const token = jwt.sign({ id: userDocument.id }, config.app.secret);
      const authorities = [];

      //Check for password validity and remove field password from res
      if (!passwordIsValid) {
        return res.status(401).json({
          accessToken: null,
          message: "Invalid Password!",
        });
      }
      delete userClone.password;

      //Map role to userClone
      for (let i = 0; i < userDocument.roles.length; i++) {
        authorities.push(userClone.roles[i].name);
      }

      if ((userClone as any).teacher) {
        const teacherDocument = await TeacherModel.findById(
          (userClone as any).teacher
        ).select("MSCB firstName lastName email");

        userClone["teacher"] = teacherDocument.toObject();
      }

      return res.status(200).json({
        ...userClone,
        roles: authorities,
        accessToken: token,
      });
    } catch (error) {
      return res.status(500).json({ message: "Internal Error" });
    }
  },
};
