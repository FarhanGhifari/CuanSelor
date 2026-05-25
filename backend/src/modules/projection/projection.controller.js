import { asyncHandler } from "../../utils/async-handler.js";
import { ok } from "../../utils/api-response.js";
import { calculateProjection } from "./projection.service.js";

export const getProjection = asyncHandler(async (req, res) => {
  const data = await calculateProjection(req.user.id);
  return ok(res, data);
});
