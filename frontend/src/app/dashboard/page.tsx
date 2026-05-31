"use client";

import { useState } from "react";
import { 
  Wallet, 
  TrendingUp, 
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Calendar,
  MessageCircle,
  CheckCircle2,
  Info,
  AlertTriangle,
  HelpCircle,
  Clock,
  Lightbulb,
  Landmark
} from "lucide-react";
import Link from "next/link";
import { useProjection } from "@/features/projection/hooks/useProjection";
import { formatCurrency } from "@/features/projection/utils/format";
import { ProjectionLoader } from "@/components/ui/ProjectionLoader";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import type { CalculatorOutput } from "@/features/projection/types/projection.types";

type InvestmentKey = "median_p50" | "pessimistic_p10" | "optimistic_p90" | "visualisasi";

const RISK_DETAILS: Record<string, { label: string }> = {
  conservative: { label: "Konservatif" },
  moderate: { label: "Moderat" },
  aggressive: { label: "Agresif" },
};

const INVESTMENT_SUGGESTIONS: Record<
  string,
  {
    title: string;
    summary: string;
    badge: string;
    accent: string;
    softBg: string;
    textColor?: string;
    descColor?: string;
    borderColor?: string;
    allocations: Array<{
      key: "saham" | "obligasi" | "emas";
      label: string;
      percentage: number;
      reason: string;
    }>;
  }
> = {
  conservative: {
    title: "Fokus stabil, pertumbuhan tetap ada",
    summary: "Porsi defensif lebih dominan untuk menjaga modal, dengan sedikit eksposur pertumbuhan dan lindung nilai.",
    badge: "Menjaga kestabilan",
    accent: "text-blue-700",
    softBg: "bg-blue-50/50",
    allocations: [
      { key: "obligasi", label: "Obligasi", percentage: 45, reason: "Menjaga arus return lebih stabil dan cocok untuk profil berhati-hati." },
      { key: "emas", label: "Emas", percentage: 35, reason: "Menjadi penyeimbang saat pasar bergejolak dan membantu menjaga nilai aset." },
      { key: "saham", label: "Saham", percentage: 20, reason: "Tetap memberi ruang pertumbuhan, tetapi dalam porsi yang terukur." },
    ],
  },
  moderate: {
    title: "Seimbang antara aman dan tumbuh",
    summary: "Komposisi dibuat lebih berimbang agar portofolio tetap bertumbuh tanpa terlalu agresif terhadap fluktuasi pasar.",
    badge: "Pertumbuhan terukur",
    accent: "text-amber-700",
    softBg: "bg-gradient-to-r from-amber-50 via-white to-emerald-50",
    allocations: [
      { key: "saham", label: "Saham", percentage: 45, reason: "Menjadi mesin pertumbuhan utama untuk horizon menengah hingga panjang." },
      { key: "obligasi", label: "Obligasi", percentage: 30, reason: "Membantu menjaga kestabilan portofolio saat pasar saham melemah." },
      { key: "emas", label: "Emas", percentage: 25, reason: "Menambah diversifikasi dan proteksi terhadap ketidakpastian ekonomi." },
    ],
  },
  aggressive: {
    title: "Agresif untuk mengejar pertumbuhan",
    summary: "Porsi saham dibuat dominan untuk mengejar return jangka panjang, dengan obligasi dan emas sebagai penyeimbang risiko.",
    badge: "Pertumbuhan maksimal",
    accent: "text-white",
    softBg: "bg-emerald-600",
    textColor: "text-white",
    descColor: "text-emerald-50",
    borderColor: "border-emerald-500",
    allocations: [
      { key: "saham", label: "Saham", percentage: 70, reason: "Menjadi porsi terbesar karena paling sesuai untuk target pertumbuhan tinggi." },
      { key: "emas", label: "Emas", percentage: 20, reason: "Menjadi buffer saat volatilitas pasar tinggi dan menjaga diversifikasi." },
      { key: "obligasi", label: "Obligasi", percentage: 10, reason: "Menambah unsur stabilitas tanpa terlalu mengurangi potensi return." },
    ],
  },
};

