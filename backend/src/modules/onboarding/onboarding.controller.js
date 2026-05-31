import { asyncHandler } from "../../utils/async-handler.js";
import { ok } from "../../utils/api-response.js";
import {
  getOnboardingStatus,
  saveFinancialOnboarding,
  savePensionOnboarding,
  getMortalityInfo,
} from "./onboarding.service.js";

export const getStatus = asyncHandler(async (req, res) => {
  const data = await getOnboardingStatus(req.user.id);
  return ok(res, data);
});

export const saveFinancial = asyncHandler(async (req, res) => {
  const data = await saveFinancialOnboarding(req.user.id, req.body);
  return ok(res, data, "Data finansial berhasil disimpan");
});

export const savePension = asyncHandler(async (req, res) => {
  const data = await savePensionOnboarding(req.user.id, req.body);
  return ok(res, data, "Data pensiun berhasil disimpan");
});

export const mortalityInfo = asyncHandler(async (req, res) => {
  const data = await getMortalityInfo(req.body);
  return ok(res, data, "Informasi aktuaria berhasil dihitung");
});
