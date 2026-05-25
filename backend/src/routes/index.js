import express from "express";
import { healthRouter } from "../modules/health/health.routes.js";
import { onboardingRouter } from "../modules/onboarding/onboarding.routes.js";
import { profileRouter } from "../modules/profile/profile.routes.js";
import { projectionRouter } from "../modules/projection/projection.routes.js";
import { riskRouter } from "../modules/risk/risk.routes.js";
import { requireAuth, optionalAuth } from "../middlewares/auth.middleware.js";
import { env } from "../config/env.js";

export const apiRouter = express.Router();

apiRouter.use("/health", healthRouter);
apiRouter.use("/onboarding", onboardingRouter);
apiRouter.use("/profile", profileRouter);
apiRouter.use("/projection", projectionRouter);
apiRouter.use("/risk", riskRouter);

// ── Endpoint debug — hanya aktif di luar production ──────────────────────────
if (env.nodeEnv !== "production") {
  apiRouter.get("/protected", requireAuth, (req, res) => {
    res.json({
      success: true,
      message: "[DEV] This is a protected endpoint",
      user: req.user,
    });
  });

  apiRouter.get("/public-with-user-info", optionalAuth, (req, res) => {
    res.json({
      success: true,
      message: "[DEV] This endpoint works with or without auth",
      user: req.user || null,
    });
  });
}
