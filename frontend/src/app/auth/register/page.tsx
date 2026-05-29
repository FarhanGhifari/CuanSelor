"use client";

import { useState } from "react";
import { RegisterForm } from "@/features/auth/components/RegisterForm";
import { useRegister } from "@/features/auth/hooks/useAuth";
import { Modal } from "@/components/ui/Modal";
import type { PersonalInfoInput } from "@/features/auth/validations/auth.schema";
import Link from "next/link";
import { AuthPageGuard } from "@/features/auth/components/AuthPageGuard";

export default function RegisterPage() {
    const { register, error } = useRegister();
    const [showEmailSent, setShowEmailSent] = useState(false);
    const [userEmail, setUserEmail] = useState("");

    const handleRegister = async (data: PersonalInfoInput) => {
        const ok = await register(data);
        if (ok) {
            setUserEmail(data.email);
            setShowEmailSent(true);
        }
    };

    return (
        <AuthPageGuard>
        <>
            <div className="min-h-screen w-full flex bg-white relative">
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
                <RegisterForm onSubmit={handleRegister} />
            </div>
        </div>


            <Modal
                open={showEmailSent}
                title="Cek Email Kamu 📧"
                description={`Kami sudah mengirim link verifikasi ke ${userEmail}. Klik link tersebut untuk mengaktifkan akunmu.`}
                primaryLabel="Oke, Mengerti"
                onPrimary={() => setShowEmailSent(false)}
                onClose={() => setShowEmailSent(false)}
            >
                <div className="flex flex-col items-center justify-center py-6">
                    <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                        <svg className="w-12 h-12 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <p className="text-sm text-muted-foreground text-center max-w-sm">
                        Tidak menerima email? Cek folder spam atau tunggu beberapa menit.
                    </p>
                </div>
            </Modal>
            {error && !showEmailSent && (
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
