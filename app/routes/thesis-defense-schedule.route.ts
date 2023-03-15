import { Router } from "express";
import {
  COMMON_ROUTE,
  THESIS_DEFENSE_SCHEDULE_ROUTE,
} from "../constants and enums/endpoint";
import { thesisDefenseScheduleController } from "../controller/thesis-defense-schedule.controller";

export const thesisDefenseScheduleRouter = Router();

thesisDefenseScheduleRouter
  .route(THESIS_DEFENSE_SCHEDULE_ROUTE.STUDENT_LIST + COMMON_ROUTE.IMPORT)
  .post(thesisDefenseScheduleController.studentList.import);

thesisDefenseScheduleRouter
  .route(THESIS_DEFENSE_SCHEDULE_ROUTE.CALENDAR.BASE)
  .get(thesisDefenseScheduleController.calendar.autoSchedule)
  .post(thesisDefenseScheduleController.calendar.getCalendarEvents);

thesisDefenseScheduleRouter
  .route(
    THESIS_DEFENSE_SCHEDULE_ROUTE.CALENDAR.BASE +
      THESIS_DEFENSE_SCHEDULE_ROUTE.CALENDAR.BUSY_LIST
  )
  .post(thesisDefenseScheduleController.calendar.busyTime.delete);

thesisDefenseScheduleRouter
  .route(
    THESIS_DEFENSE_SCHEDULE_ROUTE.CALENDAR.BASE +
      THESIS_DEFENSE_SCHEDULE_ROUTE.CALENDAR.BUSY_LIST +
      COMMON_ROUTE.IMPORT
  )
  .post(thesisDefenseScheduleController.calendar.busyTime.import)
  .put(thesisDefenseScheduleController.calendar.busyTime.edit);
