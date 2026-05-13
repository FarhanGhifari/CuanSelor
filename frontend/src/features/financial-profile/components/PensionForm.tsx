"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Target,
  Percent,
  HeartPulse,
  Briefcase,
  AlertTriangle,
  Landmark,
  Shield,
  CheckSquare,
  TrendingUp,
} from "lucide-react";
import {
  pensionOnboardingSchema,
  type PensionOnboardingInput,
} from "@/features/auth/validations/auth.schema";
import { StepIndicator } from "@/components/shared/StepIndicator";
import { RiskQuestionnaireInline } from "./RiskQuestionnaireInline";

// ── Sektor Pekerjaan Options ──────────────────────────────────
const SECTORS = [
  "Pemerintahan / PNS",
  "BUMN / BUMD",
  "Swasta — Keuangan & Perbankan",
  "Swasta — Teknologi",
  "Swasta — Manufaktur",
  "Swasta — Perdagangan & Retail",
  "Swasta — Kesehatan",
  "Swasta — Pendidikan",
  "Swasta — Lainnya",
  "Wiraswasta / Freelance",
  "Profesional (Dokter, Pengacara, dll)",
  "Lainnya",
];

// ── Props ────────────────────────────────────────────────────
interface PensionFormProps {
  onSubmit: (data: PensionOnboardingInput & { riskAnswers?: Record<string, number> }) => void;
  isPending: boolean;
  error: string | null;
}

