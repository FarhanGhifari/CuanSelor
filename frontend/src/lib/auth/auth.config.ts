import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";

export const auth = betterAuth({
    baseURL: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
    secret: process.env.BETTER_AUTH_SECRET!,

    emailAndPassword: {
        enabled: false,
        requireEmailVerification: false,
    },

    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        },
    },

    plugins: [nextCookies()],
});

// Type helper — dipakai di seluruh app
export type Session = typeof auth.$Infer.Session;
export type User    = typeof auth.$Infer.Session.user;