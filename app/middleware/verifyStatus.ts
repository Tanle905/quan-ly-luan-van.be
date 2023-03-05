import { NextFunction, Request, Response } from "express";
import { ObjectId } from "mongodb";
import { UserModel } from "../model/user.model";

export const verifyStatus = {
  isNotDeactivated: (req: Request, res: Response, next: NextFunction) => {
    const { username } = req.body;
    const { userId } = res.locals;
    const filter = username ? { username } : { _id: new ObjectId(userId) };

    try {
      UserModel.findOne(filter).exec((error: any, user: any) => {
        if (!user) return res.status(400).json({ message: "User not found!" });
        if (!user.isDeactivated) return next();

        return res
          .status(400)
          .json({ message: "This account has been deactivated!" });
      });
    } catch (error) {
      console.log(error);

      return res.status(500).json({ message: "Internal Error" });
    }
  },
};
