import { env } from "../config/env.js";

export function notFoundHandler(req, res) {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
}

export function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || err.status || 500;
  const isProduction = env.nodeEnv === "production";

  if (!isProduction) {
    console.error(err);
  }

  res.status(statusCode).json({
    success: false,
    message: statusCode === 500 && isProduction ? "Internal server error" : err.message,
    ...(err.details ? { details: err.details } : {}),
    ...(!isProduction && err.stack ? { stack: err.stack } : {}),
  });
}
