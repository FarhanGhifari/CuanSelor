"use client";

import { motion } from "framer-motion";
import type { Recommendations, ActuarialSummary } from "../types/projection.types";

interface ProjectionHeroProps {
  userName: string;
  isOnTrack: boolean;
  recommendations: Recommendations;
  actuarial: ActuarialSummary;
}

export function ProjectionHero({ userName, isOnTrack, recommendations, actuarial }: ProjectionHeroProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="projection-hero"
    >
      {/* Decorative Blurs */}
      <div className="projection-hero__blur projection-hero__blur--right" />
      <div className="projection-hero__blur projection-hero__blur--left" />

      <div className="projection-hero__content">
        {/* Status badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className={`projection-hero__badge ${isOnTrack ? "projection-hero__badge--success" : "projection-hero__badge--warning"}`}
        >
          <span className="projection-hero__badge-dot" />
          {isOnTrack ? "On Track" : "Perlu Perhatian"}
        </motion.div>

        <h2 className="projection-hero__title">
          Proyeksi Pensiunmu,{" "}
          <span className="projection-hero__name">{userName}</span>
        </h2>
        <p className="projection-hero__subtitle">
          Simulasi Monte Carlo {10000} iterasi • Horizon {actuarial.planning_horizon_post_retirement} tahun pasca-pensiun •
          Profil {recommendations.effective_risk_profile}
        </p>

        {/* Quick stats row */}
        <div className="projection-hero__stats">
          <div className="projection-hero__stat">
            <span className="projection-hero__stat-label">Usia Pensiun</span>
            <span className="projection-hero__stat-value">
              {actuarial.current_age + actuarial.years_to_retirement} th
            </span>
          </div>
          <div className="projection-hero__stat-divider" />
          <div className="projection-hero__stat">
            <span className="projection-hero__stat-label">Planning Age</span>
            <span className="projection-hero__stat-value">{actuarial.planning_age_recommended} th</span>
          </div>
          <div className="projection-hero__stat-divider" />
          <div className="projection-hero__stat">
            <span className="projection-hero__stat-label">Horizon Pensiun</span>
            <span className="projection-hero__stat-value">{actuarial.planning_horizon_post_retirement} th</span>
          </div>
        </div>
      </div>

      {/* Decorative illustration - sunset */}
      <div className="projection-hero__illustration">
        <svg viewBox="0 0 200 140" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Sun */}
          <circle cx="100" cy="70" r="28" fill="url(#sunGradient)" opacity="0.9" />
          {/* Horizon line */}
          <path d="M0 95 Q50 85 100 90 Q150 95 200 88 L200 140 L0 140 Z" fill="#006241" opacity="0.3" />
          <path d="M0 105 Q60 95 120 100 Q170 105 200 98 L200 140 L0 140 Z" fill="#006241" opacity="0.5" />
          {/* Water reflections */}
          <line x1="70" y1="110" x2="90" y2="110" stroke="rgba(255,200,100,0.4)" strokeWidth="1.5" />
          <line x1="95" y1="115" x2="120" y2="115" stroke="rgba(255,200,100,0.3)" strokeWidth="1" />
          <line x1="85" y1="120" x2="105" y2="120" stroke="rgba(255,200,100,0.2)" strokeWidth="1" />
          {/* Palm tree silhouette */}
          <path d="M160 100 L162 60" stroke="#006241" strokeWidth="2.5" opacity="0.6" />
          <path d="M162 60 Q155 50 145 55 Q155 52 162 60 Z" fill="#006241" opacity="0.5" />
          <path d="M162 60 Q170 48 180 53 Q168 50 162 60 Z" fill="#006241" opacity="0.5" />
          <path d="M162 62 Q158 45 148 50" stroke="#006241" strokeWidth="1.5" fill="none" opacity="0.4" />
          <defs>
            <radialGradient id="sunGradient">
              <stop offset="0%" stopColor="#FFD700" />
              <stop offset="60%" stopColor="#FF8C42" />
              <stop offset="100%" stopColor="#FF6B6B" stopOpacity="0.6" />
            </radialGradient>
          </defs>
        </svg>
      </div>
    </motion.section>
  );
}
