import express from "express";
import { optionalAuth } from "../../middlewares/auth.middleware.js";
import { getCurrentUser } from "./auth.controller.js";

export const authRouter = express.Router();

authRouter.get("/me", optionalAuth, getCurrentUser);
