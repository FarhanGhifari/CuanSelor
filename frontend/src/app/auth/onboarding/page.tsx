"use client";

import Link from "next/link";
import { TrendingUp } from "lucide-react";
import { OnboardingWizard } from "@/features/financial-profile/components/OnBoardingWizard";
import { useOnboarding } from "@/features/financial-profile/hooks/useOnboarding";
import { ROUTES } from "@/lib/constants/routes";

export default function OnboardingPage() {
  const { submit, isPending, error } = useOnboarding();

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(160deg, #f0f7ff 0%, #fafafa 60%, #f5f5f7 100%)" }}>

      {/* Minimal sticky header */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b px-6 py-3.5" style={{ borderColor: "#e0e0e0" }}>
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105"
              style={{ background: "linear-gradient(135deg, #0066cc, #0091ff)" }}
            >
              <TrendingUp className="w-4 h-4 text-white" />
            </div>
            <span className="text-base font-bold text-gray-900">CuanSelor</span>
          </Link>
          <Link
            href={ROUTES.DASHBOARD}
            className="text-sm font-medium transition-colors hover:text-gray-900"
            style={{ color: "#6e6e73" }}
          >
            Lewati →
          </Link>
        </div>
      </header>

      {/* Welcome hero */}
      <div className="max-w-lg mx-auto px-6 pt-10 pb-6 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold mb-5"
          style={{ background: "rgba(0,102,204,0.08)", color: "#0066cc" }}>
          🎉 Selamat bergabung!
        </div>
        <h1 className="text-3xl font-extrabold leading-tight mb-3" style={{ color: "#1d1d1f", letterSpacing: "-0.5px" }}>
          Mari kenali kondisi<br />finansialmu
        </h1>
        <p className="text-base" style={{ color: "#6e6e73" }}>
          Hanya 11 pertanyaan singkat — satu per satu,
          <br className="hidden sm:block" /> tidak lebih dari <strong style={{ color: "#1d1d1f" }}>3 menit</strong>.
        </p>
      </div>

      {/* Wizard */}
      <div className="px-4 pb-20">
        <OnboardingWizard
          onComplete={submit}
          isPending={isPending}
          error={error}
        />
      </div>
    </div>
  );
}