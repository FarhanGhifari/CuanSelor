"use client";

import type { ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
    ArrowRight,
    BarChart3,
    CalendarClock,
    Info,
    PiggyBank,
    ShieldCheck,
    TrendingUp,
    Wallet,
} from "lucide-react";

import { RISK_PROFILES } from "../data/simulation-preview-data";
import { useSimulationPreview } from "../hooks/use-simulation-preview";
import { formatCompactCurrency } from "../utils/format-currency";

export default function InteractiveSimulationPreview() {
    const {
        monthlyInvestment,
        setMonthlyInvestment,
        currentAge,
        setCurrentAge,
        riskProfile,
        setRiskProfile,
        selectedRisk,
        simulation,
    } = useSimulationPreview();

    const maxProjectionValue = Math.max(
        ...simulation.yearlyProjection.map((item) => item.value),
        1
    );

    const graphPoints = simulation.yearlyProjection
        .map((item, index) => {
            const x = ((index / (simulation.yearlyProjection.length - 1)) * 100).toFixed(2);
            const y = (100 - (item.value / maxProjectionValue) * 85).toFixed(2);

            return `${x},${y}`;
        })
        .join(" ");

    const filledGraphPoints = `0,100 ${graphPoints} 100,100`;

    return (
        <section
            id="simulation-preview"
            className="relative flex min-h-[100svh] items-center overflow-hidden bg-slate-50 px-5 py-16 md:px-[5%] lg:py-20 xl:py-24"
        >
            {/* Background Ambient */}
            <div className="pointer-events-none absolute left-1/2 top-[-12%] h-[520px] w-[920px] -translate-x-1/2 rounded-full bg-emerald-200/30 blur-[120px]" />
            <div className="pointer-events-none absolute bottom-[-18%] right-[-10%] h-[520px] w-[620px] rounded-full bg-indigo-200/30 blur-[120px]" />
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_18%,rgba(16,185,129,0.08),transparent_30%),radial-gradient(circle_at_85%_60%,rgba(79,70,229,0.08),transparent_34%)]" />

            <div className="relative z-10 mx-auto grid w-full max-w-[1560px] grid-cols-1 items-center gap-10 lg:grid-cols-12 xl:gap-14">
                {/* Left Content */}
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="lg:col-span-4"
                >
                    <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white/80 px-4 py-2 text-sm font-semibold text-emerald-700 shadow-sm backdrop-blur-xl">
                        <TrendingUp size={16} />
                        Interactive Simulation
                    </div>

                    <h2 className="max-w-xl text-[clamp(38px,4.7vw,64px)] font-black leading-[1.01] tracking-[-2px] text-slate-950">
                        Ubah Angka,
                        <span className="block bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-600 bg-clip-text text-transparent">
                            Lihat Dampaknya.
                        </span>
                    </h2>

                    <p className="mt-6 max-w-xl text-base leading-relaxed text-slate-600 md:text-lg">
                        Simulasikan investasi bulanan dan lihat bagaimana keputusan kecil
                        hari ini dapat memengaruhi target pensiun dan kesiapan finansialmu
                        di masa depan.
                    </p>

                    <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
                        <MiniBenefit
                            icon={<PiggyBank size={18} />}
                            title="Investasi"
                            desc="Atur nominal bulanan"
                        />

                        <MiniBenefit
                            icon={<CalendarClock size={18} />}
                            title="Target"
                            desc="Lihat usia pensiun"
                        />

                        <MiniBenefit
                            icon={<BarChart3 size={18} />}
                            title="Proyeksi"
                            desc="Visual real-time"
                        />
                    </div>
                </motion.div>

                {/* Right Interactive App Preview */}
                <motion.div
                    initial={{ opacity: 0, y: 32 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
                    className="lg:col-span-8"
                >
                    <div className="relative overflow-hidden rounded-[34px] border border-slate-200/80 bg-white/85 p-4 shadow-[0_30px_100px_rgba(15,23,42,0.12)] backdrop-blur-2xl md:p-5 xl:p-6">
                        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.14),transparent_34%),radial-gradient(circle_at_bottom_left,rgba(79,70,229,0.12),transparent_38%)]" />

                        <div className="relative z-10 grid grid-cols-1 gap-5 xl:grid-cols-12">
                            {/* Controls */}
                            <div className="rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm md:p-5 xl:col-span-4">
                                <div className="mb-5 flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-semibold text-slate-500">
                                            Simulation Input
                                        </p>
                                        <h3 className="mt-1 text-xl font-bold tracking-tight text-slate-950">
                                            Rencana Investasi
                                        </h3>
                                    </div>

                                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                                        <Wallet size={20} />
                                    </div>
                                </div>

                                {/* Monthly Investment */}
                                <div className="mb-5">
                                    <div className="mb-3 flex items-center justify-between gap-3">
                                        <label
                                            htmlFor="monthlyInvestment"
                                            className="text-sm font-semibold text-slate-700"
                                        >
                                            Investasi Bulanan
                                        </label>

                                        <span className="rounded-full bg-indigo-50 px-3 py-1 text-sm font-bold text-indigo-700">
                                            {formatCompactCurrency(monthlyInvestment)}
                                        </span>
                                    </div>

                                    <input
                                        id="monthlyInvestment"
                                        type="range"
                                        min={500_000}
                                        max={10_000_000}
                                        step={500_000}
                                        value={monthlyInvestment}
                                        onChange={(event) =>
                                            setMonthlyInvestment(Number(event.target.value))
                                        }
                                        className="h-2 w-full cursor-pointer appearance-none rounded-full bg-slate-200 accent-indigo-600"
                                    />

                                    <div className="mt-2 flex justify-between text-xs font-medium text-slate-400">
                                        <span>Rp500rb</span>
                                        <span>Rp10jt</span>
                                    </div>
                                </div>

                                {/* Current Age */}
                                <div className="mb-5">
                                    <div className="mb-3 flex items-center justify-between gap-3">
                                        <label
                                            htmlFor="currentAge"
                                            className="text-sm font-semibold text-slate-700"
                                        >
                                            Usia Saat Ini
                                        </label>

                                        <span className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-bold text-emerald-700">
                                            {currentAge} tahun
                                        </span>
                                    </div>

                                    <input
                                        id="currentAge"
                                        type="range"
                                        min={18}
                                        max={45}
                                        step={1}
                                        value={currentAge}
                                        onChange={(event) =>
                                            setCurrentAge(Number(event.target.value))
                                        }
                                        className="h-2 w-full cursor-pointer appearance-none rounded-full bg-slate-200 accent-emerald-600"
                                    />

                                    <div className="mt-2 flex justify-between text-xs font-medium text-slate-400">
                                        <span>18</span>
                                        <span>45</span>
                                    </div>
                                </div>

                                {/* Risk Profile */}
                                <div>
                                    <p className="mb-3 text-sm font-semibold text-slate-700">
                                        Profil Risiko
                                    </p>

                                    <div className="grid grid-cols-1 gap-2 md:grid-cols-3 xl:grid-cols-1 2xl:grid-cols-3">
                                        {RISK_PROFILES.map((profile) => {
                                            const isActive = profile.id === riskProfile;

                                            return (
                                                <button
                                                    key={profile.id}
                                                    type="button"
                                                    onClick={() => setRiskProfile(profile.id)}
                                                    className={[
                                                        "rounded-2xl border p-3 text-left transition-all duration-200",
                                                        isActive
                                                            ? "border-indigo-300 bg-indigo-50 shadow-sm"
                                                            : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50",
                                                    ].join(" ")}
                                                >
                                                    <div className="flex items-center justify-between gap-2">
                                                        <span
                                                            className={[
                                                                "text-sm font-bold",
                                                                isActive ? "text-indigo-700" : "text-slate-800",
                                                            ].join(" ")}
                                                        >
                                                            {profile.label}
                                                        </span>

                                                        <span
                                                            className={[
                                                                "text-xs font-semibold",
                                                                isActive
                                                                    ? "text-indigo-500"
                                                                    : "text-slate-400",
                                                            ].join(" ")}
                                                        >
                                                            {(profile.estimatedReturn * 100).toFixed(0)}%
                                                        </span>
                                                    </div>

                                                    <p className="mt-1 text-xs leading-snug text-slate-500">
                                                        {profile.description}
                                                    </p>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>

                            {/* Result Dashboard */}
                            <div className="relative overflow-hidden rounded-[28px] bg-slate-950 p-4 text-white shadow-xl md:p-5 xl:col-span-8">
                                <div className="pointer-events-none absolute right-[-16%] top-[-28%] h-[260px] w-[260px] rounded-full bg-indigo-500/30 blur-[80px]" />
                                <div className="pointer-events-none absolute bottom-[-28%] left-[-12%] h-[240px] w-[240px] rounded-full bg-emerald-500/25 blur-[80px]" />

                                <div className="relative z-10">
                                    <div className="mb-4 flex items-start justify-between gap-4">
                                        <div>
                                            <p className="text-sm font-medium text-slate-400">
                                                Projection Result
                                            </p>
                                            <h3 className="mt-1 text-2xl font-bold tracking-tight">
                                                Proyeksi Masa Depan
                                            </h3>
                                        </div>

                                        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1.5 text-xs font-semibold text-emerald-300">
                                            <ShieldCheck size={14} />
                                            Ilustratif
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                                        <ResultCard
                                            label="Target Pensiun"
                                            value={`Usia ${simulation.projectedRetirementAge}`}
                                            icon={<CalendarClock size={18} />}
                                        />

                                        <ResultCard
                                            label="Estimasi Dana"
                                            value={formatCompactCurrency(simulation.estimatedFund)}
                                            icon={<PiggyBank size={18} />}
                                        />

                                        <ResultCard
                                            label="Kesiapan"
                                            value={`${simulation.readinessScore}%`}
                                            icon={<TrendingUp size={18} />}
                                        />
                                    </div>

                                    <div className="mt-4 rounded-[24px] border border-white/10 bg-white/[0.04] p-4">
                                        <div className="mb-3 flex items-center justify-between gap-4">
                                            <div>
                                                <p className="text-sm font-semibold text-slate-300">
                                                    Projection Chart
                                                </p>

                                                <p className="mt-1 text-xs text-slate-500">
                                                    Skenario {selectedRisk.label.toLowerCase()} dengan
                                                    estimasi return{" "}
                                                    {(selectedRisk.estimatedReturn * 100).toFixed(0)}
                                                    %/tahun.
                                                </p>
                                            </div>

                                            <AnimatePresence mode="wait">
                                                <motion.div
                                                    key={simulation.fasterYears}
                                                    initial={{ opacity: 0, y: 8 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: -8 }}
                                                    transition={{ duration: 0.2 }}
                                                    className="shrink-0 rounded-full bg-emerald-400/10 px-3 py-1.5 text-xs font-bold text-emerald-300"
                                                >
                                                    {simulation.fasterYears > 0
                                                        ? `${simulation.fasterYears} tahun lebih cepat`
                                                        : "Target standar"}
                                                </motion.div>
                                            </AnimatePresence>
                                        </div>

                                        <div className="relative h-[145px] overflow-hidden rounded-2xl bg-slate-900/70 p-4 md:h-[155px] 2xl:h-[165px]">
                                            <div className="absolute inset-0 flex flex-col justify-between p-4">
                                                {Array.from({ length: 5 }).map((_, index) => (
                                                    <div
                                                        key={index}
                                                        className="h-px w-full bg-white/[0.06]"
                                                    />
                                                ))}
                                            </div>

                                            <svg
                                                viewBox="0 0 100 100"
                                                preserveAspectRatio="none"
                                                className="relative z-10 h-full w-full overflow-visible"
                                            >
                                                <defs>
                                                    <linearGradient
                                                        id="projectionGradient"
                                                        x1="0"
                                                        x2="0"
                                                        y1="0"
                                                        y2="1"
                                                    >
                                                        <stop
                                                            offset="0%"
                                                            stopColor="rgba(16,185,129,0.38)"
                                                        />
                                                        <stop
                                                            offset="100%"
                                                            stopColor="rgba(16,185,129,0)"
                                                        />
                                                    </linearGradient>
                                                </defs>

                                                <motion.polyline
                                                    key={graphPoints}
                                                    points={filledGraphPoints}
                                                    fill="url(#projectionGradient)"
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    transition={{ duration: 0.35 }}
                                                />

                                                <motion.polyline
                                                    key={`${graphPoints}-line`}
                                                    points={graphPoints}
                                                    fill="none"
                                                    stroke="rgb(52,211,153)"
                                                    strokeWidth="2.8"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    initial={{ pathLength: 0 }}
                                                    animate={{ pathLength: 1 }}
                                                    transition={{ duration: 0.7, ease: "easeOut" }}
                                                />
                                            </svg>

                                            <div className="absolute bottom-3 left-4 right-4 z-20 flex justify-between text-[10px] font-semibold uppercase tracking-widest text-slate-500">
                                                {simulation.yearlyProjection.map((item) => (
                                                    <span key={item.year}>{item.year}</span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-4 grid grid-cols-1 items-center gap-3 md:grid-cols-[1fr_auto]">
                                        <div className="flex items-start gap-3 rounded-2xl border border-amber-300/15 bg-amber-300/8 p-3">
                                            <Info
                                                className="mt-0.5 shrink-0 text-amber-300"
                                                size={17}
                                            />

                                            <p className="text-xs leading-relaxed text-slate-400">
                                                Simulasi ini bersifat ilustratif dan bukan nasihat
                                                keuangan final. Hasil aktual dapat berbeda tergantung
                                                inflasi, kondisi pasar, profil risiko, dan konsistensi.
                                            </p>
                                        </div>

                                        <a
                                            href="/auth/register"
                                            className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-bold text-slate-950 transition-all duration-200 hover:scale-[1.02] hover:bg-emerald-100"
                                        >
                                            Coba Simulasi
                                            <ArrowRight size={17} />
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}

function MiniBenefit({
    icon,
    title,
    desc,
}: {
    icon: ReactNode;
    title: string;
    desc: string;
}) {
    return (
        <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm backdrop-blur-xl">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                {icon}
            </div>

            <p className="font-bold text-slate-900">{title}</p>
            <p className="mt-1 text-sm text-slate-500">{desc}</p>
        </div>
    );
}

function ResultCard({
    label,
    value,
    icon,
}: {
    label: string;
    value: string;
    icon: ReactNode;
}) {
    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={value}
                initial={{ opacity: 0, y: 8, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.98 }}
                transition={{ duration: 0.2 }}
                className="rounded-2xl border border-white/10 bg-white/[0.05] p-4"
            >
                <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-emerald-300">
                    {icon}
                </div>

                <p className="text-xs font-medium text-slate-400">{label}</p>
                <p className="mt-1 text-lg font-black tracking-tight text-white">
                    {value}
                </p>
            </motion.div>
        </AnimatePresence>
    );
}