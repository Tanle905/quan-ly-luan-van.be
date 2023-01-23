import { Router } from "express";
import { TEACHER_ROUTE } from "../constants and enums/endpoint";
import { teacherController } from "../controller/teacher.controller";
import { authJwt } from "../middleware/authJwt";
import { verifyStatus } from "../middleware/verifyStatus";

export const teacherRouter = Router();

teacherRouter
  .route(TEACHER_ROUTE.BASE)
  .all([authJwt.verifyToken, verifyStatus.isNotDeactivated])
  .get(teacherController.get);
