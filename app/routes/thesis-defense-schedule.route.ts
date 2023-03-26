import { Router } from "express";
import {
  COMMON_ROUTE,
  THESIS_DEFENSE_SCHEDULE_ROUTE,
} from "../constants and enums/endpoint";
import { thesisDefenseScheduleController } from "../controller/thesis-defense-schedule.controller";

export const thesisDefenseScheduleRouter = Router();

thesisDefenseScheduleRouter
  .route(THESIS_DEFENSE_SCHEDULE_ROUTE.STUDENT_LIST)
  .get(thesisDefenseScheduleController.studentList.getAll);

thesisDefenseScheduleRouter
  .route(THESIS_DEFENSE_SCHEDULE_ROUTE.STUDENT_LIST + COMMON_ROUTE.IMPORT)
  .get(thesisDefenseScheduleController.studentList.getAll)
  .post(thesisDefenseScheduleController.studentList.import);

thesisDefenseScheduleRouter
  .route(THESIS_DEFENSE_SCHEDULE_ROUTE.CALENDAR.BASE)
  .get(thesisDefenseScheduleController.calendar.getScheduleWeeks)
  .post(thesisDefenseScheduleController.calendar.getCalendarEvents)
  .put(thesisDefenseScheduleController.calendar.editScheduleWeeks);

thesisDefenseScheduleRouter
  .route(
    THESIS_DEFENSE_SCHEDULE_ROUTE.CALENDAR.BASE +
      THESIS_DEFENSE_SCHEDULE_ROUTE.CALENDAR.THESIS_DEFENSE_TIME
  )
  .get(thesisDefenseScheduleController.calendar.thesisDefenseTime.autoSchedule)
  .post(
    thesisDefenseScheduleController.calendar.thesisDefenseTime
      .addScheduleManually
  );

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

thesisDefenseScheduleRouter
  .route(
    THESIS_DEFENSE_SCHEDULE_ROUTE.CALENDAR.BASE +
      THESIS_DEFENSE_SCHEDULE_ROUTE.CALENDAR.DATE
  )
  .get(thesisDefenseScheduleController.calendar.getCalendarEventsByDate);

thesisDefenseScheduleRouter
  .route(
    THESIS_DEFENSE_SCHEDULE_ROUTE.CALENDAR.BASE +
      THESIS_DEFENSE_SCHEDULE_ROUTE.CALENDAR.THESIS_DEFENSE_TIME +
      THESIS_DEFENSE_SCHEDULE_ROUTE.CALENDAR.ID
  )
  .delete(thesisDefenseScheduleController.calendar.thesisDefenseTime.delete);
