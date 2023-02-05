import { Router } from "express";
import { TAG_ROUTE } from "../constants and enums/endpoint";
import { tagController } from "../controller/tag.controller";

export const tagRouter = Router();

tagRouter.route(TAG_ROUTE.MAJOR_TAGS).get(tagController.getMajorTags);
