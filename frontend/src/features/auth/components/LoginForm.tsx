"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, Lock, Loader2, Eye, EyeOff, X } from "lucide-react";
import { loginSchema, type LoginInput } from "../validations/auth.schema";
import { authClient } from "@/lib/auth/auth-client";
import { cn } from "@/lib/utils/cn";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ROUTES } from "@/lib/constants/routes";
import { GoogleAuthButton } from "./GoogleAuthButton";
import { getAuthErrorMessage } from "../utils/auth-errors";

type FormErrorState = {
  id: string;
  message: string;
};

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState<FormErrorState | null>(null);
  const [hideCallbackError, setHideCallbackError] = useState(false);
  const [dismissedErrorId, setDismissedErrorId] = useState<string | null>(null);
  const [autoHiddenErrorId, setAutoHiddenErrorId] = useState<string | null>(null);
  const callbackError = hideCallbackError
    ? null
    : getAuthErrorMessage(searchParams.get("error"));
  const callbackErrorState = callbackError
    ? {
        id: `callback:${searchParams.get("error") ?? callbackError}`,
        message: callbackError,
      }
    : null;
  const displayError = loginError ?? callbackErrorState;
  const activeErrorId = displayError?.id ?? null;
  const isErrorVisible =
    Boolean(displayError) &&
    activeErrorId !== dismissedErrorId &&
    activeErrorId !== autoHiddenErrorId;

  useEffect(() => {
    if (!activeErrorId) return;

    const timer = setTimeout(() => {
      setAutoHiddenErrorId(activeErrorId);
    }, 30000);

    return () => clearTimeout(timer);
  }, [activeErrorId]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const createErrorState = (scope: "login" | "google", message: string): FormErrorState => ({
    id: `${scope}:${message}`,
    message,
  });

  const onSubmit = async (data: LoginInput) => {
    setIsLoading(true);
    setLoginError(null);
    setHideCallbackError(true);
    setDismissedErrorId(null);
    setAutoHiddenErrorId(null);

    try {
      const result = await authClient.signIn.email({
        email: data.email,
        password: data.password,
        rememberMe: data.rememberMe,
      });

      if (result.error) {
        setLoginError(
          createErrorState("login", result.error.message || "Masuk gagal. Silakan coba lagi.")
        );
        return;
      }

      const { data: session } = await authClient.getSession({
        query: { disableCookieCache: true },
      });

      if (!session?.user) {
        setLoginError(
          createErrorState("login", "Login berhasil, tapi sesi belum terbaca. Coba refresh halaman.")
        );
        return;
      }

      router.replace(ROUTES.AUTH_CALLBACK);
      router.refresh();
    } catch {
      setLoginError(createErrorState("login", "Terjadi kesalahan saat masuk"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    setLoginError(null);
    setHideCallbackError(true);
    setDismissedErrorId(null);
    setAutoHiddenErrorId(null);

    try {
      const result = await authClient.signIn.social({
        provider: "google",
        callbackURL: ROUTES.AUTH_CALLBACK,
        newUserCallbackURL: ROUTES.AUTH_CALLBACK,
        errorCallbackURL: ROUTES.LOGIN,
      });

      if (result.error) {
        setLoginError(
          createErrorState("google", result.error.message || "Masuk dengan Google gagal")
        );
      }
    } catch {
      setLoginError(createErrorState("google", "Terjadi kesalahan saat masuk dengan Google"));
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="w-full bg-white rounded-[24px] shadow-[0_12px_40px_rgb(0,0,0,0.06)] border border-gray-100 p-10">
      {isErrorVisible && displayError && (
        <div className="fixed top-6 left-1/2 z-50 w-full max-w-md -translate-x-1/2 px-4 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="rounded-xl border border-red-200 bg-red-50 pl-4 pr-3 py-3.5 flex items-center justify-between gap-3 text-red-700 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse shrink-0" />
              <p className="text-sm font-semibold">{displayError.message}</p>
            </div>
            <button
              type="button"
              onClick={() => setDismissedErrorId(displayError.id)}
              className="p-1 hover:bg-red-100 rounded-lg transition-colors text-red-500 hover:text-red-700 shrink-0"
              aria-label="Tutup"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
              suppressHydrationWarning
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
              type={showPassword ? "text" : "password"}
              placeholder="Masukkan password kamu"
              suppressHydrationWarning
              autoComplete="current-password"
              className={cn(
                "w-full pl-10 pr-12 py-4 bg-white border rounded-xl outline-none transition-all duration-200 text-base placeholder:text-gray-400",
                errors.password
                  ? "border-red-500 focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
                  : "border-gray-200 focus:border-[#10B981] focus:ring-4 focus:ring-[#10B981]/10"
              )}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
            >
              {showPassword ? (
                <EyeOff size={18} strokeWidth={1.5} />
              ) : (
                <Eye size={18} strokeWidth={1.5} />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="text-xs text-red-500 mt-1 font-medium">{errors.password.message}</p>
          )}
        </div>

        {/* Remember me + Forgot password */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center space-x-2">
            <input
              {...register("rememberMe")}
              type="checkbox"
              id="rememberMe"
              className="w-4 h-4 rounded border-gray-300 text-[#10B981] focus:ring-[#10B981] cursor-pointer"
            />
            <label htmlFor="rememberMe" className="text-[14px] text-gray-600 cursor-pointer select-none">
              Ingat saya
            </label>
          </div>
          <Link
            href={ROUTES.FORGOT_PASSWORD}
            className="text-[14px] text-[#10B981] hover:text-[#059669] font-medium transition-colors"
          >
            Lupa password?
          </Link>
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
            "Masuk"
          )}
        </button>

        {/* Divider */}
        <div className="relative my-6 pt-2">
          <div className="absolute inset-0 flex items-center pt-2">
            <div className="w-full border-t border-gray-200" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-white px-4 text-gray-500">Atau lanjutkan dengan</span>
          </div>
        </div>

        {/* Google */}
        <GoogleAuthButton
          label="Masuk dengan Google"
          onClick={handleGoogleSignIn}
          disabled={isLoading || isGoogleLoading}
          isLoading={isGoogleLoading}
        />

        <p className="text-center text-[14px] text-gray-600 mt-6 pt-2">
          Belum punya akun?{" "}
          <Link href={ROUTES.REGISTER} className="text-[#10B981] hover:text-[#059669] font-bold">
            Daftar
          </Link>
        </p>
      </form>
    </div>
  );
}
