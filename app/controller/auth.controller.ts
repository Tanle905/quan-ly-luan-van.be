import { UserRequest } from "../interface/user_and_roles.interface";
import { UserModel } from "../model/user.model";
import * as bcrypt from "bcryptjs";
import { Response } from "express";
import * as jwt from "jsonwebtoken";
import { config } from "../config";

export const authController = {
  signin: (req: UserRequest, res: Response) => {
    try {
      UserModel.findOne({
        username: req.body.username,
      })
        .populate("roles", "-__v")
        .populate("studentProfile")
        .populate("teacherProfile")
        .exec(async (err, user: any) => {
          if (err) return res.status(500).json({ message: err });

          if (!user)
            return res.status(404).json({ message: "User Not found." });

          let userClone = user.toObject();
          const passwordIsValid = bcrypt.compareSync(
            req.body.password,
            userClone.password
          );
          const token = jwt.sign({ id: user.id }, config.app.secret);
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
          for (let i = 0; i < user.roles.length; i++) {
            authorities.push(userClone.roles[i].name);
          }

          //Spread profile into userClone
          if (userClone.studentProfile) {
            userClone = { ...userClone, ...userClone.studentProfile };
          }
          if (userClone.teacherProfile) {
            userClone = { ...userClone, ...userClone.teacherProfile };
          }
          delete userClone.studentProfile;
          delete userClone.teacherProfile;

          return res.status(200).json({
            ...userClone,
            roles: authorities,
            accessToken: token,
          });
        });
    } catch (error) {
      return res.status(500).json({ message: error });
    }
  },
};