// Helper functions to build visual chart trajectory
const buildTrajectory = (
  scenKey: "pessimistic_p10" | "median_p50" | "optimistic_p90",
  age: number,
  retirementAge: number,
  currentAssets: number,
  fundAtRetirement: number,
  fundDepletedAge: number | null,
  planHorizon: number
) => {
  const traj: { age: number; value: number }[] = [];
  
  // Accumulation Phase
  for (let y = age; y <= retirementAge; y++) {
    const progress = (y - age) / Math.max(retirementAge - age, 1);
    const val = currentAssets * (1 - progress) + fundAtRetirement * Math.pow(progress, 2);
    traj.push({ age: y, value: Math.max(val, 0) });
  }
  
  // Decumulation Phase
  const endAge = fundDepletedAge || planHorizon;
  if (endAge > retirementAge) {
    for (let y = retirementAge + 1; y <= endAge; y++) {
      const progress = (y - retirementAge) / Math.max(endAge - retirementAge, 1);
      const val = fundAtRetirement * Math.pow(1 - progress, 1.5);
      traj.push({ age: y, value: Math.max(val, 0) });
    }
  }
  
  // Fill remaining years with 0
  if (endAge < planHorizon) {
    for (let y = endAge + 1; y <= planHorizon; y++) {
      traj.push({ age: y, value: 0 });
    }
  }
  
  return traj;
};

const generateChartData = (displayData?: CalculatorOutput | null) => {
  if (!displayData) return [];
  const age = displayData.user_profile.age;
  const retirementAge = displayData.user_profile.retirement_age;
  const currentAssets = displayData.user_profile.current_assets ?? 0;
  const planHorizon = displayData.user_profile.custom_planning_age || displayData.actuarial_summary.planning_age_recommended;
  
  const p10Data = buildTrajectory(
    "pessimistic_p10",
    age,
    retirementAge,
    currentAssets,
    displayData.projection.pessimistic_p10.fund_at_retirement,
    displayData.projection.pessimistic_p10.fund_depleted_age,
    planHorizon
  );
  
  const p50Data = buildTrajectory(
    "median_p50",
    age,
    retirementAge,
    currentAssets,
    displayData.projection.median_p50.fund_at_retirement,
    displayData.projection.median_p50.fund_depleted_age,
    planHorizon
  );
  
  const p90Data = buildTrajectory(
    "optimistic_p90",
    age,
    retirementAge,
    currentAssets,
    displayData.projection.optimistic_p90.fund_at_retirement,
    displayData.projection.optimistic_p90.fund_depleted_age,
    planHorizon
  );
  
  const merged = p50Data.map((item, index) => ({
    age: item.age,
    p10: Math.round(p10Data[index]?.value ?? 0),
    p50: Math.round(item.value),
    p90: Math.round(p90Data[index]?.value ?? 0),
  }));
  
  return merged;
};

type ProjectionErrorState =
  | {
      title: string;
      description: string;
      actionLabel: string;
      actionHref: string;
      isRetry: false;
    }
  | {
      title: string;
      description: string;
      actionLabel: string;
      actionHref: null;
      isRetry: true;
    };

const getProjectionErrorState = (error: unknown) => {
  const apiError = error as {
    response?: {
      status?: number;
      data?: { message?: string };
    };
    message?: string;
  } | null;

  const status = apiError?.response?.status;
  const message =
    apiError?.response?.data?.message ??
    apiError?.message ??
    "Terjadi gangguan saat memuat proyeksi pensiun.";
  const isIncompleteData =
    status === 400 || /data belum lengkap|selesaikan onboarding/i.test(message);

  if (isIncompleteData) {
    return {
      title: "Data Belum Lengkap",
      description: "Lengkapi data onboarding untuk melihat proyeksi pensiun.",
      actionLabel: "Lengkapi Data",
      actionHref: "/auth/onboarding",
      isRetry: false,
    } satisfies ProjectionErrorState;
  }

  return {
    title: "Proyeksi Belum Bisa Dimuat",
    description: message,
    actionLabel: "Coba Lagi",
    actionHref: null,
    isRetry: true,
  } satisfies ProjectionErrorState;
};

