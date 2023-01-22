import { Student } from "./student.interface";
import { User } from "./user_and_roles.interface";

export interface Teacher {
    MSCB: string;
    major: any;
    receivedRequestList: { MSSV: string; name: string; email: string }[];
    studentList: Student[];
    reportSchedule: any[];
}