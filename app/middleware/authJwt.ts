import { NextFunction, Response } from "express";
import * as jwt from "jsonwebtoken";
import { config } from "../config";
import { ROLES } from "../constants and enums/variable";
import { UserRequest } from "../interface/user_and_roles.interface";
import { RoleModel } from "../model/role.model";
import { UserModel } from "../model/user.model";

export const authJwt = {
  verifyToken: (req: UserRequest, res: Response, next: NextFunction) => {
    if (!req.headers.authorization)
      return res.status(403).json({ message: "No token provided!" });
    let token = (req.headers.authorization as string).replace("Bearer ", "");

    try {
      jwt.verify(token, config.app.secret, (err: any, decoded: any) => {
        res.locals.userId = decoded.id;
        next();
      });
    } catch (error) {
      return res.status(401).json({ message: "Unauthorized!" });
    }
  },
  isAdmin: (req: UserRequest, res: Response, next: NextFunction) => {
    const { userId } = res.locals;

    try {
      UserModel.findById(userId).exec((error: any, user: any) => {
        RoleModel.find(
          {
            _id: { $in: user.roles },
          },
          (error: any, roles: any) => {
            for (let i = 0; i < roles.length; i++) {
              if (roles[i].name === ROLES.ADMIN) {
                next();
                return;
              }
            }

            return res.status(403).json({ message: "Require Admin Role!" });
          }
        );
      });
    } catch (error) {
      return res.status(500).json({ message: error });
    }
  },
};
