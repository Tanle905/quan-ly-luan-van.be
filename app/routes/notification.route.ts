import { Router } from "express";
import { NOTIFICATION_ROUTE } from "../constants and enums/endpoint";
import { notificationController } from "../controller/notification.controller";
import { authJwt } from "../middleware/authJwt";
import { verifyStatus } from "../middleware/verifyStatus";

export const notificationRouter = Router();

notificationRouter
  .route(NOTIFICATION_ROUTE.BASE)
  .all([authJwt.verifyToken, verifyStatus.isNotDeactivated])
  .get(notificationController.get)
  .post(notificationController.post)
  .put(notificationController.put);
