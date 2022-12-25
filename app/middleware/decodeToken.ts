import { NextFunction, Response } from "express";
import { UserRequest } from "../interface/user_and_roles.interface";
import * as jwt from "jsonwebtoken";

export const decodeToken = {
  decodeToken: async (req: UserRequest, res: Response, next: NextFunction) => {
    if (!req.headers.authorization) return next();
    let token = (req.headers.authorization as string).replace("Bearer ", "");

    try {
      const decoded: any = jwt.decode(token);
      res.locals.userId = decoded?.id;
      next();
    } catch (error) {
      return res.status(500).json({ message: error });
    }
  },
};
