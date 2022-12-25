import { Response } from "express";
import { ObjectId } from "mongodb";
import { UserRequest } from "../interface/user_and_roles.interface";
import { UserModel } from "../model/user.model";

export const userManagementController = {
  get: async (req: UserRequest, res: Response) => {
    try {
      const document = await UserModel.find().select("-password -roles -__v");
      return res.status(200).json({ data: [...document] });
    } catch (error) {
      return res.status(500).json({ message: error });
    }
  },
  handleDeactivateUser: async (req: UserRequest, res: Response) => {
    const { userId } = req.params;
    const { isDeactivated } = req.body;
    try {
      await UserModel.findByIdAndUpdate(new ObjectId(userId), {
        isDeactivated,
      });
      return res
        .status(200)
        .json({ message: "User status changed successfully!" });
    } catch (error) {
      res.status(500).json({ message: error });
    }
  },
};
