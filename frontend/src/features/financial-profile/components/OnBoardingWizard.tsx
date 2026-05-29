"use client";

import { useState, useRef, useEffect, useCallback, useLayoutEffect } from "react";
import { createPortal } from "react-dom";
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
    savingsPercentage:  number | null;
    currentSavings:     number | null;
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
    savingsPercentage:  null,
    currentSavings:     null,
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
    blue:     "#10B981", // CuanSelor Emerald Green
    blueLight:"rgba(16, 185, 129, 0.08)",
    blueMid:  "rgba(16, 185, 129, 0.15)",
    ink:      "#1d1d1f",
    muted:    "#6e6e73",
    hairline: "#e0e0e0",
    canvas:   "#ffffff",
    success:  "#22c55e",
    danger:   "#ef4444",
    warning:  "#f59e0b",
};

/* ── Risk Assessment Definitions ───────────────────────────────────── */
export const RISK_QUESTIONS = [
    {
        id: "age",
        q: "Berapa usia kamu saat ini?",
        emoji: "🎂",
        type: "number",
        placeholder: "Contoh: 32",
        unit: "tahun",
    },
    {
        id: "annual_income",
        q: "Berapa total pendapatan kamu dalam 1 tahun?",
        emoji: "💰",
        type: "currency",
        placeholder: "Contoh: 120000000",
        hint: "Termasuk gaji, bonus, dan pendapatan lainnya",
    },
    {
        id: "loan_amount",
        q: "Berapa jumlah pinjaman yang ingin kamu ajukan atau analisis?",
        emoji: "💳",
        type: "currency",
        placeholder: "Contoh: 35000000",
        hint: "Total pinjaman yang sedang berjalan atau yang direncanakan",
    },
    {
        id: "loan_duration_months",
        q: "Berapa lama durasi pinjaman?",
        emoji: "📅",
        type: "number",
        placeholder: "Contoh: 24",
        unit: "bulan",
    },
    {
        id: "interest_rate",
        q: "Berapa bunga pinjaman per tahun?",
        emoji: "📊",
        type: "percentage",
        placeholder: "Contoh: 8.5",
        hint: "Masukkan dalam persen, contoh: 8.5 untuk 8.5%",
        unit: "%",
    },
    {
        id: "debt_to_income_ratio",
        q: "Berapa porsi cicilan/hutang bulanan dibanding pendapatan bulanan?",
        emoji: "⚖️",
        type: "percentage",
        placeholder: "Contoh: 30",
        hint: "Dihitung dari total cicilan bulanan dibagi pendapatan bulanan, dalam persen",
        unit: "%",
    },
    {
        id: "monthly_expenses",
        q: "Berapa total pengeluaran rutin kamu per bulan?",
        emoji: "🛒",
        type: "currency",
        placeholder: "Contoh: 4500000",
        hint: "Termasuk kebutuhan sehari-hari, transportasi, dll",
    },
    {
        id: "savings_balance",
        q: "Berapa total tabungan atau dana darurat kamu saat ini?",
        emoji: "🏦",
        type: "currency",
        placeholder: "Contoh: 25000000",
        hint: "Dana yang bisa diakses sewaktu-waktu",
    },
    {
        id: "employment_stability_years",
        q: "Sudah berapa tahun kamu memiliki pekerjaan atau penghasilan yang stabil?",
        emoji: "💼",
        type: "number",
        placeholder: "Contoh: 6",
        unit: "tahun",
    },
    {
        id: "previous_default_count",
        q: "Berapa kali kamu pernah gagal bayar atau telat berat membayar pinjaman/tagihan?",
        emoji: "⚠️",
        type: "select",
        opts: [
            { label: "Tidak pernah", sub: "Selalu bayar tepat waktu", score: 0 },
            { label: "1 kali", sub: "Pernah telat sekali", score: 1 },
            { label: "2 kali atau lebih", sub: "Beberapa kali telat", score: 2 },
        ],
    },
];

export function calcRisk(ans: Record<string, number>): "conservative" | "moderate" | "aggressive" {
    // Calculate based on financial health indicators
    const debtRatio = ans.debt_to_income_ratio || 0;
    const defaultCount = ans.previous_default_count || 0;
    const stabilityYears = ans.employment_stability_years || 0;
    
    // High risk indicators
    if (debtRatio > 40 || defaultCount >= 2 || stabilityYears < 2) {
        return "conservative";
    }
    
    // Low risk indicators  
    if (debtRatio < 30 && defaultCount === 0 && stabilityYears >= 5) {
        return "aggressive";
    }
    
    // Medium risk
    return "moderate";
}

