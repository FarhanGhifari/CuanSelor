import { betterAuth } from "better-auth";
import { Pool } from "pg";
import { env, requireEnv } from "./env.js";
import { sendVerificationEmail, sendResetPasswordEmail } from "../utils/email.js";

requireEnv(["databaseUrl", "betterAuthSecret"]);

const isLocalDatabase =
  env.databaseUrl.includes("localhost") || env.databaseUrl.includes("127.0.0.1");

const trustedOrigins = Array.from(
  new Set(
    [env.frontendUrl, env.backendUrl, env.betterAuthUrl, ...env.trustedOrigins].filter(
      Boolean,
    ),
  ),
);

export const auth = betterAuth({
  appName: "CuanSelor",
  baseURL: env.betterAuthUrl,
  secret: env.betterAuthSecret,
  trustedOrigins,
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
    requireEmailVerification: env.requireEmailVerification,
    sendResetPassword: async ({ user, token }) => {
      // Create custom URL that points to frontend
      const frontendResetUrl = `${env.frontendUrl}/auth/reset-password?token=${token}`;

      try {
        await sendResetPasswordEmail({ user, url: frontendResetUrl });
      } catch (error) {
        console.error(`[Better Auth] ERROR sending reset password email:`, error);
        throw error;
      }
    },
  },
  emailVerification: {
    sendOnSignUp: true, // Selalu kirim email saat sign up
    autoSignInAfterVerification: true, // Auto sign-in setelah verifikasi email
    expiresIn: 60 * 60 * 24, // 24 jam
    sendVerificationEmail: async ({ user, token }) => {
      // Create custom URL that points to frontend
      // Frontend will call Better Auth API to verify
      const frontendVerifyUrl = `${env.frontendUrl}/auth/verify-email?token=${token}`;

      try {
        await sendVerificationEmail({ user, url: frontendVerifyUrl });
      } catch (error) {
        console.error(`[Better Auth] ERROR sending verification email:`, error);
        throw error;
      }
    },
  },
  account: {
    accountLinking: {
      enabled: true,
      trustedProviders: ["google"],
      // Google OAuth gives verified ownership for the email address, so an
      // existing email/password user can sign in with Google without hitting
      // account_not_linked.
      requireLocalEmailVerified: false,
      updateUserInfoOnLink: true,
    },
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
