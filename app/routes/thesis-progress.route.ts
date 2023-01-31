import { Router } from "express";
import { THESIS_PROGRESS_ROUTE } from "../constants and enums/endpoint";
import { thesisProgressController } from "../controller/thesis-progress.controller";
import { authJwt } from "../middleware/authJwt";
import { verifyStatus } from "../middleware/verifyStatus";

export const thesisProgressRouter = Router();

thesisProgressRouter
  .route(THESIS_PROGRESS_ROUTE.BASE)
  .all([authJwt.verifyToken, verifyStatus.isNotDeactivated])
  .post(thesisProgressController.getThesisProgress);

thesisProgressRouter
  .route(THESIS_PROGRESS_ROUTE.EVENT.BASE)
  .all([authJwt.verifyToken, verifyStatus.isNotDeactivated])
  .post(thesisProgressController.addEvent)
  .put(thesisProgressController.editEvent);

thesisProgressRouter
  .route(THESIS_PROGRESS_ROUTE.EVENT.BASE + THESIS_PROGRESS_ROUTE.EVENT.DELETE)
  .all([authJwt.verifyToken, verifyStatus.isNotDeactivated])
  .post(thesisProgressController.deleteEvent);
