import express from "express";
import { requireAuth } from "../../middlewares/auth.middleware.js";
import { getMyProfile, updateMyProfile } from "./profile.controller.js";

export const profileRouter = express.Router();

profileRouter.get("/", requireAuth, getMyProfile);
profileRouter.post("/", requireAuth, updateMyProfile);
// PATCH digunakan karena ini adalah partial/full upsert data profil user sendiri
profileRouter.patch("/", requireAuth, updateMyProfile);
