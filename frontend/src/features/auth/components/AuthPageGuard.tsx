"use client";

/* eslint-disable @next/next/no-img-element */

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authClient, useSession } from "@/lib/auth/auth-client";
import { ROUTES } from "@/lib/constants/routes";
import { AuthLoadingScreen } from "@/features/auth/components/AuthLoadingScreen";

export function AuthPageGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [isVerifying, setIsVerifying] = useState(true);

  useEffect(() => {
    if (isPending) return;

    let cancelled = false;

    async function verifySession() {
      if (session?.user) {
        router.replace(ROUTES.AUTH_CALLBACK);
        return;
      }

      const { data } = await authClient.getSession({
        query: { disableCookieCache: true },
      });

      if (cancelled) return;

      if (data?.user) {
        router.replace(ROUTES.AUTH_CALLBACK);
        return;
      }

      setIsVerifying(false);
    }

    verifySession();

    return () => {
      cancelled = true;
    };
  }, [isPending, router, session?.user]);

  if (isPending || isVerifying || session?.user) {
    return <AuthLoadingScreen />;
  }

  return <>{children}</>;
}
