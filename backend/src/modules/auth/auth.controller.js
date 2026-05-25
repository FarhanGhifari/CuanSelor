import { ok } from "../../utils/api-response.js";

export function getCurrentUser(req, res) {
  return ok(res, {
    user: req.user,
    session: req.session,
  });
}
