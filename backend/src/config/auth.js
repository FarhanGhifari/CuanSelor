import { betterAuth } from "better-auth";
import { Pool } from "pg";
import { env, requireEnv } from "./env.js";

requireEnv(["databaseUrl", "betterAuthSecret"]);

const isLocalDatabase =
  env.databaseUrl.includes("localhost") || env.databaseUrl.includes("127.0.0.1");

export const auth = betterAuth({
  appName: "CuanSelor",
  baseURL: env.backendUrl,
  secret: env.betterAuthSecret,
  trustedOrigins: [env.frontendUrl, env.backendUrl, ...env.trustedOrigins],
  database: new Pool({
    connectionString: env.databaseUrl,
    // Gunakan rejectUnauthorized: true di production untuk mencegah MITM attack.
    // Jika error SSL, tambahkan CA cert dari dashboard Supabase ke env PGSSLROOTCERT.
    ssl:
      env.pgSsl === "false" || isLocalDatabase
        ? false
        : { rejectUnauthorized: true },
  }),
  emailAndPassword: {
    enabled: true,
    // CATATAN: Set REQUIRE_EMAIL_VERIFICATION=true di .env production setelah
    // mengkonfigurasi email provider (Resend, Nodemailer, dll) di better-auth.
    // Dokumentasi: https://www.better-auth.com/docs/plugins/email-verification
    requireEmailVerification: env.requireEmailVerification,
  },
  socialProviders:
    env.googleClientId && env.googleClientSecret
      ? {
          google: {
            clientId: env.googleClientId,
            clientSecret: env.googleClientSecret,
          },
        }
      : {},
});
