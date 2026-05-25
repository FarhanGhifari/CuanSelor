import { asyncHandler } from "../../utils/async-handler.js";
import { ok } from "../../utils/api-response.js";
import { getProfile, upsertProfile } from "./profile.service.js";

export const getMyProfile = asyncHandler(async (req, res) => {
  const data = await getProfile(req.user);
  return ok(res, data);
});

export const updateMyProfile = asyncHandler(async (req, res) => {
  const data = await upsertProfile(req.user.id, req.body);
  return ok(res, data, "Data berhasil disimpan");
});
