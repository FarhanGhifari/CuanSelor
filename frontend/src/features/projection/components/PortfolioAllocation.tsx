"use client";

import { motion } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { TrendingUp } from "lucide-react";
import type { CalculatorOutput } from "../types/projection.types";

interface PortfolioAllocationProps {
  data: CalculatorOutput;
}

const COLORS = [
  "#10b981", // emerald
  "#3b82f6", // blue
  "#8b5cf6", // purple
  "#f59e0b", // amber
  "#ef4444", // red
  "#06b6d4", // cyan
  "#ec4899", // pink
];

export function PortfolioAllocation({ data }: PortfolioAllocationProps) {
  const { recommendations } = data;
  const { allocation, effective_risk_profile, glide_path_applied, instruments_in_portfolio } = recommendations;

  // Convert allocation object to chart data
  const chartData = Object.entries(allocation).map(([name, value]) => ({
    name,
    value: value * 100,
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="rounded-3xl bg-white border border-gray-100 p-8"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-linear-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white shadow-lg">
          <TrendingUp className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900">Alokasi Portofolio</h3>
          <p className="text-sm text-gray-500">
            Profil: <span className="font-semibold capitalize">{effective_risk_profile}</span>
            {glide_path_applied && (
              <span className="ml-2 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-medium">
                Glide Path ✓
              </span>
            )}
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Donut Chart */}
        <div className="flex items-center justify-center">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => `${Number(value).toFixed(1)}%`}
                contentStyle={{
                  backgroundColor: "rgba(255, 255, 255, 0.95)",
                  border: "1px solid #e5e7eb",
                  borderRadius: "12px",
                  padding: "8px 12px",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Allocation Table */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-gray-700 mb-4">Detail Alokasi</h4>
          {chartData.map((item, index) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + index * 0.05 }}
              className="flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <span className="text-sm font-medium text-gray-700">{item.name}</span>
              </div>
              <span className="text-sm font-bold text-gray-900 tabular-nums">
                {item.value.toFixed(1)}%
              </span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Instruments List */}
      <div className="mt-6 pt-6 border-t border-gray-100">
        <h4 className="text-sm font-semibold text-gray-700 mb-3">Instrumen dalam Portofolio</h4>
        <div className="flex flex-wrap gap-2">
          {instruments_in_portfolio.map((instrument, index) => (
            <motion.span
              key={instrument}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7 + index * 0.05 }}
              className="px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-medium border border-emerald-200"
            >
              {instrument}
            </motion.span>
          ))}
        </div>
      </div>

      {/* Portfolio Stats */}
      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className="p-4 rounded-xl bg-blue-50 border border-blue-100">
          <p className="text-xs text-blue-600 font-medium mb-1">Return Nominal (Mean)</p>
          <p className="text-lg font-bold text-blue-900">{recommendations.portfolio_nominal_return_mean}</p>
        </div>
        <div className="p-4 rounded-xl bg-purple-50 border border-purple-100">
          <p className="text-xs text-purple-600 font-medium mb-1">Volatilitas (Std Dev)</p>
          <p className="text-lg font-bold text-purple-900">{recommendations.portfolio_std}</p>
        </div>
      </div>
    </motion.div>
  );
}
