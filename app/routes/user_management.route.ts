import { Router } from "express";
import { USER_MANAGEMENT_ROUTE } from "../constants and enums/endpoint";
import { userManagementController } from "../controller/user_management.controller";
import { authJwt } from "../middleware/authJwt";
import { verifyStatus } from "../middleware/verifyStatus";

export const userManagementRouter = Router();

userManagementRouter
  .route(USER_MANAGEMENT_ROUTE.BASE)
  .all([authJwt.verifyToken, authJwt.isAdmin, verifyStatus.isNotDeactivated])
  .get(userManagementController.get);

userManagementRouter
  .route(USER_MANAGEMENT_ROUTE.ID)
  .all([authJwt.verifyToken, authJwt.isAdmin, verifyStatus.isNotDeactivated])
  .put(userManagementController.handleDeactivateUser);
