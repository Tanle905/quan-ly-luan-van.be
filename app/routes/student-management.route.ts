import { Router } from "express";
import { STUDENT_MANAGEMENT_ROUTE as STUDENT_MANAGEMENT_ROUTE } from "../constants and enums/endpoint";
import { studentManagementController } from "../controller/student-management.controller";
import { authJwt } from "../middleware/authJwt";
import { verifyStatus } from "../middleware/verifyStatus";

export const studentManagementRouter = Router();

studentManagementRouter
  .route(STUDENT_MANAGEMENT_ROUTE.BASE)
  .all([authJwt.verifyToken, authJwt.isAdmin])
  .post(studentManagementController.getStudents)
  .put(studentManagementController.addStudent);

studentManagementRouter
  .route(STUDENT_MANAGEMENT_ROUTE.MSSV)
  .all([authJwt.verifyToken, authJwt.isAdmin])
  .delete(studentManagementController.deleteStudentByMSSV);
