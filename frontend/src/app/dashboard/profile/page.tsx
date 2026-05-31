"use client";

import { useState, useEffect } from "react";
import { apiClient } from "@/lib/api/axios.config";
import { API } from "@/lib/constants/api-endpoints";
import { useFinancialProfile } from "@/features/financial-profile/hooks/useOnboarding";
import { financialProfileService } from "@/features/financial-profile/services/financial-profile.service";
import { RISK_QUESTIONS, calcRisk, SECTORS } from "@/features/financial-profile/components/OnBoardingWizard";
import type { OnboardingPayload, RiskProfile } from "@/features/financial-profile/types/financial-profile.types";
import { useQueryClient } from "@tanstack/react-query";
import { ProjectionLoader } from "@/components/ui/ProjectionLoader";
import {
  User,
  ShieldCheck,
  Umbrella,
  Loader2,
  Building2,
  PiggyBank,
  AlertCircle,
  CheckCircle2,
  Info,
  HeartPulse,
  ChevronLeft,
  X,
  Check,
  Edit3,
  Save,
  Undo
} from "lucide-react";

// Color mapping for risk categories
const RISK_DETAILS = {
  conservative: {
    label: "Konservatif",
    emoji: "🛡️",
    color: "text-blue-600",
    bg: "bg-blue-50",
    border: "border-blue-100",
    desc: "Fokus pada keamanan modal dengan volatilitas rendah. Cocok untuk Anda yang menghindari risiko tinggi.",
  },
  moderate: {
    label: "Moderat",
    emoji: "⚖️",
    color: "text-amber-600",
    bg: "bg-amber-50",
    border: "border-amber-100",
    desc: "Menyeimbangkan pertumbuhan modal dengan tingkat risiko terukur. Menengah dalam hal volatilitas.",
  },
  aggressive: {
    label: "Agresif",
    emoji: "🔥",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    border: "border-emerald-100",
    desc: "Mengejar tingkat return maksimal dalam jangka panjang. Siap menghadapi fluktuasi pasar yang tinggi.",
  },
};

const GENDER_LABEL: Record<string, string> = {
  male: "Laki-laki",
  female: "Perempuan",
};

// Helper to format Rupiah
function formatRupiah(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

// Local Custom Currency Input
function ProfileCurrencyField({
  value,
  onChange,
  disabled = false,
  placeholder = "0"
}: {
  value: number;
  onChange: (v: number) => void;
  disabled?: boolean;
  placeholder?: string;
}) {
  const [raw, setRaw] = useState(value ? String(value) : "");

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setRaw(value ? String(value) : "");
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/\D/g, "");
    setRaw(digits);
    onChange(digits === "" ? 0 : Number(digits));
  };

  const fmt = (n: number) => new Intl.NumberFormat("id-ID").format(n);

  return (
    <div className="relative flex items-center mt-1">
      <span className="absolute left-4 text-gray-400 font-semibold text-sm">Rp</span>
      <input
        type="text"
        inputMode="numeric"
        disabled={disabled}
        placeholder={placeholder}
        value={raw ? fmt(Number(raw)) : ""}
        onChange={handleChange}
        className="w-full pl-10 pr-4 py-3 rounded-2xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all font-semibold text-gray-800 disabled:bg-gray-50 disabled:text-gray-400"
      />
    </div>
  );
}

// Info Row in View Mode
function InfoRow({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: string | number;
  highlight?: boolean;
}) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
      <span className="text-sm text-gray-500 font-medium">{label}</span>
      <span
        className={`text-sm font-semibold ${
          highlight ? "text-emerald-600" : "text-gray-800"
        }`}
      >
        {value}
      </span>
    </div>
  );
}

