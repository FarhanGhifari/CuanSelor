import { ROUTES } from "@/lib/constants/routes";
import { API_BASE_URL } from "@/lib/constants/env";
import { buildAuthRedirectUrl } from "./auth-redirect-url";

export function buildVerifyEmailUrl(token: string) {
  const url = new URL("/api/auth/verify-email", API_BASE_URL);
  url.searchParams.set("token", token);
  url.searchParams.set("callbackURL", buildAuthRedirectUrl(ROUTES.ONBOARDING));

  return url.toString();
}
