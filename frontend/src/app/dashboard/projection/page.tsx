"use client";

import { motion } from "framer-motion";
import { Loader2, AlertCircle } from "lucide-react";
import { useProjection } from "@/features/projection/hooks/useProjection";
import { ProjectionHero } from "@/features/projection/components/ProjectionHero";
import { KeyMetricCards } from "@/features/projection/components/KeyMetricCards";
import { RuinGauge } from "@/features/projection/components/RuinGauge";
import { ScenarioTabs } from "@/features/projection/components/ScenarioTabs";
import { FundProjectionChart } from "@/features/projection/components/FundProjectionChart";
import { PortfolioAllocation } from "@/features/projection/components/PortfolioAllocation";
import { SensitivityCards } from "@/features/projection/components/SensitivityCards";
import { InsightsList } from "@/features/projection/components/InsightsList";
import Link from "next/link";

export default function ProjectionPage() {
  const { data, isLoading, error } = useProjection();

  // Loading state
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="w-12 h-12 text-emerald-600 animate-spin" />
        <div className="text-center">
          <p className="text-lg font-semibold text-gray-900">Menghitung proyeksi pensiun...</p>
          <p className="text-sm text-gray-500 mt-1">
            Simulasi Monte Carlo 10.000 iterasi sedang berjalan
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    const errorMessage = error instanceof Error ? error.message : "Terjadi kesalahan";
    const isIncompleteData = errorMessage.includes("belum lengkap");

    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
        <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center">
          <AlertCircle className="w-8 h-8 text-red-600" />
        </div>
        <div className="text-center max-w-md">
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            {isIncompleteData ? "Data Belum Lengkap" : "Gagal Memuat Proyeksi"}
          </h2>
          <p className="text-sm text-gray-600 mb-6">{errorMessage}</p>
          {isIncompleteData && (
            <Link
              href="/auth/onboarding"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition-colors"
            >
              Lengkapi Data Onboarding
            </Link>
          )}
        </div>
      </div>
    );
  }

  // No data state
  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <p className="text-gray-500">Tidak ada data proyeksi</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Hero Section */}
      <ProjectionHero data={data} />

      {/* Key Metrics */}
      <KeyMetricCards data={data} />

      {/* Ruin Probability & Scenario Tabs */}
      <div className="grid lg:grid-cols-2 gap-8">
        <RuinGauge data={data} />
        <ScenarioTabs data={data} />
      </div>

      {/* Fund Projection Chart */}
      <FundProjectionChart data={data} />

      {/* Portfolio Allocation */}
      <PortfolioAllocation data={data} />

      {/* Sensitivity Analysis */}
      <SensitivityCards data={data} />

      {/* Actionable Insights */}
      <InsightsList data={data} />

      {/* Metadata Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
        className="text-center text-xs text-gray-400 pt-8 border-t border-gray-100"
      >
        <p>
          Proyeksi berdasarkan {data.metadata.n_simulations.toLocaleString()} simulasi Monte Carlo
          • Model: {data.metadata.inflation_model} + {data.metadata.return_model}
          • Mortalitas: {data.metadata.mortality_source}
          • v{data.metadata.version}
        </p>
      </motion.div>
    </div>
  );
}
