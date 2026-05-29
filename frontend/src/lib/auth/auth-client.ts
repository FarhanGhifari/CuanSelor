import { createAuthClient } from "better-auth/react";

const authBaseURL =
    process.env.NEXT_PUBLIC_APP_URL ??
    "http://localhost:3000";

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
