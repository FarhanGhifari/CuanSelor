"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Wallet, TrendingUp, TrendingDown, Target, Shield,
    Heart, Briefcase, ChevronRight, ChevronLeft,
    Check, Sparkles, Info, AlertCircle, Home, CreditCard,
    PiggyBank, BarChart3, Building2, DollarSign,
} from "lucide-react";

/* ── Types ─────────────────────────────────────────────────────────── */
export interface WizardData {
    fullName:           string | null;
    age:                number | null;
    gender:             "male" | "female" | null;
    monthlyIncome:      number | null;
    annualBonusMonths:  number | null;
    monthlyExpense:     number | null;
    savingsPercentage:  number | null;
    currentSavings:     number | null;
    totalDebt:          number | null;
    retirementAge:      number | null;
    lifestylePercent:   number | null;
    riskProfile:        "conservative" | "moderate" | "aggressive" | null;
    riskAnswers:        Record<string, number>;
    sector:             string | null;
    hasHealthInsurance: boolean;
    depositRate:        number | null;
    includePandemicRisk: boolean;
}

const INITIAL: WizardData = {
    fullName:           null,
    age:                null,
    gender:             null,
    monthlyIncome:      null,
    annualBonusMonths:  null,
    monthlyExpense:     null,
    savingsPercentage:  null,
    currentSavings:     null,
    totalDebt:          null,
    retirementAge:      null,
    lifestylePercent:   null,
    riskProfile:        null,
    riskAnswers:        {},
    sector:             null,
    hasHealthInsurance: false,
    depositRate:        null,
    includePandemicRisk: false,
};

/* ── Helpers ────────────────────────────────────────────────────────── */
const fmt = (n: number) => new Intl.NumberFormat("id-ID").format(n);

/* ── Design Tokens ──────────────────────────────────────────────────── */
const T = {
    blue:     "#0066cc",
    blueLight:"rgba(0,102,204,0.08)",
    blueMid:  "rgba(0,102,204,0.15)",
    ink:      "#1d1d1f",
    muted:    "#6e6e73",
    hairline: "#e0e0e0",
    canvas:   "#ffffff",
    success:  "#22c55e",
    danger:   "#ef4444",
    warning:  "#f59e0b",
};

/* ── Risk data ──────────────────────────────────────────────────────── */
const RISK_QUESTIONS = [
    {
        id: "q1",
        q: "Berapa lama kamu berencana berinvestasi?",
        emoji: "⏳",
        opts: [
            { label: "Kurang dari 2 tahun", sub: "Jangka pendek", score: 1 },
            { label: "2 – 5 tahun",         sub: "Jangka menengah", score: 2 },
            { label: "Lebih dari 5 tahun",  sub: "Jangka panjang", score: 3 },
        ],
    },
    {
        id: "q2",
        q: "Portofolio kamu tiba-tiba turun 20%. Kamu akan…",
        emoji: "📉",
        opts: [
            { label: "Jual semuanya",             sub: "Daripada rugi lebih banyak", score: 1 },
            { label: "Tahan dan tunggu pulih",    sub: "Market pasti naik lagi", score: 2 },
            { label: "Beli lebih banyak",          sub: "Ini kesempatan emas!", score: 3 },
        ],
    },
    {
        id: "q3",
        q: "Tujuan utama kamu berinvestasi?",
        emoji: "🎯",
        opts: [
            { label: "Jaga modal tetap aman",          sub: "Prioritas keamanan", score: 1 },
            { label: "Tumbuh stabil",                   sub: "Risiko terkontrol", score: 2 },
            { label: "Maksimalkan return",              sub: "Siap ambil risiko lebih", score: 3 },
        ],
    },
    {
        id: "q4",
        q: "Seberapa besar pengalaman investasimu?",
        emoji: "📊",
        opts: [
            { label: "Belum pernah investasi",          sub: "Masih belajar", score: 1 },
            { label: "Reksa dana atau deposito",        sub: "Sudah familiar", score: 2 },
            { label: "Saham, ETF, atau crypto",         sub: "Cukup berpengalaman", score: 3 },
        ],
    },
];

function calcRisk(ans: Record<string, number>): "conservative" | "moderate" | "aggressive" {
    const total = Object.values(ans).reduce((s, v) => s + v, 0);
    if (total <= 5) return "conservative";
    if (total <= 9) return "moderate";
    return "aggressive";
}

const RISK_RESULT = {
    conservative: {
        emoji: "🛡️",
        label: "Konservatif",
        desc: "Kamu prioritaskan keamanan modal. Deposito dan obligasi adalah teman terbaikmu.",
        color: T.blue,
        bg: T.blueLight,
        border: "rgba(0,102,204,0.2)",
    },
    moderate: {
        emoji: "⚖️",
        label: "Moderat",
        desc: "Kamu mencari keseimbangan antara risiko dan imbal hasil. Reksa dana campuran cocok untukmu.",
        color: "#d97706",
        bg: "rgba(245,158,11,0.08)",
        border: "rgba(245,158,11,0.2)",
    },
    aggressive: {
        emoji: "🚀",
        label: "Agresif",
        desc: "Kamu siap ambil risiko lebih besar untuk return maksimal. Saham dan ETF bisa jadi pilihanmu.",
        color: "#dc2626",
        bg: "rgba(239,68,68,0.08)",
        border: "rgba(239,68,68,0.2)",
    },
};

