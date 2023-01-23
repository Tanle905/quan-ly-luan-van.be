import { Request } from "./request.interface";

export interface Student {
  MSSV: string;
  class: string;
  major: string;
  department: string;
  sentRequestList?: Request[];
  topic?: any;
  teacher?: any;
  thesisProgress?: any;
  reportSchedule?: any;
  createdAt?: Date;
  updatedAt?: Date;
}
