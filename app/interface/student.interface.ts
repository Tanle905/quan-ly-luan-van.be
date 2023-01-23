
export interface Student {
  MSSV: string;
  class: string;
  major: string;
  department: string;
  sentRequestList?: { MSCB: string; name: string; email: string }[];
  topic?: any;
  teacher?: any;
  thesisProgress?: any;
  reportSchedule?: any;
}
