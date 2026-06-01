/* eslint-disable @next/next/no-img-element */

import type { Metadata } from "next";
import ForgotPasswordForm from "@/features/auth/components/ForgotPasswordForm";
import { ROUTES } from "@/lib/constants/routes";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Forgot Password - CuanSelor",
    description: "Reset your CuanSelor account password",
};

export default function ForgotPasswordPage() {
    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 p-6">
            <div className="w-full max-w-lg">
                {/* Logo for mobile/full-form view */}
                <div className="flex justify-center mb-8">
                    <Link href="/">
                        <img src="/CuanSelor.png" alt="CuanSelor Logo" className="h-32 w-auto" />
                    </Link>
                </div>

                <ForgotPasswordForm />

                <p className="text-center text-sm text-[#6B7280] mt-8">
                    Remember your password?{" "}
                    <Link href={ROUTES.LOGIN} className="text-[#10B981] hover:underline font-medium">
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
}
