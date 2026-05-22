"use client";

import { motion } from "framer-motion";
import { CheckCircle2, AlertTriangle } from "lucide-react";
import type { CalculatorOutput } from "../types/projection.types";

interface ProjectionHeroProps {
  data: CalculatorOutput;
}

export function ProjectionHero({ data }: ProjectionHeroProps) {
  const { user_profile, recommendations } = data;
  const isOnTrack = recommendations.is_on_track;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-50 via-white to-blue-50 border border-emerald-100/50 p-8 md:p-12"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex-1">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-emerald-200/50 mb-4"
          >
            {isOnTrack ? (
              <>
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span className="text-sm font-semibold text-emerald-700">On Track ✓</span>
              </>
            ) : (
              <>
                <AlertTriangle className="w-5 h-5 text-amber-600" />
                <span className="text-sm font-semibold text-amber-700">Perlu Perhatian ⚡</span>
              </>
            )}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-3"
          >
            Proyeksi Pensiun {user_profile.name}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="text-lg text-gray-600 max-w-2xl"
          >
            {isOnTrack
              ? `Selamat! Dengan pola menabung saat ini, Anda diproyeksikan memiliki dana pensiun yang cukup hingga usia ${data.actuarial_summary.planning_age_recommended} tahun.`
              : `Proyeksi menunjukkan dana pensiun Anda mungkin tidak mencukupi. Mari kita optimalkan strategi keuangan Anda.`}
          </motion.p>
        </div>

        {/* Illustration Placeholder */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="w-32 h-32 md:w-40 md:h-40 rounded-2xl bg-gradient-to-br from-emerald-400 to-blue-500 flex items-center justify-center text-white text-6xl"
        >
          🌅
        </motion.div>
      </div>
    </motion.div>
  );
}
