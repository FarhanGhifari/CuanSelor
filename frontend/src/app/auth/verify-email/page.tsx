"use client";

/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/no-unescaped-entities */

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ROUTES } from "@/lib/constants/routes";
import { apiClient } from "@/lib/api/axios.config";
import { AuthLoadingScreen } from "@/features/auth/components/AuthLoadingScreen";
import { buildVerifyEmailUrl } from "@/features/auth/utils/verify-email-url";

function VerifyEmailContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [error, setError] = useState<string | null>(null);
    const [resendLoading, setResendLoading] = useState(false);
    const [resendMessage, setResendMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
    const token = searchParams.get("token");

    useEffect(() => {
        if (!token) {
            return;
        }

        window.location.replace(buildVerifyEmailUrl(token));
    }, [token]);

    const handleResendEmail = async () => {
        setResendLoading(true);
        setResendMessage(null);

        try {
            const registeredEmail = localStorage.getItem("registered_email") || "al.ghifarifarhan2503@gmail.com";

            const response = await apiClient.post("/api/auth/resend-verification", {
                email: registeredEmail,
            });

            if (response.data?.success) {
                setResendMessage({
                    type: "success",
                    text: "Link verifikasi baru berhasil dikirim ke email kamu!",
                });
            } else {
                throw new Error();
            }
        } catch (err: any) {
            console.error("Gagal mengirim ulang email:", err);
            setResendMessage({
                type: "error",
                text: err.response?.data?.message || "Gagal mengirim ulang email. Coba beberapa saat lagi.",
            });
        } finally {
            setResendLoading(false);
        }
    };

    if (error) {
        return (
            <div className="min-h-screen w-full flex items-center justify-center bg-linear-to-br from-emerald-50 via-teal-50 to-cyan-50 relative">
                <div className="absolute top-6 left-6 lg:left-8 z-50">
                    <button 
                        onClick={() => router.push("/")}
                        className="flex items-center relative h-12 w-48 overflow-hidden bg-transparent border-none cursor-pointer outline-none"
                    >
                        <img
                            src="/logo.png"
                            alt="CuanSelor Logo"
                            className="absolute left-0 top-1/2 -translate-y-1/2 h-24 w-auto object-cover max-w-none"
                        />
                    </button>
                </div>

                <div className="max-w-md w-full mx-4">
                    <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 text-center">
                        <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-6">
                            <svg className="w-10 h-10 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </div>
                        <h1 className="text-2xl font-bold text-gray-800 mb-2">
                            Verifikasi Gagal
                        </h1>
                        <p className="text-gray-600 mb-6">
                            {error}
                        </p>
                        <button
                            onClick={() => router.push(ROUTES.REGISTER)}
                            className="w-full py-3 bg-linear-to-r from-emerald-500 to-emerald-600 text-white rounded-xl hover:shadow-lg hover:shadow-emerald-500/30 transition-all font-medium mb-3"
                        >
                            Daftar Ulang
                        </button>
                        <button
                            onClick={() => router.push(ROUTES.LOGIN)}
                            className="w-full py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all font-medium"
                        >
                            Coba Login
                        </button>
                    </div>
                </div>

                <div className="absolute top-10 left-10 w-40 h-40 rounded-full bg-emerald-200/30 blur-2xl"></div>
                <div className="absolute bottom-20 right-10 w-60 h-60 rounded-full bg-teal-200/20 blur-3xl"></div>
            </div>
        );
    }

    if (token) {
        return (
            <AuthLoadingScreen
                message="Memverifikasi email..."
                subtitle="Sebentar ya, kami sedang login-kan akunmu."
            />
        );
    }

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-linear-to-br from-emerald-50 via-teal-50 to-cyan-50 relative">
            <div className="absolute top-6 left-6 lg:left-8 z-50">
                <button 
                    onClick={() => router.push("/")}
                    className="flex items-center relative h-12 w-48 overflow-hidden bg-transparent border-none cursor-pointer outline-none"
                >
                    <img
                        src="/logo.png"
                        alt="CuanSelor Logo"
                        className="absolute left-0 top-1/2 -translate-y-1/2 h-24 w-auto object-cover max-w-none"
                    />
                </button>
            </div>

            <div className="max-w-md w-full mx-4">
                <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 text-center">
                    <div className="animate-bounce-gentle mb-6">
                        <img
                            src="/projection-illustration.svg"
                            alt="Email Verification"
                            className="w-48 h-48 mx-auto"
                        />
                    </div>

                    <h1 className="text-2xl font-bold text-gray-800 mb-2">
                        Cek Email Kamu
                    </h1>
                    <p className="text-gray-600 mb-6">
                        Kami sudah mengirim link verifikasi ke email kamu.
                    </p>
                    
                    <div className="mb-4 flex gap-2.5 p-3.5 bg-blue-50/50 border border-blue-100/80 rounded-xl text-xs text-blue-800 leading-relaxed items-center text-left">
                        <svg className="w-4 h-4 shrink-0 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>
                            Tidak menerima email? Cek folder spam atau klik tombol kirim ulang di bawah ini.
                        </span>
                    </div>

                    {resendMessage && (
                        <div className={`mb-6 p-3 rounded-xl text-xs text-left border ${
                            resendMessage.type === "success" 
                                ? "bg-emerald-50 border-emerald-100 text-emerald-800" 
                                : "bg-red-50 border-red-100 text-red-800"
                        }`}>
                            {resendMessage.text}
                        </div>
                    )}

                    <button
                        onClick={handleResendEmail}
                        disabled={resendLoading}
                        className="w-full py-3 bg-linear-to-r from-emerald-500 to-emerald-600 text-white rounded-xl hover:shadow-lg hover:shadow-emerald-500/30 transition-all font-medium mb-3 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {resendLoading ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                Mengirim Ulang...
                            </>
                        ) : (
                            "Kirim Ulang Verifikasi"
                        )}
                    </button>
                    <button
                        onClick={() => router.push(ROUTES.LOGIN)}
                        className="w-full py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all font-medium"
                    >
                        Kembali ke Login
                    </button>
                </div>
            </div>

            <div className="absolute top-10 left-10 w-40 h-40 rounded-full bg-emerald-200/30 blur-2xl"></div>
            <div className="absolute bottom-20 right-10 w-60 h-60 rounded-full bg-teal-200/20 blur-3xl"></div>
        </div>
    );
}

export default function VerifyEmailPage() {
    return (
        <Suspense fallback={<AuthLoadingScreen />}>
            <VerifyEmailContent />
        </Suspense>
    );
}