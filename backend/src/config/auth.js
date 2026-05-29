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
    sendResetPassword: async ({ user, url, token }) => {
      console.log(`[Better Auth] ========================================`);
      console.log(`[Better Auth] PASSWORD RESET TRIGGERED`);
      console.log(`[Better Auth] User: ${user.email}`);
      console.log(`[Better Auth] Original URL: ${url}`);
      console.log(`[Better Auth] Token: ${token}`);
      
      // Create custom URL that points to frontend
      const frontendResetUrl = `${env.frontendUrl}/auth/reset-password?token=${token}`;
      console.log(`[Better Auth] Frontend URL: ${frontendResetUrl}`);
      
      try {
        const result = await sendResetPasswordEmail({ user, url: frontendResetUrl });
        console.log(`[Better Auth] Email send result:`, result);
        console.log(`[Better Auth] ========================================`);
      } catch (error) {
        console.error(`[Better Auth] ERROR sending reset password email:`, error);
        console.log(`[Better Auth] ========================================`);
        throw error;
      }
    },
  },
  emailVerification: {
    sendOnSignUp: true, // Selalu kirim email saat sign up
    autoSignInAfterVerification: false, // Jangan auto sign-in, biar user manual login
    expiresIn: 60 * 60 * 24, // 24 jam
    sendVerificationEmail: async ({ user, url, token }) => {
      console.log(`[Better Auth] ========================================`);
      console.log(`[Better Auth] EMAIL VERIFICATION TRIGGERED`);
      console.log(`[Better Auth] User: ${user.email}`);
      console.log(`[Better Auth] User ID: ${user.id}`);
      console.log(`[Better Auth] Original URL: ${url}`);
      console.log(`[Better Auth] Token: ${token}`);
      
      // Create custom URL that points to frontend
      // Frontend will call Better Auth API to verify
      const frontendVerifyUrl = `${env.frontendUrl}/auth/verify-email?token=${token}`;
      console.log(`[Better Auth] Frontend URL: ${frontendVerifyUrl}`);
      
      try {
        const result = await sendVerificationEmail({ user, url: frontendVerifyUrl });
        console.log(`[Better Auth] Email send result:`, result);
        console.log(`[Better Auth] ========================================`);
      } catch (error) {
        console.error(`[Better Auth] ERROR sending verification email:`, error);
        console.log(`[Better Auth] ========================================`);
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
