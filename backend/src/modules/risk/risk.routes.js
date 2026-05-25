import express from "express";
import { requireAuth } from "../../middlewares/auth.middleware.js";
import { assessRiskProfile, getRiskResult } from "./risk.controller.js";

export const riskRouter = express.Router();

riskRouter.post("/assess", requireAuth, assessRiskProfile);
riskRouter.get("/result", requireAuth, getRiskResult);
