"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Target, ChevronRight, ChevronLeft,
    Check, Sparkles, Info, AlertCircle,
    PiggyBank,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { Modal } from "@/components/ui/Modal";
import { SuccessIllustration } from "@/components/ui/SuccessIllustration";

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
    planningAge:        number | null;
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
    planningAge:        null,
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
        placeholder: "Contoh: 104000000",
        hint: "Gaji tahunan + bonus/THR. Digunakan untuk analisis profil risiko finansial.",
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
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-base font-semibold pointer-events-none text-gray-400"
                style={{ color: value !== null ? T.blue : undefined }}>
                Rp
            </div>
            <input
                ref={inputRef}
                type="text"
                inputMode="numeric"
                placeholder={placeholder ?? "0"}
                value={raw ? fmt(Number(raw)) : ""}
                onChange={handleChange}
                className={cn(
                    "w-full pl-11 pr-4 py-4 bg-white border rounded-xl outline-none transition-all duration-200 text-base font-semibold focus:border-[#10B981] focus:ring-4 focus:ring-[#10B981]/10",
                    value !== null ? "border-[#10B981]" : "border-gray-200"
                )}
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
            className="w-full text-left flex items-center gap-4 px-4 py-3.5 rounded-xl border transition-all duration-200 active:scale-[0.98]"
            style={{
                borderColor:  selected ? activeColor : "rgb(229, 231, 235)",
                background:   selected ? `${activeColor}0d` : T.canvas,
                boxShadow:    selected ? `0 0 0 4px ${activeColor}1a` : "none",
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
                    <div className="text-xs mt-0.5 text-gray-500">{sub}</div>
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
            {emoji ? null : null}
            <h2 className="text-[17px] font-bold leading-snug text-gray-900 mb-1">
                {headline}
            </h2>
            {sub && (
                <p className="text-xs leading-relaxed text-gray-500">{sub}</p>
            )}
        </div>
    );
}

/* ── Steps ──────────────────────────────────────────────────────────── */

function S0_Personal({ data, set }: { data: WizardData; set: (p: Partial<WizardData>) => void }) {
    return (
        <div>
            <StepHeader headline="Kenalan dulu, yuk 👋"/>
            
            {/* Nama */}
            <div className="mb-6">
                <label className="text-[14px] font-medium text-gray-700 block mb-2">
                    Nama Lengkap
                </label>
                <input
                    type="text"
                    placeholder="Contoh: Budi Santoso"
                    value={data.fullName || ""}
                    onChange={e => set({ fullName: e.target.value || null })}
                    className={cn(
                        "w-full px-4 py-4 bg-white border rounded-xl outline-none transition-all duration-200 text-base placeholder:text-gray-400 focus:border-[#10B981] focus:ring-4 focus:ring-[#10B981]/10",
                        data.fullName ? "border-[#10B981]" : "border-gray-200"
                    )}
                    autoFocus
                />
            </div>

            {/* Usia */}
            <div className="mb-6">
                <label className="text-[14px] font-medium text-gray-700 block mb-2">
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
                        className={cn(
                            "w-28 py-4 px-4 bg-white border rounded-xl text-center outline-none transition-all duration-200 text-base font-bold focus:border-[#10B981] focus:ring-4 focus:ring-[#10B981]/10",
                            data.age ? "border-[#10B981]" : "border-gray-200"
                        )}
                    />
                    <span className="text-base font-medium text-gray-500">tahun</span>
                </div>
            </div>

            {/* Gender */}
            <div>
                <label className="text-[14px] font-medium text-gray-700 block mb-2">
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
                <div className="mt-3 flex gap-2.5 p-3.5 bg-blue-50/50 border border-blue-100/80 rounded-xl text-xs text-blue-800 leading-relaxed items-center">
                    <Info className="w-4 h-4 shrink-0 text-blue-600" />
                    <span>
                        Data ini digunakan untuk kalkulasi harapan hidup berdasarkan tabel mortalitas Indonesia
                    </span>
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
    const [isCustom, setIsCustom] = useState(() => {
        return data.annualBonusMonths !== null && ![0, 1, 2].includes(data.annualBonusMonths);
    });

    const handleChipClick = (n: number, custom: boolean) => {
        setIsCustom(custom);
        if (custom) {
            const currentVal = data.annualBonusMonths;
            if (currentVal === null || [0, 1, 2].includes(currentVal)) {
                set({ annualBonusMonths: null });
            }
        } else {
            set({ annualBonusMonths: n });
        }
    };

    return (
        <div>
            <StepHeader emoji="🎁" headline="Dapat bonus atau THR?" sub="Ini akan kami jadikan komponen penghasilan tahunanmu." />
            <div className="space-y-3">
                <Chip
                    selected={!isCustom && data.annualBonusMonths === 0}
                    onClick={() => handleChipClick(0, false)}
                    icon={<span>🚫</span>}
                    sub="Saya tidak menerima bonus/THR"
                >
                    Tidak ada bonus
                </Chip>
                <Chip
                    selected={!isCustom && data.annualBonusMonths === 1}
                    onClick={() => handleChipClick(1, false)}
                    icon={<span>🎁</span>}
                    sub="Contoh: hanya THR"
                >
                    1× gaji per tahun
                </Chip>
                <Chip
                    selected={!isCustom && data.annualBonusMonths === 2}
                    onClick={() => handleChipClick(2, false)}
                    icon={<span>🎊</span>}
                    sub="Contoh: THR + bonus tahunan"
                >
                    2× gaji per tahun
                </Chip>

                {isCustom ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="w-full flex items-center gap-4 px-4 py-3.5 rounded-xl border transition-all duration-200"
                        style={{
                            borderColor:  T.blue,
                            background:   `${T.blue}0d`,
                            boxShadow:    `0 0 0 4px ${T.blue}1a`,
                        }}
                    >
                        <div className="shrink-0 w-9 h-9 rounded-xl flex items-center justify-center text-lg bg-emerald-50 text-emerald-600">
                            ✏️
                        </div>
                        <div className="flex-1 flex items-center gap-2">
                            <input
                                type="text"
                                inputMode="numeric"
                                placeholder="3"
                                value={data.annualBonusMonths !== null && ![0, 1, 2].includes(data.annualBonusMonths) ? data.annualBonusMonths : ""}
                                onChange={e => {
                                    const val = e.target.value.replace(/\D/g, "");
                                    set({ annualBonusMonths: val === "" ? null : Number(val) });
                                }}
                                className="w-16 py-1.5 px-2 text-center bg-white border border-emerald-200 rounded-lg outline-none text-sm font-bold focus:border-[#10B981] focus:ring-2 focus:ring-[#10B981]/15 text-gray-900"
                                autoFocus
                            />
                            <span className="text-sm font-semibold text-gray-700">× gaji per tahun</span>
                        </div>
                        <button
                            type="button"
                            onClick={() => {
                                setIsCustom(false);
                                set({ annualBonusMonths: 0 });
                            }}
                            className="text-xs px-2.5 py-1 rounded-full border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 transition-colors"
                        >
                            Batal
                        </button>
                    </motion.div>
                ) : (
                    <Chip
                        selected={false}
                        onClick={() => handleChipClick(0, true)}
                        icon={<span>✏️</span>}
                        sub="Masukkan jumlah bulan lainnya secara manual"
                    >
                        Input Sendiri
                    </Chip>
                )}
            </div>
        </div>
    );
}

