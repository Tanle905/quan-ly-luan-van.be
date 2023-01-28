import { Router } from "express";
import { THESIS_PROGRESS_ROUTE } from "../constants and enums/endpoint";
import { thesisProgressController } from "../controller/thesis-progress.controller";
import { authJwt } from "../middleware/authJwt";
import { verifyStatus } from "../middleware/verifyStatus";

export const thesisProgressRouter = Router();

thesisProgressRouter
  .route(THESIS_PROGRESS_ROUTE.BASE)
  .all([authJwt.verifyToken, verifyStatus.isNotDeactivated])
  .post(thesisProgressController.getEventList);

thesisProgressRouter
  .route(THESIS_PROGRESS_ROUTE.EVENT)
  .all([authJwt.verifyToken, verifyStatus.isNotDeactivated])
  .post(thesisProgressController.addEvent);
