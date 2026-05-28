"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { TrendingDown, Minus, TrendingUp } from "lucide-react";
import type { CalculatorOutput, ProjectionScenario } from "../types/projection.types";
import { formatCurrency, formatPercentage } from "../utils/format";

interface ScenarioTabsProps {
  data: CalculatorOutput;
}

type ScenarioKey = "pessimistic" | "median" | "optimistic";

export function ScenarioTabs({ data }: ScenarioTabsProps) {
  const [activeTab, setActiveTab] = useState<ScenarioKey>("median");

  const scenarios: Record<ScenarioKey, { data: ProjectionScenario; label: string; icon: any; color: string }> = {
    pessimistic: {
      data: data.projection.pessimistic_p10,
      label: "Pesimis (P10)",
      icon: TrendingDown,
      color: "red",
    },
    median: {
      data: data.projection.median_p50,
      label: "Median (P50)",
      icon: Minus,
      color: "emerald",
    },
    optimistic: {
      data: data.projection.optimistic_p90,
      label: "Optimis (P90)",
      icon: TrendingUp,
      color: "blue",
    },
  };

  const activeScenario = scenarios[activeTab];
  const Icon = activeScenario.icon;
  
  // Calculate duration
  const retirementAge = data.user_profile.retirement_age;
  const depletedAge = activeScenario.data.fund_depleted_age;
  const duration = depletedAge ? depletedAge - retirementAge : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="rounded-3xl bg-white border border-gray-100 p-8"
    >
      <h3 className="text-lg font-bold text-gray-900 mb-6">Skenario Proyeksi</h3>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 p-1 bg-gray-100 rounded-2xl">
        {(Object.keys(scenarios) as ScenarioKey[]).map((key) => {
          const scenario = scenarios[key];
          const isActive = activeTab === key;
          return (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex-1 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200 ${
                isActive
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {scenario.label}
            </button>
          );
        })}
      </div>

      {/* Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-4"
      >
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div
            className={`w-12 h-12 rounded-xl bg-gradient-to-br from-${activeScenario.color}-500 to-${activeScenario.color}-600 flex items-center justify-center text-white shadow-lg`}
          >
            <Icon className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-xl font-bold text-gray-900">{activeScenario.label}</h4>
            <p className="text-sm text-gray-500">
              Nilai dana saat pensiun usia {retirementAge} tahun
            </p>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-gray-50">
            <p className="text-xs text-gray-500 font-medium mb-1">Dana Pensiun (Nominal)</p>
            <p className="text-xl font-bold text-gray-900 tabular-nums">
              {formatCurrency(activeScenario.data.fund_at_retirement)}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-gray-50">
            <p className="text-xs text-gray-500 font-medium mb-1">Dana Pensiun (Riil)</p>
            <p className="text-xl font-bold text-gray-900 tabular-nums">
              {formatCurrency(activeScenario.data.real_fund_at_retirement)}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-gray-50">
            <p className="text-xs text-gray-500 font-medium mb-1">Penarikan/Bulan (Nominal)</p>
            <p className="text-xl font-bold text-gray-900 tabular-nums">
              {formatCurrency(activeScenario.data.annual_withdrawal_capacity / 12)}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-gray-50">
            <p className="text-xs text-gray-500 font-medium mb-1">Ruin Probability</p>
            <p className={`text-xl font-bold tabular-nums ${
              activeScenario.data.ruin_probability > 0.5 ? 'text-red-600' : 'text-emerald-600'
            }`}>
              {formatPercentage(activeScenario.data.ruin_probability)}
            </p>
          </div>

          <div className="col-span-2 p-4 rounded-xl bg-gradient-to-br from-emerald-50 to-blue-50 border border-emerald-100">
            <p className="text-xs text-gray-600 font-medium mb-1">Durasi Dana Pensiun</p>
            <p className="text-2xl font-bold text-gray-900">
              {duration ? (
                <>
                  {duration} tahun
                  <span className="text-sm font-normal text-gray-600 ml-2">
                    (habis usia {depletedAge})
                  </span>
                </>
              ) : (
                <>
                  Dana Aman
                  <span className="text-sm font-normal text-gray-600 ml-2">
                    (mencukupi hingga planning age)
                  </span>
                </>
              )}
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
