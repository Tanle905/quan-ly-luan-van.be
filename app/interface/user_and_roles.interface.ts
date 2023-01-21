import { Request } from "express";
import { Model } from "mongoose";

export interface Role {
  role: string;
}

interface UserBody extends User {
  data: any;
}

export interface UserRequest extends Request {
  body: UserBody;
  params: { userId: string; id: string };
}

export interface User {
  username: string;
  email: string;
  roles?: string[];
  password: string;
  imageUrl?: string;
  phoneNumber?: number;
  isDeactivated?: boolean;
  name?: string;
}

export interface UserModelInterface extends Model<User> {
  extractUserData: (payload: User) => User;
}
