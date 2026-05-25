import { asyncHandler } from "../../utils/async-handler.js";
import { ok } from "../../utils/api-response.js";
import { generateRiskAssessment, getLatestRiskAssessment } from "./risk.service.js";

export const assessRiskProfile = asyncHandler(async (req, res) => {
  const data = await generateRiskAssessment(req.user.id, req.body || {});
  return ok(res, data, "Profil risiko berhasil digenerate oleh AI");
});

export const getRiskResult = asyncHandler(async (req, res) => {
  const data = await getLatestRiskAssessment(req.user.id);
  return ok(res, data);
});
