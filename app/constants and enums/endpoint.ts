//Routes
export const COMMON_ROUTE = {
  IMPORT: "/import",
  EXPORT: "/export",
};
export const AUTH_ROUTE = {
  BASE: "/",
  LOGIN: "/login",
};
export const USER_PROFILE_ROUTE = {
  BASE: "/",
  ID: "/:userId",
  TAG: "/tag",
};
export const USER_MANAGEMENT_ROUTE = {
  BASE: "/",
  ID: "/:userId",
};
export const STUDENT_MANAGEMENT_ROUTE = {
  BASE: "/",
  MSSV: "/:MSSV",
};
export const TEACHER_MANAGEMENT_ROUTE = {
  BASE: "/",
  MSCB: "/:MSCB",
};
export const TOPIC_MANAGEMENT_ROUTE = {
  BASE: "/",
};
export const STUDENT_ROUTE = {
  BASE: "/",
  MSSV: "/:MSSV",
  IMPORT: "/import",
  EXPORT: "/export",
};
export const TEACHER_ROUTE = {
  BASE: "/",
  TOPIC: "/topic",
};
export const REQUEST_ROUTE = {
  BASE: "/",
  ID: "/:requestId",
  SEND: "/send",
  ACCEPT: "/accept",
  REJECT: "/reject",
};
export const NOTIFICATION_ROUTE = {
  BASE: "/",
};
export const TOPIC_ROUTE = {
  BASE: "/",
  ID: "/:id",
  SEND: "/send",
};
export const THESIS_PROGRESS_ROUTE = {
  BASE: "/",
  EVENT: {
    BASE: "/event",
    DELETE: "/delete",
  },
  ID: "/:id",
};
export const TAG_ROUTE = {
  BASE: "/",
  MAJOR_TAGS: "/major",
};
export const THESIS_DEFENSE_SCHEDULE_ROUTE = {
  BASE: "/",
  STUDENT_LIST: "/student-list",
  CALENDAR: {
    BASE: "/calendar",
    ID: "/:id",
    DATE: "/:date",
    BUSY_LIST: "/busy-time",
    THESIS_DEFENSE_TIME: "/thesis-defense-time",
  },
  GRADING_STATUS: "/grading-status",
};
//Endpoints
export const API_ENDPOINT = "/api";
export const AUTH_ENDPOINT = "/auth";
export const USER_PROFILE_ENDPOINT = "/profile";
export const USER_MANAGEMENT_ENDPOINT = "/user-management";
export const STUDENT_MANAGEMENT_ENDPOINT = "/student-management";
export const TEACHER_MANAGEMENT_ENDPOINT = "/teacher-management";
export const TOPIC_MANAGEMENT_ENDPOINT = "/topic-management";
export const STUDENT_ENDPOINT = "/student";
export const TEACHER_ENDPOINT = "/teacher";
export const REQUEST_ENDPOINT = "/request";
export const NOTIFICATION_ENDPOINT = "/notification";
export const TOPIC_ENDPOINT = "/topic";
export const THESIS_PROGRESS_ENDPOINT = "/thesis-progress";
export const TAG_ENDPOINT = "/tag";
export const THESIS_DEFENSE_SCHEDULE_ENDPOINT = "/thesis-schedule";
