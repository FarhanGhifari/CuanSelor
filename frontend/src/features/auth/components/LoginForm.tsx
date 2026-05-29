"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, Lock, Loader2, Eye, EyeOff } from "lucide-react";
import { loginSchema, type LoginInput } from "../validations/auth.schema";
import { authClient } from "@/lib/auth/auth-client";
import { cn } from "@/lib/utils/cn";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/lib/constants/routes";
import { apiClient } from "@/lib/api/axios.config";
import { API } from "@/lib/constants/api-endpoints";

export default function LoginForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

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

  const onSubmit = async (data: LoginInput) => {
    setIsLoading(true);
    setLoginError(null);

    try {
      const result = await authClient.signIn.email({
        email: data.email,
        password: data.password,
      });

      if (result.error) {
        setLoginError(result.error.message || "Login failed");
        return;
      }

      try {
        const statusRes = await apiClient.get(API.ONBOARDING.STATUS);
        const status = statusRes.data?.data ?? statusRes.data;

        if (status.isFullyOnboarded) {
          router.push(ROUTES.DASHBOARD);
        } else {
          router.push(ROUTES.ONBOARDING);
        }
      } catch {
        // If status check fails, default to onboarding
        router.push(ROUTES.ONBOARDING);
      }
    } catch {
      setLoginError("An error occurred during login");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full bg-white rounded-[24px] shadow-[0_12px_40px_rgb(0,0,0,0.06)] border border-gray-100 p-10">
      {loginError && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-600 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
          <p className="text-sm font-medium">{loginError}</p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Email */}
        <div className="space-y-2">
          <label htmlFor="email" className="text-[14px] font-medium text-gray-700 block">
            Email Address
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
              placeholder="Enter your password"
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
              Remember me
            </label>
          </div>
          <Link
            href={ROUTES.FORGOT_PASSWORD}
            className="text-[14px] text-[#10B981] hover:text-[#059669] font-medium transition-colors"
          >
            Forgot password?
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
            "Sign In"
          )}
        </button>

        {/* Divider */}
        <div className="relative my-6 pt-2">
          <div className="absolute inset-0 flex items-center pt-2">
            <div className="w-full border-t border-gray-200" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-white px-4 text-gray-500">Or continue with</span>
          </div>
        </div>

        {/* Google */}
        <button
          type="button"
          suppressHydrationWarning
          className="w-full flex items-center justify-center py-4 px-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors font-medium text-base gap-2 text-[#111827]"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
          </svg>
          Sign in with Google
        </button>

        <p className="text-center text-[14px] text-gray-600 mt-6 pt-2">
          Don&rsquo;t have an account?{" "}
          <Link href={ROUTES.REGISTER} className="text-[#10B981] hover:text-[#059669] font-bold">
            Sign up
          </Link>
        </p>
      </form>
    </div>
  );
}
