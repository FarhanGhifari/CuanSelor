"use client";

import { motion } from "framer-motion";
import { TrendingUp, Wallet, Calendar, PiggyBank } from "lucide-react";
import type { CalculatorOutput } from "../types/projection.types";
import { formatCurrency } from "../utils/format";

interface KeyMetricCardsProps {
  data: CalculatorOutput;
}

export function KeyMetricCards({ data }: KeyMetricCardsProps) {
  const { projection, recommendations, user_profile } = data;
  const medianScenario = projection.median_p50;
  // Calculate duration properly
  const retirementAge = user_profile.retirement_age;
  const depletedAge = medianScenario.fund_depleted_age;
  const duration = depletedAge ? depletedAge - retirementAge : null;

  const metrics = [
    {
      label: "Dana saat Pensiun",
      value: formatCurrency(medianScenario.fund_at_retirement),
      subtitle: `Median (P50) • Nominal`,
      icon: Wallet,
      color: "emerald",
    },
    {
      label: "Kapasitas Tarik/bulan",
      value: formatCurrency(medianScenario.annual_withdrawal_capacity / 12),
      subtitle: "Nominal saat pensiun",
      icon: TrendingUp,
      color: "blue",
    },
    {
      label: "Dana Bertahan",
      value: duration ? `${duration} tahun` : "Aman",
      subtitle: duration ? `Dana habis usia ${depletedAge}` : "Dana mencukupi",
      icon: Calendar,
      color: duration && duration < 20 ? "red" : "purple",
    },
    {
      label: "Tabungan Bulanan",
      value: formatCurrency(recommendations.monthly_contribution_current),
      subtitle: `${(user_profile.savings_rate * 100).toFixed(0)}% dari gaji`,
      icon: PiggyBank,
      color: "amber",
    },
  ];

  const colorMap = {
    emerald: "from-emerald-500 to-emerald-600",
    blue: "from-blue-500 to-blue-600",
    purple: "from-purple-500 to-purple-600",
    amber: "from-amber-500 to-amber-600",
    red: "from-red-500 to-red-600",
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((metric, index) => {
        const Icon = metric.icon;
        return (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group relative overflow-hidden rounded-2xl bg-white border border-gray-100 p-6 hover:shadow-lg hover:shadow-gray-200/50 transition-all duration-300"
          >
            {/* Icon Background */}
            <div
              className={`absolute -top-6 -right-6 w-24 h-24 rounded-full bg-linear-to-br ${
                colorMap[metric.color as keyof typeof colorMap]
              } opacity-10 group-hover:opacity-20 transition-opacity`}
            />

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`w-12 h-12 rounded-xl bg-linear-to-br ${
                    colorMap[metric.color as keyof typeof colorMap]
                  } flex items-center justify-center text-white shadow-lg`}
                >
                  <Icon className="w-6 h-6" />
                </div>
              </div>

              <h3 className="text-sm font-medium text-gray-500 mb-2">{metric.label}</h3>
              <p className="text-2xl font-bold text-gray-900 mb-1 tabular-nums">{metric.value}</p>
              <p className="text-xs text-gray-400 font-medium">{metric.subtitle}</p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
