import { Router } from "express";
import { STUDENTT_MANAGEMENT_ROUTE as STUDENT_MANAGEMENT_ROUTE, STUDENT_ROUTE } from "../constants and enums/endpoint";
import { studentManagementController } from "../controller/student-management.controller";
import { authJwt } from "../middleware/authJwt";
import { verifyStatus } from "../middleware/verifyStatus";

export const studentManagementRouter = Router();

studentManagementRouter
  .route(STUDENT_MANAGEMENT_ROUTE.BASE)
  .all([authJwt.verifyToken, verifyStatus.isNotDeactivated])
  .post(studentManagementController.post);
