import express from "express";
import { optionalAuth } from "../../middlewares/auth.middleware.js";
import { getCurrentUser } from "./auth.controller.js";
import { requestPasswordReset, resetPassword } from "./forgot-password.controller.js";
import { resendVerification } from "./resend-verification.controller.js";

export const authRouter = express.Router();

authRouter.get("/me", optionalAuth, getCurrentUser);

authRouter.post("/forgot-password", requestPasswordReset);
authRouter.post("/reset-password", resetPassword);
authRouter.post("/resend-verification", resendVerification);