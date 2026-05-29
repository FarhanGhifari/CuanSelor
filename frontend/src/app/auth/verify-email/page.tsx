"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Modal } from "@/components/ui/Modal";
import { SuccessIllustration } from "@/components/ui/SuccessIllustration";
import { ROUTES } from "@/lib/constants/routes";
import Link from "next/link";

export default function VerifyEmailPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [showSuccess, setShowSuccess] = useState(false);
    const [isVerifying, setIsVerifying] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const verifyEmail = async () => {
            const token = searchParams.get("token");

            if (!token) {
                setError("Token verifikasi tidak ditemukan");
                setIsVerifying(false);
                return;
            }

            try {
                // Call Better Auth verify-email endpoint
                const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
                const verifyUrl = `${backendUrl}/api/auth/verify-email?token=${token}`;
                
                const response = await fetch(verifyUrl, {
                    method: "GET",
                    credentials: "include",
                });

                // Better Auth returns different status codes:
                // 200 = Success
                // 400 = Invalid/expired/already used token
                // 404 = Token not found
                
                if (response.status === 400) {
                    const data = await response.json();
                    // Token sudah dipakai atau invalid
                    setError("Link verifikasi sudah digunakan atau tidak valid");
                    setIsVerifying(false);
                    return;
                }

                if (!response.ok) {
                    throw new Error("Verifikasi gagal");
                }

                // Success!
                setIsVerifying(false);
                setShowSuccess(true);
            } catch (err) {
                setError("Link verifikasi tidak valid atau sudah kadaluarsa");
                setIsVerifying(false);
            }
        };

        verifyEmail();
    }, [searchParams]);

    if (isVerifying) {
        return (
            <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">Memverifikasi Email...</h2>
                    <p className="text-gray-600">Tunggu sebentar ya</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 relative">
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
                            className="w-full py-3 bg-gradient-to-r from-primary to-primary/80 text-white rounded-xl hover:shadow-lg hover:shadow-primary/30 transition-all font-medium mb-3"
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

                {/* Decorative circles */}
                <div className="absolute top-10 left-10 w-40 h-40 rounded-full bg-emerald-200/30 blur-2xl"></div>
                <div className="absolute bottom-20 right-10 w-60 h-60 rounded-full bg-teal-200/20 blur-3xl"></div>
            </div>
        );
    }

    // Success state - langsung popup tanpa halaman background
    return (
        <Modal
            open={showSuccess}
            title="Registrasi Berhasil 🎉"
            description="Akunmu sudah aktif! Yuk lanjut isi data finansialmu untuk mendapatkan proyeksi keuangan personal."
            primaryLabel="Lanjut ke Onboarding"
            onPrimary={() => router.push(ROUTES.ONBOARDING)}
            onClose={() => router.push(ROUTES.LOGIN)}
        >
            <SuccessIllustration />
        </Modal>
    );
}
