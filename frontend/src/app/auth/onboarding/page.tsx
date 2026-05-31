"use client";

/* eslint-disable @next/next/no-img-element */

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient, useSession } from "@/lib/auth/auth-client";
import { ROUTES } from "@/lib/constants/routes";
import { OnboardingWizard } from "@/features/financial-profile/components/OnBoardingWizard";
import { useOnboarding } from "@/features/financial-profile/hooks/useOnboarding";
import { X } from "lucide-react";

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
type BetterAuthSession = typeof authClient.$Infer.Session;

export default function OnboardingPage() {
  const router = useRouter();
  const { submit, isPending: isSubmitPending, error } = useOnboarding();
  const { data: session, isPending: isSessionPending, refetch } = useSession();
  const [isVerifying, setIsVerifying] = useState(true);
  const [showWelcome, setShowWelcome] = useState(true);
  const [isExiting, setIsExiting] = useState(false);

  const triggerClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      setShowWelcome(false);
    }, 300);
  };

  useEffect(() => {
    if (isSessionPending) return;

    let cancelled = false;
    const timeout = window.setTimeout(async () => {
      let verifiedSession: BetterAuthSession | null = null;

      for (let attempt = 0; attempt < 4; attempt += 1) {
        const { data } = await authClient.getSession({
          query: { disableCookieCache: true },
        });

        if (data?.user) {
          verifiedSession = data;
          break;
        }

        if (attempt < 3) await wait(250);
      }

      if (cancelled) return;

      if (verifiedSession?.user) {
        await refetch({ query: { disableCookieCache: true } });
        setIsVerifying(false);
        return;
      }

      router.replace(ROUTES.REGISTER);
    }, 300);

    return () => {
      cancelled = true;
      window.clearTimeout(timeout);
    };
  }, [isSessionPending, refetch, router, session?.user]);

  useEffect(() => {
    const timer = setTimeout(() => {
      triggerClose();
    }, 3700);
    return () => clearTimeout(timer);
  }, []);

  if (isSessionPending || isVerifying || !session?.user) {
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

  return (
    <div className="h-screen w-full flex bg-white relative overflow-hidden">
      {showWelcome && (
        <div
          className={`fixed top-6 left-1/2 z-60 w-full max-w-md -translate-x-1/2 px-4 transition-all duration-300 ${
            isExiting ? "opacity-0 -translate-y-2 pointer-events-none" : "opacity-100 translate-y-0"
          }`}
        >
          <div className="rounded-xl border border-gray-100 bg-white pl-4 pr-3 py-3.5 flex items-center justify-between gap-3 text-gray-800 shadow-[0_12px_40px_rgba(0,0,0,0.08)]">
            <div className="flex items-center gap-3">
              <span className="text-base shrink-0">🎉</span>
              <p className="text-sm font-semibold text-gray-900">Selamat bergabung!</p>
            </div>
            <button
              type="button"
              onClick={triggerClose}
              className="p-1 hover:bg-gray-50 rounded-lg transition-colors text-gray-400 hover:text-gray-600 shrink-0"
              aria-label="Tutup"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
          100% { transform: translateY(0px); }
        }
        .animate-float-onboarding {
          animation: float 6s ease-in-out infinite;
        }
      `}} />

      {/* Absolute Logo */}
      <div className="absolute top-6 left-6 lg:left-8 z-50">
        <Link href="/" className="flex items-center relative h-12 w-48 overflow-hidden">
          <img
            src="/logo.png"
            alt="CuanSelor Logo"
            className="absolute left-0 top-1/2 -translate-y-1/2 h-24 w-auto object-cover max-w-none"
          />
        </Link>
      </div>


      <div className="hidden lg:flex w-1/2 flex-col items-center justify-center min-h-screen sticky top-0 overflow-hidden"
           style={{ background: 'linear-gradient(160deg, #f0fdf9 0%, #e0f7f0 40%, #d1fae5 100%)' }}>
        <div className="relative z-10 flex flex-col items-center px-12">
          <img
            src="/illustration-onboarding.svg"
            alt="Task Management Illustration"
            className="w-full max-w-md h-auto drop-shadow-lg animate-float-onboarding"
            style={{ transform: "translateZ(0)", willChange: "transform" }}
          />
          <div className="mt-8 text-center max-w-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Sedikit lagi, kamu makin siap!
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              Lengkapi data singkat ini agar rekomendasi finansialmu lebih tepat dan personal.
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Wizard */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-8 pt-24 lg:pt-8 relative h-screen overflow-hidden bg-white">
        <div className="w-full max-w-lg flex flex-col justify-center h-full max-h-[85vh]">
          {/* Welcome hero */}
          <div className="text-center mb-6 shrink-0">
            <h1 className="text-[1.25rem] sm:text-[1.8rem] lg:text-[2.3rem] font-bold text-[#111827] tracking-tight mb-2 whitespace-nowrap">
              Mari kenali kondisi finansialmu
            </h1>
         
          </div>

          <div className="w-full flex flex-col">
            <OnboardingWizard
              onComplete={submit}
              isPending={isSubmitPending}
              error={error}
              initialName={session?.user?.name || ""}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
