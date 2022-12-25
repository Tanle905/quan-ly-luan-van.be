import { NextFunction, Response } from "express";
import { SYSTEM_ROLES } from "../constants and enums/variable";
import { UserRequest } from "../interface/user_and_roles.interface";
import { UserModel } from "../model/user.model";

export const verifySignUp = {
  checkDuplicateUsernameOrEmail: async (
    req: UserRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      UserModel.findOne({ username: req.body.username }).exec((error, user) => {
        if (user) {
          return res
            .status(400)
            .send({ message: "Failed! Username is already in use" });
        } else {
          UserModel.findOne({ email: req.body.email }).exec((error, user) => {
            if (user)
              return res
                .status(400)
                .send({ message: "Failed! Email is already in use" });
                next();
          });
        }
      });
    } catch (error) {
      return res.status(500).send({ message: error });
    }
  },
  checkRolesExisted: async (
    req: UserRequest,
    res: Response,
    next: NextFunction
  ) => {
    if (req.body.roles) {
      for (let i = 0; i < req.body.roles.length; i++) {
        if (!SYSTEM_ROLES.includes(req.body.roles[i])) {
          return res.status(400).send({
            message: `Failed! Role ${req.body.roles[i]} does not exist!`,
          });
        }
      }
    }
    next();
  },
};
