import express from "express";
import { requireAuth } from "../../middlewares/auth.middleware.js";
import { getStatus, saveFinancial, savePension, mortalityInfo } from "./onboarding.controller.js";

export const onboardingRouter = express.Router();

onboardingRouter.get("/status", requireAuth, getStatus);
onboardingRouter.post("/financial", requireAuth, saveFinancial);
onboardingRouter.post("/pension", requireAuth, savePension);
onboardingRouter.post("/mortality-info", requireAuth, mortalityInfo);
