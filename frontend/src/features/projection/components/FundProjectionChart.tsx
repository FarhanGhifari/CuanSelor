"use client";

import { motion } from "framer-motion";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import type { CalculatorOutput } from "../types/projection.types";
import { formatCurrency, formatCurrencyShort } from "../utils/format";

interface FundProjectionChartProps {
  data: CalculatorOutput;
}

export function FundProjectionChart({ data }: FundProjectionChartProps) {
  const { user_profile, projection, actuarial_summary } = data;
  const currentAge = user_profile.age;
  const retirementAge = user_profile.retirement_age;
  const planningAge = actuarial_summary.planning_age_recommended;

  // Generate chart data points
  const chartData = [];
  for (let age = currentAge; age <= planningAge; age++) {
    const yearsFromNow = age - currentAge;
    const yearsInRetirement = age - retirementAge;

    let p10Value = 0;
    let p50Value = 0;
    let p90Value = 0;

    if (age < retirementAge) {
      // Accumulation phase - linear growth approximation
      const progress = yearsFromNow / (retirementAge - currentAge);
      p10Value = projection.pessimistic_p10.fund_at_retirement * progress;
      p50Value = projection.median_p50.fund_at_retirement * progress;
      p90Value = projection.optimistic_p90.fund_at_retirement * progress;
    } else if (age === retirementAge) {
      // At retirement
      p10Value = projection.pessimistic_p10.fund_at_retirement;
      p50Value = projection.median_p50.fund_at_retirement;
      p90Value = projection.optimistic_p90.fund_at_retirement;
    } else {
      // Withdrawal phase - exponential decay approximation
      const withdrawalRate = 0.04; // 4% rule approximation
      const decayFactor = Math.pow(1 - withdrawalRate, yearsInRetirement);
      
      p10Value = Math.max(0, projection.pessimistic_p10.fund_at_retirement * decayFactor);
      p50Value = Math.max(0, projection.median_p50.fund_at_retirement * decayFactor);
      p90Value = Math.max(0, projection.optimistic_p90.fund_at_retirement * decayFactor);

      // Check if fund depleted
      if (projection.pessimistic_p10.fund_depleted_age && age >= projection.pessimistic_p10.fund_depleted_age) {
        p10Value = 0;
      }
      if (projection.median_p50.fund_depleted_age && age >= projection.median_p50.fund_depleted_age) {
        p50Value = 0;
      }
      if (projection.optimistic_p90.fund_depleted_age && age >= projection.optimistic_p90.fund_depleted_age) {
        p90Value = 0;
      }
    }

    chartData.push({
      age,
      Pesimis: p10Value,
      Median: p50Value,
      Optimis: p90Value,
    });
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="rounded-3xl bg-white border border-gray-100 p-8"
    >
      <div className="mb-6">
        <h3 className="text-lg font-bold text-gray-900 mb-2">Proyeksi Dana Pensiun</h3>
        <p className="text-sm text-gray-500">
          Simulasi pertumbuhan dan penarikan dana dari usia {currentAge} hingga {planningAge} tahun
        </p>
      </div>

      <ResponsiveContainer width="100%" height={400}>
        <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorPesimis" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorMedian" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorOptimis" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
          <XAxis
            dataKey="age"
            stroke="#9ca3af"
            style={{ fontSize: "12px" }}
            label={{ value: "Usia (tahun)", position: "insideBottom", offset: -5 }}
          />
          <YAxis
            stroke="#9ca3af"
            style={{ fontSize: "12px" }}
            tickFormatter={(value) => formatCurrencyShort(value)}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "rgba(255, 255, 255, 0.95)",
              border: "1px solid #e5e7eb",
              borderRadius: "12px",
              padding: "12px",
            }}
            formatter={(value) => formatCurrency(Number(value))}
            labelFormatter={(label) => `Usia ${label} tahun`}
          />
          <Legend
            wrapperStyle={{ paddingTop: "20px" }}
            iconType="circle"
          />
          <Area
            type="monotone"
            dataKey="Pesimis"
            stroke="#ef4444"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorPesimis)"
          />
          <Area
            type="monotone"
            dataKey="Median"
            stroke="#10b981"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#colorMedian)"
          />
          <Area
            type="monotone"
            dataKey="Optimis"
            stroke="#3b82f6"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorOptimis)"
          />
        </AreaChart>
      </ResponsiveContainer>

      {/* Retirement marker */}
      <div className="mt-4 flex items-center justify-center gap-2 text-sm text-gray-500">
        <div className="w-2 h-2 rounded-full bg-amber-500" />
        <span>Usia pensiun: {retirementAge} tahun</span>
      </div>
    </motion.div>
  );
}
