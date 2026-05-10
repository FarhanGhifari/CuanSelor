"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    TrendingUp, TrendingDown, DollarSign,
    Briefcase, Target, Users, Shield,
} from "lucide-react";
import { StepIndicator } from "@/features/auth/components/RegisterForm";
import {
    financialInfoSchema,
    type FinancialInfoInput,
} from "@/features/auth/validations/auth.schema";

const PROFESSIONS = [
    "Pelajar / Mahasiswa",
    "Karyawan Swasta",
    "PNS / ASN",
    "Wirausaha",
    "Freelancer",
    "Profesional (Dokter, Lawyer, dll)",
    "Lainnya",
];

const RISK_OPTIONS = [
    {
        value: "conservative",
        label: "Konservatif",
        desc: "Risiko rendah, return stabil",
        icon: Shield,
        color: "text-primary",
        bg: "bg-primary/10",
    },
    {
        value: "moderate",
        label: "Moderat",
        desc: "Pendekatan seimbang",
        icon: TrendingUp,
        color: "text-blue-500",
        bg: "bg-blue-500/10",
    },
    {
        value: "aggressive",
        label: "Agresif",
        desc: "Risiko tinggi, potensi besar",
        icon: TrendingUp,
        color: "text-destructive",
        bg: "bg-destructive/10",
    },
];

interface FinancialFormProps {
    onSubmit: (data: FinancialInfoInput) => void;
    onBack: () => void;
    isPending: boolean;
    error: string | null;
}

