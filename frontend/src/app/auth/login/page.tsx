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
                <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-8 pt-20 lg:pt-8 relative">
                    <div className="w-full max-w-lg">
                        <div className="mb-4 text-center">
                            <h2 className="text-[2.8rem] font-bold text-[#111827] tracking-tight mb-2">Selamat Datang!</h2>
                            <p className="text-[#6B7280] text-[1.1rem]">Masuk untuk melanjutkan ke dashboard kamu</p>
                        </div>
                        
                        <Suspense fallback={<AuthLoadingScreen />}>
                            <LoginForm />
                        </Suspense>
                        
                        <p className="text-center text-sm text-[#6B7280] mt-4">
                            Dengan masuk, kamu menyetujui <Link href="/terms" className="text-[#10B981] hover:underline font-medium">Ketentuan Layanan</Link> dan <Link href="/privacy" className="text-[#10B981] hover:underline font-medium">Kebijakan Privasi</Link> kami
                        </p>
                    </div>
                </div>
            </div>
        </AuthPageGuard>
    )
}

