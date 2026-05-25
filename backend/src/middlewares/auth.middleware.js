import { fromNodeHeaders } from "better-auth/node";
import { auth } from "../config/auth.js";
import { AppError } from "../utils/app-error.js";

export async function requireAuth(req, res, next) {
  try {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    if (!session?.user) {
      throw new AppError("Unauthorized - No active session", 401);
    }

    req.user = session.user;
    req.session = session.session;
    next();
  } catch (error) {
    next(error);
  }
}

export async function optionalAuth(req, res, next) {
  try {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    req.user = session?.user || null;
    req.session = session?.session || null;
  } catch {
    req.user = null;
    req.session = null;
  }

  next();
}

export function requireRole(...allowedRoles) {
  return (req, res, next) => {
    const userRole = req.user?.role;

    if (!userRole || !allowedRoles.includes(userRole)) {
      return next(new AppError("Forbidden - Insufficient permissions", 403));
    }

    next();
  };
}
