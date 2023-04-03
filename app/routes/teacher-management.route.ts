import { Router } from "express";
import { authJwt } from "../middleware/authJwt";
import { teacherManagementController } from "../controller/teacher-management.controller";
import { TEACHER_MANAGEMENT_ROUTE } from "../constants and enums/endpoint";

export const teacherManagementRouter = Router();

teacherManagementRouter
  .route(TEACHER_MANAGEMENT_ROUTE.BASE)
  .all([authJwt.verifyToken, authJwt.isAdmin])
  .post(teacherManagementController.getTeachers)
  .put(teacherManagementController.addTeacher);

teacherManagementRouter
  .route(TEACHER_MANAGEMENT_ROUTE.MSCB)
  .all([authJwt.verifyToken, authJwt.isAdmin])
  .delete(teacherManagementController.deleteTeacherByMSCB);
