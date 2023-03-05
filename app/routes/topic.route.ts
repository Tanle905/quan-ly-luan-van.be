import { Router } from "express";
import { TOPIC_ROUTE } from "../constants and enums/endpoint";
import { topicController } from "../controller/topic.controller";
import { authJwt } from "../middleware/authJwt";
import { verifyStatus } from "../middleware/verifyStatus";

export const topicRouter = Router();

topicRouter
  .route(TOPIC_ROUTE.ID)
  .all([authJwt.verifyToken, verifyStatus.isNotDeactivated])
  .get(topicController.getTopicById)
  .post(topicController.acceptTopic)
  .put(topicController.requestChangeTopic);

topicRouter
  .route(TOPIC_ROUTE.ID + TOPIC_ROUTE.SEND)
  .all([authJwt.verifyToken, verifyStatus.isNotDeactivated])
  .post(topicController.sendTopic);
