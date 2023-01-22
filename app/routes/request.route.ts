import { Router } from "express";
import { REQUEST_ROUTE } from "../constants and enums/endpoint";
import { requestController } from "../controller/request.controller";
import { authJwt } from "../middleware/authJwt";

export const requestRouter = Router();

requestRouter
  .route(REQUEST_ROUTE.BASE)
  .all([authJwt.verifyToken, authJwt.isStudent])
  .post(requestController.sendRequest)
  .put(requestController.deleteRequest);
