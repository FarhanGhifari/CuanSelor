"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { User, Mail, Lock, Loader2, Eye, EyeOff, X } from "lucide-react";
import {
  personalInfoSchema,
  type PersonalInfoInput,
} from "@/features/auth/validations/auth.schema";
import { ROUTES } from "@/lib/constants/routes";
import { GoogleAuthButton } from "./GoogleAuthButton";
import { getAuthErrorMessage } from "../utils/auth-errors";
import { cn } from "@/lib/utils/cn";

// ── Props ──────────────────────────────────────────────────────
interface RegisterFormProps {
  onSubmit: (data: PersonalInfoInput) => void;
  onGoogleSignUp: () => void;
  isLoading?: boolean;
}

// ── Component ──────────────────────────────────────────────────
export function RegisterForm({ onSubmit, onGoogleSignUp, isLoading = false }: RegisterFormProps) {
  const searchParams = useSearchParams();
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [googleError, setGoogleError] = useState<string | null>(null);
  const [hideCallbackError, setHideCallbackError] = useState(false);
  const callbackError = hideCallbackError
    ? null
    : getAuthErrorMessage(searchParams.get("error"));
  const displayGoogleError = googleError ?? callbackError;

  const [showError, setShowError] = useState(false);

  useEffect(() => {
    if (displayGoogleError) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setShowError(true);
      const timer = setTimeout(() => {
        setShowError(false);
      }, 30000);
      return () => clearTimeout(timer);
    } else {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setShowError(false);
    }
  }, [displayGoogleError]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PersonalInfoInput>({ resolver: zodResolver(personalInfoSchema) });

  const handleGoogleSignUp = async () => {
    setIsGoogleLoading(true);
    setGoogleError(null);
    setHideCallbackError(true);

    try {
      await onGoogleSignUp();
    } catch {
      setGoogleError("Registrasi Google gagal. Coba lagi.");
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="w-full bg-white rounded-[24px] shadow-[0_12px_40px_rgb(0,0,0,0.06)] border border-gray-100 p-8">
      {showError && displayGoogleError && (
        <div className="fixed top-6 left-1/2 z-50 w-full max-w-md -translate-x-1/2 px-4 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="rounded-xl border border-red-200 bg-red-50 pl-4 pr-3 py-3.5 flex items-center justify-between gap-3 text-red-700 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse shrink-0" />
              <p className="text-sm font-semibold">{displayGoogleError}</p>
            </div>
            <button
              type="button"
              onClick={() => setShowError(false)}
              className="p-1 hover:bg-red-100 rounded-lg transition-colors text-red-500 hover:text-red-700 shrink-0"
              aria-label="Tutup"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Nama Lengkap */}
        <div className="space-y-2">
          <label htmlFor="fullName" className="text-[14px] font-medium text-gray-700 block">
            Nama Lengkap
          </label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
              <User size={18} strokeWidth={1.5} />
            </div>
            <input
              {...register("fullName")}
              id="fullName"
              type="text"
              placeholder="John Doe"
              autoComplete="name"
              className={cn(
                "w-full pl-10 pr-4 py-4 bg-white border rounded-xl outline-none transition-all duration-200 text-base placeholder:text-gray-400",
                errors.fullName
                  ? "border-red-500 focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
                  : "border-gray-200 focus:border-[#10B981] focus:ring-4 focus:ring-[#10B981]/10"
              )}
            />
          </div>
          {errors.fullName && (
            <p className="text-xs text-red-500 mt-1 font-medium">{errors.fullName.message}</p>
          )}
        </div>

        {/* Email */}
        <div className="space-y-2">
          <label htmlFor="email" className="text-[14px] font-medium text-gray-700 block">
            Email
          </label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
              <Mail size={18} strokeWidth={1.5} />
            </div>
            <input
              {...register("email")}
              id="email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              className={cn(
                "w-full pl-10 pr-4 py-4 bg-white border rounded-xl outline-none transition-all duration-200 text-base placeholder:text-gray-400",
                errors.email
                  ? "border-red-500 focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
                  : "border-gray-200 focus:border-[#10B981] focus:ring-4 focus:ring-[#10B981]/10"
              )}
            />
          </div>
          {errors.email && (
            <p className="text-xs text-red-500 mt-1 font-medium">{errors.email.message}</p>
          )}
        </div>

        {/* Password Row */}
        <div className="grid grid-cols-2 gap-4">
          {/* Password */}
          <div className="space-y-2">
            <label htmlFor="password" className="text-[14px] font-medium text-gray-700 block">
              Password
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <Lock size={18} strokeWidth={1.5} />
              </div>
              <input
                {...register("password")}
                id="password"
                type={showPass ? "text" : "password"}
                placeholder="Minimal 8 karakter"
                autoComplete="new-password"
                className={cn(
                  "w-full pl-10 pr-12 py-4 bg-white border rounded-xl outline-none transition-all duration-200 text-base placeholder:text-gray-400",
                  errors.password
                    ? "border-red-500 focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
                    : "border-gray-200 focus:border-[#10B981] focus:ring-4 focus:ring-[#10B981]/10"
                )}
              />
              <button
                type="button"
                tabIndex={-1}
                onClick={() => setShowPass((p) => !p)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPass ? <EyeOff size={18} strokeWidth={1.5} /> : <Eye size={18} strokeWidth={1.5} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-xs text-red-500 mt-1 font-medium">{errors.password.message}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="space-y-2">
            <label htmlFor="confirmPassword" className="text-[14px] font-medium text-gray-700 block">
              Konfirmasi Password
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <Lock size={18} strokeWidth={1.5} />
              </div>
              <input
                {...register("confirmPassword")}
                id="confirmPassword"
                type={showConfirm ? "text" : "password"}
                placeholder="Ulangi password"
                autoComplete="new-password"
                className={cn(
                  "w-full pl-10 pr-12 py-4 bg-white border rounded-xl outline-none transition-all duration-200 text-base placeholder:text-gray-400",
                  errors.confirmPassword
                    ? "border-red-500 focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
                    : "border-gray-200 focus:border-[#10B981] focus:ring-4 focus:ring-[#10B981]/10"
                )}
              />
              <button
                type="button"
                tabIndex={-1}
                onClick={() => setShowConfirm((p) => !p)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showConfirm ? <EyeOff size={18} strokeWidth={1.5} /> : <Eye size={18} strokeWidth={1.5} />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-xs text-red-500 mt-1 font-medium">{errors.confirmPassword.message}</p>
            )}
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isLoading}
          suppressHydrationWarning
          className="w-full py-4 px-6 bg-[#10B981] hover:bg-[#059669] disabled:bg-[#6EE7B7] text-white font-bold text-lg rounded-xl transition-all duration-200 flex items-center justify-center mt-2"
        >
          {isLoading ? (
            <Loader2 className="animate-spin" size={20} />
          ) : (
            "Daftar"
          )}
        </button>

        {/* Divider */}
        <div className="relative my-5 pt-1">
          <div className="absolute inset-0 flex items-center pt-1">
            <div className="w-full border-t border-gray-200" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-white px-4 text-gray-500">Atau lanjutkan dengan</span>
          </div>
        </div>

        {/* Google */}
        <GoogleAuthButton
          label="Daftar dengan Google"
          onClick={handleGoogleSignUp}
          disabled={isLoading || isGoogleLoading}
          isLoading={isGoogleLoading}
        />

        <p className="text-center text-[14px] text-gray-600 mt-5 pt-1">
          Sudah punya akun?{" "}
          <Link href={ROUTES.LOGIN} className="text-[#10B981] hover:text-[#059669] font-bold">
            Masuk
          </Link>
        </p>
      </form>
    </div>
  );
}
