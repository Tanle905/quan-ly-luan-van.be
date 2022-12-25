//Routes
export const AUTH_ROUTE = {
  BASE: "/",
  LOGIN: "/login",
};
export const USER_PROFILE_ROUTE = {
  BASE: "/",
  ADDRESS: {
    BASE: "/address",
    ID: "/:id",
  },
  ORDER: {
    BASE: "/order",
    ID: "/:id",
  },
  ID: "/:id",
};
export const USER_MANAGEMENT_ROUTE = {
  BASE: "/",
  ID: "/:userId",
};
//Endpoints
export const API_ENDPOINT = "/api";
export const AUTH_ENDPOINT = "/login";
export const USER_PROFILE_ENDPOINT = "/profile";
export const USER_MANAGEMENT_ENDPOINT = "/user-management";

