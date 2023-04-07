import { Router } from "express";
import { authJwt } from "../middleware/authJwt";
import { TOPIC_MANAGEMENT_ROUTE } from "../constants and enums/endpoint";
import { topicManagementController } from "../controller/topic-management.controller";

export const topicManagementRouter = Router();

topicManagementRouter
  .route(TOPIC_MANAGEMENT_ROUTE.BASE)
  .all([authJwt.verifyToken, authJwt.isAdmin])
  .post(topicManagementController.getTopics);
