"use client";

/* eslint-disable @next/next/no-img-element */

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { apiClient } from "@/lib/api/axios.config";
import { API } from "@/lib/constants/api-endpoints";
import { ROUTES } from "@/lib/constants/routes";
import { authClient } from "@/lib/auth/auth-client";

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
type BetterAuthSession = typeof authClient.$Infer.Session;

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    let cancelled = false;

    async function redirectAfterAuth() {
      let session: BetterAuthSession | null = null;

      for (let attempt = 0; attempt < 6; attempt += 1) {
        const { data } = await authClient.getSession({
          query: { disableCookieCache: true },
        });

        if (data?.user) {
          session = data;
          break;
        }

        if (attempt < 5) await wait(250);
      }

      if (cancelled) return;

      if (!session?.user) {
        router.replace(ROUTES.LOGIN);
        return;
      }

      try {
        const statusRes = await apiClient.get(API.ONBOARDING.STATUS);
        const status = statusRes.data?.data ?? statusRes.data;

        if (cancelled) return;

        router.replace(
          status.isFullyOnboarded ? ROUTES.DASHBOARD : ROUTES.ONBOARDING,
        );
      } catch {
        if (!cancelled) router.replace(ROUTES.ONBOARDING);
      }
    }

    redirectAfterAuth();

    return () => {
      cancelled = true;
    };
  }, [router]);

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-white px-6">
      <div className="animate-bounce-gentle">
        <img
          src="/projection-illustration.svg"
          alt="Loading..."
          className="w-48 h-48 md:w-56 md:h-56 drop-shadow-lg"
        />
      </div>
      <p className="mt-8 text-lg font-semibold text-gray-700 animate-pulse">
        Memuat...
      </p>
    </div>
  );
}
