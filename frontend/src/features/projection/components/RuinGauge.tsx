"use client";

import { motion } from "framer-motion";
import { AlertCircle, CheckCircle, AlertTriangle } from "lucide-react";
import type { CalculatorOutput } from "../types/projection.types";

interface RuinGaugeProps {
  data: CalculatorOutput;
}

export function RuinGauge({ data }: RuinGaugeProps) {
  const ruinProb = data.projection.median_p50.ruin_probability * 100;
  const planningAge = data.actuarial_summary.planning_age_recommended;

  // Determine color and status
  let color = "emerald";
  let statusIcon = CheckCircle;
  let statusText = "Risiko Rendah";
  let statusBg = "bg-emerald-50";
  let statusTextColor = "text-emerald-700";

  if (ruinProb >= 40) {
    color = "red";
    statusIcon = AlertCircle;
    statusText = "Risiko Tinggi";
    statusBg = "bg-red-50";
    statusTextColor = "text-red-700";
  } else if (ruinProb >= 15) {
    color = "amber";
    statusIcon = AlertTriangle;
    statusText = "Risiko Sedang";
    statusBg = "bg-amber-50";
    statusTextColor = "text-amber-700";
  }

  const StatusIcon = statusIcon;

  // SVG gauge parameters
  const size = 200;
  const strokeWidth = 20;
  const radius = (size - strokeWidth) / 2;
  const circumference = Math.PI * radius; // Semi-circle
  const offset = circumference - (ruinProb / 100) * circumference;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.3 }}
      className="rounded-3xl bg-white border border-gray-100 p-8"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className={`w-10 h-10 rounded-xl ${statusBg} flex items-center justify-center`}>
          <StatusIcon className={`w-5 h-5 ${statusTextColor}`} />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900">Ruin Probability</h3>
          <p className="text-sm text-gray-500">Peluang dana habis sebelum usia {planningAge}</p>
        </div>
      </div>

      {/* Gauge */}
      <div className="flex flex-col items-center">
        <div className="relative">
          <svg width={size} height={size / 2 + 20} className="transform rotate-0">
            {/* Background arc */}
            <path
              d={`M ${strokeWidth / 2} ${size / 2} A ${radius} ${radius} 0 0 1 ${
                size - strokeWidth / 2
              } ${size / 2}`}
              fill="none"
              stroke="#f3f4f6"
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
            {/* Progress arc */}
            <motion.path
              d={`M ${strokeWidth / 2} ${size / 2} A ${radius} ${radius} 0 0 1 ${
                size - strokeWidth / 2
              } ${size / 2}`}
              fill="none"
              stroke={
                color === "emerald"
                  ? "#10b981"
                  : color === "amber"
                  ? "#f59e0b"
                  : "#ef4444"
              }
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset: offset }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            />
          </svg>

          {/* Center text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pt-8">
            <motion.p
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="text-5xl font-bold text-gray-900 tabular-nums"
            >
              {ruinProb.toFixed(1)}%
            </motion.p>
          </div>
        </div>

        {/* Status badge */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className={`mt-6 px-6 py-3 rounded-full ${statusBg} border border-${color}-200`}
        >
          <p className={`text-sm font-semibold ${statusTextColor}`}>{statusText}</p>
        </motion.div>

        {/* Explanation */}
        <p className="mt-4 text-center text-sm text-gray-600 max-w-md">
          Berdasarkan simulasi Monte Carlo 10.000 iterasi, terdapat peluang{" "}
          <span className="font-bold">{ruinProb.toFixed(1)}%</span> dana pensiun Anda akan habis
          sebelum usia {planningAge} tahun.
        </p>
      </div>
    </motion.div>
  );
}
