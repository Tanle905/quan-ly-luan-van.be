import { Types } from "mongoose";
import { Student } from "./student.interface";
import { Teacher } from "./teacher.interface";

export interface Request {
  _id: string;
  isStudentAccepted?: boolean;
  isTeacherAccepted?: boolean;
  student: Student;
  teacher: Teacher;
  topic?: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}