const SECTORS = [
    { label: "Pemerintahan / PNS",          icon: "🏛️" },
    { label: "BUMN / BUMD",                 icon: "🏢" },
    { label: "Swasta — Keuangan",            icon: "🏦" },
    { label: "Swasta — Teknologi",           icon: "💻" },
    { label: "Swasta — Manufaktur",          icon: "🏭" },
    { label: "Swasta — Kesehatan",           icon: "🏥" },
    { label: "Swasta — Pendidikan",          icon: "🎓" },
    { label: "Wiraswasta / Freelance",       icon: "💼" },
    { label: "Profesional (Dokter/Pengacara)", icon: "👔" },
    { label: "Lainnya",                      icon: "✨" },
];

/* ── Slide animation variant ────────────────────────────────────────── */
const EASE_IN  = [0.22, 1, 0.36, 1] as [number, number, number, number];
const EASE_OUT = [0.22, 1, 0.36, 1] as [number, number, number, number];

const slideVariant = (dir: 1 | -1) => ({
    initial:  { opacity: 0, x: 40 * dir, scale: 0.98 },
    animate:  { opacity: 1, x: 0,        scale: 1,    transition: { duration: 0.32, ease: EASE_IN  } },
    exit:     { opacity: 0, x: -40 * dir,scale: 0.98, transition: { duration: 0.22, ease: EASE_OUT } },
});

/* ── Currency Input ─────────────────────────────────────────────────── */
function CurrencyField({
    value, onChange, placeholder, autoFocus = false,
}: {
    value: number | null;
    onChange: (v: number | null) => void;
    placeholder?: string;
    autoFocus?: boolean;
}) {
    const [raw, setRaw] = useState(value !== null ? String(value) : "");
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (autoFocus) setTimeout(() => inputRef.current?.focus(), 350);
    }, [autoFocus]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const digits = e.target.value.replace(/\D/g, "");
        setRaw(digits);
        onChange(digits === "" ? null : Number(digits));
    };

    return (
        <div className="relative">
            <div className="absolute left-5 top-1/2 -translate-y-1/2 text-lg font-semibold pointer-events-none"
                style={{ color: value !== null ? T.blue : T.muted }}>
                Rp
            </div>
            <input
                ref={inputRef}
                type="text"
                inputMode="numeric"
                placeholder={placeholder ?? "0"}
                value={raw ? fmt(Number(raw)) : ""}
                onChange={handleChange}
                className="w-full pl-16 pr-6 py-5 text-2xl font-semibold bg-transparent border-0 border-b-2 transition-all outline-none"
                style={{
                    borderColor: value !== null ? T.blue : T.hairline,
                    color: T.ink,
                    letterSpacing: "-0.5px",
                }}
            />
        </div>
    );
}

/* ── Choice Chip ────────────────────────────────────────────────────── */
function Chip({
    selected, onClick, children, sub, icon, color,
}: {
    selected: boolean;
    onClick: () => void;
    children: React.ReactNode;
    sub?: string;
    icon?: React.ReactNode;
    color?: string;
}) {
    const activeColor = color ?? T.blue;
    return (
        <button
            type="button"
            onClick={onClick}
            className="w-full text-left flex items-center gap-4 px-5 py-4 rounded-2xl border-2 transition-all duration-200 active:scale-[0.98]"
            style={{
                borderColor:  selected ? activeColor : T.hairline,
                background:   selected ? `${activeColor}0d` : T.canvas,
                boxShadow:    selected ? `0 0 0 4px ${activeColor}20` : "none",
            }}
        >
            {icon && (
                <div className="shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-lg"
                    style={{ background: selected ? `${activeColor}15` : "rgba(0,0,0,0.04)" }}>
                    {icon}
                </div>
            )}
            <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm" style={{ color: selected ? activeColor : T.ink }}>
                    {children}
                </div>
                {sub && (
                    <div className="text-xs mt-0.5" style={{ color: T.muted }}>{sub}</div>
                )}
            </div>
            {selected && (
                <div className="shrink-0 w-5 h-5 rounded-full flex items-center justify-center"
                    style={{ background: activeColor }}>
                    <Check className="w-3 h-3 text-white" />
                </div>
            )}
        </button>
    );
}

/* ── Step header ────────────────────────────────────────────────────── */
function StepHeader({
    emoji, headline, sub,
}: {
    emoji: string;
    headline: string;
    sub?: string;
}) {
    return (
        <div className="mb-8">
            <div className="text-4xl mb-4">{emoji}</div>
            <h2 className="text-2xl font-bold leading-snug mb-2" style={{ color: T.ink }}>
                {headline}
            </h2>
            {sub && (
                <p className="text-base leading-relaxed" style={{ color: T.muted }}>{sub}</p>
            )}
        </div>
    );
}

/* ── Steps ──────────────────────────────────────────────────────────── */

