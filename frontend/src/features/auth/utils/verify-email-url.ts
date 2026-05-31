import { ROUTES } from "@/lib/constants/routes";
import { API_BASE_URL, APP_BASE_URL } from "@/lib/constants/env";

export function buildVerifyEmailUrl(token: string) {
  const appUrl =
    typeof window !== "undefined" ? window.location.origin : APP_BASE_URL;
  const callbackURL = `${appUrl}${ROUTES.AUTH_CALLBACK}`;

  const url = new URL("/api/auth/verify-email", API_BASE_URL);
  url.searchParams.set("token", token);
  url.searchParams.set("callbackURL", callbackURL);

  return url.toString();
}
