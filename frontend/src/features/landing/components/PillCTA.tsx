"use client";

import Link from "next/link";
import React from "react";
import { FONT } from "./tokens";

interface PillCTAProps {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "ghost";
  style?: React.CSSProperties;
  dark?: boolean;
}

/**
 * Premium pill-shaped CTA button - dark-first design with shimmer hover.
 */
export default function PillCTA({
  href,
  children,
  variant = "primary",
  style,
  dark,
}: PillCTAProps) {
  const isPrimary = variant === "primary";

  return (
    <Link
      href={href}
      className={`cta-shimmer transition-all duration-300 ease-out group ${
        isPrimary
          ? "hover:shadow-[0_12px_32px_rgba(16,185,129,0.50)] hover:-translate-y-0.5 hover:scale-[1.03]"
          : "hover:bg-black/5 hover:-translate-y-0.5 hover:scale-[1.03]"
      }`}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        padding: "14px 28px",
        borderRadius: 50,
        fontSize: 15,
        fontWeight: 600,
        fontFamily: FONT,
        letterSpacing: "-0.01em",
        lineHeight: 1.2,
        textDecoration: "none",
        cursor: "pointer",
        boxSizing: "border-box",
        background: isPrimary
          ? "linear-gradient(135deg, #10B981 0%, #14B8A6 100%)"
          : "rgba(15,23,42,0.03)",
        color: isPrimary ? "#ffffff" : "#0F172A",
        border: isPrimary
          ? "1px solid rgba(16,185,129,0.3)"
          : "1px solid rgba(15,23,42,0.08)",
        boxShadow: isPrimary
          ? "0 4px 20px rgba(16,185,129,0.25)"
          : "none",
        ...style,
      }}
    >
      {children}
    </Link>
  );
}
