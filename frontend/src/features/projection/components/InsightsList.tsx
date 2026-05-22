"use client";

import { motion } from "framer-motion";
import { Lightbulb, CheckCircle2 } from "lucide-react";
import type { CalculatorOutput } from "../types/projection.types";

interface InsightsListProps {
  data: CalculatorOutput;
}

export function InsightsList({ data }: InsightsListProps) {
  const { actionable_insights } = data;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7 }}
      className="rounded-3xl bg-gradient-to-br from-amber-50 via-white to-emerald-50 border border-amber-100/50 p-8"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-white shadow-lg">
          <Lightbulb className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900">Rekomendasi Aksi</h3>
          <p className="text-sm text-gray-500">Langkah konkret untuk optimasi pensiun Anda</p>
        </div>
      </div>

      <div className="space-y-4">
        {actionable_insights.map((insight, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 + index * 0.1 }}
            className="flex gap-4 p-4 rounded-2xl bg-white border border-gray-100 hover:shadow-md hover:shadow-gray-200/50 transition-all duration-300"
          >
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-sm">
              {index + 1}
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-700 leading-relaxed">{insight}</p>
            </div>
            <CheckCircle2 className="flex-shrink-0 w-5 h-5 text-gray-300 hover:text-emerald-600 transition-colors cursor-pointer" />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
