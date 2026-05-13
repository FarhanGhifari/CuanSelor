"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { RegisterForm } from "@/features/auth/components/RegisterForm";
import { useRegister } from "@/features/auth/hooks/useAuth";
import { Modal } from "@/components/ui/Modal";
import { ROUTES } from "@/lib/constants/routes";
import type { PersonalInfoInput } from "@/features/auth/validations/auth.schema";

export default function RegisterPage() {
    const router = useRouter();
    const { register, isPending, error } = useRegister();
    const [showSuccess, setShowSuccess] = useState(false);

    const handleRegister = async (data: PersonalInfoInput) => {
        const ok = await register(data);
        if (ok) setShowSuccess(true);
    };

    return (
        <div className="min-h-screen bg-muted/30 flex items-center justify-center px-4 py-12">
            <RegisterForm onSubmit={handleRegister} />
            <Modal
                open={showSuccess}
                title="Registrasi berhasil 🎉"
                description="Yuk lanjut isi data finansialmu untuk mendapatkan proyeksi keuangan personal."
                primaryLabel="Lanjut"
                onPrimary={() => router.push(ROUTES.ONBOARDING)}
                onClose={() => setShowSuccess(false)}
            />
            {error && !showSuccess && (
                <div className="fixed bottom-6 left-1/2 z-40 w-full max-w-md -translate-x-1/2 px-4">
                    <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 shadow">
                        {error}
                    </div>
                </div>
            )}
        </div>
    );
}