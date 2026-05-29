"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { authClient, useSession } from "@/lib/auth/auth-client";
import { ROUTES } from "@/lib/constants/routes";

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
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-white px-6">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center">
            <Loader2 className="w-7 h-7 animate-spin text-[#10B981]" />
          </div>
          <p className="text-sm font-medium text-gray-500">Memeriksa sesi...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
