"use client";

import { 
  Wallet, 
  TrendingUp, 
  ArrowRight,
  ShieldCheck,
  Zap,
  AlertCircle,
  Calendar,
  PiggyBank,
  Target,
  TrendingDown,
  MessageCircle
} from "lucide-react";
import Link from "next/link";
import { useProjection } from "@/features/projection/hooks/useProjection";
import { formatCurrency, formatPercentage } from "@/features/projection/utils/format";
import { ProjectionLoader } from "@/components/ui/ProjectionLoader";

export default function DashboardOverview() {
  const { data: projectionData, isLoading, error } = useProjection();

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-[32px] bg-gray-900 text-white p-8 lg:p-12">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-72 h-72 rounded-full bg-[#10B981] blur-[80px] opacity-40"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-72 h-72 rounded-full bg-emerald-600 blur-[80px] opacity-40"></div>
        
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-sm font-medium mb-6">
            <Zap size={16} className="text-emerald-400" />
            <span>Dashboard Finansial</span>
          </div>
          <h2 className="text-3xl lg:text-5xl font-extrabold tracking-tight mb-4 leading-tight">
            Kendalikan Masa Depan <br/> Finansialmu Hari Ini.
          </h2>
          <p className="text-gray-400 text-lg mb-8 max-w-xl">
            Proyeksi pensiun, data keuangan, dan profil risikomu dalam satu dashboard.
          </p>
          <Link 
            href="/dashboard/projection"
            className="bg-[#10B981] hover:bg-[#059669] text-white px-8 py-4 rounded-2xl font-bold transition-all duration-300 inline-flex items-center gap-3"
          >
            Tanya FindSor! <ArrowRight size={20} />
          </Link>
        </div>
      </div>

      {/* Proyeksi Pensiun Section */}
      {isLoading ? (
        <ProjectionLoader />
      ) : error ? (
        <div className="bg-white rounded-[32px] p-8 border border-red-100">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center flex-shrink-0">
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
      ) : projectionData ? (
        <>
          {/* Proyeksi Pensiun Header */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">Proyeksi Pensiun</h3>
              <p className="text-sm text-gray-500">
                Berdasarkan {projectionData.metadata.n_simulations.toLocaleString()} simulasi Monte Carlo
              </p>
            </div>
            <Link
              href="/dashboard/projection"
              className="text-emerald-600 hover:text-emerald-700 font-semibold text-sm flex items-center gap-2"
            >
              Lihat Detail <ArrowRight size={16} />
            </Link>
          </div>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Dana saat Pensiun */}
            <div className="group relative overflow-hidden rounded-2xl bg-white border border-gray-100 p-6 hover:shadow-lg hover:shadow-emerald-100 transition-all duration-300">
              <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 opacity-10 group-hover:opacity-20 transition-opacity" />
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white shadow-lg mb-4">
                  <Wallet className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Dana saat Pensiun</h3>
                <p className="text-2xl font-bold text-gray-900 mb-1 tabular-nums">
                  {formatCurrency(projectionData.projection.median_p50.fund_at_retirement)}
                </p>
                <p className="text-xs text-gray-400 font-medium">Median (P50)</p>
              </div>
            </div>

            {/* Kapasitas Tarik/bulan */}
            <div className="group relative overflow-hidden rounded-2xl bg-white border border-gray-100 p-6 hover:shadow-lg hover:shadow-blue-100 transition-all duration-300">
              <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 opacity-10 group-hover:opacity-20 transition-opacity" />
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white shadow-lg mb-4">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Kapasitas Tarik/bulan</h3>
                <p className="text-2xl font-bold text-gray-900 mb-1 tabular-nums">
                  {formatCurrency(projectionData.projection.median_p50.annual_withdrawal_capacity / 12)}
                </p>
                <p className="text-xs text-gray-400 font-medium">Nilai Riil</p>
              </div>
            </div>

            {/* Durasi Pensiun */}
            <div className="group relative overflow-hidden rounded-2xl bg-white border border-gray-100 p-6 hover:shadow-lg hover:shadow-purple-100 transition-all duration-300">
              <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 opacity-10 group-hover:opacity-20 transition-opacity" />
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white shadow-lg mb-4">
                  <Calendar className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Durasi Pensiun</h3>
                <p className="text-2xl font-bold text-gray-900 mb-1 tabular-nums">
                  {projectionData.projection.median_p50.fund_depleted_age
                    ? `${projectionData.projection.median_p50.fund_depleted_age - projectionData.user_profile.retirement_age} tahun`
                    : "Aman"}
                </p>
                <p className="text-xs text-gray-400 font-medium">
                  {projectionData.projection.median_p50.fund_depleted_age
                    ? `Habis usia ${projectionData.projection.median_p50.fund_depleted_age}`
                    : "Dana mencukupi"}
                </p>
              </div>
            </div>

            {/* Tabungan Bulanan */}
            <div className="group relative overflow-hidden rounded-2xl bg-white border border-gray-100 p-6 hover:shadow-lg hover:shadow-amber-100 transition-all duration-300">
              <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-gradient-to-br from-amber-500 to-amber-600 opacity-10 group-hover:opacity-20 transition-opacity" />
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-white shadow-lg mb-4">
                  <PiggyBank className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Tabungan Bulanan</h3>
                <p className="text-2xl font-bold text-gray-900 mb-1 tabular-nums">
                  {formatCurrency(projectionData.recommendations.monthly_contribution_current)}
                </p>
                <p className="text-xs text-gray-400 font-medium">
                  {(projectionData.user_profile.savings_rate * 100).toFixed(0)}% dari gaji
                </p>
              </div>
            </div>
          </div>

          {/* Ruin Probability & Quick Stats */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Ruin Probability */}
            <div className="bg-white rounded-[32px] p-8 border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-6">Ruin Probability</h3>
              <div className="flex items-center justify-center mb-6">
                <div className="relative w-48 h-48">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="96"
                      cy="96"
                      r="80"
                      stroke="#f3f4f6"
                      strokeWidth="16"
                      fill="none"
                    />
                    <circle
                      cx="96"
                      cy="96"
                      r="80"
                      stroke={projectionData.projection.median_p50.ruin_probability > 0.5 ? "#ef4444" : "#10b981"}
                      strokeWidth="16"
                      fill="none"
                      strokeDasharray={`${projectionData.projection.median_p50.ruin_probability * 502.4} 502.4`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <p className={`text-4xl font-bold ${projectionData.projection.median_p50.ruin_probability > 0.5 ? 'text-red-600' : 'text-emerald-600'}`}>
                        {formatPercentage(projectionData.projection.median_p50.ruin_probability)}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">Risiko</p>
                    </div>
                  </div>
                </div>
              </div>
              <p className="text-sm text-gray-600 text-center">
                Peluang dana habis sebelum usia {projectionData.actuarial_summary.planning_age_recommended} tahun
              </p>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-[32px] p-8 border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-6">Informasi Aktuaria</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50">
                  <span className="text-sm font-medium text-gray-600">Usia Harapan Hidup (P50)</span>
                  <span className="text-lg font-bold text-gray-900">
                    {projectionData.actuarial_summary.p50_survival_age} tahun
                  </span>
                </div>
                <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50">
                  <span className="text-sm font-medium text-gray-600">Planning Age (P90)</span>
                  <span className="text-lg font-bold text-gray-900">
                    {projectionData.actuarial_summary.p90_survival_age} tahun
                  </span>
                </div>
                <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50">
                  <span className="text-sm font-medium text-gray-600">Durasi Pensiun</span>
                  <span className="text-lg font-bold text-gray-900">
                    {projectionData.actuarial_summary.planning_horizon_post_retirement} tahun
                  </span>
                </div>
                <div className="flex items-center justify-between p-4 rounded-xl bg-emerald-50">
                  <span className="text-sm font-medium text-emerald-700">Status Risiko</span>
                  <span className="text-sm font-bold text-emerald-700">
                    {projectionData.actuarial_summary.longevity_risk_flag ? "Risiko Tinggi" : "Aman"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : null}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Data Finansial */}
        <div className="group bg-white rounded-[32px] p-8 border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_40px_rgb(16,185,129,0.1)] transition-all duration-300">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-[#10B981] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
            <Wallet size={28} strokeWidth={2} />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Manajemen Finansial</h3>
          <p className="text-gray-500 mb-6 line-clamp-2">
            Kelola pendapatan, pengeluaran, dan porsi investasi bulananmu.
          </p>
          <Link 
            href="/dashboard/financial" 
            className="inline-flex items-center gap-2 text-[#10B981] font-bold hover:text-[#059669] transition-colors"
          >
            Kelola Data <ArrowRight size={18} />
          </Link>
        </div>

        {/* Card 2: Tanya FindSor */}
        <div className="group bg-white rounded-[32px] p-8 border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_40px_rgb(16,185,129,0.1)] transition-all duration-300">
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
        <div className="group bg-white rounded-[32px] p-8 border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_40px_rgb(16,185,129,0.1)] transition-all duration-300">
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
