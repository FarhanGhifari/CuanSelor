"use client";

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
}

export default function AuthAwarePillCTA({
  href,
  children,
  dashboardChildren = "Dashboard",
  loadingChildren = "Memeriksa sesi...",
  variant = "primary",
  style,
  dark,
}: AuthAwarePillCTAProps) {
  const { data: session, isPending } = useSession();
  const isAuthenticated = Boolean(session?.user);

  return (
    <PillCTA
      href={isAuthenticated ? ROUTES.DASHBOARD : href}
      variant={variant}
      style={style}
      dark={dark}
    >
      {isPending ? loadingChildren : isAuthenticated ? dashboardChildren : children}
    </PillCTA>
  );
}
