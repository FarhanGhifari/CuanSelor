"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, Loader2, ArrowLeft, CheckCircle2 } from "lucide-react";
import { forgotPasswordSchema, type ForgotPasswordInput } from "../validations/auth.schema";
import { cn } from "@/lib/utils/cn";
import Link from "next/link";
import { ROUTES } from "@/lib/constants/routes";

type Step = "idle" | "loading" | "success" | "error";

export default function ForgotPasswordForm() {
  const [step, setStep] = useState<Step>("idle");
  const [submittedEmail, setSubmittedEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (data: ForgotPasswordInput) => {
    setStep("loading");
    setErrorMessage("");
    
    try {
      // Better Auth forget password API
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/auth/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: data.email,
        }),
      });

      const result = await response.json();

      if (!response.ok || result.error) {
        setErrorMessage(result.error?.message || result.message || "Gagal mengirim email reset password");
        setStep("error");
        return;
      }

      setSubmittedEmail(data.email);
      setStep("success");
    } catch (error) {
      setErrorMessage("Terjadi kesalahan. Silakan coba lagi.");
      setStep("error");
    }
  };

  if (step === "success") {
    return (
      <div className="w-full bg-white rounded-[24px] shadow-[0_12px_40px_rgb(0,0,0,0.06)] border border-gray-100 p-10 text-center">
        {/* Success illustration */}
        <div className="flex justify-center mb-6">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #d1fae5, #a7f3d0)" }}
          >
            <CheckCircle2 className="w-10 h-10 text-[#10B981]" strokeWidth={1.5} />
          </div>
        </div>

        <h3 className="text-2xl font-bold text-gray-900 mb-3">Cek Email Anda</h3>
        <p className="text-gray-500 text-sm leading-relaxed mb-2">
          Kami sudah mengirim link reset password ke:
        </p>
        <p className="text-[#10B981] font-semibold text-base mb-8 break-all">
          {submittedEmail}
        </p>
        <p className="text-gray-400 text-xs leading-relaxed mb-8">
          Tidak menerima email? Cek folder spam atau{" "}
          <button
            type="button"
            onClick={() => setStep("idle")}
            className="text-[#10B981] hover:text-[#059669] font-medium underline underline-offset-2 transition-colors"
          >
            kirim ulang
          </button>
          . Link akan kedaluwarsa dalam 1 jam.
        </p>

        <Link
          href={ROUTES.LOGIN}
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 transition-colors font-medium"
        >
          <ArrowLeft size={16} />
          Kembali ke Login
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full bg-white rounded-[24px] shadow-[0_12px_40px_rgb(0,0,0,0.06)] border border-gray-100 p-10">
      {/* Header */}
      <div className="mb-8">
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5"
          style={{ background: "linear-gradient(135deg, #d1fae5, #a7f3d0)" }}
        >
          <Mail className="w-7 h-7 text-[#10B981]" strokeWidth={1.5} />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Lupa Password?</h2>
        <p className="text-sm text-gray-500 leading-relaxed">
          Tidak masalah! Masukkan email yang terdaftar dan kami akan kirimkan link untuk reset password Anda.
        </p>
      </div>

      {/* Error Message */}
      {step === "error" && errorMessage && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-600 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
          <p className="text-sm font-medium">{errorMessage}</p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="space-y-2">
          <label htmlFor="email" className="text-[14px] font-medium text-gray-700 block">
            Alamat Email
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
              <Mail size={18} strokeWidth={1.5} />
            </div>
            <input
              {...register("email")}
              id="email"
              type="email"
              placeholder="you@example.com"
              suppressHydrationWarning
              autoComplete="email"
              className={cn(
                "w-full pl-10 pr-4 py-4 bg-white border rounded-xl outline-none transition-all duration-200 text-base placeholder:text-gray-400",
                errors.email
                  ? "border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
                  : "border-gray-200 focus:border-[#10B981] focus:ring-4 focus:ring-[#10B981]/10"
              )}
            />
          </div>
          {errors.email && (
            <p className="text-xs text-red-500 mt-1 font-medium flex items-center gap-1">
              {errors.email.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={step === "loading"}
          suppressHydrationWarning
          className="w-full py-4 px-6 text-white font-bold text-base rounded-xl transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-70"
          style={{ background: "linear-gradient(90deg, #10b981, #14b8a6)" }}
        >
          {step === "loading" ? (
            <>
              <Loader2 className="animate-spin" size={18} />
              Mengirim link...
            </>
          ) : (
            "Kirim Link Reset"
          )}
        </button>
      </form>

      <div className="mt-8 pt-6 border-t border-gray-100 text-center">
        <Link
          href={ROUTES.LOGIN}
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 transition-colors font-medium"
        >
          <ArrowLeft size={15} />
          Kembali ke Login
        </Link>
      </div>
    </div>
  );
}
