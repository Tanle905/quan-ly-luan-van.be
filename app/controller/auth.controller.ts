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
        .exec((err, user: any) => {
          if (!user) {
            return res.status(404).json({ message: "User Not found." });
          }
          const userClone = user.toObject();
          const passwordIsValid = bcrypt.compareSync(
            req.body.password,
            userClone.password
          );
          const token = jwt.sign({ id: user.id }, config.app.secret);
          const authorities = [];
          if (!passwordIsValid) {
            return res.status(401).json({
              accessToken: null,
              message: "Invalid Password!",
            });
          }
          for (let i = 0; i < user.roles.length; i++) {
            authorities.push(userClone.roles[i].name);
          }
          delete userClone.password;
          res.status(200).json({
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
