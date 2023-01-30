//Routes
export const AUTH_ROUTE = {
  BASE: "/",
  LOGIN: "/login",
};
export const USER_PROFILE_ROUTE = {
  BASE: "/",
  ID: "/:id",
};
export const USER_MANAGEMENT_ROUTE = {
  BASE: "/",
  ID: "/:userId",
};
export const STUDENT_ROUTE = {
  BASE: "/",
};
export const TEACHER_ROUTE = {
  BASE: "/",
};
export const REQUEST_ROUTE = {
  BASE: "/",
  ACCEPT: "/accept",
  REJECT: "/reject",
};
export const NOTIFICATION_ROUTE = {
  BASE: "/",
};
export const THESIS_PROGRESS_ROUTE = {
  BASE: "/",
  EVENT: {
    BASE: "/event",
    DELETE: "/delete",
  },
};
//Endpoints
export const API_ENDPOINT = "/api";
export const AUTH_ENDPOINT = "/auth";
export const USER_PROFILE_ENDPOINT = "/profile";
export const USER_MANAGEMENT_ENDPOINT = "/user-management";
export const STUDENT_ENDPOINT = "/student";
export const TEACHER_ENDPOINT = "/teacher";
export const REQUEST_ENDPOINT = "/request";
export const NOTIFICATION_ENDPOINT = "/notification";
export const THESIS_PROGRESS_ENDPOINT = "/thesis-progress";
