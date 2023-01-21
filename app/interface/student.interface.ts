import { User } from "./user_and_roles.interface";

export interface Student extends User {
  MSSV: string;
  isRequestSent?: boolean;
  topic?: any;
  teacher?: any;
  thesisProgress?: any;
  reportSchedule?: any;
}
