"use client";

import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth/auth-client";
import { apiClient } from "@/lib/api/axios.config";
import { API } from "@/lib/constants/api-endpoints";
import { ROUTES } from "@/lib/constants/routes";

export default function AuthCallbackPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  useEffect(() => {
    if (isPending) return;

    if (!session?.user) {
      router.replace(ROUTES.LOGIN);
      return;
    }

    let cancelled = false;

    async function redirectAfterAuth() {
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
  }, [isPending, router, session?.user]);

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-white px-6">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center">
          <Loader2 className="w-7 h-7 animate-spin text-[#10B981]" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900">Menyiapkan sesi...</h1>
          <p className="mt-1 text-sm text-gray-500">
            Mohon tunggu sebentar.
          </p>
        </div>
      </div>
    </div>
  );
}