const RISK_RESULT = {
    conservative: {
        emoji: "🛡️",
        label: "Konservatif",
        desc: "Profil finansial kamu menunjukkan perlu kehati-hatian ekstra. Fokus pada stabilitas dan kurangi beban hutang.",
        color: T.blue,
        bg: T.blueLight,
        border: "rgba(16, 185, 129, 0.2)",
    },
    moderate: {
        emoji: "⚖️",
        label: "Moderat",
        desc: "Profil finansial kamu cukup seimbang. Kamu bisa mengambil risiko investasi dengan bijak sambil menjaga stabilitas.",
        color: "#d97706",
        bg: "rgba(245,158,11,0.08)",
        border: "rgba(245,158,11,0.2)",
    },
    aggressive: {
        emoji: "🚀",
        label: "Agresif",
        desc: "Profil finansial kamu sangat solid! Kamu punya ruang untuk investasi agresif dan mengambil peluang lebih besar.",
        color: "#dc2626",
        bg: "rgba(239,68,68,0.08)",
        border: "rgba(239,68,68,0.2)",
    },
};

export const SECTORS = [
    { label: "Pertanian, Kehutanan, dan Perikanan", icon: "🌾" },
    { label: "Pertambangan dan Penggalian", icon: "⛏️" },
    { label: "Industri", icon: "🏭" },
    { label: "Penyediaan Listrik, Gas, Uap/Air Panas, dan Udara Dingin", icon: "⚡" },
    { label: "Penyediaan Air, Pengelolaan Air Limbah, Penanganan Limbah, dan Remediasi", icon: "💧" },
    { label: "Konstruksi", icon: "🏗️" },
    { label: "Perdagangan Besar dan Eceran", icon: "🛒" },
    { label: "Transportasi dan Penyimpanan", icon: "🚚" },
    { label: "Penyediaan Akomodasi dan Penyediaan Makan Minum", icon: "🏨" },
    { label: "Aktivitas Penerbitan dan Telekomunikasi", icon: "📡" },
    { label: "Aktivitas Keuangan dan Asuransi", icon: "🏦" },
    { label: "Aktivitas Real Estat", icon: "🏢" },
    { label: "Aktivitas Profesional, Ilmiah, dan Teknis dan Aktivitas Administratif dan Penunjang Usaha", icon: "💼" },
    { label: "Administrasi Pemerintahan dan Pertahanan, serta Jaminan Sosial Wajib", icon: "🏛️" },
    { label: "Pendidikan", icon: "🎓" },
    { label: "Aktivitas Kesehatan Manusia dan Aktivitas Sosial", icon: "🏥" },
    { label: "Kesenian, Aktivitas Jasa Lainnya, Aktivitas Rumah Tangga, dan Aktivitas Badan Internasional", icon: "🎨" },
    { label: "Rata-rata", icon: "📊" },
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
            className="w-full text-left flex items-center gap-4 px-4 py-3 rounded-2xl border-2 transition-all duration-200 active:scale-[0.98]"
            style={{
                borderColor:  selected ? activeColor : T.hairline,
                background:   selected ? `${activeColor}0d` : T.canvas,
                boxShadow:    selected ? `0 0 0 4px ${activeColor}20` : "none",
            }}
        >
            {icon && (
                <div className="shrink-0 w-9 h-9 rounded-xl flex items-center justify-center text-lg"
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
    emoji?: string;
    headline: string;
    sub?: string;
}) {
    return (
        <div className="mb-5">
            {emoji ? <div className="text-3xl mb-2">{emoji}</div> : null}
            <h2 className="text-lg font-bold leading-snug mb-1.5" style={{ color: T.ink }}>
                {headline}
            </h2>
            {sub && (
                <p className="text-sm leading-relaxed" style={{ color: T.muted }}>{sub}</p>
            )}
        </div>
    );
}

/* ── Steps ──────────────────────────────────────────────────────────── */

function S0_Personal({ data, set }: { data: WizardData; set: (p: Partial<WizardData>) => void }) {
    return (
        <div>
            <StepHeader headline="Kenalan dulu, yuk 👋" sub="Data ini penting untuk kalkulasi aktuaria yang akurat." />
            
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
                        type="text"
                        inputMode="numeric"
                        placeholder="30"
                        value={data.age ?? ""}
                        onChange={e => {
                            const val = e.target.value.replace(/\D/g, "");
                            set({ age: val === "" ? null : Number(val) });
                        }}
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
                <div className="flex items-center gap-1.5 mt-3 text-xs" style={{ color: T.muted }}>
                    <Info size={14} className="shrink-0 text-blue-500" />
                    <span>Data ini digunakan untuk kalkulasi harapan hidup berdasarkan tabel mortalitas Indonesia</span>
                </div>
            </div>
        </div>
    );
}

function S1_Income({ data, set }: { data: WizardData; set: (p: Partial<WizardData>) => void }) {
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

function S4_Savings({ data, set }: { data: WizardData; set: (p: Partial<WizardData>) => void }) {
    const savingsOpts = [
        { pct: 10, label: "10% penghasilan", sub: "Baru mulai - setiap rupiah penting!", color: "#64748b" },
        { pct: 20, label: "20% penghasilan", sub: "Standar emas - prinsip 50/30/20", color: T.blue },
        { pct: 30, label: "30% penghasilan", sub: "Bagus! Kamu serius dengan masa depan", color: "#7c3aed" },
        { pct: 50, label: "50% penghasilan", sub: "Wow, kamu sudah hidup hemat total!", color: "#059669" },
    ];
    const monthlyTarget = data.monthlyIncome && data.savingsPercentage
        ? Math.round(data.monthlyIncome * data.savingsPercentage / 100) : null;

    return (
        <div>
            <StepHeader emoji="🐷" headline="Berapa % yang kamu alokasikan untuk nabung?" sub="Pilih persentase dari gaji bulanan Anda yang disisihkan untuk ditabung/investasi (contoh: 20% dari gaji bulanan)." />
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
            <StepHeader emoji="🏦" headline="Total tabungan & investasimu saat ini?" sub="Rekening, deposito, reksa dana, saham, emas - semuanya. Kalau belum ada, isi 0." />
            <CurrencyField value={data.currentSavings} onChange={v => set({ currentSavings: v ?? 0 })} placeholder="0" autoFocus />
            {data.currentSavings !== null && data.currentSavings > 0 && (
                <motion.p initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
                    className="mt-3 text-sm font-medium" style={{ color: T.success }}>
                    🎉 Sudah punya modal Rp {fmt(data.currentSavings)} - mantap!
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

function S7_RetirementAge({ data, set }: { data: WizardData; set: (p: Partial<WizardData>) => void }) {
    const ageOpts = [
        { age: 45, label: "Umur 45", sub: "Pensiun dini - butuh persiapan ekstra keras", emoji: "⚡" },
        { age: 50, label: "Umur 50", sub: "Cukup agresif - masih sangat bisa dicapai", emoji: "💪" },
        { age: 55, label: "Umur 55", sub: "Rata-rata kebanyakan orang - realistis", emoji: "✅" },
        { age: 60, label: "Umur 60", sub: "Usia pensiun normal - lebih banyak waktu menabung", emoji: "🎯" },
    ];

    return (
        <div>
            <StepHeader emoji="🌴" headline="Kapan kamu ingin pensiun?" sub="Tidak harus angka pasti. Estimasi sudah cukup - bisa diubah nanti." />
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
                        type="text"
                        inputMode="numeric"
                        placeholder="55"
                        value={data.retirementAge ?? ""}
                        onChange={e => {
                            const val = e.target.value.replace(/\D/g, "");
                            set({ retirementAge: val === "" ? null : Number(val) });
                        }}
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
    const target = data.lifestylePercent && data.monthlyIncome
        ? Math.round(data.monthlyIncome * data.lifestylePercent / 100) : null;

    return (
        <div>
            <StepHeader emoji="🏡" headline="Gaya hidup saat pensiun?" sub="Masukkan persentase dari gaji terakhir yang kamu butuhkan per bulan." />
            <div className="mb-4">
                <label className="block text-sm font-semibold mb-2" style={{ color: T.ink }}>
                    Persentase kebutuhan
                </label>
                <div className="flex items-center gap-3">
                    <input
                        type="text"
                        inputMode="numeric"
                        placeholder="80"
                        value={data.lifestylePercent ?? ""}
                        onChange={e => {
                            const val = e.target.value.replace(/\D/g, "");
                            set({ lifestylePercent: val === "" ? null : Number(val) });
                        }}
                        className="w-28 py-3 px-4 border-2 rounded-2xl text-lg font-bold text-center outline-none transition-all"
                        style={{ borderColor: data.lifestylePercent ? T.blue : T.hairline, color: T.ink }}
                    />
                    <span className="text-base font-medium" style={{ color: T.muted }}>% dari gaji terakhir</span>
                </div>
                <p className="text-xs mt-2" style={{ color: T.muted }}>
                    Contoh: 80 berarti kebutuhanmu 80% dari gaji terakhir.
                </p>
            </div>
            {target && (
                <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                    className="mt-4 p-3.5 rounded-2xl flex items-center gap-3"
                    style={{ background: T.blueLight }}>
                    <Target className="w-5 h-5 shrink-0" style={{ color: T.blue }} />
                    <p className="text-sm font-medium" style={{ color: T.blue }}>
                        Target kebutuhan pensiun: Rp {fmt(target)}/bulan
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

    const handleSelect = useCallback((value: number) => {
        const next = { ...answers, [current.id]: value };
        set({ riskAnswers: next });
        if (qIdx < RISK_QUESTIONS.length - 1) {
            setTimeout(() => setQIdx(i => i + 1), 260);
        } else {
            set({ riskProfile: calcRisk(next) });
        }
    }, [answers, current.id, qIdx, set]);

    const handleInputChange = useCallback((value: number | null) => {
        if (value !== null) {
            const next = { ...answers, [current.id]: value };
            set({ riskAnswers: next });
        }
    }, [answers, current.id, set]);

    const handleNext = useCallback(() => {
        if (answers[current.id] !== undefined) {
            if (qIdx < RISK_QUESTIONS.length - 1) {
                setQIdx(i => i + 1);
            } else {
                set({ riskProfile: calcRisk(answers) });
            }
        }
    }, [answers, current.id, qIdx, set]);

    const profile = data.riskProfile;

    return (
        <div>
            <StepHeader emoji="🧠" headline="Analisis Profil Finansial" sub={`${RISK_QUESTIONS.length} pertanyaan untuk menentukan profil risiko kamu`} />

            {/* Progress Dots */}
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
                        <p className="text-base font-semibold mb-2" style={{ color: T.ink }}>
                            <span className="text-2xl mr-2">{current.emoji}</span>
                            {current.q}
                        </p>
                        {current.hint && (
                            <p className="text-xs mb-4" style={{ color: T.muted }}>
                                {current.hint}
                            </p>
                        )}

                        {/* Render based on question type */}
                        {current.type === "select" && current.opts ? (
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
                        ) : current.type === "currency" ? (
                            <div>
                                <CurrencyField
                                    value={answers[current.id] ?? null}
                                    onChange={handleInputChange}
                                    placeholder={current.placeholder}
                                    autoFocus={true}
                                />
                                <button
                                    type="button"
                                    onClick={handleNext}
                                    disabled={answers[current.id] === undefined}
                                    className="mt-4 w-full py-3 rounded-xl font-semibold transition-all disabled:opacity-50"
                                    style={{
                                        background: answers[current.id] !== undefined ? T.blue : T.hairline,
                                        color: answers[current.id] !== undefined ? "white" : T.muted,
                                    }}>
                                    Lanjut
                                </button>
                            </div>
                        ) : current.type === "number" || current.type === "percentage" ? (
                            <div>
                                <div className="relative">
                                    <input
                                        type="text"
                                        inputMode="numeric"
                                        value={answers[current.id] !== undefined ? String(answers[current.id]) : ""}
                                        onChange={(e) => {
                                            const val = e.target.value.replace(/\D/g, "");
                                            handleInputChange(val === "" ? null : Number(val));
                                        }}
                                        placeholder={current.placeholder}
                                        autoFocus
                                        className="w-full px-5 py-4 text-lg font-semibold rounded-2xl border-2 transition-all outline-none"
                                        style={{
                                            borderColor: answers[current.id] !== undefined ? T.blue : T.hairline,
                                            background: T.canvas,
                                            color: T.ink,
                                        }}
                                    />
                                    {current.unit && (
                                        <span className="absolute right-5 top-1/2 -translate-y-1/2 text-lg font-semibold pointer-events-none"
                                            style={{ color: T.muted }}>
                                            {current.unit}
                                        </span>
                                    )}
                                </div>
                                <button
                                    type="button"
                                    onClick={handleNext}
                                    disabled={answers[current.id] === undefined}
                                    className="mt-4 w-full py-3 rounded-xl font-semibold transition-all disabled:opacity-50"
                                    style={{
                                        background: answers[current.id] !== undefined ? T.blue : T.hairline,
                                        color: answers[current.id] !== undefined ? "white" : T.muted,
                                    }}>
                                    Lanjut
                                </button>
                            </div>
                        ) : null}

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
                        Profil Risiko: {RISK_RESULT[profile].label}
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
    const [isOpen, setIsOpen] = useState(false);
    const triggerRef = useRef<HTMLButtonElement>(null);
    const [menuPos, setMenuPos] = useState<{ top: number; left: number; width: number } | null>(null);

    useLayoutEffect(() => {
        if (!isOpen) return;
        const rect = triggerRef.current?.getBoundingClientRect();
        if (!rect) return;
        setMenuPos({ top: rect.bottom + 8, left: rect.left, width: rect.width });
    }, [isOpen]);

    useEffect(() => {
        if (!isOpen) return;
        const handleResize = () => setIsOpen(false);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [isOpen]);

    return (
        <div>
            <StepHeader emoji="🏢" headline="Kamu kerja di sektor apa?" sub="Ini membantu kami menyesuaikan proyeksi dengan kondisi nyata Indonesia." />
            <div className="mb-4">
                <label className="block text-sm font-semibold mb-2" style={{ color: T.ink }}>
                    Pilih sektor pekerjaan
                </label>
                <div className="relative">
                    <button
                        type="button"
                        onClick={() => setIsOpen(v => !v)}
                        ref={triggerRef}
                        className="w-full flex items-center justify-between px-4 py-3 rounded-2xl border-2 outline-none transition-all font-semibold text-sm text-left"
                        style={{ borderColor: data.sector ? T.blue : T.hairline, color: T.ink, background: T.canvas }}
                    >
                        <span className="truncate mr-2">
                            {data.sector ? (
                                <>
                                    <span className="mr-2">{SECTORS.find(s => s.label === data.sector)?.icon || "🏢"}</span>
                                    {data.sector}
                                </>
                            ) : (
                                "Pilih sektor"
                            )}
                        </span>
                        <span className="text-xs" style={{ color: T.muted }}>▼</span>
                    </button>

                    {isOpen && menuPos && createPortal(
                        <>
                            <div
                                className="fixed inset-0 z-30"
                                onClick={() => setIsOpen(false)}
                            />
                            <div
                                className="fixed z-40 bg-white border border-gray-100 rounded-2xl shadow-xl max-h-60 overflow-y-auto overflow-x-auto py-1"
                                style={{ top: menuPos.top, left: menuPos.left, width: menuPos.width }}
                            >
                                {SECTORS.map(s => (
                                    <button
                                        key={s.label}
                                        type="button"
                                        onClick={() => {
                                            set({ sector: s.label });
                                            setIsOpen(false);
                                        }}
                                        className={`w-full text-left px-4 py-2.5 font-semibold text-sm flex items-center gap-2.5 whitespace-nowrap transition-colors ${
                                            data.sector === s.label
                                                ? "bg-emerald-50/50 text-emerald-600"
                                                : "text-gray-700 hover:bg-emerald-50 hover:text-emerald-700"
                                        }`}
                                    >
                                        <span className="text-base shrink-0">{s.icon}</span>
                                        <span>{s.label}</span>
                                    </button>
                                ))}
                            </div>
                        </>
                    , document.body)}
                </div>
                <p className="text-xs mt-2" style={{ color: T.muted }}>
                    Kamu bisa pilih sektor yang paling mendekati pekerjaanmu.
                </p>
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
function Summary({
    data,
    onEdit,
    confirmAccuracy,
    onConfirmChange,
}: {
    data: WizardData;
    onEdit: (step: number) => void;
    confirmAccuracy: boolean;
    onConfirmChange: (next: boolean) => void;
}) {
    const summaryItems = [
        { step: 0,  icon: "👤", label: "Nama Lengkap",            val: data.fullName         ?? "-" },
        { step: 0,  icon: "🎂", label: "Usia",                    val: data.age              ? `${data.age} tahun` : "-" },
        { step: 0,  icon: data.gender === "male" ? "👨" : "👩", label: "Jenis Kelamin", val: data.gender === "male" ? "Laki-laki" : data.gender === "female" ? "Perempuan" : "-" },
        { step: 1,  icon: "💰", label: "Penghasilan Bulanan",     val: data.monthlyIncome    ? `Rp ${fmt(data.monthlyIncome)}`    : "-" },
        { step: 2,  icon: "🎁", label: "Bonus/THR",               val: data.annualBonusMonths !== null ? (data.annualBonusMonths === 0 ? "Tidak ada" : `${data.annualBonusMonths}× gaji/tahun`) : "-" },
        { step: 3,  icon: "🐷", label: "Target Tabungan",         val: data.savingsPercentage !== null ? `${data.savingsPercentage}%/bulan` : "-" },
        { step: 4,  icon: "🏦", label: "Tabungan & Investasi",    val: data.currentSavings   !== null ? `Rp ${fmt(data.currentSavings)}` : "-" },
        { step: 5,  icon: "🌴", label: "Target Pensiun",          val: data.retirementAge    ? `Usia ${data.retirementAge} tahun` : "-" },
        { step: 6,  icon: "🏡", label: "Gaya Hidup Pensiun",      val: data.lifestylePercent ? `${data.lifestylePercent}% dari gaji terakhir` : "-" },
        { step: 7,  icon: "🧠", label: "Profil Risiko",           val: data.riskProfile      ? `${RISK_RESULT[data.riskProfile].emoji} ${RISK_RESULT[data.riskProfile].label}` : "-" },
        { step: 8,  icon: "🏢", label: "Sektor Pekerjaan",        val: data.sector           ?? "-" },
    ];

    return (
        <div>
            <div className="text-center mb-5">
                <div className="text-4xl mb-2">✅</div>
                <h2 className="text-xl font-bold mb-1.5" style={{ color: T.ink }}>Semuanya sudah diisi!</h2>
                <p className="text-sm" style={{ color: T.muted }}>
                    Periksa sekali lagi sebelum kami menghitung proyeksi pensiunmu.
                </p>
            </div>
            <div className="max-h-72 overflow-y-auto pr-1">
                <div className="space-y-2">
                    {summaryItems.map(item => (
                        <div key={item.label}
                            className="flex items-center gap-3 px-4 py-3 rounded-2xl border hover:bg-gray-50 transition-colors cursor-default"
                            style={{ borderColor: T.hairline }}>
                            <span className="text-base shrink-0">{item.icon}</span>
                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-medium" style={{ color: T.muted }}>{item.label}</p>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                                <span className="text-xs font-semibold truncate" style={{ color: T.ink, maxWidth: 150 }}>
                                    {item.val}
                                </span>
                                <button type="button" onClick={() => onEdit(item.step)}
                                    className="text-[11px] px-2.5 py-1 rounded-full border transition-all"
                                    style={{ color: T.blue, borderColor: "rgba(16, 185, 129, 0.25)" }}>
                                    Ubah
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <label className="flex items-start gap-3 mt-4 px-4 py-3 rounded-2xl border cursor-pointer"
                    style={{ borderColor: confirmAccuracy ? T.blue : T.hairline, background: confirmAccuracy ? T.blueLight : T.canvas }}>
                    <div className="relative mt-0.5">
                        <input
                            type="checkbox"
                            className="sr-only"
                            checked={confirmAccuracy}
                            onChange={e => onConfirmChange(e.target.checked)}
                        />
                        <div className="w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all"
                            style={{ borderColor: confirmAccuracy ? T.blue : T.hairline, background: confirmAccuracy ? T.blue : "transparent" }}>
                            {confirmAccuracy && <Check className="w-3 h-3 text-white" />}
                        </div>
                    </div>
                    <div>
                        <p className="text-sm font-semibold" style={{ color: T.ink }}>
                            Saya memastikan data yang saya isi sudah benar.
                        </p>
                        <p className="text-xs mt-0.5" style={{ color: T.muted }}>
                            Data ini akan digunakan untuk perhitungan proyeksi finansial.
                        </p>
                    </div>
                </label>
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
                style={{ background: `linear-gradient(90deg, ${T.blue}, #34d399)` }}
                initial={false}
                animate={{ width: `${(step / total) * 100}%` }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            />
        </div>
    );
}

/* ══ Main Wizard ════════════════════════════════════════════════════════ */

const TOTAL = 10; // steps 0-9 (0 = personal, 9 = assumptions), + summary

const STEP_CONFIG = [
    { label: "Data Diri",    validate: (d: WizardData) => d.fullName !== null && d.age !== null && d.gender !== null },
    { label: "Gaji",         validate: (d: WizardData) => d.monthlyIncome !== null },
    { label: "Bonus",        validate: (d: WizardData) => d.annualBonusMonths !== null },
    { label: "Nabung",       validate: (d: WizardData) => d.savingsPercentage !== null },
    { label: "Tabungan",     validate: (d: WizardData) => d.currentSavings !== null },
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
    const [confirmAccuracy, setConfirmAccuracy] = useState(false);
    const topRef = useRef<HTMLDivElement>(null);

    const set = useCallback((patch: Partial<WizardData>) =>
        setDataRaw(prev => ({ ...prev, ...patch })), []);

    useEffect(() => {
        topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, [step, showSummary]);

    useEffect(() => {
        if (!showSummary) setConfirmAccuracy(false);
    }, [showSummary]);

    const canNext = showSummary ? confirmAccuracy : STEP_CONFIG[step]?.validate(data) ?? true;

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
        <div
            ref={topRef}
            className="w-full max-w-lg mx-auto"
            style={{ maxHeight: "calc(100vh - 260px)" }}
        >
            {/* Top progress */}
            <div className="mb-2 px-1">
                <TopProgress step={showSummary ? TOTAL : step + 1} total={TOTAL} />
                <div className="flex justify-between mt-1.5">
                    <span className="text-xs font-medium" style={{ color: T.blue }}>{currentStepLabel}</span>
                    <span className="text-xs" style={{ color: T.muted }}>
                        {showSummary ? "Selesai!" : `${step + 1} / ${TOTAL}`}
                    </span>
                </div>
            </div>

            {/* Card */}
            <div className="bg-white rounded-3xl shadow-lg border px-5 py-5 min-h-80 max-h-full flex flex-col" style={{ borderColor: T.hairline }}>

                {error && (
                    <div className="mb-5 flex items-center gap-2.5 p-4 rounded-2xl text-sm"
                        style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", color: T.danger }}>
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        {error}
                    </div>
                )}

                {/* Step content */}
                <div className="flex-1 overflow-y-auto pr-1">
                    <AnimatePresence mode="wait" custom={dir}>
                        {showSummary ? (
                            <motion.div key="summary" variants={v} initial="initial" animate="animate" exit="exit">
                                <Summary
                                    data={data}
                                    onEdit={handleEdit}
                                    confirmAccuracy={confirmAccuracy}
                                    onConfirmChange={setConfirmAccuracy}
                                />
                            </motion.div>
                        ) : (
                            <motion.div key={step} variants={v} initial="initial" animate="animate" exit="exit">
                                {step === 0  && <S0_Personal        data={data} set={set} />}
                                {step === 1  && <S1_Income          data={data} set={set} />}
                                {step === 2  && <S2_Bonus           data={data} set={set} />}
                                {step === 3  && <S4_Savings         data={data} set={set} />}
                                {step === 4  && <S5_CurrentSavings  data={data} set={set} />}
                                {step === 5  && <S7_RetirementAge   data={data} set={set} />}
                                {step === 6  && <S8_Lifestyle       data={data} set={set} />}
                                {step === 7  && <S9_Risk            data={data} set={set} />}
                                {step === 8  && <S10_Sector         data={data} set={set} />}
                                {step === 9  && <S11_Assumptions    data={data} set={set} />}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Nav */}
                <div className="flex gap-3 mt-5 pt-4 border-t" style={{ borderColor: T.hairline }}>
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
                        style={{ background: canNext ? `linear-gradient(135deg, ${T.blue}, #34d399)` : "#d1d5db" }}>
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
        </div>
    );
}
