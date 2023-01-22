import { Router } from "express";
import { TEACHER_ROUTE } from "../constants and enums/endpoint";
import { teacherController } from "../controller/teacher.controller";

export const teacherRouter = Router();

teacherRouter.route(TEACHER_ROUTE.BASE).get(teacherController.get);
