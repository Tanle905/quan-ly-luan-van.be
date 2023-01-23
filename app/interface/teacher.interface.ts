import { Request } from "./request.interface";
import { Student } from "./student.interface";

export interface Teacher {
    MSCB: string;
    major: any;
    receivedRequestList: Request[];
    studentList: Student[];
    reportSchedule: any[];
    createdAt?: Date;
    updatedAt?: Date;
}