function S0_Personal({ data, set }: { data: WizardData; set: (p: Partial<WizardData>) => void }) {
    return (
        <div>
            <StepHeader emoji="👋" headline="Kenalan dulu, yuk!" sub="Data ini penting untuk kalkulasi aktuaria yang akurat." />
            
            {/* Nama */}
            <div className="mb-6">
                <label className="block text-sm font-semibold mb-2" style={{ color: T.ink }}>
                    Nama Lengkap
                </label>
                <input
                    type="text"
                    placeholder="Contoh: Budi Santoso"
                    value={data.fullName || ""}
                    onChange={e => set({ fullName: e.target.value || null })}
                    className="w-full px-5 py-4 text-base rounded-2xl border-2 transition-all outline-none"
                    style={{
                        borderColor: data.fullName ? T.blue : T.hairline,
                        color: T.ink,
                    }}
                    autoFocus
                />
            </div>

            {/* Usia */}
            <div className="mb-6">
                <label className="block text-sm font-semibold mb-2" style={{ color: T.ink }}>
                    Usia Saat Ini
                </label>
                <div className="flex items-center gap-3">
                    <input
                        type="number"
                        min={18}
                        max={65}
                        placeholder="30"
                        value={data.age ?? ""}
                        onChange={e => set({ age: e.target.value ? Number(e.target.value) : null })}
                        className="w-28 py-4 px-4 border-2 rounded-2xl text-lg font-bold text-center outline-none transition-all"
                        style={{ borderColor: data.age ? T.blue : T.hairline, color: T.ink }}
                    />
                    <span className="text-base font-medium" style={{ color: T.muted }}>tahun</span>
                </div>
            </div>

            {/* Gender */}
            <div>
                <label className="block text-sm font-semibold mb-3" style={{ color: T.ink }}>
                    Jenis Kelamin
                </label>
                <div className="grid grid-cols-2 gap-3">
                    <Chip
                        selected={data.gender === "male"}
                        onClick={() => set({ gender: "male" })}
                        icon={<span className="text-2xl">👨</span>}
                    >
                        Laki-laki
                    </Chip>
                    <Chip
                        selected={data.gender === "female"}
                        onClick={() => set({ gender: "female" })}
                        icon={<span className="text-2xl">👩</span>}
                    >
                        Perempuan
                    </Chip>
                </div>
                <p className="text-xs mt-3" style={{ color: T.muted }}>
                    💡 Data ini digunakan untuk kalkulasi harapan hidup berdasarkan tabel mortalitas Indonesia
                </p>
            </div>
        </div>
    );
}

function S1_Income({ data, set }: { data: WizardData; set: (p: Partial<WizardData>) => void }) {
    const surplus = data.monthlyIncome !== null && data.monthlyExpense !== null
        ? data.monthlyIncome - data.monthlyExpense : null;
    return (
        <div>
            <StepHeader emoji="💰" headline="Berapa gaji bersihmu per bulan?" sub="Pendapatan setelah pajak & potongan lainnya." />
            <CurrencyField value={data.monthlyIncome} onChange={v => set({ monthlyIncome: v })} placeholder="5.000.000" autoFocus />
            {data.monthlyIncome !== null && (
                <motion.p initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className="mt-3 text-sm font-medium" style={{ color: T.blue }}>
                    👍 Oke, Rp {fmt(data.monthlyIncome)}/bulan tercatat!
                </motion.p>
            )}
        </div>
    );
}

function S2_Bonus({ data, set }: { data: WizardData; set: (p: Partial<WizardData>) => void }) {
    const bonusOpts = [
        { n: 0, label: "Tidak ada bonus", sub: "Saya tidak menerima bonus/THR" },
        { n: 1, label: "1× gaji per tahun", sub: "Contoh: hanya THR" },
        { n: 2, label: "2× gaji per tahun", sub: "Contoh: THR + bonus tahunan" },
        { n: 3, label: "3× gaji per tahun", sub: "Contoh: THR + 2 bonus" },
    ];
    return (
        <div>
            <StepHeader emoji="🎁" headline="Dapat bonus atau THR?" sub="Ini akan kami jadikan komponen penghasilan tahunanmu." />
            <div className="space-y-3">
                {bonusOpts.map(o => (
                    <Chip key={o.n} selected={data.annualBonusMonths === o.n}
                        onClick={() => set({ annualBonusMonths: o.n })}
                        icon={<span>{o.n === 0 ? "🚫" : o.n === 1 ? "🎁" : o.n === 2 ? "🎊" : "🏆"}</span>}
                        sub={o.sub}>
                        {o.label}
                    </Chip>
                ))}
            </div>
        </div>
    );
}

