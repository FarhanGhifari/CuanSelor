import type { Metadata } from "next";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import ResetPasswordForm from "@/features/auth/components/ResetPasswordForm";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Reset Password - CuanSelor",
    description: "Create a new password for your CuanSelor account",
};

function LoadingFallback() {
    return (
        <div className="w-full bg-white rounded-[24px] shadow-[0_12px_40_rgb(0,0,0,0.06)] border border-gray-100 p-10 flex flex-col items-center gap-4">
            <Loader2 className="animate-spin w-8 h-8 text-[#10B981]" />
            <p className="text-gray-500 text-sm">Loading...</p>
        </div>
    );
}

export default function ResetPasswordPage() {
    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 p-6">
            <div className="w-full max-w-lg">
                {/* Logo for branding */}
                <div className="flex justify-center mb-8">
                    <Link href="/">
                        <img src="/logo.png" alt="CuanSelor Logo" className="h-32 w-auto" />
                    </Link>
                </div>

                <Suspense fallback={<LoadingFallback />}>
                    <ResetPasswordForm />
                </Suspense>
            </div>
        </div>
    );
}
