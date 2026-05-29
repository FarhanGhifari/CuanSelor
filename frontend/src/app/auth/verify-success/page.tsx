"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Modal } from "@/components/ui/Modal";
import { SuccessIllustration } from "@/components/ui/SuccessIllustration";
import { ROUTES } from "@/lib/constants/routes";
import Link from "next/link";

export default function VerifySuccessPage() {
    const router = useRouter();
    const [showModal, setShowModal] = useState(true);

    return (
        <>
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
                        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                            <svg className="w-10 h-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h1 className="text-2xl font-bold text-gray-800 mb-2">
                            Email Terverifikasi! 🎉
                        </h1>
                        <p className="text-gray-600 mb-6">
                            Akunmu sudah aktif. Yuk lanjut isi data finansialmu untuk mendapatkan proyeksi keuangan personal.
                        </p>
                        <button
                            onClick={() => router.push(ROUTES.ONBOARDING)}
                            className="w-full py-3 bg-gradient-to-r from-primary to-primary/80 text-white rounded-xl hover:shadow-lg hover:shadow-primary/30 transition-all font-medium mb-3"
                        >
                            Lanjut ke Onboarding
                        </button>
                        <p className="text-sm text-gray-500">
                            Atau{" "}
                            <Link href={ROUTES.DASHBOARD} className="text-primary hover:underline font-medium">
                                langsung ke dashboard
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Decorative circles */}
                <div className="absolute top-10 left-10 w-40 h-40 rounded-full bg-emerald-200/30 blur-2xl"></div>
                <div className="absolute bottom-20 right-10 w-60 h-60 rounded-full bg-teal-200/20 blur-3xl"></div>
            </div>

            <Modal
                open={showModal}
                title="Registrasi Berhasil 🎉"
                description="Akunmu sudah aktif! Yuk lanjut isi data finansialmu untuk mendapatkan proyeksi keuangan personal."
                primaryLabel="Lanjut ke Onboarding"
                onPrimary={() => router.push(ROUTES.ONBOARDING)}
                onClose={() => setShowModal(false)}
            >
                <SuccessIllustration />
            </Modal>
        </>
    );
}
