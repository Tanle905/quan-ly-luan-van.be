import express, { Application, Request, Response } from "express";
import morgan from "morgan";
import cors from "cors";
import { config } from "./app/config";
import mongoose from "mongoose";
import {
  AUTH_ENDPOINT,
  NOTIFICATION_ENDPOINT,
  REQUEST_ENDPOINT,
  STUDENT_ENDPOINT,
  TEACHER_ENDPOINT,
  THESIS_PROGRESS_ENDPOINT,
  USER_MANAGEMENT_ENDPOINT,
  USER_PROFILE_ENDPOINT,
} from "./app/constants and enums/endpoint";
import { authRouter } from "./app/routes/auth.route";
import { userManagementRouter } from "./app/routes/user_management.route";
import { profileRouter } from "./app/routes/user_profile.route";
import { teacherRouter } from "./app/routes/teacher.route";
import { requestRouter } from "./app/routes/request.route";
import { notificationRouter } from "./app/routes/notification.route";
import { studentRouter } from "./app/routes/student.route";
import { thesisProgressRouter } from "./app/routes/thesis-progress.route";

//Config
const app: Application = express();
const port = config.app.port;
const mongoString = config.app.databaseUrl as string;
mongoose.set("strictQuery", true);
mongoose.connect(mongoString);
export const database = mongoose.connection;
app.use(morgan("combined"));
app.use(cors());
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});
app.use(AUTH_ENDPOINT, authRouter);
app.use(USER_PROFILE_ENDPOINT, profileRouter);
app.use(USER_MANAGEMENT_ENDPOINT, userManagementRouter);
app.use(TEACHER_ENDPOINT, teacherRouter);
app.use(REQUEST_ENDPOINT, requestRouter);
app.use(NOTIFICATION_ENDPOINT, notificationRouter);
app.use(STUDENT_ENDPOINT, studentRouter);
app.use(THESIS_PROGRESS_ENDPOINT, thesisProgressRouter);

app.listen(port, () => {});