// ── Component ────────────────────────────────────────────────
export function PensionForm({ onSubmit, isPending, error }: PensionFormProps) {
  const [riskAnswers, setRiskAnswers] = useState<Record<string, number>>({});

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm<PensionOnboardingInput>({
    resolver: zodResolver(pensionOnboardingSchema),
    defaultValues: {
      hasHealthInsurance: false,
      includePandemicRisk: false,
      confirmAccuracy: false,
    },
  });

  const hasInsurance = watch("hasHealthInsurance");
  const riskProfile = watch("riskProfile");

  const handleRiskComplete = (
    profile: "conservative" | "moderate" | "aggressive",
    answers: Record<string, number>
  ) => {
    setValue("riskProfile", profile, { shouldValidate: true });
    setRiskAnswers(answers);
  };

  const onFormSubmit = (data: PensionOnboardingInput) => {
    onSubmit({ ...data, riskAnswers });
  };

  return (
    <div className="w-full max-w-2xl">
      {/* Header */}
      <div className="text-center mb-8">
        <StepIndicator current={3} />
        <h1 className="text-4xl font-bold text-foreground mb-4">
          Proyeksi Pensiun
        </h1>
        <p className="text-lg text-muted-foreground">
          Langkah terakhir — atur target pensiun dan profil risikomu
        </p>
      </div>

      {/* Form Card */}
      <div className="bg-card rounded-2xl shadow-xl border border-border p-8 md:p-12">
        {/* Error banner */}
        {error && (
          <div className="mb-6 flex items-center gap-2.5 p-4 bg-destructive/10 border border-destructive/20 rounded-xl text-sm text-destructive">
            <Shield className="w-4 h-4 shrink-0" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onFormSubmit)} noValidate className="space-y-8">
          {/* ── Target Pensiun ────────────────────────────────── */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                <Target className="w-4 h-4 text-emerald-500" />
              </div>
              Target Pensiun
            </h3>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Target Usia Pensiun */}
              <div>
                <label className="block text-sm text-muted-foreground mb-2">
                  Target Usia Pensiun
                </label>
                <div className="relative">
                  <Target className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/60" />
                  <input
                    type="number"
                    placeholder="55"
                    className="w-full pl-12 pr-4 py-3.5 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    {...register("retirementAge")}
                  />
                </div>
                <p className="text-xs text-muted-foreground/70 mt-1.5">Usia saat kamu ingin pensiun</p>
                {errors.retirementAge && (
                  <p className="text-xs text-destructive mt-1">{errors.retirementAge.message}</p>
                )}
              </div>

              {/* Persentase Gaya Hidup */}
              <div>
                <label className="block text-sm text-muted-foreground mb-2">
                  Gaya Hidup Setelah Pensiun (%)
                </label>
                <div className="relative">
                  <Percent className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/60" />
                  <input
                    type="number"
                    placeholder="70"
                    className="w-full pl-12 pr-4 py-3.5 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    {...register("lifestylePercent")}
                  />
                </div>
                <p className="text-xs text-muted-foreground/70 mt-1.5">
                  Misal 70% = kebutuhan 70% dari gaya hidup sekarang
                </p>
                {errors.lifestylePercent && (
                  <p className="text-xs text-destructive mt-1">{errors.lifestylePercent.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* ── Asuransi Kesehatan ──────────────────────────── */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-rose-500/10 flex items-center justify-center">
                <HeartPulse className="w-4 h-4 text-rose-500" />
              </div>
              Asuransi Kesehatan
            </h3>

            <label className="flex items-start gap-3 p-4 bg-background border border-border rounded-xl cursor-pointer hover:border-primary/40 transition-colors">
              <input
                type="checkbox"
                className="mt-0.5 w-5 h-5 rounded border-border text-primary focus:ring-primary/20 accent-emerald-500"
                {...register("hasHealthInsurance")}
              />
              <div>
                <span className="text-sm font-medium text-foreground">
                  Saya memiliki asuransi kesehatan
                </span>
                <p className="text-xs text-muted-foreground mt-1">
                  BPJS, asuransi swasta, atau asuransi dari kantor
                </p>
              </div>
            </label>

            {/* Warning jika tidak punya asuransi */}
            {!hasInsurance && (
              <div className="mt-3 flex gap-3 p-4 bg-amber-500/5 border border-amber-500/20 rounded-xl">
                <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-amber-700">
                    Perhatian: Inflasi Medis Tinggi
                  </p>
                  <p className="text-xs text-amber-600/80 mt-1 leading-relaxed">
                    Inflasi biaya medis di Indonesia mencapai <strong>&gt;10% per tahun</strong>.
                    Tanpa asuransi kesehatan, biaya medis di usia 65+ bisa sangat membebani
                    dana pensiun Anda. Kami sarankan untuk segera memiliki perlindungan kesehatan.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* ── Profil Risiko (Inline Questionnaire) ─────────── */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-violet-500/10 flex items-center justify-center">
                <Shield className="w-4 h-4 text-violet-500" />
              </div>
              Profil Risiko Investasi
            </h3>

            <RiskQuestionnaireInline
              onComplete={handleRiskComplete}
              initialProfile={riskProfile || null}
            />

            {errors.riskProfile && (
              <p className="text-xs text-destructive mt-2">{errors.riskProfile.message}</p>
            )}
          </div>

          {/* ── Sektor & Pandemi ─────────────────────────────── */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-sky-500/10 flex items-center justify-center">
                <Briefcase className="w-4 h-4 text-sky-500" />
              </div>
              Pekerjaan & Asumsi
            </h3>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Sektor Pekerjaan */}
              <div className="md:col-span-2">
                <label className="block text-sm text-muted-foreground mb-2">
                  Sektor Pekerjaan
                </label>
                <div className="relative">
                  <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/60" />
                  <select
                    className="w-full pl-12 pr-4 py-3.5 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all appearance-none"
                    {...register("sector")}
                    defaultValue=""
                  >
                    <option value="" disabled>
                      Pilih sektor pekerjaan
                    </option>
                    {SECTORS.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
                {errors.sector && (
                  <p className="text-xs text-destructive mt-1">{errors.sector.message}</p>
                )}
              </div>

              {/* Bunga Deposito */}
              <div>
                <label className="block text-sm text-muted-foreground mb-2">
                  Bunga Deposito per Tahun (%)
                </label>
                <div className="relative">
                  <Landmark className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/60" />
                  <input
                    type="number"
                    step="0.1"
                    placeholder="4.5"
                    className="w-full pl-12 pr-4 py-3.5 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    {...register("depositRate")}
                  />
                </div>
                <p className="text-xs text-muted-foreground/70 mt-1.5">
                  Asumsi bunga deposito bank per tahun
                </p>
                {errors.depositRate && (
                  <p className="text-xs text-destructive mt-1">{errors.depositRate.message}</p>
                )}
              </div>

              {/* Risiko Pandemi */}
              <div className="flex items-start">
                <label className="flex items-start gap-3 p-4 bg-background border border-border rounded-xl cursor-pointer hover:border-primary/40 transition-colors w-full h-full">
                  <input
                    type="checkbox"
                    className="mt-0.5 w-5 h-5 rounded border-border text-primary focus:ring-primary/20 accent-emerald-500"
                    {...register("includePandemicRisk")}
                  />
                  <div>
                    <span className="text-sm font-medium text-foreground">
                      Gunakan risiko pandemi
                    </span>
                    <p className="text-xs text-muted-foreground mt-1">
                      Faktorkan potensi risiko pandemi dalam proyeksi
                    </p>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* ── Konfirmasi ──────────────────────────────────── */}
          <div className="space-y-4">
            <label className="flex items-start gap-3 p-4 bg-primary/5 border border-primary/20 rounded-xl cursor-pointer hover:bg-primary/10 transition-colors">
              <Controller
                name="confirmAccuracy"
                control={control}
                render={({ field }) => (
                  <input
                    type="checkbox"
                    className="mt-0.5 w-5 h-5 rounded border-border text-primary focus:ring-primary/20 accent-emerald-500"
                    checked={field.value ?? false}
                    onChange={field.onChange}
                  />
                )}
              />
              <div>
                <span className="text-sm font-medium text-foreground">
                  Saya konfirmasi data yang diisi sudah benar
                </span>
                <p className="text-xs text-muted-foreground mt-1">
                  Data ini akan digunakan untuk menghitung proyeksi pensiun Anda
                </p>
              </div>
            </label>
            {errors.confirmAccuracy && (
              <p className="text-xs text-destructive">{errors.confirmAccuracy.message}</p>
            )}
          </div>

          {/* ── Submit ──────────────────────────────────────── */}
          <div className="pt-2 space-y-3">
            <button
              type="submit"
              disabled={isPending}
              className="w-full py-4 bg-linear-to-r from-primary to-primary/80 text-primary-foreground rounded-xl hover:shadow-lg hover:shadow-primary/30 transition-all flex items-center justify-center gap-2 text-lg font-medium disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isPending ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Menyimpan...
                </>
              ) : (
                <>
                  Selesai
                  <CheckSquare className="w-5 h-5" />
                </>
              )}
            </button>
            <p className="text-center text-sm text-muted-foreground">
              Kamu bisa mengubah data ini kapan saja melalui dashboard
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
