"use client";

import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Lock, Loader2, Eye, EyeOff, CheckCircle2, XCircle, ArrowLeft, ShieldCheck, AlertCircle } from "lucide-react";
import { resetPasswordSchema, type ResetPasswordInput } from "../validations/auth.schema";
import { cn } from "@/lib/utils/cn";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ROUTES } from "@/lib/constants/routes";

// Password strength helpers
const strengthChecks = [
  { label: "Minimal 8 karakter", test: (v: string) => v.length >= 8 },
  { label: "Minimal satu huruf kapital", test: (v: string) => /[A-Z]/.test(v) },
  { label: "Minimal satu angka", test: (v: string) => /[0-9]/.test(v) },
];

function getStrengthLevel(password: string): { score: number; label: string; color: string } {
  const passed = strengthChecks.filter((c) => c.test(password)).length;
  if (passed === 0) return { score: 0, label: "", color: "" };
  if (passed === 1) return { score: 1, label: "Lemah", color: "#ef4444" };
  if (passed === 2) return { score: 2, label: "Cukup", color: "#f59e0b" };
  return { score: 3, label: "Kuat", color: "#10b981" };
}

type Step = "loading" | "invalid" | "form" | "success";

const CARD_BASE_CLASS =
  "w-full min-h-[720px] max-h-[calc(100vh-7rem)] overflow-y-auto bg-white rounded-[24px] shadow-[0_12px_40px_rgb(0,0,0,0.06)] border border-gray-100 p-8 sm:p-10";

const CARD_CENTER_CLASS = `${CARD_BASE_CLASS} flex flex-col justify-center`;

