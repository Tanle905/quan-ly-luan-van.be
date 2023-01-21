import { Student } from "./student.interface";
import { User } from "./user_and_roles.interface";

export interface Teacher extends User {
    MSCB: string;
    major: any;
    receivedRequestList: any[];
    studentList: Student[];
    reportSchedule: any[];
}