export function FinancialForm({ onSubmit, onBack, isPending, error }: FinancialFormProps) {
    const { register, handleSubmit, formState: { errors } } =
        useForm<FinancialInfoInput>({ resolver: zodResolver(financialInfoSchema) });

    return (
        <div className="w-full max-w-2xl">
            {/* Header */}
            <div className="text-center mb-8">
                <StepIndicator current={2} />
                <h1 className="text-4xl font-bold text-foreground mb-4">
                    Info Finansialmu
                </h1>
                <p className="text-lg text-muted-foreground">
                    Bantu kami menghitung proyeksi keuangan yang akurat untukmu
                </p>
            </div>

            {/* Form Card */}
            <div className="bg-card rounded-2xl shadow-xl border border-border p-8 md:p-12">

                {/* Error banner */}
                {error && (
                    <div className="mb-6 flex items-center gap-2.5 p-4 bg-destructive/10 border border-destructive/20 rounded-xl text-sm text-destructive">
                        <Shield className="w-4 h-4 flex-shrink-0" />
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-8">

                    {/* Pekerjaan */}
                    <div>
                        <h3 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                                <Briefcase className="w-4 h-4 text-primary" />
                            </div>
                            Pekerjaan
                        </h3>
                        <div>
                            <label className="block text-sm text-muted-foreground mb-2">Profesi saat ini</label>
                            <div className="relative">
                                <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/60" />
                                <select
                                    className="w-full pl-12 pr-4 py-3.5 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all appearance-none"
                                    {...register("profession")}
                                >
                                    <option value="">Pilih pekerjaan</option>
                                    {PROFESSIONS.map(p => (
                                        <option key={p} value={p}>{p}</option>
                                    ))}
                                </select>
                            </div>
                            {errors.profession && (
                                <p className="text-xs text-destructive mt-1.5">{errors.profession.message}</p>
                            )}
                        </div>
                    </div>

                    {/* Informasi Finansial */}
                    <div>
                        <h3 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                                <DollarSign className="w-4 h-4 text-blue-500" />
                            </div>
                            Informasi Finansial
                        </h3>
                        <div className="grid md:grid-cols-2 gap-6">
                            {/* Pendapatan */}
                            <div>
                                <label className="block text-sm text-muted-foreground mb-2">Pendapatan Bulanan</label>
                                <div className="relative">
                                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/60" />
                                    <input
                                        type="number"
                                        placeholder="5.000.000"
                                        className="w-full pl-12 pr-4 py-3.5 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                        {...register("monthlyIncome")}
                                    />
                                </div>
                                <p className="text-xs text-muted-foreground/70 mt-1.5">Total pendapatan setelah pajak</p>
                                {errors.monthlyIncome && (
                                    <p className="text-xs text-destructive mt-1">{errors.monthlyIncome.message}</p>
                                )}
                            </div>

                            {/* Pengeluaran */}
                            <div>
                                <label className="block text-sm text-muted-foreground mb-2">Pengeluaran Bulanan</label>
                                <div className="relative">
                                    <TrendingDown className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/60" />
                                    <input
                                        type="number"
                                        placeholder="3.000.000"
                                        className="w-full pl-12 pr-4 py-3.5 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                        {...register("monthlyExpense")}
                                    />
                                </div>
                                <p className="text-xs text-muted-foreground/70 mt-1.5">Rata-rata pengeluaran per bulan</p>
                                {errors.monthlyExpense && (
                                    <p className="text-xs text-destructive mt-1">{errors.monthlyExpense.message}</p>
                                )}
                            </div>

                            {/* Tabungan */}
                            <div>
                                <label className="block text-sm text-muted-foreground mb-2">Total Tabungan / Aset</label>
                                <div className="relative">
                                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/60" />
                                    <input
                                        type="number"
                                        placeholder="10.000.000"
                                        className="w-full pl-12 pr-4 py-3.5 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                        {...register("currentSavings")}
                                    />
                                </div>
                                {errors.currentSavings && (
                                    <p className="text-xs text-destructive mt-1.5">{errors.currentSavings.message}</p>
                                )}
                            </div>

                            {/* Utang */}
                            <div>
                                <label className="block text-sm text-muted-foreground mb-2">Total Utang</label>
                                <div className="relative">
                                    <TrendingDown className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/60" />
                                    <input
                                        type="number"
                                        placeholder="0"
                                        className="w-full pl-12 pr-4 py-3.5 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                        {...register("totalDebt")}
                                    />
                                </div>
                                {errors.totalDebt && (
                                    <p className="text-xs text-destructive mt-1.5">{errors.totalDebt.message}</p>
                                )}
                            </div>

                            {/* Tanggungan */}
                            <div className="md:col-span-2">
                                <label className="block text-sm text-muted-foreground mb-2">Jumlah Tanggungan</label>
                                <div className="relative">
                                    <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/60" />
                                    <input
                                        type="number"
                                        placeholder="0"
                                        className="w-full pl-12 pr-4 py-3.5 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                        {...register("dependents")}
                                    />
                                </div>
                                <p className="text-xs text-muted-foreground/70 mt-1.5">Jumlah orang yang bergantung pada penghasilanmu</p>
                                {errors.dependents && (
                                    <p className="text-xs text-destructive mt-1">{errors.dependents.message}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Profil Risiko */}
                    <div>
                        <h3 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                                <Shield className="w-4 h-4 text-primary" />
                            </div>
                            Profil Risiko Investasi
                        </h3>
                        <label className="block text-sm text-muted-foreground mb-3">
                            Seberapa besar toleransi risikomu?
                        </label>
                        <div className="grid md:grid-cols-3 gap-4">
                            {RISK_OPTIONS.map(({ value, label, desc, icon: Icon, color, bg }) => (
                                <label key={value} className="relative cursor-pointer">
                                    <input
                                        type="radio"
                                        value={value}
                                        className="peer sr-only"
                                        {...register("riskProfile")}
                                    />
                                    <div className="p-6 bg-background border-2 border-border rounded-xl peer-checked:border-primary peer-checked:bg-primary/5 transition-all hover:border-primary/50">
                                        <div className="text-center">
                                            <div className={`w-12 h-12 rounded-full ${bg} flex items-center justify-center mx-auto mb-3`}>
                                                <Icon className={`w-6 h-6 ${color}`} />
                                            </div>
                                            <div className="font-medium text-foreground mb-1">{label}</div>
                                            <div className="text-xs text-muted-foreground">{desc}</div>
                                        </div>
                                    </div>
                                </label>
                            ))}
                        </div>
                        {errors.riskProfile && (
                            <p className="text-xs text-destructive mt-1.5">{errors.riskProfile.message}</p>
                        )}
                    </div>

                    {/* Target Pensiun */}
                    <div>
                        <h3 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                                <Target className="w-4 h-4 text-blue-500" />
                            </div>
                            Target Pensiun
                        </h3>
                        <div>
                            <label className="block text-sm text-muted-foreground mb-2">Target Usia Pensiun</label>
                            <div className="relative">
                                <Target className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/60" />
                                <input
                                    type="number"
                                    placeholder="55"
                                    className="w-full pl-12 pr-4 py-3.5 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                    {...register("retirementAge")}
                                />
                            </div>
                            {errors.retirementAge && (
                                <p className="text-xs text-destructive mt-1.5">{errors.retirementAge.message}</p>
                            )}
                        </div>
                    </div>

                    {/* Info note */}
                    <div className="flex gap-3 p-4 bg-primary/5 border border-primary/20 rounded-xl">
                        <Shield className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            Data ini hanya digunakan untuk menghitung proyeksi keuangan personalmu.
                            Kamu bisa mengubahnya kapan saja melalui dashboard.
                        </p>
                    </div>

                    {/* Buttons */}
                    <div className="pt-2 space-y-3">
                        <button
                            type="submit"
                            disabled={isPending}
                            className="w-full py-4 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground rounded-xl hover:shadow-lg hover:shadow-primary/30 transition-all flex items-center justify-center gap-2 text-lg font-medium disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {isPending ? (
                                <>
                                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                                    </svg>
                                    Membuat akun...
                                </>
                            ) : (
                                <>
                                    Buat Akun & Lihat Proyeksiku
                                    <TrendingUp className="w-5 h-5" />
                                </>
                            )}
                        </button>
                        <button
                            type="button"
                            onClick={onBack}
                            className="w-full py-3.5 border border-border text-muted-foreground rounded-xl hover:bg-muted/50 transition-all text-sm font-medium"
                        >
                            ← Kembali ke Data Diri
                        </button>
                        <p className="text-center text-sm text-muted-foreground">
                            Informasimu dienkripsi dan aman
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