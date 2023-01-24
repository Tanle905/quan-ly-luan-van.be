import { Router } from "express";
import { STUDENT_ROUTE } from "../constants and enums/endpoint";
import { studentController } from "../controller/student.controller";
import { authJwt } from "../middleware/authJwt";
import { verifyStatus } from "../middleware/verifyStatus";

export const studentRouter = Router();

studentRouter
  .route(STUDENT_ROUTE.BASE)
  .all([authJwt.verifyToken, verifyStatus.isNotDeactivated])
  .post(studentController.get);