export default function ProfilePage() {
  const { profile, isLoading, error, refetch } = useFinancialProfile();
  const queryClient = useQueryClient();
  const [email, setEmail] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<OnboardingPayload | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isSectorDropdownOpen, setIsSectorDropdownOpen] = useState(false);

  // Risk Quiz Modal State
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [quizStep, setQuizStep] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [calculatedRisk, setCalculatedRisk] = useState<RiskProfile | null>(null);

  // Fetch email separately to not disrupt type interfaces
  useEffect(() => {
    async function fetchEmail() {
      try {
        const res = await apiClient.get(API.PROFILE.GET);
        if (res.data?.data?.personal?.email) {
          setEmail(res.data.data.personal.email);
        }
      } catch {
        // Silently fail - email is not critical
      }
    }
    fetchEmail();
  }, []);

  // Sync profile data to local form state
  useEffect(() => {
    if (profile) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData({
        fullName: profile.fullName,
        age: profile.age,
        gender: profile.gender,
        monthlyIncome: profile.monthlyIncome,
        annualBonusMonths: profile.annualBonusMonths,
        monthlyExpense: profile.monthlyExpense,
        savingsPercentage: profile.savingsPercentage,
        currentSavings: profile.currentSavings,
        totalDebt: profile.totalDebt,
        retirementAge: profile.retirementAge,
        planningAge: profile.planningAge,
        lifestylePercent: profile.lifestylePercent,
        riskProfile: profile.riskProfile,
        riskAnswers: profile.riskAnswers || {},
        sector: profile.sector,
        hasHealthInsurance: profile.hasHealthInsurance,
        depositRate: profile.depositRate,
        includePandemicRisk: profile.includePandemicRisk,
      });
    }
  }, [profile]);

  const handleFieldChange = (key: keyof OnboardingPayload, value: unknown) => {
    if (!formData) return;
    setFormData((prev) => prev ? { ...prev, [key]: value } : null);
  };

  const handleCancel = () => {
    if (profile) {
      setFormData({
        fullName: profile.fullName,
        age: profile.age,
        gender: profile.gender,
        monthlyIncome: profile.monthlyIncome,
        annualBonusMonths: profile.annualBonusMonths,
        monthlyExpense: profile.monthlyExpense,
        savingsPercentage: profile.savingsPercentage,
        currentSavings: profile.currentSavings,
        totalDebt: profile.totalDebt,
        retirementAge: profile.retirementAge,
        planningAge: profile.planningAge,
        lifestylePercent: profile.lifestylePercent,
        riskProfile: profile.riskProfile,
        riskAnswers: profile.riskAnswers || {},
        sector: profile.sector,
        hasHealthInsurance: profile.hasHealthInsurance,
        depositRate: profile.depositRate,
        includePandemicRisk: profile.includePandemicRisk,
      });
    }
    setSaveError(null);
    setIsEditing(false);
  };

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!formData) return;

    setSaveError(null);
    setSaveSuccess(false);

    // Validation checks
    if (!formData.age || formData.age < 17 || formData.age > 100) {
      setSaveError("Usia harus diisi antara 17 hingga 100 tahun.");
      return;
    }
    if (!formData.retirementAge || formData.retirementAge <= formData.age || formData.retirementAge > 100) {
      setSaveError(`Target Usia Pensiun harus lebih besar dari usia Anda saat ini (${formData.age}) dan maksimal 100 tahun.`);
      return;
    }
    if (formData.savingsPercentage < 0 || formData.savingsPercentage > 100) {
      setSaveError("Target menabung harus bernilai antara 0% sampai 100%.");
      return;
    }
    if (formData.lifestylePercent < 0 || formData.lifestylePercent > 200) {
      setSaveError("Gaya hidup pensiun harus bernilai antara 0% sampai 200%.");
      return;
    }
    if (formData.depositRate < 0 || formData.depositRate > 100) {
      setSaveError("Asumsi bunga deposito harus bernilai antara 0% sampai 100%.");
      return;
    }

    setIsSaving(true);
    try {
      await financialProfileService.save(formData);
      queryClient.invalidateQueries({ queryKey: ["projection"] });
      setSaveSuccess(true);
      setIsEditing(false);
      await refetch();
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setSaveError(msg ?? "Gagal menyimpan perubahan profil.");
    } finally {
      setIsSaving(false);
    }
  };

  // ── Risk Questionnaire Logics ──
  const openQuiz = () => {
    // Pre-fill answers from existing profile data
    const prefilled: Record<string, number> = {};
    
    // Auto-calculate annual_income untuk risk assessment
    // Formula: (gaji bulanan × 12) + (gaji bulanan × bonus bulan)
    // Ini HANYA untuk analisis profil risiko finansial, TIDAK mempengaruhi proyeksi pensiun
    if (formData) {
      if (formData.age) prefilled.age = formData.age;
      if (formData.monthlyIncome) {
        const bonusMonths = formData.annualBonusMonths ?? 0;
        prefilled.annual_income = formData.monthlyIncome * (12 + bonusMonths);
      }
      if (formData.currentSavings) prefilled.savings_balance = formData.currentSavings;
    }
    setQuizStep(0);
    setQuizAnswers(prefilled);
    setCalculatedRisk(null);
    setIsQuizOpen(true);
  };

  const closeQuiz = () => {
    setIsQuizOpen(false);
  };

  const currentQuestion = RISK_QUESTIONS[quizStep];
  const allQuizDone = RISK_QUESTIONS.every((q) => quizAnswers[q.id] !== undefined);

  const handleQuizSelect = (value: number) => {
    const nextAnswers = { ...quizAnswers, [currentQuestion.id]: value };
    setQuizAnswers(nextAnswers);

    if (quizStep < RISK_QUESTIONS.length - 1) {
      setQuizStep((s) => s + 1);
    } else {
      setCalculatedRisk(calcRisk(nextAnswers));
    }
  };

  const handleQuizInputChange = (value: number | null) => {
    if (value !== null) {
      setQuizAnswers((prev) => ({ ...prev, [currentQuestion.id]: value }));
    }
  };

  const handleQuizNext = () => {
    if (quizAnswers[currentQuestion.id] !== undefined) {
      if (quizStep < RISK_QUESTIONS.length - 1) {
        setQuizStep((s) => s + 1);
      } else {
        setCalculatedRisk(calcRisk(quizAnswers));
      }
    }
  };

  const handleSaveQuizResult = async () => {
    if (!formData || !calculatedRisk) return;

    setIsSaving(true);
    try {
      const updatedPayload: OnboardingPayload = {
        ...formData,
        riskProfile: calculatedRisk,
        riskAnswers: quizAnswers,
        // Sync age and totalDebt from quiz values
        age: quizAnswers.age ?? formData.age,
        totalDebt: quizAnswers.loan_amount ?? formData.totalDebt,
        monthlyExpense: quizAnswers.monthly_expenses ?? formData.monthlyExpense,
      };

      await financialProfileService.save(updatedPayload);
      queryClient.invalidateQueries({ queryKey: ["projection"] });
      setFormData(updatedPayload);
      setIsQuizOpen(false);
      setSaveSuccess(true);
      await refetch();
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch {
      alert("Gagal menyimpan profil risiko baru.");
    } finally {
      setIsSaving(false);
    }
  };

  // Render loading skeleton
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-10rem)]">
        <div className="w-full max-w-sm">
          <ProjectionLoader text="Memuat profil kamu..." />
        </div>
      </div>
    );
  }

  if (error || !profile || !formData) {
    return (
      <div className="max-w-md mx-auto mt-16 text-center">
        <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
          <AlertCircle size={28} className="text-red-500" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Gagal Memuat Profil</h2>
        <p className="text-gray-500 text-sm mb-6">{error ?? "Terjadi kesalahan saat memuat data."}</p>
        <button
          onClick={refetch}
          className="px-5 py-2.5 bg-emerald-500 text-white rounded-full text-sm font-semibold hover:bg-emerald-600 transition-colors"
        >
          Coba Lagi
        </button>
      </div>
    );
  }

  const riskInfo = RISK_DETAILS[formData.riskProfile] || RISK_DETAILS.moderate;

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* ── Profile Header ── */}
      <div className="flex items-start justify-between gap-6 flex-wrap pb-6 border-b border-gray-100">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-3xl bg-linear-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
            <User size={30} strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
              {profile.fullName || "User"}
            </h1>
            <p className="text-gray-500 font-medium">{email || "Memuat email..."}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          {isEditing ? (
            <>
              <button
                type="button"
                onClick={handleCancel}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl border border-gray-200 text-gray-600 hover:bg-gray-50 font-bold transition-all text-sm"
              >
                <Undo size={16} />
                Batal
              </button>
              <button
                type="button"
                onClick={() => handleSave()}
                disabled={isSaving}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white font-bold transition-all shadow-md shadow-emerald-500/10 text-sm"
              >
                {isSaving ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Save size={16} />
                )}
                Simpan
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-emerald-50 hover:bg-emerald-100/80 text-emerald-700 font-bold transition-all border border-emerald-100 text-sm"
            >
              <Edit3 size={16} />
              Edit Profil
            </button>
          )}
        </div>
      </div>

      {/* ── Status Messages ── */}
      {saveSuccess && (
        <div className="flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-100 text-emerald-800 rounded-2xl text-sm font-semibold animate-in fade-in duration-300">
          <CheckCircle2 size={18} className="text-emerald-500" />
          <span>Profil berhasil disimpan dan diperbarui! Proyeksi pensiun telah dihitung ulang.</span>
        </div>
      )}
      {saveError && (
        <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-100 text-red-800 rounded-2xl text-sm font-semibold animate-in fade-in duration-300">
          <AlertCircle size={18} className="text-red-500 shrink-0 mt-0.5" />
          <span>{saveError}</span>
        </div>
      )}

      {/* ── Profile Details Cards ── */}
      <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1: Data Diri */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-gray-50">
            <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500">
              <User size={18} />
            </div>
            <h2 className="font-bold text-gray-800 text-base">Data Diri</h2>
          </div>
          {isEditing ? (
            <div className="space-y-4">
              <div>
                <label className="text-xs text-gray-400 font-bold block mb-1">NAMA LENGKAP (TIDAK BISA DIUBAH)</label>
                <input
                  type="text"
                  disabled
                  value={formData.fullName}
                  className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-gray-50 text-gray-400 font-semibold cursor-not-allowed outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-400 font-bold block mb-1">JENIS KELAMIN (TIDAK BISA DIUBAH)</label>
                  <input
                    type="text"
                    disabled
                    value={GENDER_LABEL[formData.gender] || formData.gender}
                    className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-gray-50 text-gray-400 font-semibold cursor-not-allowed outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 font-bold block mb-1">USIA (TAHUN)</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={formData.age || ""}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, "");
                      handleFieldChange("age", val === "" ? 0 : Number(val));
                    }}
                    className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all font-semibold text-gray-800"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-1">
              <InfoRow label="Nama Lengkap" value={formData.fullName} />
              <InfoRow label="Jenis Kelamin" value={GENDER_LABEL[formData.gender] || formData.gender} />
              <InfoRow label="Usia" value={`${formData.age} tahun`} />
            </div>
          )}
        </div>

        {/* Card 2: Pekerjaan & Finansial */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-gray-50">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-500">
              <Building2 size={18} />
            </div>
            <h2 className="font-bold text-gray-800 text-base">Finansial & Pekerjaan</h2>
          </div>
          {isEditing ? (
            <div className="space-y-4">
              <div>
                <label className="text-xs text-gray-500 font-bold block mb-1">SEKTOR PEKERJAAN</label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setIsSectorDropdownOpen(!isSectorDropdownOpen)}
                    className="w-full flex items-center justify-between px-4 py-3 rounded-2xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all font-semibold text-gray-800 bg-white text-left text-sm"
                  >
                    <span className="truncate mr-2">
                      {formData.sector ? (
                        <>
                          <span className="mr-2">
                            {SECTORS.find((s) => s.label === formData.sector)?.icon || "🏢"}
                          </span>
                          {formData.sector}
                        </>
                      ) : (
                        "Pilih Sektor"
                      )}
                    </span>
                    <span className="text-gray-400 text-xs shrink-0">▼</span>
                  </button>

                  {isSectorDropdownOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-20"
                        onClick={() => setIsSectorDropdownOpen(false)}
                      />
                      <div className="absolute left-0 right-0 z-30 mt-2 bg-white border border-gray-100 rounded-2xl shadow-xl max-h-60 overflow-y-auto overflow-x-auto py-1">
                        {SECTORS.map((s) => (
                          <button
                            key={s.label}
                            type="button"
                            onClick={() => {
                              handleFieldChange("sector", s.label);
                              setIsSectorDropdownOpen(false);
                            }}
                            className={`w-full text-left px-4 py-2.5 hover:bg-emerald-50 hover:text-emerald-700 font-semibold text-sm flex items-center gap-2.5 whitespace-nowrap transition-colors ${
                              formData.sector === s.label
                                ? "bg-emerald-50/50 text-emerald-600"
                                : "text-gray-700"
                            }`}
                          >
                            <span className="text-base shrink-0">{s.icon}</span>
                            <span>{s.label}</span>
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-500 font-bold block">PENGHASILAN BULANAN</label>
                  <ProfileCurrencyField
                    value={formData.monthlyIncome}
                    onChange={(v) => handleFieldChange("monthlyIncome", v)}
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 font-bold block">BONUS TAHUNAN (BULAN GAJI)</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={formData.annualBonusMonths || 0}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, "");
                      handleFieldChange("annualBonusMonths", val === "" ? 0 : Number(val));
                    }}
                    className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all font-semibold text-gray-800 mt-1"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-1">
              <InfoRow label="Sektor Pekerjaan" value={formData.sector || "-"} />
              <InfoRow label="Penghasilan Bulanan" value={formatRupiah(formData.monthlyIncome)} highlight />
              <InfoRow label="Bonus Tahunan" value={`${formData.annualBonusMonths}× gaji/tahun`} />
            </div>
          )}
        </div>

        {/* Card 3: Tabungan & Aset */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-gray-50">
            <div className="w-9 h-9 rounded-xl bg-violet-50 flex items-center justify-center text-violet-500">
              <PiggyBank size={18} />
            </div>
            <h2 className="font-bold text-gray-800 text-base">Tabungan & Aset</h2>
          </div>
          {isEditing ? (
            <div className="space-y-4">
              <div>
                <label className="text-xs text-gray-500 font-bold block">TABUNGAN SAAT INI</label>
                <ProfileCurrencyField
                  value={formData.currentSavings}
                  onChange={(v) => handleFieldChange("currentSavings", v)}
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 font-bold block">TARGET MENABUNG (%)</label>
                <p className="text-[10px] text-gray-400 font-medium mt-0.5">Persentase dari gaji bulanan Anda yang disisihkan untuk ditabung/investasi (contoh: 20%)</p>
                <input
                  type="text"
                  inputMode="numeric"
                  value={formData.savingsPercentage || 0}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, "");
                    handleFieldChange("savingsPercentage", val === "" ? 0 : Number(val));
                  }}
                  className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all font-semibold text-gray-800 mt-1"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-1">
              <InfoRow label="Tabungan Saat Ini" value={formatRupiah(formData.currentSavings)} highlight />
              <InfoRow label="Target Menabung" value={`${formData.savingsPercentage}% dari gaji bulanan`} />
            </div>
          )}
        </div>

        {/* Card 4: Target Pensiun */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-gray-50">
            <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center text-amber-500">
              <Umbrella size={18} />
            </div>
            <h2 className="font-bold text-gray-800 text-base">Dana Pensiun</h2>
          </div>
          {isEditing ? (
            <div className="space-y-4">
              <div>
                <label className="text-xs text-gray-500 font-bold block mb-1">TARGET USIA PENSIUN</label>
                <input
                  type="text"
                  inputMode="numeric"
                  value={formData.retirementAge || ""}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, "");
                    handleFieldChange("retirementAge", val === "" ? 0 : Number(val));
                  }}
                  className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all font-semibold text-gray-800"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 font-bold block mb-1">RENCANAKAN DANA HINGGA USIA</label>
                <p className="text-[10px] text-gray-400 font-medium mt-0.5 mb-1">Usia target hingga dana pensiunmu harus bertahan (berdasarkan tabel mortalitas)</p>
                <input
                  type="text"
                  inputMode="numeric"
                  value={formData.planningAge || ""}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, "");
                    handleFieldChange("planningAge", val === "" ? 0 : Number(val));
                  }}
                  placeholder="Contoh: 84"
                  className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all font-semibold text-gray-800"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 font-bold block mb-1">GAYA HIDUP PENSIUN (%)</label>
                <p className="text-[10px] text-gray-400 font-medium mt-0.5 mb-1">Persentase dari gaji terakhir yang kamu butuhkan per bulan saat pensiun</p>
                <input
                  type="text"
                  inputMode="numeric"
                  value={formData.lifestylePercent || ""}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, "");
                    handleFieldChange("lifestylePercent", val === "" ? 0 : Number(val));
                  }}
                  className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all font-semibold text-gray-800"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-1">
              <InfoRow label="Target Usia Pensiun" value={`${formData.retirementAge} Tahun`} />
              <InfoRow label="Rencanakan Dana Hingga" value={formData.planningAge ? `${formData.planningAge} Tahun` : "-"} />
              <InfoRow label="Gaya Hidup Pensiun" value={`${formData.lifestylePercent}% dari pengeluaran akhir`} />
            </div>
          )}
        </div>

        {/* Card 5: Profil Risiko */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-gray-50">
            <div className="w-9 h-9 rounded-xl bg-rose-50 flex items-center justify-center text-rose-500">
              <ShieldCheck size={18} />
            </div>
            <h2 className="font-bold text-gray-800 text-base">Profil Risiko</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className={`px-4 py-1.5 rounded-full text-sm font-extrabold ${riskInfo.bg} ${riskInfo.color}`}>
                {riskInfo.emoji} {riskInfo.label}
              </span>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed font-medium">
              {riskInfo.desc}
            </p>
            <div>
              <button
                type="button"
                onClick={openQuiz}
                className="w-full py-2.5 rounded-2xl border border-emerald-200 text-emerald-700 hover:bg-emerald-50 font-bold transition-all text-sm text-center"
              >
                Isi Ulang Kuesioner Risiko
              </button>
            </div>
          </div>
        </div>

        {/* Card 6: Asumsi & Proteksi */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-gray-50">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-500">
              <HeartPulse size={18} />
            </div>
            <h2 className="font-bold text-gray-800 text-base">Asumsi & Proteksi</h2>
          </div>
          {isEditing ? (
            <div className="space-y-4">
              <div>
                <label className="text-xs text-gray-500 font-bold block mb-1">ASUMSI BUNGA DEPOSITO (%)</label>
                <select
                  value={formData.depositRate}
                  onChange={(e) => handleFieldChange("depositRate", Number(e.target.value))}
                  className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all font-semibold text-gray-800"
                >
                  <option value={3.5}>3.5% (Konservatif)</option>
                  <option value={4.0}>4.0% (Standar bank)</option>
                  <option value={4.5}>4.5% (Rata-rata 2025)</option>
                  <option value={5.0}>5.0% (Optimistis)</option>
                </select>
              </div>

              <div className="space-y-3 pt-2">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.hasHealthInsurance}
                    onChange={(e) => handleFieldChange("hasHealthInsurance", e.target.checked)}
                    className="w-5 h-5 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="text-sm text-gray-700 font-semibold">Memiliki Asuransi Kesehatan</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.includePandemicRisk}
                    onChange={(e) => handleFieldChange("includePandemicRisk", e.target.checked)}
                    className="w-5 h-5 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="text-sm text-gray-700 font-semibold">Sertakan Buffer Risiko Pandemi</span>
                </label>
              </div>
            </div>
          ) : (
            <div className="space-y-1">
              <InfoRow label="Rate Bunga Deposito" value={`${formData.depositRate}% per tahun`} />
              <InfoRow label="Asuransi Kesehatan" value={formData.hasHealthInsurance ? "Tersedia" : "Tidak Ada"} />
              <InfoRow label="Risiko Pandemi" value={formData.includePandemicRisk ? "Dipertimbangkan" : "Diabaikan"} />
            </div>
          )}
        </div>
      </form>

      {/* ── Footer Info Note ── */}
      {!isEditing && (
        <div className="flex items-center gap-3.5 p-4 bg-emerald-50 border border-emerald-100 rounded-3xl text-emerald-800">
          <Info size={16} className="shrink-0 text-emerald-600" />
          <p className="text-base font-semibold leading-relaxed">
            Semua parameter di atas digunakan oleh mesin rekomendasi CuanSelor untuk menyimulasikan masa pensiun Anda menggunakan metode Monte Carlo. Anda dapat memperbarui data ini kapan saja untuk melihat dampaknya pada rencana pensiun Anda.
          </p>
        </div>
      )}

      {/* ── RISK QUIZ MODAL ── */}
      {isQuizOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">

            {/* Header — mirip container register */}
            <div className="flex items-center justify-between px-7 pt-7 pb-5 border-b border-gray-100">
              <div>
                <h3 className="text-xl font-bold text-gray-900 tracking-tight">
                  Perbarui Profil Risiko
                </h3>
                <p className="text-sm text-gray-500 mt-0.5">
                  Jawab pertanyaan berikut untuk menghitung ulang profil risiko kamu
                </p>
              </div>
              <button
                onClick={closeQuiz}
                className="p-2 rounded-xl hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Body */}
            <div className="px-7 py-6">
              {!allQuizDone ? (
                <div className="space-y-5">
                  {/* Progress bar */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs text-gray-400 font-medium">
                      <span>Pertanyaan {quizStep + 1} dari {RISK_QUESTIONS.length}</span>
                      <span>{Math.round(((quizStep) / RISK_QUESTIONS.length) * 100)}% selesai</span>
                    </div>
                    <div className="flex gap-1">
                      {RISK_QUESTIONS.map((q, i) => (
                        <div
                          key={q.id}
                          className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                            i < quizStep
                              ? "bg-emerald-500"        // sudah dilewati
                              : i === quizStep
                              ? "bg-emerald-300"        // sedang aktif
                              : "bg-gray-100"           // belum dilewati
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Question */}
                  <div>
                    <p className="text-base font-semibold text-gray-900 leading-snug">
                      {currentQuestion.q}
                    </p>
                    {currentQuestion.hint && (
                      <p className="text-xs text-gray-400 mt-1 leading-relaxed">{currentQuestion.hint}</p>
                    )}
                    {/* Show pre-filled notice */}
                    {(currentQuestion.id === "age" || currentQuestion.id === "annual_income" || currentQuestion.id === "savings_balance") &&
                      quizAnswers[currentQuestion.id] !== undefined && (
                      <p className="text-xs text-emerald-600 font-medium mt-1.5 flex items-center gap-1">
                        <Check size={12} /> Diisi otomatis dari data profilmu — ubah jika perlu
                      </p>
                    )}
                  </div>

                  {/* Inputs */}
                  <div>
                    {currentQuestion.type === "select" && currentQuestion.opts ? (
                      <div className="space-y-2.5">
                        {currentQuestion.opts.map((opt) => {
                          const selected = quizAnswers[currentQuestion.id] === opt.score;
                          return (
                            <button
                              key={opt.score}
                              type="button"
                              onClick={() => handleQuizSelect(opt.score)}
                              className={`w-full text-left flex items-center justify-between px-4 py-3.5 rounded-xl border transition-all duration-150 ${
                                selected
                                  ? "border-emerald-500 bg-emerald-50 ring-1 ring-emerald-500/20"
                                  : "border-gray-200 hover:border-emerald-300 hover:bg-gray-50"
                              }`}
                            >
                              <div>
                                <p className={`font-semibold text-sm ${selected ? "text-emerald-700" : "text-gray-800"}`}>
                                  {opt.label}
                                </p>
                                {opt.sub && <p className="text-xs text-gray-400 mt-0.5">{opt.sub}</p>}
                              </div>
                              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                                selected ? "border-emerald-500 bg-emerald-500" : "border-gray-300"
                              }`}>
                                {selected && <Check className="w-3 h-3 text-white" />}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    ) : currentQuestion.type === "currency" ? (
                      <div className="space-y-3">
                        <ProfileCurrencyField
                          value={quizAnswers[currentQuestion.id] || 0}
                          onChange={handleQuizInputChange}
                        />
                        <button
                          type="button"
                          onClick={handleQuizNext}
                          disabled={quizAnswers[currentQuestion.id] === undefined}
                          className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold transition-all text-sm"
                        >
                          Lanjut
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="relative">
                          <input
                            type="text"
                            inputMode="numeric"
                            value={quizAnswers[currentQuestion.id] !== undefined ? String(quizAnswers[currentQuestion.id]) : ""}
                            onChange={(e) => {
                              const val = e.target.value.replace(/[^\d.]/g, "").replace(/^(\d*\.?\d*).*/, "$1");
                              handleQuizInputChange(val === "" ? null : Number(val));
                            }}
                            placeholder={currentQuestion.placeholder}
                            autoFocus
                            className="w-full px-4 py-3.5 pr-16 text-base font-semibold rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all text-gray-800 placeholder:font-normal placeholder:text-gray-400"
                          />
                          {currentQuestion.unit && (
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-400 font-medium">
                              {currentQuestion.unit}
                            </span>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={handleQuizNext}
                          disabled={quizAnswers[currentQuestion.id] === undefined}
                          className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold transition-all text-sm"
                        >
                          Lanjut
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Back button */}
                  {quizStep > 0 && (
                    <button
                      type="button"
                      onClick={() => setQuizStep((s) => s - 1)}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <ChevronLeft size={13} /> Kembali
                    </button>
                  )}
                </div>
              ) : (
                /* Result Screen */
                calculatedRisk && (
                  <div className="space-y-5">
                    {/* Result badge */}
                    <div className={`flex items-center gap-4 p-4 rounded-xl border ${RISK_DETAILS[calculatedRisk].border} ${RISK_DETAILS[calculatedRisk].bg}`}>
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${RISK_DETAILS[calculatedRisk].bg} border ${RISK_DETAILS[calculatedRisk].border}`}>
                        <ShieldCheck size={22} className={RISK_DETAILS[calculatedRisk].color} />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 font-medium">Profil Risiko Baru</p>
                        <h4 className={`text-lg font-bold ${RISK_DETAILS[calculatedRisk].color}`}>
                          {RISK_DETAILS[calculatedRisk].label}
                        </h4>
                        <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                          {RISK_DETAILS[calculatedRisk].desc}
                        </p>
                      </div>
                    </div>

                    {/* Summary of changes */}
                    <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 space-y-2.5">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Data yang akan diperbarui</p>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Profil Risiko</span>
                          <span className={`font-semibold ${RISK_DETAILS[calculatedRisk].color}`}>{RISK_DETAILS[calculatedRisk].label}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Usia</span>
                          <span className="font-semibold text-gray-800">{quizAnswers.age} tahun</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Pengeluaran Bulanan</span>
                          <span className="font-semibold text-gray-800">{formatRupiah(quizAnswers.monthly_expenses || 0)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Total Utang</span>
                          <span className="font-semibold text-gray-800">{formatRupiah(quizAnswers.loan_amount || 0)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3 pt-1">
                      <button
                        type="button"
                        onClick={openQuiz}
                        className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 font-semibold transition-all text-sm"
                      >
                        Ulangi
                      </button>
                      <button
                        type="button"
                        onClick={handleSaveQuizResult}
                        disabled={isSaving}
                        className="flex-1 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white font-semibold transition-all text-sm flex items-center justify-center gap-2"
                      >
                        {isSaving && <Loader2 size={15} className="animate-spin" />}
                        Simpan Profil Baru
                      </button>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
