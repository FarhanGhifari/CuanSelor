"use client";

import { useEffect, useState } from "react";
import type React from "react";
import { useSession } from "@/lib/auth/auth-client";
import { ROUTES } from "@/lib/constants/routes";
import PillCTA from "./PillCTA";

interface AuthAwarePillCTAProps {
  href: string;
  children: React.ReactNode;
  dashboardChildren?: React.ReactNode;
  loadingChildren?: React.ReactNode;
  variant?: "primary" | "ghost";
  style?: React.CSSProperties;
  dark?: boolean;
  className?: string;
}

export default function AuthAwarePillCTA({
  href,
  children,
  dashboardChildren = "Dashboard",
  loadingChildren = "Memeriksa sesi...",
  variant = "primary",
  style,
  dark,
  className,
}: AuthAwarePillCTAProps) {
  const [mounted, setMounted] = useState(false);
  const { data: session, isPending } = useSession();
  const isAuthenticated = Boolean(session?.user);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <PillCTA href={href} variant={variant} style={style} dark={dark} className={className}>
        {children}
      </PillCTA>
    );
  }

  return (
    <PillCTA
      href={isAuthenticated ? ROUTES.DASHBOARD : href}
      variant={variant}
      style={style}
      dark={dark}
      className={className}
    >
      {isPending ? loadingChildren : isAuthenticated ? dashboardChildren : children}
    </PillCTA>
  );
}
