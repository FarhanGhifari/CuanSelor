import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./config/auth.js";
import { env } from "./config/env.js";
import { authRouter } from "./modules/auth/auth.routes.js";
import { apiRouter } from "./routes/index.js";
import {
  errorHandler,
  notFoundHandler,
} from "./middlewares/error.middleware.js";

export function createApp() {
  const app = express();

  app.set('trust proxy', 1);

  // ── Security headers dasar ──────────────────────────────────────────────────
  app.use((req, res, next) => {
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("X-Frame-Options", "DENY");
    res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
    next();
  });

  // ── Rate limiting global ────────────────────────────────────────────────────
  const globalLimiter = rateLimit({
    windowMs: env.rateLimitWindowMs,
    max: env.rateLimitMax,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      success: false,
      message:
        "Terlalu banyak request dari IP ini. Coba lagi setelah beberapa saat.",
    },
  });

  // Rate limit lebih ketat untuk endpoint projection (spawn Python per request)
  const projectionLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 menit
    max: env.projectionRateLimitMax,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      success: false,
      message:
        "Terlalu banyak kalkulasi proyeksi. Tunggu 1 menit sebelum mencoba lagi.",
    },
  });

  app.use(globalLimiter);

  // ── CORS ────────────────────────────────────────────────────────────────────
  app.use(
    cors({
      origin: [env.frontendUrl, env.betterAuthUrl, ...env.trustedOrigins],
      credentials: true,
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    }),
  );

  // Better Auth butuh raw request body, jadi mount sebelum express.json().
  const betterAuthHandler = toNodeHandler(auth);
  const compatibilityAuthPaths = new Set([
    "/api/auth/me",
    "/api/auth/forgot-password",
    "/api/auth/reset-password",
    "/api/auth/resend-verification",
  ]);

  // Use regex pattern instead of wildcard for Express compatibility
  app.all(/^\/api\/auth\/.*/, async (req, res, next) => {
    if (compatibilityAuthPaths.has(req.path)) return next();

    try {
      console.log(`[Better Auth] ${req.method} ${req.path}`);
      return await betterAuthHandler(req, res);
    } catch (error) {
      console.error("[Better Auth] Error:", error);
      return res.status(500).json({ 
        error: "Internal server error", 
        message: error.message,
        path: req.path 
      });
    }
  });

  app.use(express.json({ limit: "1mb" }));

  // Compatibility endpoint untuk respons user yang dinormalisasi.
  app.use("/api/auth", authRouter);

  // ── Health check root ───────────────────────────────────────────────────────
  app.get("/", (req, res) => {
    res.json({
      success: true,
      message: "Selamat! API CUAN SELOR berhasil menyala.",
      status: "Active",
    });
  });

  // Terapkan rate limit ketat khusus untuk projection
  app.use("/api/projection", projectionLimiter);

  // Rate limit untuk AI advisor chat (max 20 req/menit per IP)
  const advisorLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 20,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      success: false,
      message:
        "Terlalu banyak pesan chat. Tunggu sebentar sebelum mengirim lagi.",
    },
  });
  app.use("/api/advisor", advisorLimiter);

  app.use("/api", apiRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