const formatTooltipValue = (
  value: number | string | ReadonlyArray<number | string> | undefined,
) => {
  const normalizedValue = Array.isArray(value) ? value[0] : value;
  return [`Rp ${Number(normalizedValue ?? 0).toLocaleString()}`, ""];
};

export default function DashboardOverview() {
  const [selectedInvestment, setSelectedInvestment] = useState<InvestmentKey>("median_p50");
  
  const { data: projectionData, isLoading, error } = useProjection();
  const displayData = projectionData;
  const actuarial = displayData?.actuarial_summary;
  const scenarioData = selectedInvestment !== "visualisasi" ? (displayData?.projection[selectedInvestment]) : null;
  const chartData = generateChartData(displayData);
  const chartAgeTicks = (() => {
    if (!chartData.length) return [];

    const minAge = chartData[0].age;
    const maxAge = chartData[chartData.length - 1].age;
    const ticks: number[] = [];
    const firstTick = Math.ceil(minAge / 10) * 10;

    for (let age = firstTick; age <= maxAge; age += 10) {
      ticks.push(age);
    }

    return ticks;
  })();

  const monthlySalary = displayData?.user_profile?.monthly_salary ?? 0;
  const savingsRateVal = displayData?.user_profile?.savings_rate ?? 0;
  const monthlySave = monthlySalary * savingsRateVal;

  const medianRuinProbability = displayData?.projection?.median_p50?.ruin_probability ?? 0;
  const statusRuin = medianRuinProbability < 0.15 
    ? "memiliki probabilitas kecukupan dana yang optimal" 
    : "memiliki risiko tinggi kekurangan dana (shortfall)";
  
  const targetAge = displayData?.user_profile?.custom_planning_age || actuarial?.planning_age_recommended;

  const isOptimal = medianRuinProbability < 0.15;
  const conclusionBgClass = isOptimal 
    ? "bg-emerald-50 border-emerald-200 text-emerald-900" 
    : "bg-amber-50 border-amber-200 text-amber-900";
  const conclusionIconClass = isOptimal ? "text-emerald-600" : "text-amber-600";

  const ruinProbability = scenarioData?.ruin_probability ?? 0;
  const successRate = (1 - ruinProbability) * 100;
  const depletedAge = scenarioData?.fund_depleted_age ?? null;
  const hasDepletionWarning = depletedAge !== null;
  
  const isLongevityHighRisk = actuarial?.longevity_risk_flag ?? false;
  const expectedDeathAge = actuarial?.expected_death_age ?? 78;
  
  const statusDesc = isLongevityHighRisk
    ? `Harapan hidup (${expectedDeathAge} th) terlalu dekat dengan target pensiun. Kamu mungkin hanya punya sedikit waktu menikmati masa pensiun, pertimbangkan pensiun lebih awal.`
    : "Durasi pensiun wajar, risiko inflasi relatif terkendali.";

  const userRiskProfile = displayData?.user_profile?.risk_profile || "moderate";
  const riskInfo = RISK_DETAILS[userRiskProfile] || RISK_DETAILS.moderate;
  const investmentSuggestion = INVESTMENT_SUGGESTIONS[userRiskProfile] || INVESTMENT_SUGGESTIONS.moderate;
  const errorState = error ? getProjectionErrorState(error) : null;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* ════════════════════════════════════════════════════════════
          SARAN INVESTASI BERDASARKAN PROFIL RISIKO (INFOBOX STYLE)
          ════════════════════════════════════════════════════════════ */}
      {displayData && (
        <div className="bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm space-y-5">
          <div className="flex items-center gap-2">
            <Info className="w-5 h-5 text-blue-500" />
            <h2 className="text-2xl font-bold text-gray-900">Saran Investasi</h2>
          </div>

          <div className={`rounded-2xl border p-5 flex flex-col md:flex-row gap-4 items-start md:items-center ${investmentSuggestion.softBg} ${investmentSuggestion.borderColor || 'border-emerald-50'}`}>
            
            <div className="flex-1">
              <div className={`text-base leading-relaxed ${investmentSuggestion.textColor || 'text-gray-800'}`}>
                Wahh profil risiko kamu <span className={`font-bold ${investmentSuggestion.accent}`}>{riskInfo.label}</span> ! Kamu bisa ikuti saran investasi berikut yaa!
              </div>
              <p className={`text-base leading-relaxed mt-1.5 ${investmentSuggestion.descColor || 'text-gray-500'}`}>
                {investmentSuggestion.summary}
              </p>
            </div>
            <div className={`text-base font-bold leading-relaxed ${investmentSuggestion.accent} shrink-0`}>
              {investmentSuggestion.badge}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {investmentSuggestion.allocations.map((item) => (
              <div key={item.key} className="rounded-2xl border border-gray-100 bg-gray-50/50 p-5 space-y-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      item.key === "saham"
                        ? "bg-emerald-100 text-emerald-600"
                        : item.key === "obligasi"
                        ? "bg-blue-100 text-blue-600"
                        : "bg-amber-100 text-amber-600"
                    }`}>
                      {item.key === "saham" ? (
                        <TrendingUp size={14} />
                      ) : item.key === "obligasi" ? (
                        <Wallet size={14} />
                      ) : (
                        <Landmark size={14} />
                      )}
                    </div>
                    <div>
                      <p className="text-base font-bold leading-relaxed text-gray-900">{item.label}</p>
                    </div>
                  </div>
                  <span className="text-lg font-bold text-gray-900">{item.percentage}%</span>
                </div>

                <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      item.key === "saham"
                        ? "bg-emerald-500"
                        : item.key === "obligasi"
                        ? "bg-blue-500"
                        : "bg-amber-400"
                    }`}
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>

                <p className="text-base leading-relaxed text-gray-500">
                  {item.reason}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Proyeksi Pensiun Section */}
      {isLoading && !projectionData ? (
        <ProjectionLoader />
      ) : errorState && !displayData ? (
        <div className="bg-white rounded-4xl p-8 border border-red-100">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center shrink-0">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-900 mb-2">{errorState.title}</h3>
              <p className="text-sm text-gray-600 mb-4">
                {errorState.description}
              </p>
              {errorState.isRetry ? (
                <button
                  type="button"
                  onClick={() => window.location.reload()}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition-colors text-sm"
                >
                  {errorState.actionLabel} <ArrowRight size={16} />
                </button>
              ) : (
                <Link
                  href={errorState.actionHref}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition-colors text-sm"
                >
                  {errorState.actionLabel} <ArrowRight size={16} />
                </Link>
              )}
            </div>
          </div>
        </div>
      ) : displayData && actuarial ? (
        <>
          {/* Proyeksi Pensiun Header */}
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">Proyeksi Pensiun Anda</h3>
          </div>

          <div className="space-y-3">
            {/* ════════════════════════════════════════════════════════════
                KESIMPULAN INFOBOX (PROYEKSI PENSIUN)
                ════════════════════════════════════════════════════════════ */}
            <div className={`border rounded-2xl p-5 flex gap-3.5 items-center ${conclusionBgClass}`}>
              <Lightbulb className={`w-5 h-5 shrink-0 ${conclusionIconClass} ${isOptimal ? "" : "animate-pulse"}`} />
              <div className="text-base leading-relaxed">
                <span className="font-bold">Kesimpulan:</span> Berdasarkan alokasi tabungan sebesar{" "}
                <span className="font-bold">{formatCurrency(monthlySave)}</span> per bulan,{" "}
                proyeksi dana pensiun Anda <span className="font-semibold">{statusRuin}</span> untuk{" "}
                menunjang standar hidup hingga usia <span className="font-semibold">{targetAge} tahun</span>.
              </div>
            </div>

            {/* ════════════════════════════════════════════════════════════
                INFORMASI AKUARIA INFOBOX
                ════════════════════════════════════════════════════════════ */}
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5 text-blue-900 flex gap-3.5 items-center">
              <Info className="w-5 h-5 text-blue-600 shrink-0" />
              <div className="text-base leading-relaxed">
                <span className="font-bold">Informasi Aktuaria (Berdasarkan Tabel Mortalitas BPJS/TMPI 2023):</span> Usia harapan hidup rata-rata Anda adalah{" "}
                <span className="font-bold">{actuarial.expected_death_age} tahun</span>. Terdapat probabilitas{" "}
                <span className="font-bold">50%</span> untuk mencapai usia{" "}
                <span className="font-bold">{actuarial.p50_survival_age} tahun</span> (P50), dan probabilitas{" "}
                <span className="font-bold">10%</span> untuk mencapai usia{" "}
                <span className="font-bold">{actuarial.p90_survival_age} tahun</span> (P90).{" "}
              </div>
            </div>
          </div>



          {/* ════════════════════════════════════════════════════════════
              FUNDAMENTAL ASUMSI ANDA CARDS
              ════════════════════════════════════════════════════════════ */}
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

          {/* ════════════════════════════════════════════════════════════
              DETAIL SKENARIO TERPILIH — Metrics + Ruin Gauge
              ════════════════════════════════════════════════════════════ */}
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <h3 className="text-2xl font-bold text-gray-900">
                Dana Saat Pensiun (Skenario Investasi)
              </h3>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-200 overflow-x-auto scrollbar-none">
              {[
                { key: "median_p50" as const, label: "Skenario Median" },
                { key: "pessimistic_p10" as const, label: "Skenario Pesimis" },
                { key: "optimistic_p90" as const, label: "Skenario Optimis" },
                { key: "visualisasi" as const, label: "Visualisasi Grafik" },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setSelectedInvestment(tab.key)}
                  className={`py-3 px-6 font-bold text-sm border-b-2 transition-colors shrink-0 ${
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
            {selectedInvestment === "visualisasi" ? (
              <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] space-y-6">
                <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 text-sm text-emerald-900 flex items-center gap-3">
                  <Info className="w-5 h-5 text-emerald-600 shrink-0" />
                  <p>
                    Grafik di bawah menunjukkan estimasi saldo tabungan Anda dalam mata uang Rupiah (IDR) seiring bertambahnya usia.
                  </p>
                </div>
                
                <div className="h-96 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={chartData}
                      margin={{ top: 20, right: 30, left: 10, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                      <XAxis 
                        type="number"
                        dataKey="age"
                        domain={["dataMin", "dataMax"]}
                        ticks={chartAgeTicks}
                        allowDecimals={false}
                        stroke="#9ca3af"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        dy={10}
                      />
                      <YAxis 
                        stroke="#9ca3af"
                        fontSize={11}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(v) => `Rp ${(v / 1e6).toLocaleString()}jt`}
                        dx={-10}
                      />
                      <Tooltip 
                        formatter={formatTooltipValue}
                        labelFormatter={(label) => `Usia: ${label} Tahun`}
                        contentStyle={{ 
                          backgroundColor: "#ffffff", 
                          border: "1px solid #f3f4f6",
                          borderRadius: "12px",
                          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)"
                        }}
                      />
                      <Legend 
                        verticalAlign="top" 
                        height={36} 
                        iconType="circle"
                        formatter={(value) => {
                          if (value === "p90") return "P90 (Optimis)";
                          if (value === "p50") return "P50 (Median)";
                          return "P10 (Pesimis)";
                        }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="p90" 
                        name="p90"
                        stroke="#10B981" 
                        strokeWidth={3} 
                        dot={false}
                        activeDot={{ r: 6 }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="p50" 
                        name="p50"
                        stroke="#3B82F6" 
                        strokeWidth={3} 
                        dot={false}
                        activeDot={{ r: 6 }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="p10" 
                        name="p10"
                        stroke="#EF4444" 
                        strokeWidth={3} 
                        dot={false}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                
                <p className="text-xs text-gray-400 italic">
                  *Grafik ini adalah interpolasi visual untuk menggambarkan rentang (range) kemungkinan perjalanan dana Anda dari umur {displayData?.user_profile?.age || 25} ke {targetAge}.
                </p>
              </div>
            ) : scenarioData ? (
              <div className="grid lg:grid-cols-2 gap-8">
                {/* Left Column: Metrics */}
                <div className="space-y-6 bg-white rounded-3xl p-8 border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
                  <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 text-sm text-emerald-900">
                    {selectedInvestment === "median_p50" && (
                      <div>
                        <p className="font-semibold">Skenario Median</p>
                        <p className="mt-1 text-emerald-800">
                          Angka di bawah ini adalah hasil yang paling wajar: peluang 50% hasil investasi berada di atasnya dan 50% di bawahnya.
                          Cocok sebagai patokan utama karena mencerminkan kondisi pasar normal.
                        </p>
                      </div>
                    )}
                    {selectedInvestment === "pessimistic_p10" && (
                      <div>
                        <p className="font-semibold">Skenario Pesimis</p>
                        <p className="mt-1 text-emerald-800">
                          Angka di bawah ini adalah batas bawah konservatif: hanya 10% kemungkinan hasil investasi lebih rendah dari angka ini,
                          sedangkan 90% kemungkinan sama atau lebih tinggi. Gunakan untuk melihat kondisi terburuk yang masih mungkin.
                        </p>
                      </div>
                    )}
                    {selectedInvestment === "optimistic_p90" && (
                      <div>
                        <p className="font-semibold">Skenario Optimis</p>
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
                  <div
                    className={`flex items-center gap-3.5 rounded-2xl border p-4 ${
                      hasDepletionWarning
                        ? "border-amber-200 bg-amber-50 text-amber-900"
                        : "border-emerald-200 bg-emerald-50 text-emerald-900"
                    }`}
                  >
                    {hasDepletionWarning ? (
                      <AlertTriangle className="w-5 h-5 shrink-0 text-amber-600" />
                    ) : (
                      <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600" />
                    )}
                    <div className="text-base leading-relaxed">
                      {hasDepletionWarning ? (
                        <>
                          <span className="font-bold">Peringatan:</span> Dana diproyeksikan terdepresiasi
                          penuh pada usia <span className="font-bold">{depletedAge} tahun</span>.
                        </>
                      ) : (
                        <>
                          <span className="font-bold">Informasi:</span> Proyeksi dana mencukupi hingga akhir
                          target horizon waktu.
                        </>
                      )}
                    </div>
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
                    Peluang dana habis sebelum usia {displayData?.user_profile?.custom_planning_age || actuarial?.planning_age_recommended} tahun.
                  </p>

                  {/* Mini success rate info */}
                  <div className="mt-6 flex items-center gap-2 text-xs text-emerald-700 bg-emerald-50 px-4 py-2 rounded-full border border-emerald-200">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    Peluang Keberhasilan: <span className="font-bold text-emerald-700">{successRate.toFixed(1)}%</span>
                  </div>
                </div>
              </div>
            ) : null}
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
