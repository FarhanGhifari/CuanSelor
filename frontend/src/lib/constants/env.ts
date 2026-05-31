const PRODUCTION_API_URL = "https://cuanselor-backend.up.railway.app";

/**
 * URL backend. Di production/hosting, set NEXT_PUBLIC_API_URL.
 * Fallback localhost hanya untuk development lokal tanpa .env.
 */
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ??
  (process.env.NODE_ENV === "production"
    ? PRODUCTION_API_URL
    : "http://localhost:8000");

/**
 * URL frontend. Di production/hosting, set NEXT_PUBLIC_APP_URL.
 */
export const APP_BASE_URL =
  process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
