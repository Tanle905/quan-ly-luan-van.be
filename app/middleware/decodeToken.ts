import { NextFunction, Request, Response } from "express";
import * as jwt from "jsonwebtoken";

export const decodeToken = {
  decodeToken: async (req: Request, res: Response, next: NextFunction) => {
    if (!req.headers.authorization) return next();
    let token = (req.headers.authorization as string).replace("Bearer ", "");

    try {
      const decoded: any = jwt.decode(token);
      res.locals.userId = decoded?.id;
      next();
    } catch (error) {
      return res.status(500).json({ message: "Internal Error" });
    }
  },
};
