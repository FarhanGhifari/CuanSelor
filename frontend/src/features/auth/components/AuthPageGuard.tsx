"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth/auth-client";
import { ROUTES } from "@/lib/constants/routes";

export function AuthPageGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  useEffect(() => {
    if (isPending || !session?.user) return;
    router.replace(ROUTES.AUTH_CALLBACK);
  }, [isPending, router, session?.user]);

  return <>{children}</>;
}