function S4_Savings({ data, set }: { data: WizardData; set: (p: Partial<WizardData>) => void }) {
    const [isCustom, setIsCustom] = useState(() => {
        return data.savingsPercentage !== null && ![10, 20].includes(data.savingsPercentage);
    });

    const handleChipClick = (pct: number | null, custom: boolean) => {
        setIsCustom(custom);
        if (custom) {
            const currentVal = data.savingsPercentage;
            if (currentVal === null || [10, 20].includes(currentVal)) {
                set({ savingsPercentage: null });
            }
        } else {
            set({ savingsPercentage: pct });
        }
    };

    const savingsOpts = [
        { pct: 10, label: "10% penghasilan", sub: "Baru mulai - setiap rupiah penting!", color: "#64748b" },
        { pct: 20, label: "20% penghasilan", sub: "Standar emas - prinsip 50/30/20", color: T.blue },
    ];
    const monthlyTarget = data.monthlyIncome && data.savingsPercentage
        ? Math.round(data.monthlyIncome * data.savingsPercentage / 100) : null;

    return (
        <div>
            <StepHeader emoji="🐷" headline="Berapa % yang kamu alokasikan untuk nabung?" sub="Pilih persentase dari gaji bulanan Anda yang disisihkan untuk ditabung/investasi (contoh: 20% dari gaji bulanan)." />
            <div className="space-y-3">
                {savingsOpts.map(o => (
                    <Chip key={o.pct} selected={!isCustom && data.savingsPercentage === o.pct}
                        onClick={() => handleChipClick(o.pct, false)}
                        icon={<span className="text-lg">{o.pct === 10 ? "🌱" : "💡"}</span>}
                        sub={o.sub}
                        color={o.color}>
                        {o.label}
                    </Chip>
                ))}

                {isCustom ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="w-full flex items-center gap-4 px-4 py-3.5 rounded-xl border transition-all duration-200"
                        style={{
                            borderColor:  T.blue,
                            background:   `${T.blue}0d`,
                            boxShadow:    `0 0 0 4px ${T.blue}1a`,
                        }}
                    >
                        <div className="shrink-0 w-9 h-9 rounded-xl flex items-center justify-center text-lg bg-emerald-50 text-emerald-600">
                            ✏️
                        </div>
                        <div className="flex-1 flex items-center gap-2">
                            <input
                                type="text"
                                inputMode="numeric"
                                placeholder="30"
                                value={data.savingsPercentage !== null && ![10, 20].includes(data.savingsPercentage) ? data.savingsPercentage : ""}
                                onChange={e => {
                                    const val = e.target.value.replace(/\D/g, "");
                                    const num = val === "" ? null : Number(val);
                                    // Validasi: tidak boleh 0, tidak boleh > 100
                                    if (num !== null && (num === 0 || num > 100)) {
                                        return; // Ignore invalid input
                                    }
                                    set({ savingsPercentage: num });
                                }}
                                className="w-16 py-1.5 px-2 text-center bg-white border border-emerald-200 rounded-lg outline-none text-sm font-bold focus:border-[#10B981] focus:ring-2 focus:ring-[#10B981]/15 text-gray-900"
                                autoFocus
                            />
                            <span className="text-sm font-semibold text-gray-700">% dari gaji</span>
                        </div>
                        <button
                            type="button"
                            onClick={() => {
                                setIsCustom(false);
                                set({ savingsPercentage: 10 });
                            }}
                            className="text-xs px-2.5 py-1 rounded-full border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 transition-colors"
                        >
                            Batal
                        </button>
                    </motion.div>
                ) : (
                    <Chip
                        selected={false}
                        onClick={() => handleChipClick(null, true)}
                        icon={<span>✏️</span>}
                        sub="Masukkan persentase lainnya secara manual"
                    >
                        Input Sendiri
                    </Chip>
                )}
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
    const [isCustom, setIsCustom] = useState(() => {
        return data.retirementAge !== null && ![45, 50, 55].includes(data.retirementAge);
    });

    const handleChipClick = (age: number | null, custom: boolean) => {
        setIsCustom(custom);
        if (custom) {
            const currentVal = data.retirementAge;
            if (currentVal === null || [45, 50, 55].includes(currentVal)) {
                set({ retirementAge: null });
            }
        } else {
            set({ retirementAge: age });
        }
    };

    const ageOpts = [
        { age: 45, label: "Umur 45", sub: "Pensiun dini - butuh persiapan ekstra keras", emoji: "⚡" },
        { age: 50, label: "Umur 50", sub: "Cukup agresif - masih sangat bisa dicapai", emoji: "💪" },
        { age: 55, label: "Umur 55", sub: "Rata-rata kebanyakan orang - realistis", emoji: "✅" },
    ];

    return (
        <div>
            <StepHeader emoji="🌴" headline="Kapan kamu ingin pensiun?" sub="Tidak harus angka pasti. Estimasi sudah cukup - bisa diubah nanti." />
            <div className="space-y-3">
                {ageOpts.map(o => (
                    <Chip key={o.age} selected={!isCustom && data.retirementAge === o.age}
                        onClick={() => handleChipClick(o.age, false)}
                        icon={<span className="text-lg">{o.emoji}</span>}
                        sub={o.sub}>
                        {o.label}
                    </Chip>
                ))}

                {isCustom ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="w-full flex items-center gap-4 px-4 py-3.5 rounded-xl border transition-all duration-200"
                        style={{
                            borderColor:  T.blue,
                            background:   `${T.blue}0d`,
                            boxShadow:    `0 0 0 4px ${T.blue}1a`,
                        }}
                    >
                        <div className="shrink-0 w-9 h-9 rounded-xl flex items-center justify-center text-lg bg-emerald-50 text-emerald-600">
                            ✏️
                        </div>
                        <div className="flex-1 flex items-center gap-2">
                            <input
                                type="text"
                                inputMode="numeric"
                                placeholder="60"
                                value={data.retirementAge !== null && ![45, 50, 55].includes(data.retirementAge) ? data.retirementAge : ""}
                                onChange={e => {
                                    const val = e.target.value.replace(/\D/g, "");
                                    set({ retirementAge: val === "" ? null : Number(val) });
                                }}
                                className="w-16 py-1.5 px-2 text-center bg-white border border-emerald-200 rounded-lg outline-none text-sm font-bold focus:border-[#10B981] focus:ring-2 focus:ring-[#10B981]/15 text-gray-900"
                                autoFocus
                            />
                            <span className="text-sm font-semibold text-gray-700">tahun</span>
                        </div>
                        <button
                            type="button"
                            onClick={() => {
                                setIsCustom(false);
                                set({ retirementAge: 55 });
                            }}
                            className="text-xs px-2.5 py-1 rounded-full border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 transition-colors"
                        >
                            Batal
                        </button>
                    </motion.div>
                ) : (
                    <Chip
                        selected={false}
                        onClick={() => handleChipClick(null, true)}
                        icon={<span>✏️</span>}
                        sub="Masukkan usia tertentu secara manual"
                    >
                        Input Sendiri
                    </Chip>
                )}
            </div>
        </div>
    );
}

