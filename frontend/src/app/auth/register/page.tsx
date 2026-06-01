"use client";

/* eslint-disable @next/next/no-img-element */

import { useState, useCallback, Suspense } from "react";
import { useRouter } from "next/navigation";
import { RegisterForm } from "@/features/auth/components/RegisterForm";
import { useRegister } from "@/features/auth/hooks/useAuth";
import type { PersonalInfoInput } from "@/features/auth/validations/auth.schema";
import Link from "next/link";
import { AuthPageGuard } from "@/features/auth/components/AuthPageGuard";
import { AuthLoadingScreen } from "@/features/auth/components/AuthLoadingScreen";
import { authClient } from "@/lib/auth/auth-client";
import { ROUTES } from "@/lib/constants/routes";
import { buildAuthRedirectUrl } from "@/features/auth/utils/auth-redirect-url";

type RegisterStep = "form" | "loading";

export default function RegisterPage() {
    const router = useRouter();
    const { register, error } = useRegister();
    const [step, setStep] = useState<RegisterStep>("form");

    // ── Manual sign-up handler ──
    const handleRegister = async (data: PersonalInfoInput) => {
        setStep("loading");

        const ok = await register(data);
        if (ok) {
            // Langsung redirect ke waiting verification page
            router.push(ROUTES.VERIFY_EMAIL);
        } else {
            setStep("form");
        }
    };

    // ── Google sign-up handler ──
    const handleGoogleSignUp = useCallback(async () => {
        setStep("loading");

        try {
            const result = await authClient.signIn.social({
                provider: "google",
                callbackURL: buildAuthRedirectUrl(ROUTES.AUTH_CALLBACK),
                newUserCallbackURL: buildAuthRedirectUrl(ROUTES.AUTH_CALLBACK),
                errorCallbackURL: buildAuthRedirectUrl(ROUTES.REGISTER),
            });

            if (result.error) {
                setStep("form");
            }
            // If no error, the browser will redirect via OAuth flow.
            // The loading screen stays visible until redirect happens.
        } catch {
            setStep("form");
        }
    }, []);

    if (step === "loading") {
        return <AuthLoadingScreen message="Mendaftarkan akun..." />;
    }

    return (
        <AuthPageGuard>
            <>
                <div className="h-screen w-full flex bg-white relative overflow-hidden">
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
                                src="/illustration-register.svg"
                                alt="Success Illustration"
                                className="w-full max-w-sm h-auto drop-shadow-lg"
                            />
                            <div className="mt-8 text-center max-w-sm">
                                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                                    Mulai Perjalanan Finansialmu
                                </h2>
                                <p className="text-gray-600 text-sm leading-relaxed">
                                    Daftar sekarang dan dapatkan proyeksi pensiun personal berbasis data aktuaria Indonesia.
                                </p>
                            </div>
                        </div>
                        {/* Decorative circles */}
                        <div className="absolute top-10 left-10 w-40 h-40 rounded-full bg-emerald-200/30 blur-2xl"></div>
                        <div className="absolute bottom-20 right-10 w-60 h-60 rounded-full bg-teal-200/20 blur-3xl"></div>
                    </div>

                    {/* Right Side - Form */}
                    <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-8 pt-20 lg:pt-8 relative">
                        <div className="w-full max-w-lg">
                            <div className="mb-4 text-center">
                                <h2 className="text-[2.8rem] font-bold text-[#111827] tracking-tight mb-2">Buat Akun</h2>
                                <p className="text-[#6B7280] text-[1.1rem]">Isi data diri kamu untuk memulai</p>
                            </div>

                            <Suspense fallback={<AuthLoadingScreen />}>
                                <RegisterForm
                                    onSubmit={handleRegister}
                                    onGoogleSignUp={handleGoogleSignUp}
                                    isLoading={false}
                                />
                            </Suspense>

                            <p className="text-center text-sm text-[#6B7280] mt-4">
                                Dengan mendaftar, kamu menyetujui <Link href="/terms" className="text-[#10B981] hover:underline font-medium">Ketentuan Layanan</Link> dan <Link href="/privacy" className="text-[#10B981] hover:underline font-medium">Kebijakan Privasi</Link> kami
                            </p>
                        </div>
                    </div>
                </div>

                {error && (
                    <div className="fixed bottom-6 left-1/2 z-40 w-full max-w-md -translate-x-1/2 px-4">
                        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 shadow">
                            {error}
                        </div>
                    </div>
                )}
            </>
        </AuthPageGuard>
    );
}