export default function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const [step, setStep] = useState<Step>(token ? "form" : "invalid");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });
  const watchedPassword = useWatch({ control, name: "password" }) ?? "";

  const onSubmit = async (data: ResetPasswordInput) => {
    setErrorMessage("");
    
    try {
      // Better Auth reset password API
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/auth/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          newPassword: data.password,
          token: token,
        }),
      });

      const result = await response.json();

      if (!response.ok || result.error) {
        // Check if it's a "same password" error
        if (result.message?.includes("sama dengan password lama")) {
          setErrorMessage(result.message);
          return;
        }

        // Tampilkan pesan backend yang lebih spesifik untuk error non-token.
        const message = result.message || result.error?.message || "";
        if (
          message.includes("tidak valid") ||
          message.includes("kedaluwarsa") ||
          message.includes("digunakan")
        ) {
          setStep("invalid");
          return;
        }

        setErrorMessage(message || "Gagal mereset password. Silakan coba lagi.");
        return;
      }

      setStep("success");
    } catch {
      setStep("invalid");
    }
  };

  const strength = getStrengthLevel(watchedPassword);

  // ── Token invalid / expired ────────────────────────────────────────────────
  if (step === "loading") {
    return (
      <div className={`${CARD_CENTER_CLASS} items-center gap-4 text-center`}>
        <Loader2 className="animate-spin w-8 h-8 text-[#10B981]" />
        <p className="text-gray-500 text-sm">Memverifikasi link reset...</p>
      </div>
    );
  }

  if (step === "invalid") {
    return (
      <div className={`${CARD_CENTER_CLASS} text-center`}>
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center">
            <XCircle className="w-10 h-10 text-red-400" strokeWidth={1.5} />
          </div>
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-3">Link Tidak Valid atau Sudah Digunakan</h3>
        <p className="text-gray-500 text-sm leading-relaxed mb-8">
          Link reset password ini sudah tidak valid. Kemungkinan link sudah digunakan atau sudah kedaluwarsa (expired setelah 1 jam).
          <br /><br />
          Silakan request link reset password baru.
        </p>
        <Link
          href={ROUTES.FORGOT_PASSWORD}
          className="inline-flex items-center justify-center w-full py-3.5 px-6 text-white font-semibold text-sm rounded-xl transition-all duration-200"
          style={{ background: "linear-gradient(90deg, #10b981, #14b8a6)" }}
        >
          Request Link Baru
        </Link>
        <div className="mt-5">
          <Link
            href={ROUTES.LOGIN}
            className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-gray-700 transition-colors"
          >
            <ArrowLeft size={14} /> Kembali ke Login
          </Link>
        </div>
      </div>
    );
  }

  // ── Success ────────────────────────────────────────────────────────────────
  if (step === "success") {
    return (
      <div className={`${CARD_CENTER_CLASS} text-center`}>
        <div className="flex justify-center mb-6">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #d1fae5, #a7f3d0)" }}
          >
            <CheckCircle2 className="w-10 h-10 text-[#10B981]" strokeWidth={1.5} />
          </div>
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-3">Password Berhasil Diubah!</h3>
        <p className="text-gray-500 text-sm leading-relaxed mb-8">
          Password Anda sudah berhasil direset. Sekarang Anda bisa login dengan password baru.
        </p>
        <Link
          href={ROUTES.LOGIN}
          className="inline-flex items-center justify-center w-full py-3.5 px-6 text-white font-semibold text-sm rounded-xl transition-all duration-200 hover:opacity-90"
          style={{ background: "linear-gradient(90deg, #10b981, #14b8a6)" }}
        >
          Login Sekarang
        </Link>
      </div>
    );
  }

  // ── Reset form ─────────────────────────────────────────────────────────────
  return (
    <div className={CARD_BASE_CLASS}>
      {/* Header */}
      <div className="mb-8">
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5"
          style={{ background: "linear-gradient(135deg, #d1fae5, #a7f3d0)" }}
        >
          <ShieldCheck className="w-7 h-7 text-[#10B981]" strokeWidth={1.5} />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Buat Password Baru</h2>
        <p className="text-sm text-gray-500 leading-relaxed">
          Password baru Anda harus berbeda dari password sebelumnya.
        </p>
      </div>

      {/* Error Message */}
      {errorMessage && (
        <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3 text-amber-800 animate-in fade-in slide-in-from-top-2 duration-300">
          <AlertCircle size={20} className="shrink-0 mt-0.5" />
          <p className="text-sm font-medium leading-relaxed">{errorMessage}</p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* New Password */}
        <div className="space-y-2">
          <label htmlFor="password" className="text-[14px] font-medium text-gray-700 block">
            Password Baru
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
              <Lock size={18} strokeWidth={1.5} />
            </div>
            <input
              {...register("password")}
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Buat password yang kuat"
              suppressHydrationWarning
              autoComplete="new-password"
              className={cn(
                "w-full pl-10 pr-12 py-4 bg-white border rounded-xl outline-none transition-all duration-200 text-base placeholder:text-gray-400",
                errors.password
                  ? "border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
                  : "border-gray-200 focus:border-[#10B981] focus:ring-4 focus:ring-[#10B981]/10"
              )}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
            >
              {showPassword ? <EyeOff size={18} strokeWidth={1.5} /> : <Eye size={18} strokeWidth={1.5} />}
            </button>
          </div>

          {/* Strength meter */}
          {watchedPassword.length > 0 && (
            <div className="space-y-2 pt-1">
              <div className="flex gap-1.5">
                {[1, 2, 3].map((level) => (
                  <div
                    key={level}
                    className="h-1.5 flex-1 rounded-full transition-all duration-300"
                    style={{
                      backgroundColor:
                        strength.score >= level ? strength.color : "#e5e7eb",
                    }}
                  />
                ))}
              </div>
              {strength.label && (
                <p className="text-xs font-medium" style={{ color: strength.color }}>
                  Password {strength.label}
                </p>
              )}
            </div>
          )}

          {/* Requirement checklist */}
          <ul className="space-y-1 pt-1">
            {strengthChecks.map((check) => {
              const passed = check.test(watchedPassword);
              return (
                <li key={check.label} className="flex items-center gap-2">
                  <div
                    className={cn(
                      "w-4 h-4 rounded-full flex items-center justify-center transition-colors",
                      passed ? "bg-[#10b981]" : "bg-gray-100"
                    )}
                  >
                    <CheckCircle2
                      size={10}
                      className={passed ? "text-white" : "text-gray-300"}
                      strokeWidth={3}
                    />
                  </div>
                  <span
                    className={cn(
                      "text-xs transition-colors",
                      passed ? "text-[#10b981] font-medium" : "text-gray-400"
                    )}
                  >
                    {check.label}
                  </span>
                </li>
              );
            })}
          </ul>

          {errors.password && (
            <p className="text-xs text-red-500 font-medium">{errors.password.message}</p>
          )}
        </div>

        {/* Confirm Password */}
        <div className="space-y-2">
          <label htmlFor="confirmPassword" className="text-[14px] font-medium text-gray-700 block">
            Konfirmasi Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
              <Lock size={18} strokeWidth={1.5} />
            </div>
            <input
              {...register("confirmPassword")}
              id="confirmPassword"
              type={showConfirm ? "text" : "password"}
              placeholder="Ulangi password baru Anda"
              suppressHydrationWarning
              autoComplete="new-password"
              className={cn(
                "w-full pl-10 pr-12 py-4 bg-white border rounded-xl outline-none transition-all duration-200 text-base placeholder:text-gray-400",
                errors.confirmPassword
                  ? "border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
                  : "border-gray-200 focus:border-[#10B981] focus:ring-4 focus:ring-[#10B981]/10"
              )}
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
            >
              {showConfirm ? <EyeOff size={18} strokeWidth={1.5} /> : <Eye size={18} strokeWidth={1.5} />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-xs text-red-500 font-medium">{errors.confirmPassword.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          suppressHydrationWarning
          className="w-full py-4 px-6 text-white font-bold text-base rounded-xl transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-70 mt-2"
          style={{ background: "linear-gradient(90deg, #10b981, #14b8a6)" }}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="animate-spin" size={18} />
              Mengatur ulang password...
            </>
          ) : (
            "Simpan Password Baru"
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