function S8_PlanningAge({ data, set }: { data: WizardData; set: (p: Partial<WizardData>) => void }) {
    const shouldFetchMortalityInfo = Boolean(data.age && data.gender && data.retirementAge);
    const [mortalityInfo, setMortalityInfo] = useState<{
        expected_death_age: number;
        p50_survival_age: number;
        p90_survival_age: number;
    } | null>(null);
    const [isLoading, setIsLoading] = useState(shouldFetchMortalityInfo);

    // Fetch mortality info dari FastAPI saat component mount atau data berubah
    useEffect(() => {
        if (!shouldFetchMortalityInfo) {
            return;
        }

        const controller = new AbortController();

        fetch("http://localhost:8001/mortality-info", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                age: data.age,
                gender: data.gender,
                retirement_age: data.retirementAge,
            }),
            signal: controller.signal,
        })
            .then((res) => res.json())
            .then((result) => {
                if (result.success && result.data) {
                    setMortalityInfo(result.data);
                }
            })
            .catch(() => {
                setMortalityInfo(null);
            })
            .finally(() => {
                setIsLoading(false);
            });

        return () => controller.abort();
    }, [data.age, data.gender, data.retirementAge, shouldFetchMortalityInfo]);

    return (
        <div>
            <StepHeader 
                emoji="📊" 
                headline="Rencanakan Dana Hingga Usia" 
                sub="Tentukan sampai usia berapa kamu ingin dana pensiunmu bertahan." 
            />
            
            {/* Info Box dengan Data Real dari FastAPI */}
            {isLoading ? (
                <div className="mb-5 flex gap-2.5 p-3.5 bg-gray-50/50 border border-gray-200/80 rounded-xl text-xs text-gray-600 leading-relaxed items-center">
                    <div className="w-4 h-4 border-2 border-gray-400 border-t-gray-600 rounded-full animate-spin shrink-0"></div>
                    <span>Menghitung tabel mortalitas...</span>
                </div>
            ) : mortalityInfo ? (
                <div className="mb-5 flex gap-2.5 p-3.5 bg-gray-50/50 border border-gray-200/80 rounded-xl text-xs text-gray-800 leading-relaxed items-center">
                    <Info className="w-4 h-4 shrink-0 text-gray-600" />
                    <span>
                        <strong>Informasi Aktuaria:</strong> Usia harapan hidup rata-rata adalah <strong>{mortalityInfo.expected_death_age} tahun</strong>. Terdapat probabilitas <strong>50%</strong> untuk mencapai usia <strong>{mortalityInfo.p50_survival_age} tahun</strong>, dan probabilitas <strong>10%</strong> untuk mencapai usia <strong>{mortalityInfo.p90_survival_age} tahun</strong>.
                    </span>
                </div>
            ) : (
                <div className="mb-5 flex gap-2.5 p-3.5 bg-gray-50/50 border border-gray-200/80 rounded-xl text-xs text-gray-800 leading-relaxed items-center">
                    <Info className="w-4 h-4 shrink-0 text-gray-600" />
                    <span>
                        <strong>Informasi Aktuaria:</strong> Sistem akan menghitung usia harapan hidup berdasarkan tabel mortalitas Indonesia (TMPI 2023) sesuai dengan usia dan jenis kelamin kamu.
                    </span>
                </div>
            )}

            <div className="mb-4">
                <label className="text-[14px] font-medium text-gray-700 block mb-2">
                    Rencanakan dana hingga usia
                </label>
                <div className="flex items-center gap-3">
                    <input
                        type="text"
                        inputMode="numeric"
                        placeholder={mortalityInfo ? mortalityInfo.p50_survival_age.toString() : "Contoh: 84"}
                        value={data.planningAge ?? ""}
                        onChange={e => {
                            const val = e.target.value.replace(/\D/g, "");
                            set({ planningAge: val === "" ? null : Number(val) });
                        }}
                        className={cn(
                            "w-28 py-4 px-4 bg-white border rounded-xl text-center outline-none transition-all duration-200 text-base font-bold focus:border-[#10B981] focus:ring-4 focus:ring-[#10B981]/10",
                            data.planningAge ? "border-[#10B981]" : "border-gray-200"
                        )}
                        autoFocus
                    />
                    <span className="text-base font-medium text-gray-500">tahun</span>
                </div>
                {data.retirementAge && (
                    <p className="text-xs mt-2 text-gray-500">
                        Minimal {data.retirementAge + 1} tahun, maksimal 120 tahun
                    </p>
                )}
            </div>
        </div>
    );
}

