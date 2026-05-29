import { asyncHandler } from "../../utils/async-handler.js";
import { ok } from "../../utils/api-response.js";
import { calculateProjection } from "./projection.service.js";

export const getProjection = asyncHandler(async (req, res) => {
  const customPlanningAge = req.query.custom_planning_age
    ? Number(req.query.custom_planning_age)
    : null;
  const data = await calculateProjection(req.user.id, customPlanningAge);
  return ok(res, data);
});
