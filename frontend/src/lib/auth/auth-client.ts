import { createAuthClient } from "better-auth/react";

const authBaseURL =
    process.env.NEXT_PUBLIC_AUTH_URL ??
    process.env.NEXT_PUBLIC_API_URL ??
    "http://localhost:8000";

export const authClient = createAuthClient({
    baseURL: authBaseURL,
    disableCache: false,
});

export const {
  signIn,
  signOut,
  signUp,
  useSession,
} = authClient;