function S9_Lifestyle({ data, set }: { data: WizardData; set: (p: Partial<WizardData>) => void }) {
    const target = data.lifestylePercent && data.monthlyIncome
        ? Math.round(data.monthlyIncome * data.lifestylePercent / 100) : null;

    return (
        <div>
            <StepHeader emoji="🏡" headline="Gaya hidup saat pensiun?" sub="Masukkan persentase dari gaji terakhir yang kamu butuhkan per bulan." />
            <div className="mb-4">
                <label className="text-[14px] font-medium text-gray-700 block mb-2">
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
                        className={cn(
                            "w-28 py-4 px-4 bg-white border rounded-xl text-center outline-none transition-all duration-200 text-base font-bold focus:border-[#10B981] focus:ring-4 focus:ring-[#10B981]/10",
                            data.lifestylePercent ? "border-[#10B981]" : "border-gray-200"
                        )}
                    />
                    <span className="text-base font-medium text-gray-500">% dari gaji terakhir</span>
                </div>
                <p className="text-xs mt-2 text-gray-500">
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

function S10_Risk({ data, set }: { data: WizardData; set: (p: Partial<WizardData>) => void }) {
    const [qIdx, setQIdx] = useState(() => {
        // Start from 0 if not all done so the user can review their pre-populated answers,
        // otherwise show the final result screen.
        const allDone = RISK_QUESTIONS.every(q => data.riskAnswers[q.id] !== undefined);
        if (allDone) return RISK_QUESTIONS.length - 1;
        return 0;
    });

    // Auto pre-populate fields from previous wizard steps
    useEffect(() => {
        const nextAnswers = { ...data.riskAnswers };
        let changed = false;

        if (data.age !== null && nextAnswers.age === undefined) {
            nextAnswers.age = data.age;
            changed = true;
        }

        // Auto-calculate annual_income untuk risk assessment (BISA DIEDIT USER)
        // Formula: (gaji bulanan × 12) + (gaji bulanan × bonus bulan)
        // Ini HANYA untuk analisis profil risiko finansial, TIDAK mempengaruhi proyeksi pensiun
        if (data.monthlyIncome !== null && nextAnswers.annual_income === undefined) {
            const annual = data.monthlyIncome * (12 + (data.annualBonusMonths ?? 0));
            nextAnswers.annual_income = annual;
            changed = true;
        }

        if (data.currentSavings !== null && nextAnswers.savings_balance === undefined) {
            nextAnswers.savings_balance = data.currentSavings;
            changed = true;
        }

        if (changed) {
            set({ riskAnswers: nextAnswers });
        }
    }, [data.age, data.monthlyIncome, data.annualBonusMonths, data.currentSavings, data.riskAnswers, set]);

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
        const next = { ...answers };
        if (value === null) {
            delete next[current.id];
        } else {
            next[current.id] = value;
        }
        set({ riskAnswers: next });
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
                            background: i < qIdx
                                ? T.blue
                                : i === qIdx ? "rgba(16, 185, 129, 0.3)" : T.hairline,
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
                            {current.q}
                        </p>
                        {current.hint && (
                            <p className="text-xs mb-4" style={{ color: T.muted }}>
                                {current.hint}
                            </p>
                        )}

                        {current.id === "annual_income" && (
                            <div className="mb-4 flex gap-2.5 p-3.5 bg-blue-50/50 border border-blue-100/80 rounded-xl text-xs text-blue-800 leading-relaxed items-center">
                                <Info className="w-4 h-4 shrink-0 text-blue-600" />
                                <span>
                                    Nilai terisi otomatis dari <strong>(Gaji Bulanan × 12) + (Gaji Bulanan × Bonus Bulan)</strong>. Anda dapat mengubah nilai ini jika diperlukan. Nilai ini hanya untuk analisis profil risiko finansial, tidak mempengaruhi proyeksi pensiun.
                                </span>
                            </div>
                        )}

                        {current.id === "age" && (
                            <div className="mb-4 flex gap-2.5 p-3.5 bg-blue-50/50 border border-blue-100/80 rounded-xl text-xs text-blue-800 leading-relaxed items-center">
                                <Info className="w-4 h-4 shrink-0 text-blue-600" />
                                <span>
                                    Nilai terisi otomatis dari <strong>usia</strong> yang anda masukkan sebelumnya. Anda tetap dapat mengubah nilai ini secara manual jika diperlukan.
                                </span>
                            </div>
                        )}

                        {current.id === "savings_balance" && (
                            <div className="mb-4 flex gap-2.5 p-3.5 bg-amber-50/50 border border-amber-100/80 rounded-xl text-xs text-amber-800 leading-relaxed items-center">
                                <Info className="w-4 h-4 shrink-0 text-amber-600" />
                                <span>
                                    Nilai terisi otomatis dari <strong>total tabungan & investasi</strong> yang anda masukkan sebelumnya. Anda tetap dapat mengubah nilai ini secara manual jika diperlukan.
                                </span>
                            </div>
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
                                    className="mt-4 w-full py-4 rounded-xl font-bold transition-all disabled:opacity-50 active:scale-[0.97]"
                                    style={{
                                        background: answers[current.id] !== undefined ? T.blue : "#e5e7eb",
                                        color: answers[current.id] !== undefined ? "white" : "#9ca3af",
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
                                        className={cn(
                                            "w-full px-4 py-4 bg-white border rounded-xl outline-none transition-all duration-200 text-base font-semibold focus:border-[#10B981] focus:ring-4 focus:ring-[#10B981]/10",
                                            answers[current.id] !== undefined ? "border-[#10B981]" : "border-gray-200"
                                        )}
                                    />
                                    {current.unit && (
                                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-base font-semibold pointer-events-none text-gray-400">
                                            {current.unit}
                                        </span>
                                    )}
                                </div>
                                <button
                                    type="button"
                                    onClick={handleNext}
                                    disabled={answers[current.id] === undefined}
                                    className="mt-4 w-full py-4 rounded-xl font-bold transition-all disabled:opacity-50 active:scale-[0.97]"
                                    style={{
                                        background: answers[current.id] !== undefined ? T.blue : "#e5e7eb",
                                        color: answers[current.id] !== undefined ? "white" : "#9ca3af",
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

function S11_Sector({ data, set }: { data: WizardData; set: (p: Partial<WizardData>) => void }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div>
            <StepHeader emoji="🏢" headline="Kamu kerja di sektor apa?" sub="Ini membantu kami menyesuaikan proyeksi dengan kondisi nyata Indonesia." />
            <div className="mb-4">
                <label className="text-[14px] font-medium text-gray-700 block mb-2">
                    Pilih sektor pekerjaan
                </label>
                <div className="relative">
                    <button
                        type="button"
                        onClick={() => setIsOpen(v => !v)}
                        className={cn(
                            "w-full flex items-center justify-between px-4 py-4 rounded-xl border outline-none transition-all duration-200 text-base font-semibold text-left bg-white",
                            data.sector ? "border-[#10B981]" : "border-gray-200"
                        )}
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
                        <span className="text-xs text-gray-400">▼</span>
                    </button>

                    {isOpen && (
                        <>
                            {/* Backdrop */}
                            <div
                                className="fixed inset-0 z-40"
                                onClick={() => setIsOpen(false)}
                            />
                            {/* Dropdown - simple absolute positioning */}
                            <div
                                className="absolute z-50 mt-2 w-full bg-white border border-gray-100 rounded-2xl shadow-xl overflow-y-auto py-1 max-h-[240px]"
                            >
                                {SECTORS.map(s => (
                                    <button
                                        key={s.label}
                                        type="button"
                                        onClick={() => {
                                            set({ sector: s.label });
                                            setIsOpen(false);
                                        }}
                                        className={`w-full text-left px-4 py-2.5 font-semibold text-sm flex items-center gap-2.5 transition-colors ${
                                            data.sector === s.label
                                                ? "bg-emerald-50/50 text-emerald-600"
                                                : "text-gray-700 hover:bg-emerald-50 hover:text-emerald-700"
                                        }`}
                                    >
                                        <span className="text-base shrink-0">{s.icon}</span>
                                        <span className="truncate">{s.label}</span>
                                    </button>
                                ))}
                            </div>
                        </>
                    )}
                </div>
                <p className="text-xs mt-2 text-gray-500">
                    Kamu bisa pilih sektor yang paling mendekati pekerjaanmu.
                </p>
            </div>
        </div>
    );
}

function S12_Assumptions({ data, set }: { data: WizardData; set: (p: Partial<WizardData>) => void }) {
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
                <p className="text-[14px] font-medium text-gray-700 block mb-2">Asumsi bunga deposito/tahun</p>
                <div className="grid grid-cols-4 gap-2">
                    {rateOpts.map(o => (
                        <button key={o.r} type="button"
                            onClick={() => set({ depositRate: o.r })}
                            className="py-3 px-2 rounded-xl border text-center transition-all duration-200 active:scale-[0.97]"
                            style={{
                                borderColor: data.depositRate === o.r ? T.blue : "rgb(229, 231, 235)",
                                background:  data.depositRate === o.r ? T.blueLight : T.canvas,
                            }}>
                            <div className="text-sm font-bold" style={{ color: data.depositRate === o.r ? T.blue : T.ink }}>{o.label}</div>
                            <div className="text-[10px] mt-0.5 text-gray-500">{o.sub}</div>
                        </button>
                    ))}
                </div>
            </div>

            <div className="space-y-3">
                <label className="flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all"
                    style={{ borderColor: data.hasHealthInsurance ? T.blue : "rgb(229, 231, 235)", background: data.hasHealthInsurance ? T.blueLight : T.canvas }}>
                    <div className="relative">
                        <input type="checkbox" className="sr-only"
                            checked={data.hasHealthInsurance}
                            onChange={e => set({ hasHealthInsurance: e.target.checked })} />
                        <div className="w-5 h-5 rounded-md border flex items-center justify-center transition-all"
                            style={{ borderColor: data.hasHealthInsurance ? T.blue : "rgb(229, 231, 235)", background: data.hasHealthInsurance ? T.blue : "transparent" }}>
                            {data.hasHealthInsurance && <Check className="w-3 h-3 text-white" />}
                        </div>
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-gray-900">Saya punya asuransi kesehatan</p>
                        <p className="text-xs mt-0.5 text-gray-500">BPJS, asuransi swasta, atau dari kantor</p>
                    </div>
                </label>

                {!data.hasHealthInsurance && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
                        className="flex gap-2.5 p-3.5 rounded-xl overflow-hidden"
                        style={{ background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.3)" }}>
                        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" style={{ color: T.warning }} />
                        <p className="text-xs leading-relaxed text-[#92400e]">
                            Inflasi biaya kesehatan Indonesia mencapai &gt;10%/tahun. Kami sarankan kamu segera mendaftar BPJS.
                        </p>
                    </motion.div>
                )}

                <label className="flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all"
                    style={{ borderColor: data.includePandemicRisk ? T.blue : "rgb(229, 231, 235)", background: data.includePandemicRisk ? T.blueLight : T.canvas }}>
                    <div className="relative">
                        <input type="checkbox" className="sr-only"
                            checked={data.includePandemicRisk}
                            onChange={e => set({ includePandemicRisk: e.target.checked })} />
                        <div className="w-5 h-5 rounded-md border flex items-center justify-center transition-all"
                            style={{ borderColor: data.includePandemicRisk ? T.blue : "rgb(229, 231, 235)", background: data.includePandemicRisk ? T.blue : "transparent" }}>
                            {data.includePandemicRisk && <Check className="w-3 h-3 text-white" />}
                        </div>
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-gray-900">Sertakan buffer risiko pandemi</p>
                        <p className="text-xs mt-0.5 text-gray-500">Proyeksi akan lebih konservatif dengan buffer risiko krisis</p>
                    </div>
                </label>

                {!data.includePandemicRisk && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
                        className="flex gap-2.5 p-3.5 rounded-xl overflow-hidden"
                        style={{ background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.3)" }}>
                        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" style={{ color: T.warning }} />
                        <p className="text-xs leading-relaxed text-[#92400e]">
                            Tanpa buffer pandemi, proyeksi finansial akan berasumsi kondisi pasar selalu stabil. Mengaktifkannya membantu menyimulasikan ketahanan dana Anda terhadap potensi krisis ekonomi global tak terduga.
                        </p>
                    </motion.div>
                )}
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
        { step: 6,  icon: "📊", label: "Rencanakan Dana Hingga",  val: data.planningAge      ? `Usia ${data.planningAge} tahun` : "-" },
        { step: 7,  icon: "🏡", label: "Gaya Hidup Pensiun",      val: data.lifestylePercent ? `${data.lifestylePercent}% dari gaji terakhir` : "-" },
        { step: 8,  icon: "🧠", label: "Profil Risiko",           val: data.riskProfile      ? `${RISK_RESULT[data.riskProfile].emoji} ${RISK_RESULT[data.riskProfile].label}` : "-" },
        { step: 9,  icon: "🏢", label: "Sektor Pekerjaan",        val: data.sector           ?? "-" },
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
            <div className="mb-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {summaryItems.map(item => (
                        <div key={item.label}
                            className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl border hover:bg-gray-50 transition-colors cursor-default"
                            style={{ borderColor: T.hairline }}>
                            <span className="text-sm shrink-0">{item.icon}</span>
                            <div className="flex-1 min-w-0">
                                <p className="text-[10px] font-medium text-gray-500 leading-none">{item.label}</p>
                                <p className="text-xs font-semibold text-gray-900 truncate mt-0.5">
                                    {item.val}
                                </p>
                            </div>
                            <button type="button" onClick={() => onEdit(item.step)}
                                className="text-[10px] px-2.5 py-0.5 rounded-full border text-[#10B981] border-emerald-100 hover:bg-emerald-50 transition-all shrink-0">
                                Ubah
                            </button>
                        </div>
                    ))}
                </div>

                <label className="flex items-center gap-3 mt-4 px-4 py-3 rounded-xl border cursor-pointer"
                    style={{ borderColor: confirmAccuracy ? T.blue : T.hairline, background: confirmAccuracy ? T.blueLight : T.canvas }}>
                    <div className="relative">
                        <input
                            type="checkbox"
                            className="sr-only"
                            checked={confirmAccuracy}
                            onChange={e => onConfirmChange(e.target.checked)}
                        />
                        <div className="w-5 h-5 rounded-md border flex items-center justify-center transition-all"
                            style={{ borderColor: confirmAccuracy ? T.blue : T.hairline, background: confirmAccuracy ? T.blue : "transparent" }}>
                            {confirmAccuracy && <Check className="w-3 h-3 text-white" />}
                        </div>
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-gray-900">
                            Saya memastikan data yang saya isi sudah benar.
                        </p>
                        <p className="text-xs mt-0.5 text-gray-500">
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
    // Create array of segments (0 to total-1)
    const segments = Array.from({ length: total }, (_, i) => i);
    
    return (
        <div className="w-full flex gap-1.5">
            {segments.map((segmentIndex) => {
                // Segment is completed if current step > segmentIndex
                const isCompleted = step > segmentIndex + 1;
                const isCurrent = step === segmentIndex + 1;
                
                return (
                    <motion.div
                        key={segmentIndex}
                        className="h-1 rounded-full flex-1"
                        style={{
                            background: isCompleted 
                                ? `linear-gradient(90deg, ${T.blue}, #34d399)` 
                                : isCurrent
                                ? 'rgba(16, 185, 129, 0.3)'
                                : '#e5e7eb'
                        }}
                        initial={false}
                        animate={{
                            opacity: 1,
                        }}
                        transition={{ duration: 0.3 }}
                    />
                );
            })}
        </div>
    );
}

/* ══ Main Wizard ════════════════════════════════════════════════════════ */

const TOTAL = 11; // steps 0-10 (0 = personal, 10 = assumptions), + summary

const STEP_CONFIG = [
    { label: "Data Diri",    validate: (d: WizardData) => d.fullName !== null && d.age !== null && d.gender !== null },
    { label: "Gaji",         validate: (d: WizardData) => d.monthlyIncome !== null },
    { label: "Bonus",        validate: (d: WizardData) => d.annualBonusMonths !== null },
    { label: "Nabung",       validate: (d: WizardData) => d.savingsPercentage !== null },
    { label: "Tabungan",     validate: (d: WizardData) => d.currentSavings !== null },
    { label: "Pensiun",      validate: (d: WizardData) => d.retirementAge !== null },
    { label: "Usia Target",  validate: (d: WizardData) => {
        if (d.planningAge === null || d.retirementAge === null) return false;
        return d.planningAge > d.retirementAge && d.planningAge <= 120;
    }},
    { label: "Gaya Hidup",   validate: (d: WizardData) => d.lifestylePercent !== null },
    { label: "Risiko",       validate: (d: WizardData) => d.riskProfile !== null },
    { label: "Pekerjaan",    validate: (d: WizardData) => d.sector !== null },
    { label: "Asumsi",       validate: (d: WizardData) => d.depositRate !== null },
];

export function OnboardingWizard({
    onComplete, isPending, error, initialName,
}: {
    onComplete: (data: WizardData) => void;
    isPending: boolean;
    error: string | null;
    initialName?: string;
}) {
    const [step, setStep]   = useState(0);
    const [showSummary, setShowSummary] = useState(false);
    const [dir, setDir]     = useState<1 | -1>(1);
    const [data, setDataRaw] = useState<WizardData>({
        ...INITIAL,
        fullName: initialName || null,
    });
    const [confirmAccuracy, setConfirmAccuracy] = useState(false);
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const topRef = useRef<HTMLDivElement>(null);

    const set = useCallback((patch: Partial<WizardData>) =>
        setDataRaw(prev => ({ ...prev, ...patch })), []);

    useEffect(() => {
        topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, [step, showSummary]);

    const canNext = showSummary ? confirmAccuracy : STEP_CONFIG[step]?.validate(data) ?? true;

    const goNext = () => {
        if (showSummary) {
            setShowSuccessPopup(true);
            return;
        }
        if (step < TOTAL - 1) { setDir(1); setStep(s => s + 1); }
        else { setDir(1); setShowSummary(true); }
    };

    const goBack = () => {
        if (showSummary) {
            setDir(-1);
            setConfirmAccuracy(false);
            setShowSummary(false);
            return;
        }
        if (step > 0) { setDir(-1); setStep(s => s - 1); }
    };

    const handleEdit = (s: number) => {
        setDir(-1);
        setConfirmAccuracy(false);
        setShowSummary(false);
        setStep(s);
    };

    const v = slideVariant(dir);
    const currentStepLabel = showSummary ? "Ringkasan" : STEP_CONFIG[step]?.label ?? "";

    return (
        <div
            ref={topRef}
            className="w-full max-w-lg mx-auto flex flex-col"
        >
            {/* Top progress */}
            <div className="mb-3 px-1 shrink-0">
                <TopProgress step={showSummary ? TOTAL : step + 1} total={TOTAL} />
                <div className="flex justify-between mt-2">
                    <span className="text-xs font-medium" style={{ color: T.blue }}>{currentStepLabel}</span>
                    <span className="text-xs font-medium text-gray-500">
                        {showSummary ? "Selesai!" : `${step + 1} / ${TOTAL}`}
                    </span>
                </div>
            </div>

            {/* Card */}
            <div className="bg-white rounded-[24px] shadow-[0_12px_40px_rgba(0,0,0,0.06)] border border-gray-100 p-10 flex flex-col">

                {error && (
                    <div className="mb-5 flex items-center gap-2.5 p-4 rounded-2xl text-sm"
                        style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", color: T.danger }}>
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        {error}
                    </div>
                )}

                {/* Step content */}
                <div className={cn(
                    "w-full px-1",
                    step === 10 
                        ? "h-[320px] overflow-y-auto scrollbar-thin" 
                        : showSummary
                        ? "h-[420px] overflow-y-auto scrollbar-thin"
                        : "overflow-visible"
                )}>
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
                                {step === 6  && <S8_PlanningAge     data={data} set={set} />}
                                {step === 7  && <S9_Lifestyle       data={data} set={set} />}
                                {step === 8  && <S10_Risk           data={data} set={set} />}
                                {step === 9  && <S11_Sector         data={data} set={set} />}
                                {step === 10 && <S12_Assumptions    data={data} set={set} />}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Nav */}
                <div className="flex gap-3 mt-6 pt-6 border-t border-gray-100 shrink-0">
                    {(step > 0 || showSummary) && (
                        <button type="button" onClick={goBack}
                            className="flex items-center gap-1.5 px-6 py-4 rounded-xl border border-gray-200 text-base font-semibold text-gray-500 transition-all hover:bg-gray-50 active:scale-[0.97]"
                        >
                            <ChevronLeft className="w-4 h-4" /> Kembali
                        </button>
                    )}
                    <button 
                        type="button" 
                        onClick={goNext}
                        disabled={!canNext}
                        className="flex-1 flex items-center justify-center gap-2 py-4 rounded-xl text-base font-bold text-white transition-all active:scale-[0.97] disabled:opacity-40 disabled:cursor-not-allowed"
                        style={{ background: canNext ? `linear-gradient(135deg, ${T.blue}, #34d399)` : "#d1d5db" }}>
                        {showSummary ? (
                            <><Sparkles className="w-4 h-4" /> Registrasi Sekarang...</>
                        ) : step === TOTAL ? (
                            <>Lihat Ringkasan <ChevronRight className="w-4 h-4" /></>
                        ) : (
                            <>Lanjut <ChevronRight className="w-4 h-4" /></>
                        )}
                    </button>
                </div>
            </div>

            {/* Success Registration Popup */}
            <Modal
                open={showSuccessPopup}
                title="Registrasi Berhasil! 🎉"
                description="Selamat! Registrasi kamu berhasil. Yuk, lihat proyeksi dana pensiunmu sekarang!"
                primaryLabel={isPending ? "Memproses..." : "Hitung Proyeksi"}
                onPrimary={() => {
                    if (!isPending) {
                        onComplete(data);
                    }
                }}
                onClose={() => {
                    if (!isPending) {
                        setShowSuccessPopup(false);
                    }
                }}
            >
                <SuccessIllustration />
            </Modal>
        </div>
    );
}
