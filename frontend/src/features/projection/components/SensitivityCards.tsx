"use client";

import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Calendar, PiggyBank } from "lucide-react";
import type { CalculatorOutput } from "../types/projection.types";
import { formatPercentage } from "../utils/format";

interface SensitivityCardsProps {
  data: CalculatorOutput;
}

export function SensitivityCards({ data }: SensitivityCardsProps) {
  const { sensitivity } = data;

  const scenarios = [
    {
      title: "Inflasi naik 1%",
      icon: TrendingUp,
      color: "red",
      fundChange: sensitivity.if_inflation_plus_1pct.fund_change_pct || 0,
      ruinChange: sensitivity.if_inflation_plus_1pct.ruin_change || 0,
    },
    {
      title: "Pensiun ditunda 3 tahun",
      icon: Calendar,
      color: "emerald",
      fundChange: sensitivity.if_retirement_delayed_3yr.fund_change_pct || 0,
      ruinChange: sensitivity.if_retirement_delayed_3yr.ruin_change || 0,
    },
    {
      title: "Nabung +10%",
      icon: PiggyBank,
      color: "blue",
      fundChange: sensitivity.if_savings_rate_plus_10pct.fund_change_pct || 0,
      ruinChange: sensitivity.if_savings_rate_plus_10pct.ruin_change || 0,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      className="rounded-3xl bg-white border border-gray-100 p-8"
    >
      <h3 className="text-lg font-bold text-gray-900 mb-2">Sensitivity Analysis</h3>
      <p className="text-sm text-gray-500 mb-6">Bagaimana jika...</p>

      <div className="grid md:grid-cols-3 gap-6">
        {scenarios.map((scenario, index) => {
          const Icon = scenario.icon;
          const isPositive = scenario.fundChange > 0;

          return (
            <motion.div
              key={scenario.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 + index * 0.1 }}
              className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-50 to-white border border-gray-100 p-6 hover:shadow-lg hover:shadow-gray-200/50 transition-all duration-300"
            >
              {/* Icon */}
              <div
                className={`w-12 h-12 rounded-xl bg-gradient-to-br from-${scenario.color}-500 to-${scenario.color}-600 flex items-center justify-center text-white shadow-lg mb-4`}
              >
                <Icon className="w-6 h-6" />
              </div>

              {/* Title */}
              <h4 className="text-base font-bold text-gray-900 mb-4">{scenario.title}</h4>

              {/* Metrics */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500 font-medium">Dana P50</span>
                  <div className="flex items-center gap-1">
                    {isPositive ? (
                      <TrendingUp className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-600" />
                    )}
                    <span
                      className={`text-sm font-bold tabular-nums ${
                        isPositive ? "text-emerald-600" : "text-red-600"
                      }`}
                    >
                      {isPositive ? "+" : ""}
                      {scenario.fundChange.toFixed(1)}%
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500 font-medium">Ruin Prob</span>
                  <div className="flex items-center gap-1">
                    {scenario.ruinChange < 0 ? (
                      <TrendingDown className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <TrendingUp className="w-4 h-4 text-red-600" />
                    )}
                    <span
                      className={`text-sm font-bold tabular-nums ${
                        scenario.ruinChange < 0 ? "text-emerald-600" : "text-red-600"
                      }`}
                    >
                      {scenario.ruinChange > 0 ? "+" : ""}
                      {formatPercentage(scenario.ruinChange)}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
