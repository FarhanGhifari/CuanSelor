"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { apiClient } from "@/lib/api/axios.config";
import { API } from "@/lib/constants/api-endpoints";
import { ROUTES } from "@/lib/constants/routes";
import { authClient } from "@/lib/auth/auth-client";
import { AuthLoadingScreen } from "@/features/auth/components/AuthLoadingScreen";

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
type BetterAuthSession = typeof authClient.$Infer.Session;

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    let cancelled = false;

    async function redirectAfterAuth() {
      let session: BetterAuthSession | null = null;

      for (let attempt = 0; attempt < 10; attempt += 1) {
        const { data } = await authClient.getSession({
          query: { disableCookieCache: true },
        });

        if (data?.user) {
          session = data;
          break;
        }

        if (attempt < 9) await wait(300);
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

  return <AuthLoadingScreen />;
}
