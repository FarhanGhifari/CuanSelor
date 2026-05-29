"use client";

import Link from "next/link";
import { OnboardingWizard } from "@/features/financial-profile/components/OnBoardingWizard";
import { useOnboarding } from "@/features/financial-profile/hooks/useOnboarding";

export default function OnboardingPage() {
  const { submit, isPending, error } = useOnboarding();

  return (
    <div className="h-screen w-full flex bg-white relative overflow-hidden">
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


      {/* Left Side - Illustration */}
      <div className="hidden lg:flex w-1/2 relative flex-col items-center justify-center overflow-hidden"
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
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-start px-6 pt-10 pb-6 lg:pt-8 lg:pb-6 h-screen overflow-hidden relative">
        <div className="w-full max-w-md origin-top scale-[0.96]">
          {/* Welcome hero */}
          <div className="text-center mb-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold mb-2 bg-emerald-50 text-emerald-600 border border-emerald-100">
              🎉 Selamat bergabung!
            </div>
            <h1 className="text-[1.95rem] lg:text-[2.1rem] font-extrabold leading-tight text-gray-900 tracking-tight mb-1.5 whitespace-nowrap">
              Mari kenali kondisi finansialmu
            </h1>
            <p className="text-gray-500 text-sm max-w-sm mx-auto">
              Hanya 11 pertanyaan singkat satu per satu,
              tidak lebih dari <strong className="text-gray-900 font-semibold">3 menit</strong>.
            </p>
          </div>

          <OnboardingWizard
            onComplete={submit}
            isPending={isPending}
            error={error}
          />
        </div>
      </div>
    </div>
  );
}
