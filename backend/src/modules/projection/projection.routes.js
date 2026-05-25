import express from "express";
import { requireAuth } from "../../middlewares/auth.middleware.js";
import { getProjection } from "./projection.controller.js";

export const projectionRouter = express.Router();

projectionRouter.get("/", requireAuth, getProjection);
