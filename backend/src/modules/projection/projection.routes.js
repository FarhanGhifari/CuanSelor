import express from "express";
import { requireAuth } from "../../middlewares/auth.middleware.js";
import { getProjection } from "./projection.controller.js";
import { getCacheStatistics, clearCache } from "./cache.controller.js";

export const projectionRouter = express.Router();

projectionRouter.get("/", requireAuth, getProjection);
projectionRouter.get("/cache/stats", requireAuth, getCacheStatistics);
projectionRouter.delete("/cache", requireAuth, clearCache);
