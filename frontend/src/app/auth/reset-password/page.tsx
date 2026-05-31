/* eslint-disable @next/next/no-img-element */

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
        <div className="w-full min-h-[720px] max-h-[calc(100vh-7rem)] overflow-y-auto bg-white rounded-[24px] shadow-[0_12px_40px_rgb(0,0,0,0.06)] border border-gray-100 p-8 sm:p-10 flex flex-col items-center justify-center gap-4 text-center">
            <Loader2 className="animate-spin w-8 h-8 text-[#10B981]" />
            <p className="text-gray-500 text-sm">Loading...</p>
        </div>
    );
}

export default function ResetPasswordPage() {
    return (
        <div className="min-h-screen w-full bg-gray-50 px-4 py-8 sm:px-6">
            <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-[620px] flex-col items-center justify-center">
                {/* Logo for branding */}
                <div className="mb-6 flex h-20 items-center justify-center sm:mb-8">
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
