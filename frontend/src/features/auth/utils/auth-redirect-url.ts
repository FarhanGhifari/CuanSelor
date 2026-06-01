import { APP_BASE_URL } from "@/lib/constants/env";

const trimTrailingSlash = (url: string) => url.replace(/\/+$/, "");

export function getAppOrigin() {
  if (typeof window !== "undefined") {
    return window.location.origin;
  }

  return trimTrailingSlash(APP_BASE_URL);
}

export function buildAuthRedirectUrl(path: string) {
  return new URL(path, `${getAppOrigin()}/`).toString();
}
