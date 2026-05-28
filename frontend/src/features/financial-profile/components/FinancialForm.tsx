"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    TrendingUp,
    TrendingDown,
    DollarSign,
    Shield,
    Wallet,
    Percent,
} from "lucide-react";
import {
    financialOnboardingSchema,
    type FinancialOnboardingInput,
} from "@/features/auth/validations/auth.schema";
import { StepIndicator } from "@/components/shared/StepIndicator";

interface FinancialFormProps {
    onSubmit: (data: FinancialOnboardingInput) => void;
    isPending: boolean;
    error: string | null;
}

export function FinancialForm({ onSubmit, isPending, error }: FinancialFormProps) {
    const { register, handleSubmit, formState: { errors } } =
        useForm<FinancialOnboardingInput>({ resolver: zodResolver(financialOnboardingSchema) });

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
                        <Shield className="w-4 h-4 shrink-0" />
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-8">

                    {/* Informasi Finansial */}
                    <div>
                        <h3 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                                <DollarSign className="w-4 h-4 text-blue-500" />
                            </div>
                            Informasi Finansial
                        </h3>
                        <div className="grid md:grid-cols-2 gap-6">
                            {/* Pendapatan Bulanan */}
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

                            {/* Pengeluaran Bulanan */}
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

                            {/* Bonus/THR */}
                            <div>
                                <label className="block text-sm text-muted-foreground mb-2">Bonus/THR (kali gaji per tahun)</label>
                                <div className="relative">
                                    <TrendingUp className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/60" />
                                    <input
                                        type="number"
                                        step="0.1"
                                        placeholder="1"
                                        className="w-full pl-12 pr-4 py-3.5 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                        {...register("annualBonusMonths")}
                                    />
                                </div>
                                <p className="text-xs text-muted-foreground/70 mt-1.5">Contoh: 1 = satu kali gaji setahun</p>
                                {errors.annualBonusMonths && (
                                    <p className="text-xs text-destructive mt-1.5">{errors.annualBonusMonths.message}</p>
                                )}
                            </div>

                            {/* Dana Investasi */}
                            <div>
                                <label className="block text-sm text-muted-foreground mb-2">Dana Investasi Saat Ini</label>
                                <div className="relative">
                                    <Wallet className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/60" />
                                    <input
                                        type="number"
                                        placeholder="0"
                                        className="w-full pl-12 pr-4 py-3.5 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                        {...register("currentSavings")}
                                    />
                                </div>
                                {errors.currentSavings && (
                                    <p className="text-xs text-destructive mt-1.5">{errors.currentSavings.message}</p>
                                )}
                            </div>

                            {/* Persentase Nabung */}
                            <div className="md:col-span-2">
                                <label className="block text-sm text-muted-foreground mb-2">Persentase Nabung/Investasi (%)</label>
                                <div className="relative">
                                    <Percent className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/60" />
                                    <input
                                        type="number"
                                        placeholder="20"
                                        className="w-full pl-12 pr-4 py-3.5 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                        {...register("savingsPercentage")}
                                    />
                                </div>
                                <p className="text-xs text-muted-foreground/70 mt-1.5">Dari total pendapatan bulanan</p>
                                {errors.savingsPercentage && (
                                    <p className="text-xs text-destructive mt-1">{errors.savingsPercentage.message}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Info note */}
                    <div className="flex gap-3 p-4 bg-primary/5 border border-primary/20 rounded-xl">
                        <Shield className="w-5 h-5 text-primary shrink-0 mt-0.5" />
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
                            className="w-full py-4 bg-linear-to-r from-primary to-primary/80 text-primary-foreground rounded-xl hover:shadow-lg hover:shadow-primary/30 transition-all flex items-center justify-center gap-2 text-lg font-medium disabled:opacity-60 disabled:cursor-not-allowed"
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
                                    Simpan Data Finansial
                                    <TrendingUp className="w-5 h-5" />
                                </>
                            )}
                        </button>
                        <p className="text-center text-sm text-muted-foreground">
                            Informasimu dienkripsi dan aman
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
}