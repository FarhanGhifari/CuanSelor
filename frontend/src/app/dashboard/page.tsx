"use client";

import { useState, useEffect } from "react";
import { 
  Wallet, 
  TrendingUp, 
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Calendar,
  PiggyBank,
  TrendingDown,
  MessageCircle,
  CheckCircle2,
  Info,
  Sliders,
  BarChart3,
  AlertTriangle,
  LayoutDashboard,
  HelpCircle,
  Clock
} from "lucide-react";
import Link from "next/link";
import { useProjection } from "@/features/projection/hooks/useProjection";
import { formatCurrency, formatPercentage } from "@/features/projection/utils/format";
import { ProjectionLoader } from "@/components/ui/ProjectionLoader";

type InvestmentKey = "median_p50" | "pessimistic_p10" | "optimistic_p90";
type LongevityKey = "P50" | "P90";

export default function DashboardOverview() {
  const [selectedLongevity, setSelectedLongevity] = useState<LongevityKey>("P50");
  const [selectedInvestment, setSelectedInvestment] = useState<InvestmentKey>("median_p50");
  const [customPlanningAge, setCustomPlanningAge] = useState<number | undefined>(undefined);

  const { data: projectionData, isLoading, error } = useProjection(customPlanningAge);

  // Sync customPlanningAge when selectedLongevity changes or when projectionData loads
  useEffect(() => {
    if (projectionData?.actuarial_summary) {
      const targetAge = selectedLongevity === "P50"
        ? projectionData.actuarial_summary.p50_survival_age
        : projectionData.actuarial_summary.p90_survival_age;
      
      if (customPlanningAge !== targetAge) {
        setCustomPlanningAge(targetAge);
      }
    }
  }, [projectionData, selectedLongevity, customPlanningAge]);

  const actuarial = projectionData?.actuarial_summary;
  const scenarioData = projectionData?.projection[selectedInvestment];

  const ruinProbability = scenarioData?.ruin_probability ?? 0;
  const successRate = (1 - ruinProbability) * 100;

  const isFundingHighRisk = ruinProbability > 0.5;
  const isFundingWarning = ruinProbability > 0.15 && ruinProbability <= 0.5;

  const fundingStatus = isFundingHighRisk
    ? "Risiko Tinggi — Dana Berpotensi Habis"
    : isFundingWarning
      ? "Perlu Perhatian — Bisa Ditingkatkan"
      : "Aman - Dana Cukup Sampai Target";

  const fundingStatusClass = isFundingHighRisk
    ? "bg-red-50 text-red-700 border-red-200"
    : isFundingWarning
      ? "bg-amber-50 text-amber-700 border-amber-200"
      : "bg-emerald-50 text-emerald-700 border-emerald-200";

  const fundingRingColor = isFundingHighRisk ? "#ef4444" : isFundingWarning ? "#f59e0b" : "#10b981";
  
  const isLongevityHighRisk = actuarial?.longevity_risk_flag ?? false;
  
  const statusDesc = isLongevityHighRisk
    ? "Harapan hidup (78 th) terlalu dekat dengan target pensiun. Kamu mungkin hanya punya sedikit waktu menikmati masa pensiun, pertimbangkan pensiun lebih awal."
    : "Durasi pensiun wajar, risiko inflasi relatif terkendali.";

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      

      {/* Proyeksi Pensiun Section */}
      {isLoading ? (
        <ProjectionLoader />
      ) : error ? (
        <div className="bg-white rounded-4xl p-8 border border-red-100">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center shrink-0">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Data Belum Lengkap</h3>
              <p className="text-sm text-gray-600 mb-4">
                Lengkapi data onboarding untuk melihat proyeksi pensiun.
              </p>
              <Link
                href="/auth/onboarding"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition-colors text-sm"
              >
                Lengkapi Data <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      ) : projectionData && actuarial ? (
        <>
          {/* Proyeksi Pensiun Header */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">Proyeksi Pensiun</h3>
              <p className="text-sm text-gray-500">
                Pilih target usia berdasarkan peluang hidup (aktuaria) lalu lihat hasil dananya
              </p>
            </div>
            <Link
              href="/dashboard/projection"
              className="text-emerald-600 hover:text-emerald-700 font-semibold text-sm flex items-center gap-2"
            >
              Lihat Detail <ArrowRight size={16} />
            </Link>
          </div>

          {/* ════════════════════════════════════════════════════════════
              INFORMASI AKUARIA INFOBOX
              ════════════════════════════════════════════════════════════ */}
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5 text-blue-900 flex gap-3.5 items-start">
            <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <div className="text-sm leading-relaxed">
              <span className="font-bold">Informasi Aktuaria (Berdasarkan Tabel Mortalitas BPJS/TMPI 2023):</span> Usia harapan hidup rata-rata Anda adalah{" "}
              <span className="font-bold">{actuarial.expected_death_age} tahun</span>. Terdapat probabilitas{" "}
              <span className="font-bold">50%</span> untuk mencapai usia{" "}
              <span className="font-bold">{actuarial.p50_survival_age} tahun</span> (P50), dan probabilitas{" "}
              <span className="font-bold">10%</span> untuk mencapai usia{" "}
              <span className="font-bold">{actuarial.p90_survival_age} tahun</span> (P90).{" "}
              <span className="font-semibold">P50/P90 di sini menunjukkan peluang hidup.</span>
            </div>
          </div>

          {/* ════════════════════════════════════════════════════════════
              LONGEVITY TARGET SELECTOR (P50 vs P90)
              ════════════════════════════════════════════════════════════ */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-gray-700">Rencanakan Dana Hingga Usia (Target Usia Hidup)</h4>
            <p className="text-xs text-gray-500">
              Menentukan sampai usia berapa dana perlu bertahan berdasarkan peluang hidup.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* P50 Button Card */}
              <button
                onClick={() => setSelectedLongevity("P50")}
                className={`text-left p-5 rounded-2xl border-2 transition-all duration-300 relative overflow-hidden ${
                  selectedLongevity === "P50"
                    ? "bg-blue-50 border-blue-500 ring-2 ring-blue-500/20 shadow-md"
                    : "bg-white border-gray-100 hover:border-gray-200"
                }`}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${
                    selectedLongevity === "P50" ? "bg-blue-200 text-blue-800" : "bg-gray-100 text-gray-600"
                  }`}>
                    P50 - Realistis
                  </span>
                  {selectedLongevity === "P50" && <CheckCircle2 className="w-5 h-5 text-blue-600" />}
                </div>
                <div className="text-2xl font-black text-gray-900 mb-1">
                  {actuarial.p50_survival_age} Tahun
                </div>
                  <p className="text-xs text-gray-500">
                    Target usia dengan peluang hidup 50%. Realistis untuk kebanyakan orang.
                  </p>
                </button>

              {/* P90 Button Card */}
              <button
                onClick={() => setSelectedLongevity("P90")}
                className={`text-left p-5 rounded-2xl border-2 transition-all duration-300 relative overflow-hidden ${
                  selectedLongevity === "P90"
                    ? "bg-emerald-50 border-emerald-500 ring-2 ring-emerald-500/20 shadow-md"
                    : "bg-white border-gray-100 hover:border-gray-200"
                }`}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${
                    selectedLongevity === "P90" ? "bg-emerald-200 text-emerald-800" : "bg-gray-100 text-gray-600"
                  }`}>
                    P90 - Sangat Aman
                  </span>
                  {selectedLongevity === "P90" && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
                </div>
                <div className="text-2xl font-black text-gray-900 mb-1">
                  {actuarial.p90_survival_age} Tahun
                </div>
                  <p className="text-xs text-gray-500">
                    Target usia dengan peluang hidup 10%. Cocok untuk mitigasi risiko umur panjang.
                  </p>
                </button>
              </div>
            </div>

          {/* ════════════════════════════════════════════════════════════
              FUNDAMENTAL ASUMSI ANDA CARDS
              ════════════════════════════════════════════════════════════ */}
          <div className="space-y-4">
            <h4 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Sliders className="w-5 h-5 text-emerald-600" /> Fundamental Asumsi Anda
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Card 1: Usia Harapan Hidup */}
              <div className="bg-white border border-gray-100 rounded-2xl p-6 text-gray-900 shadow-[0_8px_30px_rgba(0,0,0,0.02)] flex flex-col justify-between min-h-35">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                    USIA HARAPAN HIDUP (P50)
                  </span>
                  <Clock className="w-4.5 h-4.5 text-blue-500" />
                </div>
                <div className="text-3xl font-black text-blue-600 mt-2">
                  {actuarial.p50_survival_age} Tahun
                </div>
                <span className="text-[11px] text-gray-500 mt-2 block">
                  Usia di mana 50% populasi diperkirakan bertahan hidup.
                </span>
              </div>

              {/* Card 2: Batas Maksimal Horizon Pensiun */}
              <div className="bg-white border border-gray-100 rounded-2xl p-6 text-gray-900 shadow-[0_8px_30px_rgba(0,0,0,0.02)] flex flex-col justify-between min-h-35">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                    BATAS MAKSIMAL HORIZON PENSIUN (P90)
                  </span>
                  <Calendar className="w-4.5 h-4.5 text-emerald-500" />
                </div>
                <div className="text-3xl font-black text-emerald-600 mt-2">
                  {actuarial.p90_survival_age} Tahun
                </div>
                <span className="text-[11px] text-gray-500 mt-2 block">
                  Basis perhitungan ketahanan dana aman.
                </span>
              </div>

              {/* Card 3: Status Risiko Umur Panjang */}
              <div className="bg-white border border-gray-100 rounded-2xl p-6 text-gray-900 shadow-[0_8px_30px_rgba(0,0,0,0.02)] flex flex-col justify-between min-h-35">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                    STATUS RISIKO UMUR PANJANG
                  </span>
                  {isLongevityHighRisk ? (
                    <AlertTriangle className="w-4.5 h-4.5 text-red-500" />
                  ) : (
                    <CheckCircle2 className="w-4.5 h-4.5 text-emerald-500" />
                  )}
                </div>
                <div className="mt-2">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${
                    isLongevityHighRisk 
                      ? "bg-red-50 text-red-600 border-red-100" 
                      : "bg-emerald-50 text-emerald-600 border-emerald-100"
                  }`}>
                    {isLongevityHighRisk ? "Risiko Tinggi" : "Aman Terkendali"}
                  </span>
                </div>
                <span className="text-[11px] text-gray-500 mt-2 block leading-relaxed">
                  {statusDesc}
                </span>
              </div>
            </div>
          </div>

          {/* ════════════════════════════════════════════════════════════
              DETAIL SKENARIO TERPILIH — Metrics + Ruin Gauge
              ════════════════════════════════════════════════════════════ */}
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
              <h3 className="text-lg font-bold text-gray-900">
                Hasil Proyeksi Dana Saat Pensiun (Skenario Investasi)
              </h3>
            </div>
            <p className="text-xs text-gray-500">
              P10/P50/P90 di bawah ini menggambarkan variasi hasil investasi untuk usia{" "}
              {projectionData.user_profile.age} → {projectionData.user_profile.retirement_age}.
            </p>

            {/* Tabs */}
            <div className="flex border-b border-gray-200">
              {[
                { key: "median_p50" as const, label: "Skenario Median (P50)" },
                { key: "pessimistic_p10" as const, label: "Skenario Pesimis (P10)" },
                { key: "optimistic_p90" as const, label: "Skenario Optimis (P90)" },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setSelectedInvestment(tab.key)}
                  className={`py-3 px-6 font-bold text-sm border-b-2 transition-colors ${
                    selectedInvestment === tab.key
                      ? "border-emerald-600 text-emerald-600"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Active Tab Content */}
            {scenarioData && (
              <div className="grid lg:grid-cols-2 gap-8">
                {/* Left Column: Metrics */}
                <div className="space-y-6 bg-white rounded-3xl p-8 border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
                  <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 text-sm text-emerald-900">
                    {selectedInvestment === "median_p50" && (
                      <div>
                        <p className="font-semibold">Skenario Median (P50)</p>
                        <p className="mt-1 text-emerald-800">
                          Angka di bawah ini adalah hasil yang paling wajar: peluang 50% hasil investasi berada di atasnya dan 50% di bawahnya.
                          Cocok sebagai patokan utama karena mencerminkan kondisi pasar normal.
                        </p>
                      </div>
                    )}
                    {selectedInvestment === "pessimistic_p10" && (
                      <div>
                        <p className="font-semibold">Skenario Pesimis (P10)</p>
                        <p className="mt-1 text-emerald-800">
                          Angka di bawah ini adalah batas bawah konservatif: hanya 10% kemungkinan hasil investasi lebih rendah dari angka ini,
                          sedangkan 90% kemungkinan sama atau lebih tinggi. Gunakan untuk melihat kondisi terburuk yang masih mungkin.
                        </p>
                      </div>
                    )}
                    {selectedInvestment === "optimistic_p90" && (
                      <div>
                        <p className="font-semibold">Skenario Optimis (P90)</p>
                        <p className="mt-1 text-emerald-800">
                          Angka di bawah ini menggambarkan skenario terbaik: 90% kemungkinan hasil berada di bawahnya, dan hanya 10% yang lebih tinggi.
                          Cocok untuk melihat potensi maksimal bila return investasi sangat baik.
                        </p>
                      </div>
                    )}
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-gray-400 block uppercase tracking-wider mb-1">
                      Dana Terkumpul (Nominal)
                    </span>
                    <div className="text-3xl font-extrabold text-gray-900 tabular-nums">
                      {formatCurrency(scenarioData.fund_at_retirement)}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-xs font-semibold text-gray-400 block uppercase tracking-wider mb-1">
                        Penarikan/bln
                      </span>
                      <div className="text-xl font-bold text-gray-800 tabular-nums">
                        {formatCurrency(scenarioData.annual_withdrawal_capacity / 12)}
                      </div>
                    </div>
                  </div>

                  {/* Depletion Warning / Success Box */}
                  {scenarioData.fund_depleted_age ? (
                    <div className="bg-amber-50 border border-amber-200 text-amber-900 rounded-xl p-4 flex gap-2.5 items-start">
                      <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                      <div className="text-sm font-semibold">
                        Peringatan: Dana diproyeksikan terdepresiasi penuh pada usia{" "}
                        <span className="underline">{scenarioData.fund_depleted_age} tahun</span>.
                      </div>
                    </div>
                  ) : (
                    <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl p-4 flex gap-2.5 items-start">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                      <div className="text-sm font-semibold">
                        Proyeksi dana mencukupi hingga akhir target horizon waktu (usia {customPlanningAge || actuarial.planning_age_recommended} tahun).
                      </div>
                    </div>
                  )}

                  {/* Status Badge */}
                  <div className={`p-4 rounded-xl border text-center ${fundingStatusClass}`}>
                    <p className="text-sm font-bold">{fundingStatus}</p>
                  </div>
                </div>

                {/* Right Column: Ruin Probability Box */}
                <div className="bg-white border border-gray-100 rounded-3xl p-8 text-center flex flex-col justify-center items-center shadow-[0_8px_30px_rgba(0,0,0,0.02)] min-h-75">
                  <h4 className="text-gray-700 font-bold text-base flex items-center gap-1.5 mb-4">
                    Peluang Kebangkrutan
                    <div 
                      title="Persentase risiko uang pensiun Anda habis total menjadi Rp 0 sebelum Anda meninggal dunia." 
                      className="cursor-help text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <HelpCircle size={16} />
                    </div>
                  </h4>
                  <div className={`text-7xl font-black mb-4 tracking-tight leading-none ${
                    scenarioData.ruin_probability > 0.5 ? "text-red-500" : "text-emerald-500"
                  }`}>
                    {(scenarioData.ruin_probability * 100).toFixed(1)}%
                  </div>
                  <p className="text-sm text-gray-500">
                    Peluang dana habis sebelum usia {customPlanningAge || actuarial.planning_age_recommended} tahun.
                  </p>

                  {/* Mini success rate info */}
                  <div className="mt-6 flex items-center gap-2 text-xs text-emerald-700 bg-emerald-50 px-4 py-2 rounded-full border border-emerald-200">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    Peluang Keberhasilan: <span className="font-bold text-emerald-700">{successRate.toFixed(1)}%</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      ) : null}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Data Finansial */}
        <div className="group bg-white rounded-4xl p-8 border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_40px_rgb(16,185,129,0.1)] transition-all duration-300">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-[#10B981] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
            <Wallet size={28} strokeWidth={2} />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Profil & Finansial</h3>
          <p className="text-gray-500 mb-6 line-clamp-2">
            Kelola data diri, pendapatan, target nabung, dan asumsi keuanganmu.
          </p>
          <Link 
            href="/dashboard/profile" 
            className="inline-flex items-center gap-2 text-[#10B981] font-bold hover:text-[#059669] transition-colors"
          >
            Kelola Data <ArrowRight size={18} />
          </Link>
        </div>

        {/* Card 2: Tanya FindSor */}
        <div className="group bg-white rounded-4xl p-8 border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_40px_rgb(16,185,129,0.1)] transition-all duration-300">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-500 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
            <MessageCircle size={28} strokeWidth={2} />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Tanya FindSor!</h3>
          <p className="text-gray-500 mb-6 line-clamp-2">
            Chat dengan AI advisor untuk konsultasi finansial personal.
          </p>
          <Link 
            href="/dashboard/projection" 
            className="inline-flex items-center gap-2 text-blue-500 font-bold hover:text-blue-600 transition-colors"
          >
            Mulai Chat <ArrowRight size={18} />
          </Link>
        </div>

        {/* Card 3: Profil Risiko */}
        <div className="group bg-white rounded-4xl p-8 border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_40px_rgb(16,185,129,0.1)] transition-all duration-300">
          <div className="w-14 h-14 rounded-2xl bg-purple-50 text-purple-500 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
            <ShieldCheck size={28} strokeWidth={2} />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Profil Risiko</h3>
          <p className="text-gray-500 mb-6 line-clamp-2">
            Update profil risiko dan preferensi investasimu.
          </p>
          <Link 
            href="/dashboard/profile" 
            className="inline-flex items-center gap-2 text-purple-500 font-bold hover:text-purple-600 transition-colors"
          >
            Update Profil <ArrowRight size={18} />
          </Link>
        </div>
      </div>
      
    </div>
  );
}
