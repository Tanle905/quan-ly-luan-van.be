import { Router } from "express";
import { AUTH_ROUTE } from "../constants and enums/endpoint";
import { authController } from "../controller/auth.controller";
import { verifyStatus } from "../middleware/verifyStatus";

export const authRouter = Router();

authRouter
  .route(AUTH_ROUTE.LOGIN)
  .all(verifyStatus.isNotDeactivated)
  .post(authController.signin);
