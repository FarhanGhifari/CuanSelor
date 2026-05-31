import { asyncHandler } from "../../utils/async-handler.js";
import { AppError } from "../../utils/app-error.js";
import { ok } from "../../utils/api-response.js";
import { calculateProjection } from "./projection.service.js";

export const getProjection = asyncHandler(async (req, res) => {
  let customPlanningAge = null;

  if (req.query.custom_planning_age !== undefined) {
    customPlanningAge = Number(req.query.custom_planning_age);

    if (!Number.isFinite(customPlanningAge) || customPlanningAge < 18 || customPlanningAge > 120) {
      throw new AppError("custom_planning_age harus berupa angka antara 18 dan 120", 400);
    }
  }

  const data = await calculateProjection(req.user.id, customPlanningAge);
  return ok(res, data);
});
