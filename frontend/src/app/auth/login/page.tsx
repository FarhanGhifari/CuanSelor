/* eslint-disable @next/next/no-img-element */

import type { Metadata } from "next";
import { Suspense } from "react";
import LoginForm from '@/features/auth/components/LoginForm';
import Link from "next/link";
import { AuthPageGuard } from "@/features/auth/components/AuthPageGuard";
import { AuthLoadingScreen } from "@/features/auth/components/AuthLoadingScreen";

export const metadata: Metadata = {
    title: 'Login - CuanSelor',
    description: "Log in to your CuanSelor account",
}

export default function LoginPage() {
    return (
        <AuthPageGuard>
        <div className="h-screen w-full flex bg-white relative overflow-hidden">
            {/* Absolute Logo */}
            <div className="absolute top-4 left-4 lg:top-6 lg:left-8 z-50">
                <Link href="/" className="flex items-center">
                    <img
                        src="/CuanSelor.png"
                        alt="CuanSelor Logo"
                        className="h-8 sm:h-10 lg:h-12 w-auto object-contain"
                    />
                </Link>
            </div>

                {/* Left Side - Illustration */}
                <div className="hidden lg:flex w-1/2 relative flex-col items-center justify-center overflow-hidden"
                     style={{ background: 'linear-gradient(160deg, #f0fdf9 0%, #e0f7f0 40%, #d1fae5 100%)' }}>
                    <div className="relative z-10 flex flex-col items-center px-12">
                        <img
                            src="/illustration-login.svg"
                            alt="Financial Analysis Illustration"
                            className="w-full max-w-md h-auto drop-shadow-lg"
                        />
                        <div className="mt-8 text-center max-w-md">
                            <h2 className="text-2xl font-bold text-gray-800 mb-2">
                                Pantau Keuanganmu dengan Mudah
                            </h2>
                            <p className="text-gray-600 text-sm leading-relaxed">
                                Analisis data finansial, proyeksi pensiun, dan rekomendasi personal semua dalam satu platform.
                            </p>
                        </div>
                    </div>
                    {/* Decorative circles */}
                    <div className="absolute top-10 right-10 w-40 h-40 rounded-full bg-emerald-200/30 blur-2xl"></div>
                    <div className="absolute bottom-20 left-10 w-60 h-60 rounded-full bg-teal-200/20 blur-3xl"></div>
                </div>

                {/* Right Side - Form */}
                <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 pt-16 sm:pt-20 lg:pt-8 relative">
                    <div className="w-full max-w-lg px-2">
                        <div className="mb-4 sm:mb-6 text-center">
                            <h2 className="text-2xl sm:text-3xl lg:text-[2.8rem] font-bold text-[#111827] tracking-tight mb-2">Selamat Datang!</h2>
                            <p className="text-[#6B7280] text-sm sm:text-base lg:text-[1.1rem]">Masuk untuk melanjutkan ke dashboard kamu</p>
                        </div>
                        
                        <Suspense fallback={<AuthLoadingScreen />}>
                            <LoginForm />
                        </Suspense>
                        
                        <p className="text-center text-xs sm:text-sm text-[#6B7280] mt-4">
                            Dengan masuk, kamu menyetujui <Link href="/terms" className="text-[#10B981] hover:underline font-medium">Ketentuan Layanan</Link> dan <Link href="/privacy" className="text-[#10B981] hover:underline font-medium">Kebijakan Privasi</Link> kami
                        </p>
                    </div>
                </div>
            </div>
        </AuthPageGuard>
    )
}

