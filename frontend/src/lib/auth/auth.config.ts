import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { Pool } from "pg";

const databaseUrl = process.env.SUPABASE_DB_URL || process.env.DATABASE_URL;

if (!databaseUrl) {
    throw new Error("Missing SUPABASE_DB_URL or DATABASE_URL for Better Auth");
}

const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;

export const auth = betterAuth({
    baseURL: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
    secret: process.env.BETTER_AUTH_SECRET!,
    database: new Pool({
        connectionString: databaseUrl,
    }),

    emailAndPassword: {
        enabled: true,
        requireEmailVerification: false,
    },

    socialProviders: googleClientId && googleClientSecret
        ? {
            google: {
                clientId: googleClientId,
                clientSecret: googleClientSecret,
            },
        }
        : {},

    plugins: [nextCookies()],
});

// Type helper — dipakai di seluruh app
export type Session = typeof auth.$Infer.Session;
export type User    = typeof auth.$Infer.Session.user;