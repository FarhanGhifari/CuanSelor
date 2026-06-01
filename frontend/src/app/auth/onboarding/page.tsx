"use client";

/* eslint-disable @next/next/no-img-element */

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth/auth-client";
import { ROUTES } from "@/lib/constants/routes";
import { OnboardingWizard } from "@/features/financial-profile/components/OnBoardingWizard";
import { useOnboarding } from "@/features/financial-profile/hooks/useOnboarding";
import { AuthLoadingScreen } from "@/features/auth/components/AuthLoadingScreen";
import { X } from "lucide-react";

export default function OnboardingPage() {
  const router = useRouter();
  const { submit, isPending: isSubmitPending, error } = useOnboarding();
  const { data: session, isPending: isSessionPending } = useSession();
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
    if (!session?.user) {
      router.replace(ROUTES.REGISTER);
    }
  }, [isSessionPending, router, session?.user]);

  useEffect(() => {
    const timer = setTimeout(() => {
      triggerClose();
    }, 3700);
    return () => clearTimeout(timer);
  }, []);

  if (isSessionPending) {
    return <AuthLoadingScreen />;
  }

  if (!session?.user) {
    return null;
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
            src="/CuanSelor.png"
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