function S3_Expense({ data, set }: { data: WizardData; set: (p: Partial<WizardData>) => void }) {
    const surplus = data.monthlyIncome !== null && data.monthlyExpense !== null
        ? data.monthlyIncome - data.monthlyExpense : null;
    const pct = surplus !== null && data.monthlyIncome
        ? Math.round((surplus / data.monthlyIncome) * 100) : null;

    return (
        <div>
            <StepHeader emoji="🛒" headline="Rata-rata pengeluaranmu per bulan?" sub="Termasuk makan, transport, kos, tagihan, langganan, dan semua biaya rutin." />
            <CurrencyField value={data.monthlyExpense} onChange={v => set({ monthlyExpense: v })} placeholder="3.000.000" autoFocus />
            <AnimatePresence>
                {surplus !== null && (
                    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                        className="mt-4 p-4 rounded-2xl"
                        style={{ background: surplus >= 0 ? "rgba(34,197,94,0.08)" : "rgba(239,68,68,0.08)" }}>
                        {surplus >= 0 ? (
                            <>
                                <p className="text-sm font-semibold" style={{ color: T.success }}>
                                    ✓ Sisa Rp {fmt(surplus)}/bulan ({pct}% dari penghasilan)
                                </p>
                                <p className="text-xs mt-1" style={{ color: T.muted }}>
                                    {pct! >= 20 ? "Bagus! Kamu sudah memenuhi prinsip nabung 20%." : "Coba tingkatkan sisa hingga minimal 20% untuk masa depan yang lebih aman."}
                                </p>
                            </>
                        ) : (
                            <p className="text-sm font-semibold" style={{ color: T.danger }}>
                                ⚠ Pengeluaran melebihi penghasilan sebesar Rp {fmt(Math.abs(surplus))}
                            </p>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

function S4_Savings({ data, set }: { data: WizardData; set: (p: Partial<WizardData>) => void }) {
    const savingsOpts = [
        { pct: 10, label: "10% penghasilan", sub: "Baru mulai — setiap rupiah penting!", color: "#64748b" },
        { pct: 20, label: "20% penghasilan", sub: "Standar emas — prinsip 50/30/20", color: T.blue },
        { pct: 30, label: "30% penghasilan", sub: "Bagus! Kamu serius dengan masa depan", color: "#7c3aed" },
        { pct: 50, label: "50% penghasilan", sub: "Wow, kamu sudah hidup hemat total!", color: "#059669" },
    ];
    const monthlyTarget = data.monthlyIncome && data.savingsPercentage
        ? Math.round(data.monthlyIncome * data.savingsPercentage / 100) : null;

    return (
        <div>
            <StepHeader emoji="🐷" headline="Berapa % yang kamu alokasikan untuk nabung?" sub="Pilih target yang realistis — bisa kamu ubah kapan saja." />
            <div className="space-y-3">
                {savingsOpts.map(o => (
                    <Chip key={o.pct} selected={data.savingsPercentage === o.pct}
                        onClick={() => set({ savingsPercentage: o.pct })}
                        icon={<span className="text-lg">{o.pct === 10 ? "🌱" : o.pct === 20 ? "💡" : o.pct === 30 ? "🚀" : "⚡"}</span>}
                        sub={o.sub}
                        color={o.color}>
                        {o.label}
                    </Chip>
                ))}
            </div>
            {monthlyTarget && (
                <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                    className="mt-4 p-3.5 rounded-2xl flex items-center gap-3"
                    style={{ background: T.blueLight }}>
                    <PiggyBank className="w-5 h-5 shrink-0" style={{ color: T.blue }} />
                    <p className="text-sm font-medium" style={{ color: T.blue }}>
                        Target nabung: Rp {fmt(monthlyTarget)}/bulan
                    </p>
                </motion.div>
            )}
        </div>
    );
}

function S5_CurrentSavings({ data, set }: { data: WizardData; set: (p: Partial<WizardData>) => void }) {
    return (
        <div>
            <StepHeader emoji="🏦" headline="Total tabungan & investasimu saat ini?" sub="Rekening, deposito, reksa dana, saham, emas — semuanya. Kalau belum ada, isi 0." />
            <CurrencyField value={data.currentSavings} onChange={v => set({ currentSavings: v ?? 0 })} placeholder="0" autoFocus />
            {data.currentSavings !== null && data.currentSavings > 0 && (
                <motion.p initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
                    className="mt-3 text-sm font-medium" style={{ color: T.success }}>
                    🎉 Sudah punya modal Rp {fmt(data.currentSavings)} — mantap!
                </motion.p>
            )}
            {data.currentSavings === 0 && (
                <motion.p initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
                    className="mt-3 text-sm" style={{ color: T.muted }}>
                    Tidak apa-apa! Semua orang mulai dari nol 💪
                </motion.p>
            )}
        </div>
    );
}

function S6_Debt({ data, set }: { data: WizardData; set: (p: Partial<WizardData>) => void }) {
    const netWorth = (data.currentSavings ?? 0) - (data.totalDebt ?? 0);
    const showSummary = data.totalDebt !== null;

    return (
        <div>
            <StepHeader emoji="💳" headline="Ada utang atau cicilan aktif?" sub="KPR, cicilan motor/mobil, pinjol, kartu kredit. Isi 0 kalau tidak ada." />
            <CurrencyField value={data.totalDebt} onChange={v => set({ totalDebt: v ?? 0 })} placeholder="0" autoFocus />
            <AnimatePresence>
                {showSummary && (
                    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                        className="mt-4 p-4 rounded-2xl"
                        style={{ background: netWorth >= 0 ? "rgba(34,197,94,0.08)" : "rgba(239,68,68,0.08)" }}>
                        <p className="text-xs font-medium mb-1" style={{ color: T.muted }}>Net Worth kamu</p>
                        <p className="text-2xl font-bold" style={{ color: netWorth >= 0 ? T.success : T.danger, letterSpacing: "-0.5px" }}>
                            {netWorth >= 0 ? "" : "−"} Rp {fmt(Math.abs(netWorth))}
                        </p>
                        {netWorth < 0 && (
                            <p className="text-xs mt-2" style={{ color: T.muted }}>
                                Tidak perlu panik — dengan perencanaan yang baik, ini bisa diperbaiki 💪
                            </p>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

function S7_RetirementAge({ data, set }: { data: WizardData; set: (p: Partial<WizardData>) => void }) {
    const ageOpts = [
        { age: 45, label: "Umur 45", sub: "Pensiun dini — butuh persiapan ekstra keras", emoji: "⚡" },
        { age: 50, label: "Umur 50", sub: "Cukup agresif — masih sangat bisa dicapai", emoji: "💪" },
        { age: 55, label: "Umur 55", sub: "Rata-rata kebanyakan orang — realistis", emoji: "✅" },
        { age: 60, label: "Umur 60", sub: "Usia pensiun normal — lebih banyak waktu menabung", emoji: "🎯" },
    ];

    return (
        <div>
            <StepHeader emoji="🌴" headline="Kapan kamu ingin pensiun?" sub="Tidak harus angka pasti. Estimasi sudah cukup — bisa diubah nanti." />
            <div className="space-y-3 mb-5">
                {ageOpts.map(o => (
                    <Chip key={o.age} selected={data.retirementAge === o.age}
                        onClick={() => set({ retirementAge: o.age })}
                        icon={<span className="text-lg">{o.emoji}</span>}
                        sub={o.sub}>
                        {o.label}
                    </Chip>
                ))}
            </div>
            <div>
                <p className="text-xs font-medium mb-2" style={{ color: T.muted }}>Atau ketik usia tertentu</p>
                <div className="flex items-center gap-3">
                    <input
                        type="number"
                        min={30}
                        max={75}
                        placeholder="55"
                        value={data.retirementAge ?? ""}
                        onChange={e => set({ retirementAge: e.target.value ? Number(e.target.value) : null })}
                        className="w-28 py-3 px-4 border-2 rounded-2xl text-lg font-bold text-center outline-none transition-all"
                        style={{ borderColor: data.retirementAge ? T.blue : T.hairline, color: T.ink }}
                    />
                    <span className="text-base font-medium" style={{ color: T.muted }}>tahun</span>
                </div>
            </div>
        </div>
    );
}

function S8_Lifestyle({ data, set }: { data: WizardData; set: (p: Partial<WizardData>) => void }) {
    const opts = [
        { val: 60, label: "Lebih hemat dari sekarang", sub: "~60% dari pengeluaran sekarang", emoji: "🧘" },
        { val: 80, label: "Hampir sama seperti sekarang", sub: "~80% dari pengeluaran sekarang", emoji: "🏡" },
        { val: 100, label: "Gaya hidup yang sama atau lebih baik", sub: "~100% dari pengeluaran sekarang", emoji: "✈️" },
    ];
    const target = data.lifestylePercent && data.monthlyExpense
        ? Math.round(data.monthlyExpense * data.lifestylePercent / 100) : null;

    return (
        <div>
            <StepHeader emoji="🏡" headline="Gaya hidup saat pensiun?" sub="Bayangkan dirimu di masa pensiun — seberapa besar kebutuhan bulananmu?" />
            <div className="space-y-3">
                {opts.map(o => (
                    <Chip key={o.val} selected={data.lifestylePercent === o.val}
                        onClick={() => set({ lifestylePercent: o.val })}
                        icon={<span className="text-xl">{o.emoji}</span>}
                        sub={o.sub}>
                        {o.label}
                    </Chip>
                ))}
            </div>
            {target && (
                <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                    className="mt-4 p-3.5 rounded-2xl flex items-center gap-3"
                    style={{ background: T.blueLight }}>
                    <Target className="w-5 h-5 shrink-0" style={{ color: T.blue }} />
                    <p className="text-sm font-medium" style={{ color: T.blue }}>
                        Target pengeluaran pensiun: Rp {fmt(target)}/bulan
                    </p>
                </motion.div>
            )}
        </div>
    );
}

function S9_Risk({ data, set }: { data: WizardData; set: (p: Partial<WizardData>) => void }) {
    const [qIdx, setQIdx] = useState(() => {
        // Resume from last answered
        const answered = RISK_QUESTIONS.findIndex(q => data.riskAnswers[q.id] === undefined);
        return answered === -1 ? RISK_QUESTIONS.length - 1 : answered;
    });
    const answers = data.riskAnswers;
    const allDone = RISK_QUESTIONS.every(q => answers[q.id] !== undefined);
    const current = RISK_QUESTIONS[qIdx];

    const handleSelect = useCallback((score: number) => {
        const next = { ...answers, [current.id]: score };
        set({ riskAnswers: next });
        if (qIdx < RISK_QUESTIONS.length - 1) {
            setTimeout(() => setQIdx(i => i + 1), 260);
        } else {
            set({ riskProfile: calcRisk(next) });
        }
    }, [answers, current.id, qIdx, set]);

    const profile = data.riskProfile;

    return (
        <div>
            <StepHeader emoji="🧠" headline="Kenali profil risikomu" sub={`${RISK_QUESTIONS.length} pertanyaan singkat — jawab jujur sesuai dirimu ya!`} />

            {/* Dots */}
            <div className="flex gap-2 mb-6">
                {RISK_QUESTIONS.map((q, i) => (
                    <div key={i} className="h-1.5 flex-1 rounded-full transition-all duration-300"
                        style={{
                            background: answers[q.id] !== undefined
                                ? T.blue
                                : i === qIdx ? "rgba(0,102,204,0.3)" : T.hairline,
                        }}
                    />
                ))}
            </div>

            {!allDone ? (
                <AnimatePresence mode="wait">
                    <motion.div key={qIdx}
                        initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.22 }}>
                        <p className="text-base font-semibold mb-5" style={{ color: T.ink }}>
                            <span className="text-2xl mr-2">{current.emoji}</span>
                            {current.q}
                        </p>
                        <div className="space-y-3">
                            {current.opts.map(o => (
                                <Chip key={o.score}
                                    selected={answers[current.id] === o.score}
                                    onClick={() => handleSelect(o.score)}
                                    sub={o.sub}>
                                    {o.label}
                                </Chip>
                            ))}
                        </div>
                        {qIdx > 0 && (
                            <button type="button" onClick={() => setQIdx(i => i - 1)}
                                className="mt-4 text-xs flex items-center gap-1 transition-colors hover:opacity-70"
                                style={{ color: T.muted }}>
                                <ChevronLeft className="w-3.5 h-3.5" /> Pertanyaan sebelumnya
                            </button>
                        )}
                    </motion.div>
                </AnimatePresence>
            ) : profile ? (
                <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
                    className="p-6 rounded-3xl text-center"
                    style={{ background: RISK_RESULT[profile].bg, border: `2px solid ${RISK_RESULT[profile].border}` }}>
                    <div className="text-5xl mb-3">{RISK_RESULT[profile].emoji}</div>
                    <p className="text-xl font-bold mb-2" style={{ color: RISK_RESULT[profile].color }}>
                        Investor {RISK_RESULT[profile].label}
                    </p>
                    <p className="text-sm leading-relaxed" style={{ color: T.muted }}>
                        {RISK_RESULT[profile].desc}
                    </p>
                    <button type="button"
                        onClick={() => { setQIdx(0); set({ riskAnswers: {}, riskProfile: null }); }}
                        className="mt-4 text-xs underline underline-offset-2"
                        style={{ color: T.muted }}>
                        Ulangi kuesioner
                    </button>
                </motion.div>
            ) : null}
        </div>
    );
}

function S10_Sector({ data, set }: { data: WizardData; set: (p: Partial<WizardData>) => void }) {
    return (
        <div>
            <StepHeader emoji="🏢" headline="Kamu kerja di sektor apa?" sub="Ini membantu kami menyesuaikan proyeksi dengan kondisi nyata Indonesia." />
            <div className="grid grid-cols-2 gap-2.5">
                {SECTORS.map(s => (
                    <button key={s.label} type="button"
                        onClick={() => set({ sector: s.label })}
                        className="flex items-center gap-2.5 px-4 py-3.5 rounded-2xl border-2 text-left transition-all duration-200 active:scale-[0.97]"
                        style={{
                            borderColor: data.sector === s.label ? T.blue : T.hairline,
                            background:  data.sector === s.label ? T.blueLight : T.canvas,
                        }}>
                        <span className="text-xl">{s.icon}</span>
                        <span className="text-xs font-medium leading-tight" style={{ color: data.sector === s.label ? T.blue : T.ink }}>
                            {s.label}
                        </span>
                    </button>
                ))}
            </div>
        </div>
    );
}

function S11_Assumptions({ data, set }: { data: WizardData; set: (p: Partial<WizardData>) => void }) {
    const rateOpts = [
        { r: 3.5, label: "3,5%", sub: "Konservatif" },
        { r: 4.0, label: "4,0%", sub: "Standar bank" },
        { r: 4.5, label: "4,5%", sub: "Rata-rata 2025" },
        { r: 5.0, label: "5,0%", sub: "Optimistis" },
    ];

    return (
        <div>
            <StepHeader emoji="⚙️" headline="Asumsi terakhir..." sub="Ini dipakai untuk menghitung proyeksi yang lebih akurat." />

            <div className="mb-6">
                <p className="text-sm font-semibold mb-3" style={{ color: T.ink }}>Asumsi bunga deposito/tahun</p>
                <div className="grid grid-cols-4 gap-2">
                    {rateOpts.map(o => (
                        <button key={o.r} type="button"
                            onClick={() => set({ depositRate: o.r })}
                            className="py-3 px-2 rounded-2xl border-2 text-center transition-all duration-200 active:scale-[0.97]"
                            style={{
                                borderColor: data.depositRate === o.r ? T.blue : T.hairline,
                                background:  data.depositRate === o.r ? T.blueLight : T.canvas,
                            }}>
                            <div className="text-sm font-bold" style={{ color: data.depositRate === o.r ? T.blue : T.ink }}>{o.label}</div>
                            <div className="text-[10px] mt-0.5" style={{ color: T.muted }}>{o.sub}</div>
                        </button>
                    ))}
                </div>
            </div>

            <div className="space-y-3">
                <label className="flex items-start gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all"
                    style={{ borderColor: data.hasHealthInsurance ? T.blue : T.hairline, background: data.hasHealthInsurance ? T.blueLight : T.canvas }}>
                    <div className="relative mt-0.5">
                        <input type="checkbox" className="sr-only"
                            checked={data.hasHealthInsurance}
                            onChange={e => set({ hasHealthInsurance: e.target.checked })} />
                        <div className="w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all"
                            style={{ borderColor: data.hasHealthInsurance ? T.blue : T.hairline, background: data.hasHealthInsurance ? T.blue : "transparent" }}>
                            {data.hasHealthInsurance && <Check className="w-3 h-3 text-white" />}
                        </div>
                    </div>
                    <div>
                        <p className="text-sm font-semibold" style={{ color: T.ink }}>❤️ Saya punya asuransi kesehatan</p>
                        <p className="text-xs mt-0.5" style={{ color: T.muted }}>BPJS, asuransi swasta, atau dari kantor</p>
                    </div>
                </label>

                {!data.hasHealthInsurance && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
                        className="flex gap-2.5 p-3.5 rounded-2xl overflow-hidden"
                        style={{ background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.3)" }}>
                        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" style={{ color: T.warning }} />
                        <p className="text-xs leading-relaxed" style={{ color: "#92400e" }}>
                            Inflasi biaya kesehatan Indonesia mencapai &gt;10%/tahun. Kami sarankan kamu segera mendaftar BPJS.
                        </p>
                    </motion.div>
                )}

                <label className="flex items-start gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all"
                    style={{ borderColor: data.includePandemicRisk ? T.blue : T.hairline, background: data.includePandemicRisk ? T.blueLight : T.canvas }}>
                    <div className="relative mt-0.5">
                        <input type="checkbox" className="sr-only"
                            checked={data.includePandemicRisk}
                            onChange={e => set({ includePandemicRisk: e.target.checked })} />
                        <div className="w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all"
                            style={{ borderColor: data.includePandemicRisk ? T.blue : T.hairline, background: data.includePandemicRisk ? T.blue : "transparent" }}>
                            {data.includePandemicRisk && <Check className="w-3 h-3 text-white" />}
                        </div>
                    </div>
                    <div>
                        <p className="text-sm font-semibold" style={{ color: T.ink }}>🛡️ Sertakan buffer risiko pandemi</p>
                        <p className="text-xs mt-0.5" style={{ color: T.muted }}>Proyeksi akan lebih konservatif dengan buffer risiko krisis</p>
                    </div>
                </label>
            </div>
        </div>
    );
}

/* ── Summary ────────────────────────────────────────────────────────── */
function Summary({ data, onEdit }: { data: WizardData; onEdit: (step: number) => void }) {
    const summaryItems = [
        { step: 0,  icon: "👤", label: "Nama Lengkap",            val: data.fullName         ?? "-" },
        { step: 0,  icon: "🎂", label: "Usia",                    val: data.age              ? `${data.age} tahun` : "-" },
        { step: 0,  icon: data.gender === "male" ? "👨" : "👩", label: "Jenis Kelamin", val: data.gender === "male" ? "Laki-laki" : data.gender === "female" ? "Perempuan" : "-" },
        { step: 1,  icon: "💰", label: "Penghasilan Bulanan",     val: data.monthlyIncome    ? `Rp ${fmt(data.monthlyIncome)}`    : "-" },
        { step: 2,  icon: "🎁", label: "Bonus/THR",               val: data.annualBonusMonths !== null ? (data.annualBonusMonths === 0 ? "Tidak ada" : `${data.annualBonusMonths}× gaji/tahun`) : "-" },
        { step: 3,  icon: "🛒", label: "Pengeluaran Bulanan",     val: data.monthlyExpense   ? `Rp ${fmt(data.monthlyExpense)}`   : "-" },
        { step: 4,  icon: "🐷", label: "Target Tabungan",         val: data.savingsPercentage !== null ? `${data.savingsPercentage}%/bulan` : "-" },
        { step: 5,  icon: "🏦", label: "Tabungan & Investasi",    val: data.currentSavings   !== null ? `Rp ${fmt(data.currentSavings)}` : "-" },
        { step: 6,  icon: "💳", label: "Total Utang",             val: data.totalDebt        !== null ? `Rp ${fmt(data.totalDebt)}` : "-" },
        { step: 7,  icon: "🌴", label: "Target Pensiun",          val: data.retirementAge    ? `Usia ${data.retirementAge} tahun` : "-" },
        { step: 8,  icon: "🏡", label: "Gaya Hidup Pensiun",      val: data.lifestylePercent ? `${data.lifestylePercent}% dari sekarang` : "-" },
        { step: 9,  icon: "🧠", label: "Profil Risiko",           val: data.riskProfile      ? `${RISK_RESULT[data.riskProfile].emoji} ${RISK_RESULT[data.riskProfile].label}` : "-" },
        { step: 10, icon: "🏢", label: "Sektor Pekerjaan",        val: data.sector           ?? "-" },
    ];

    return (
        <div>
            <div className="text-center mb-8">
                <div className="text-5xl mb-3">✅</div>
                <h2 className="text-2xl font-bold mb-2" style={{ color: T.ink }}>Semuanya sudah diisi!</h2>
                <p className="text-base" style={{ color: T.muted }}>
                    Periksa sekali lagi sebelum kami menghitung proyeksi pensiunmu.
                </p>
            </div>
            <div className="rounded-3xl border overflow-hidden" style={{ borderColor: T.hairline }}>
                {summaryItems.map((item, i) => (
                    <div key={item.label}
                        className="flex items-center gap-3 px-5 py-4 hover:bg-gray-50 transition-colors cursor-default"
                        style={{ borderTop: i > 0 ? `1px solid ${T.hairline}` : "none" }}>
                        <span className="text-xl shrink-0">{item.icon}</span>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs" style={{ color: T.muted }}>{item.label}</p>
                            <p className="text-sm font-semibold truncate" style={{ color: T.ink }}>{item.val}</p>
                        </div>
                        <button type="button" onClick={() => onEdit(item.step)}
                            className="shrink-0 text-xs px-3 py-1.5 rounded-full border transition-all hover:bg-blue-50"
                            style={{ color: T.blue, borderColor: "rgba(0,102,204,0.25)" }}>
                            Ubah
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

/* ── Progress bar ────────────────────────────────────────────────────── */
function TopProgress({ step, total }: { step: number; total: number }) {
    return (
        <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden mb-1">
            <motion.div
                className="h-full rounded-full"
                style={{ background: `linear-gradient(90deg, ${T.blue}, #0091ff)` }}
                initial={false}
                animate={{ width: `${(step / total) * 100}%` }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            />
        </div>
    );
}

/* ══ Main Wizard ════════════════════════════════════════════════════════ */

const TOTAL = 12; // steps 0-11 (0 = personal, 11 = assumptions), + summary

const STEP_CONFIG = [
    { label: "Data Diri",    validate: (d: WizardData) => d.fullName !== null && d.age !== null && d.gender !== null },
    { label: "Gaji",         validate: (d: WizardData) => d.monthlyIncome !== null },
    { label: "Bonus",        validate: (d: WizardData) => d.annualBonusMonths !== null },
    { label: "Pengeluaran",  validate: (d: WizardData) => d.monthlyExpense !== null },
    { label: "Nabung",       validate: (d: WizardData) => d.savingsPercentage !== null },
    { label: "Tabungan",     validate: (d: WizardData) => d.currentSavings !== null },
    { label: "Utang",        validate: (d: WizardData) => d.totalDebt !== null },
    { label: "Pensiun",      validate: (d: WizardData) => d.retirementAge !== null },
    { label: "Gaya Hidup",   validate: (d: WizardData) => d.lifestylePercent !== null },
    { label: "Risiko",       validate: (d: WizardData) => d.riskProfile !== null },
    { label: "Pekerjaan",    validate: (d: WizardData) => d.sector !== null },
    { label: "Asumsi",       validate: (d: WizardData) => d.depositRate !== null },
];

export function OnboardingWizard({
    onComplete, isPending, error,
}: {
    onComplete: (data: WizardData) => void;
    isPending: boolean;
    error: string | null;
}) {
    const [step, setStep]   = useState(0);
    const [showSummary, setShowSummary] = useState(false);
    const [dir, setDir]     = useState<1 | -1>(1);
    const [data, setDataRaw] = useState<WizardData>(INITIAL);
    const topRef = useRef<HTMLDivElement>(null);

    const set = useCallback((patch: Partial<WizardData>) =>
        setDataRaw(prev => ({ ...prev, ...patch })), []);

    useEffect(() => {
        topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, [step, showSummary]);

    const canNext = showSummary ? true : STEP_CONFIG[step]?.validate(data) ?? true;

    const goNext = () => {
        if (showSummary) { onComplete(data); return; }
        if (step < TOTAL - 1) { setDir(1); setStep(s => s + 1); }
        else { setDir(1); setShowSummary(true); }
    };

    const goBack = () => {
        if (showSummary) { setDir(-1); setShowSummary(false); return; }
        if (step > 0) { setDir(-1); setStep(s => s - 1); }
    };

    const handleEdit = (s: number) => {
        setDir(-1);
        setShowSummary(false);
        setStep(s);
    };

    const v = slideVariant(dir);
    const currentStepLabel = showSummary ? "Ringkasan" : STEP_CONFIG[step]?.label ?? "";

    return (
        <div ref={topRef} className="w-full max-w-lg mx-auto">
            {/* Top progress */}
            <div className="mb-4 px-1">
                <TopProgress step={showSummary ? TOTAL : step + 1} total={TOTAL} />
                <div className="flex justify-between mt-1.5">
                    <span className="text-xs font-medium" style={{ color: T.blue }}>{currentStepLabel}</span>
                    <span className="text-xs" style={{ color: T.muted }}>
                        {showSummary ? "Selesai!" : `${step + 1} / ${TOTAL}`}
                    </span>
                </div>
            </div>

            {/* Card */}
            <div className="bg-white rounded-3xl shadow-lg border px-7 py-8 min-h-[420px] flex flex-col" style={{ borderColor: T.hairline }}>

                {error && (
                    <div className="mb-5 flex items-center gap-2.5 p-4 rounded-2xl text-sm"
                        style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", color: T.danger }}>
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        {error}
                    </div>
                )}

                {/* Step content */}
                <div className="flex-1">
                    <AnimatePresence mode="wait" custom={dir}>
                        {showSummary ? (
                            <motion.div key="summary" variants={v} initial="initial" animate="animate" exit="exit">
                                <Summary data={data} onEdit={handleEdit} />
                            </motion.div>
                        ) : (
                            <motion.div key={step} variants={v} initial="initial" animate="animate" exit="exit">
                                {step === 0  && <S0_Personal        data={data} set={set} />}
                                {step === 1  && <S1_Income          data={data} set={set} />}
                                {step === 2  && <S2_Bonus           data={data} set={set} />}
                                {step === 3  && <S3_Expense         data={data} set={set} />}
                                {step === 4  && <S4_Savings         data={data} set={set} />}
                                {step === 5  && <S5_CurrentSavings  data={data} set={set} />}
                                {step === 6  && <S6_Debt            data={data} set={set} />}
                                {step === 7  && <S7_RetirementAge   data={data} set={set} />}
                                {step === 8  && <S8_Lifestyle       data={data} set={set} />}
                                {step === 9  && <S9_Risk            data={data} set={set} />}
                                {step === 10 && <S10_Sector         data={data} set={set} />}
                                {step === 11 && <S11_Assumptions    data={data} set={set} />}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Nav */}
                <div className="flex gap-3 mt-8 pt-6 border-t" style={{ borderColor: T.hairline }}>
                    {(step > 0 || showSummary) && (
                        <button type="button" onClick={goBack}
                            className="flex items-center gap-1.5 px-5 py-3.5 rounded-2xl border text-sm font-medium transition-all hover:bg-gray-50 active:scale-[0.97]"
                            style={{ borderColor: T.hairline, color: T.muted }}>
                            <ChevronLeft className="w-4 h-4" /> Kembali
                        </button>
                    )}
                    <button type="button" onClick={goNext}
                        disabled={!canNext || (isPending && showSummary)}
                        className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl text-sm font-semibold text-white transition-all active:scale-[0.97] disabled:opacity-40 disabled:cursor-not-allowed"
                        style={{ background: canNext ? `linear-gradient(135deg, ${T.blue}, #0091ff)` : "#d1d5db" }}>
                        {isPending && showSummary ? (
                            <>
                                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                                </svg>
                                Menyimpan...
                            </>
                        ) : showSummary ? (
                            <><Sparkles className="w-4 h-4" /> Hitung Proyeksiku!</>
                        ) : step === TOTAL ? (
                            <>Lihat Ringkasan <ChevronRight className="w-4 h-4" /></>
                        ) : (
                            <>Lanjut <ChevronRight className="w-4 h-4" /></>
                        )}
                    </button>
                </div>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-3 mt-6 text-center">
                {[
                    { icon: "🔒", title: "Aman & Privat",  desc: "Data terenkripsi" },
                    { icon: "🤖", title: "Didukung AI",    desc: "Analisis cerdas" },
                    { icon: "🎯", title: "Goal-Oriented",  desc: "Pantau progresmu" },
                ].map(b => (
                    <div key={b.title} className="py-3 px-2 rounded-2xl" style={{ background: T.blueLight }}>
                        <div className="text-2xl mb-1">{b.icon}</div>
                        <div className="text-xs font-semibold mb-0.5" style={{ color: T.blue }}>{b.title}</div>
                        <div className="text-[10px]" style={{ color: T.muted }}>{b.desc}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}
