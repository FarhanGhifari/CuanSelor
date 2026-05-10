"use client";

import { useState }    from "react";
import Link            from "next/link";
import { useForm }     from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input }       from "@/components/ui/Input";
import { Button }      from "@/components/ui/Button";
import { User, Mail, Lock, Calendar, Eye, EyeOff, AlertCircle } from "lucide-react";
import {
  personalInfoSchema,
  type PersonalInfoInput,
} from "@/features/auth/validations/auth.schema";
import { ROUTES } from "@/lib/constants/routes";
import { StepIndicator } from "@/components/shared/StepIndicator";

// ── Props ──────────────────────────────────────────────────────
interface RegisterFormProps {
  onNext: (data: PersonalInfoInput) => void;
}

// ── Component ──────────────────────────────────────────────────
export function RegisterForm({ onNext }: RegisterFormProps) {
  const [showPass, setShowPass]       = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const { register, handleSubmit, formState: { errors } } =
    useForm<PersonalInfoInput>({ resolver: zodResolver(personalInfoSchema) });

  return (
    <div className="flex-1 flex flex-col justify-center items-center bg-gray-50 px-6 py-12">
      <div className="w-full max-w-md">

        {/* Heading */}
        <h2 className="text-3xl font-extrabold text-gray-900 mb-1">Buat Akun</h2>
        <p className="text-gray-500 text-sm mb-8">Isi data diri kamu untuk memulai</p>

        {/* Step indicator */}
        <StepIndicator current={1}/>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <form onSubmit={handleSubmit(onNext)} noValidate>
            <div className="space-y-4">

              <Input
                label="Nama Lengkap"
                type="text"
                placeholder="John Doe"
                autoComplete="name"
                leftIcon={<User size={18} strokeWidth={1.8} />}
                error={errors.fullName?.message}
                {...register("fullName")}
              />

              <Input
                label="Email"
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                leftIcon={<Mail size={18} strokeWidth={1.8} />}
                error={errors.email?.message}
                {...register("email")}
              />

              <Input
                label="Password"
                type={showPass ? "text" : "password"}
                placeholder="Minimal 8 karakter"
                autoComplete="new-password"
                leftIcon={<Lock size={18} strokeWidth={1.8} />}
                rightIcon={
                  <button type="button" tabIndex={-1}
                    onClick={() => setShowPass(p => !p)}
                    className="text-gray-400 hover:text-gray-600 transition-colors">
                    {showPass ? <Eye size={18} strokeWidth={1.8} /> : <EyeOff size={18} strokeWidth={1.8} />}
                  </button>
                }
                error={errors.password?.message}
                {...register("password")}
              />

              <Input
                label="Konfirmasi Password"
                type={showConfirm ? "text" : "password"}
                placeholder="Ulangi password"
                autoComplete="new-password"
                leftIcon={<Lock size={18} strokeWidth={1.8} />}
                rightIcon={
                  <button type="button" tabIndex={-1}
                    onClick={() => setShowConfirm(p => !p)}
                    className="text-gray-400 hover:text-gray-600 transition-colors">
                    {showConfirm ? <Eye size={18} strokeWidth={1.8} /> : <EyeOff size={18} strokeWidth={1.8} />}
                  </button>
                }
                error={errors.confirmPassword?.message}
                {...register("confirmPassword")}
              />

              <Input
                label="Tanggal Lahir"
                type="date"
                leftIcon={<Calendar size={18} strokeWidth={1.8} />}
                error={errors.birthDate?.message}
                {...register("birthDate")}
              />

              {/* Jenis Kelamin */}
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-700">
                  Jenis Kelamin
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { value: "male",   label: "Laki-laki" },
                    { value: "female", label: "Perempuan" },
                  ].map(opt => (
                    <label key={opt.value}
                      className="flex items-center gap-2.5 p-3 border border-gray-200 rounded-xl cursor-pointer hover:border-emerald-400 hover:bg-emerald-50/40 transition-all has-[:checked]:border-emerald-400 has-[:checked]:bg-emerald-50">
                      <input type="radio" value={opt.value}
                        className="accent-emerald-500"
                        {...register("gender")} />
                      <span className="text-sm text-gray-700">{opt.label}</span>
                    </label>
                  ))}
                </div>
                {errors.gender && (
                  <p className="text-xs text-red-500 flex items-center gap-1.5 mt-1">
                    <AlertCircle size={14} />
                    {errors.gender.message}
                  </p>
                )}
              </div>

              <Button type="submit" fullWidth>
                Lanjut ke Info Finansial →
              </Button>
            </div>
          </form>
        </div>

        {/* Sign in */}
        <p className="text-center text-sm text-gray-500 mt-6">
          Sudah punya akun?{" "}
          <Link href={ROUTES.LOGIN}
            className="font-semibold text-emerald-500 hover:text-emerald-600 transition-colors">
            Masuk
          </Link>
        </p>

        <p className="text-center text-xs text-gray-400 mt-3 leading-relaxed">
          Dengan mendaftar, kamu menyetujui{" "}
          <Link href="/terms" className="text-emerald-500 hover:underline">Syarat & Ketentuan</Link>{" "}
          dan{" "}
          <Link href="/privacy" className="text-emerald-500 hover:underline">Kebijakan Privasi</Link>
        </p>
      </div>

      <button className="fixed bottom-6 right-6 w-9 h-9 rounded-full border border-gray-300 bg-white flex items-center justify-center text-gray-500 hover:bg-gray-100 shadow-sm transition text-sm font-bold">
        ?
      </button>
    </div>
  );
}
