import { Request } from "express";
import { Model } from "mongoose";
import { Student } from "./student.interface";
import { Teacher } from "./teacher.interface";

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
  roles?: Role[];
  MSSV?: string;
  MSCB?: string;
  teacherProfile?: Teacher;   //virtual field
  studentProfile?: Student;   //virtual field
  firstName?: string;
  lastName?: string;
  imageUrl?: string;
  phoneNumber?: number;
  isDeactivated?: boolean;
  ethnic?: string;
  religion?: string;
  CCCD?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UserModelInterface extends Model<User> {
  extractUserData: (payload: User) => User;
}
