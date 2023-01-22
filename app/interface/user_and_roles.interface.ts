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
  MSSV?: string;
  MSCB?: string;
  teacherProfile?: any;
  studentProfile?: any;
  imageUrl?: string;
  phoneNumber?: number;
  name?: string;
  isDeactivated?: boolean;
}

export interface UserModelInterface extends Model<User> {
  extractUserData: (payload: User) => User;
}
