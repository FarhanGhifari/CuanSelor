import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: resolve(__dirname, "../../.env") });

const parseList = (value) =>
  value
    ?.split(",")
    .map((item) => item.trim())
    .filter(Boolean) || [];

const port = Number(process.env.PORT || 8000);
const frontendUrl =
  process.env.FRONTEND_URL ||
  process.env.NEXT_PUBLIC_APP_URL ||
  process.env.NEXT_APP_URL ||
  "http://localhost:3000";
const backendUrl =
  process.env.BACKEND_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  `http://localhost:${port}`;
const betterAuthUrl =
  process.env.BETTER_AUTH_URL ||
  backendUrl;

export const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port,
  frontendUrl,
  backendUrl,
  betterAuthUrl,
  trustedOrigins: parseList(process.env.TRUSTED_ORIGINS),
  betterAuthSecret: process.env.BETTER_AUTH_SECRET,
  supabaseUrl: process.env.SUPABASE_URL,
  supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
  databaseUrl: process.env.SUPABASE_DB_URL || process.env.DATABASE_URL,
  pgSsl: process.env.PGSSL,
  googleClientId: process.env.GOOGLE_CLIENT_ID,
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
  pythonCommand: process.env.PYTHON_COMMAND || "python",
  projectionTimeoutMs: Number(process.env.PROJECTION_TIMEOUT_MS || 120000),
  projectionServiceUrl:
    process.env.PROJECTION_SERVICE_URL || "http://127.0.0.1:8001",
  aiServiceUrl: process.env.AI_SERVICE_URL || "http://127.0.0.1:8001",
  aiServiceTimeoutMs: Number(process.env.AI_SERVICE_TIMEOUT_MS || 15000),
  geminiApiKey: process.env.GEMINI_API_KEY,
  // Rate limiting
  rateLimitWindowMs: Number(process.env.RATE_LIMIT_WINDOW_MS || 15 * 60 * 1000),
  rateLimitMax: Number(process.env.RATE_LIMIT_MAX || 100),
  projectionRateLimitMax: Number(process.env.PROJECTION_RATE_LIMIT_MAX || 10),
  // Email verification - set ke true di production setelah konfigurasi email provider
  requireEmailVerification: process.env.REQUIRE_EMAIL_VERIFICATION === "true",
  // Email provider configuration (Gmail SMTP only)
  gmailUser: process.env.GMAIL_USER,
  gmailAppPassword: process.env.GMAIL_APP_PASSWORD,
  emailFromName: process.env.EMAIL_FROM_NAME || "CuanSelor",
};

export function requireEnv(keys) {
  const missing = keys.filter((key) => !env[key]);

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(", ")}`,
    );
  }
}
