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
  password: string;
  roles?: string[];
  MSSV?: string;
  MSCB?: string;
  teacherProfile?: any;   //virtual field
  studentProfile?: any;   //virtual field
  firstName?: string;
  lastName?: string;
  imageUrl?: string;
  phoneNumber?: number;
  isDeactivated?: boolean;
  ethnic?: string;
  religion?: string;
  CCCD?: string;
}

export interface UserModelInterface extends Model<User> {
  extractUserData: (payload: User) => User;
}
