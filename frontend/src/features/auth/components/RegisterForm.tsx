"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TrendingUp, User, Mail, Lock, Eye, EyeOff } from "lucide-react";
import {
  personalInfoSchema,
  type PersonalInfoInput,
} from "@/features/auth/validations/auth.schema";
import { ROUTES } from "@/lib/constants/routes";

// ── Step Indicator ─────────────────────────────────────────────
export function StepIndicator({ current }: { current: 1 | 2 }) {
  const steps = [
    { step: 1, label: "Data Diri" },
    { step: 2, label: "Info Finansial" },
  ];
  return (
    <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-4">
      <span className="text-primary text-sm font-medium">
        Step {current} of 2 — {steps[current - 1].label}
      </span>
    </div>
  );
}

// ── Props ──────────────────────────────────────────────────────
interface RegisterFormProps {
  onSubmit: (data: PersonalInfoInput) => void;
}

// ── Component ──────────────────────────────────────────────────
export function RegisterForm({ onSubmit }: RegisterFormProps) {
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const { register, handleSubmit, formState: { errors } } =
    useForm<PersonalInfoInput>({ resolver: zodResolver(personalInfoSchema) });

  return (
    <div className="w-full max-w-2xl">
      {/* Step badge */}
      <div className="text-center mb-8">
        <StepIndicator current={1} />
        <h1 className="text-4xl font-bold text-foreground mb-4">
          Buat Akun CuanSelor
        </h1>
        <p className="text-lg text-muted-foreground">
          Isi data diri kamu untuk memulai perjalanan finansialmu
        </p>
      </div>

      {/* Form Card */}
      <div className="bg-card rounded-2xl shadow-xl border border-border p-8 md:p-12">
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-8">

          {/* Personal Information */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <User className="w-4 h-4 text-primary" />
              </div>
              Informasi Pribadi
            </h3>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Nama */}
              <div className="md:col-span-2">
                <label className="block text-sm text-muted-foreground mb-2">Nama Lengkap</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/60" />
                  <input
                    type="text"
                    placeholder="John Doe"
                    autoComplete="name"
                    className="w-full pl-12 pr-4 py-3.5 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    {...register("fullName")}
                  />
                </div>
                {errors.fullName && (
                  <p className="text-xs text-destructive mt-1.5">{errors.fullName.message}</p>
                )}
              </div>

              {/* Email */}
              <div className="md:col-span-2">
                <label className="block text-sm text-muted-foreground mb-2">Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/60" />
                  <input
                    type="email"
                    placeholder="you@example.com"
                    autoComplete="email"
                    className="w-full pl-12 pr-4 py-3.5 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    {...register("email")}
                  />
                </div>
                {errors.email && (
                  <p className="text-xs text-destructive mt-1.5">{errors.email.message}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm text-muted-foreground mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/60" />
                  <input
                    type={showPass ? "text" : "password"}
                    placeholder="Minimal 8 karakter"
                    autoComplete="new-password"
                    className="w-full pl-12 pr-12 py-3.5 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    {...register("password")}
                  />
                  <button
                    type="button"
                    tabIndex={-1}
                    onClick={() => setShowPass(p => !p)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground/60 hover:text-muted-foreground transition-colors"
                  >
                    {showPass ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs text-destructive mt-1.5">{errors.password.message}</p>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm text-muted-foreground mb-2">Konfirmasi Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/60" />
                  <input
                    type={showConfirm ? "text" : "password"}
                    placeholder="Ulangi password"
                    autoComplete="new-password"
                    className="w-full pl-12 pr-12 py-3.5 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    {...register("confirmPassword")}
                  />
                  <button
                    type="button"
                    tabIndex={-1}
                    onClick={() => setShowConfirm(p => !p)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground/60 hover:text-muted-foreground transition-colors"
                  >
                    {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-xs text-destructive mt-1.5">{errors.confirmPassword.message}</p>
                )}
              </div>

            </div>
          </div>

          {/* Submit */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-4 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground rounded-xl hover:shadow-lg hover:shadow-primary/30 transition-all flex items-center justify-center gap-2 text-lg font-medium"
            >
              Daftar
              <TrendingUp className="w-5 h-5" />
            </button>
            <p className="text-center text-sm text-muted-foreground mt-4">
              Sudah punya akun?{" "}
              <Link href={ROUTES.LOGIN} className="text-primary hover:underline font-medium">
                Masuk
              </Link>
            </p>
          </div>
        </form>
      </div>

      {/* Trust badges */}
      <div className="grid grid-cols-3 gap-6 mt-10 text-center">
        {[
          { icon: "🔒", title: "Aman & Privat", desc: "Data kamu dienkripsi" },
          { icon: "🤖", title: "Berbasis AI", desc: "Rekomendasi cerdas" },
          { icon: "🎯", title: "Goal-Oriented", desc: "Pantau progres pensiunmu" },
        ].map((b) => (
          <div key={b.title}>
            <div className="text-2xl mb-2">{b.icon}</div>
            <div className="font-medium text-foreground text-sm mb-1">{b.title}</div>
            <div className="text-xs text-muted-foreground">{b.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}