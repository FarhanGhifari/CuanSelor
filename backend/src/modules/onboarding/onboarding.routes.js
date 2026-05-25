import express from "express";
import { requireAuth } from "../../middlewares/auth.middleware.js";
import { getStatus, saveFinancial, savePension } from "./onboarding.controller.js";

export const onboardingRouter = express.Router();

onboardingRouter.get("/status", requireAuth, getStatus);
onboardingRouter.post("/financial", requireAuth, saveFinancial);
onboardingRouter.post("/pension", requireAuth, savePension);
