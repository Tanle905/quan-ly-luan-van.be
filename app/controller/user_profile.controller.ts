import { Response } from "express";
import { ObjectId } from "mongodb";
import { UserRequest } from "../interface/user_and_roles.interface";
import { UserModel } from "../model/user.model";

export const userProfileController = {
  get: async (req: UserRequest, res: Response) => {
    const { userId } = res.locals;

    try {
      UserModel.findById(new ObjectId(userId))
        .select("-password")
        .populate("roles", "-__v")
        .exec((error, user: any) => {
          if (error) return res.status(400).json({ message: error });
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
      return res.status(500).json({ message: error });
    }
  },
  put: async (req: UserRequest, res: Response) => {
    const { userId } = res.locals;

    try {
      const profileData = UserModel.extractUserData(req.body);
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
          if (error) return res.status(400).json({ message: error });
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
      res.status(500).json({ message: error });
    }
  },
};
