import { createAuthClient } from "better-auth/react";
import { API_BASE_URL } from "@/lib/constants/env";

// Auth API berjalan di backend; cookie session harus satu domain dengan apiClient.
export const authClient = createAuthClient({
  baseURL: API_BASE_URL,
  disableCache: false,
});
export const {
  signIn,
  signOut,
  signUp,
  useSession,
} = authClient;
