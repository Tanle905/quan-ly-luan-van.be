import { Router } from "express";
import multer from "multer";
import { tmpdir } from "os";
import {
  COMMON_ROUTE,
  THESIS_DEFENSE_SCHEDULE_ROUTE,
} from "../constants and enums/endpoint";
import { thesisDefenseScheduleController } from "../controller/thesis-defense-schedule.controller";

export const thesisDefenseScheduleRouter = Router();

thesisDefenseScheduleRouter
  .route(THESIS_DEFENSE_SCHEDULE_ROUTE.STUDENT_LIST + COMMON_ROUTE.IMPORT)
  .all([multer({ dest: tmpdir() }).single("file")])
  .post(thesisDefenseScheduleController.studentList.import);
