"use client";

import { useEffect, useRef } from "react";
import {
  BrainCircuit,
  Clock,
  TrendingUp,
  Wallet,
  HelpCircle,
} from "lucide-react";
import { T, FONT } from "./tokens";

/* ─────────────────────────────────────────────
   Problem card data
   ───────────────────────────────────────────── */

interface ProblemCard {
  title: string;
  description: string;
  icon: React.ElementType;
  accentColor: string;
  accentBg: string;
  /** If true, card spans 2 columns on lg+ */
  isMain?: boolean;
  /** Optional gradient for the main card */
  gradient?: string;
}

const CARDS: ProblemCard[] = [
  {
    title: "Masa Depan Finansial Masih Serba Tebakan",
    description:
      "Banyak orang tahu berapa penghasilannya, tapi belum tahu apakah cashflow, dana darurat, investasi, dan target pensiunnya benar-benar berada di jalur yang aman.",
    icon: BrainCircuit,
    accentColor: T.emerald,
    accentBg: `${T.emerald}12`,
    isMain: true,
  },
  {
    title: "Target Pensiun Terasa Terlalu Jauh",
    description:
      "Pensiun sering dianggap urusan nanti. Padahal semakin lama ditunda, semakin besar dana yang perlu disiapkan untuk mencapai hidup yang aman.",
    icon: Clock,
    accentColor: T.indigo,
    accentBg: `${T.indigo}12`,
  },
  {
    title: "Investasi Sering Karena FOMO",
    description:
      "Keputusan investasi sering dipengaruhi tren, bukan berdasarkan profil risiko, tujuan finansial, dan kemampuan bulanan yang benar-benar sesuai.",
    icon: TrendingUp,
    accentColor: T.violet,
    accentBg: `${T.violet}12`,
  },
  {
    title: "Cashflow Bocor Tanpa Disadari",
    description:
      "Pengeluaran kecil, paylater, dan gaya hidup bisa membuat pendapatan habis tanpa terasa, sehingga tabungan dan investasi jangka panjang sering tertunda.",
    icon: Wallet,
    accentColor: "#F59E0B",
    accentBg: "rgba(245,158,11,0.08)",
  },
  {
    title: "Bingung Harus Mulai dari Mana",
    description:
      "Data keuangan tersebar, tujuan belum jelas, dan terlalu banyak pilihan membuat langkah pertama terasa membingungkan.",
    icon: HelpCircle,
    accentColor: "#F43F5E",
    accentBg: "rgba(244,63,94,0.08)",
  },
];

const FLOW_STEPS = ["Cashflow", "Risk Profile", "Simulation", "AI Insight"];

/* ─────────────────────────────────────────────
   Component
   ───────────────────────────────────────────── */

export default function ProblemSection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("ps-in-view");
          observer.unobserve(el);
        }
      },
      { threshold: 0.08 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      {/* Scoped CSS – animations & hover */}
      <style>{scopedCSS}</style>

      <section
        ref={sectionRef}
        className="ps-section"
        style={{
          background: T.bgBase,
          fontFamily: FONT,
          padding: "100px 24px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Ambient glow */}
        <div className="ps-ambient-glow" />

        <div style={{ maxWidth: 1200, margin: "0 auto", position: "relative", zIndex: 1 }}>
          {/* ── Header ── */}
          <div style={{ textAlign: "center", marginBottom: 64 }}>

            {/* Heading */}
            <h2
              className="ps-fade-up ps-d1"
              style={{
                fontFamily: FONT,
                fontSize: "clamp(28px, 3.5vw, 44px)",
                fontWeight: 800,
                letterSpacing: "-0.03em",
                lineHeight: 1.2,
                color: "#000000",
                maxWidth: 760,
                margin: "0 auto 20px",
              }}
            >
              Masalahnya bukan kamu tidak peduli masa depan.
              <br />
              Masalahnya, kamu belum punya gambaran yang jelas.
            </h2>

            {/* Subheadline */}
            <p
              className="ps-fade-up ps-d2"
              style={{
                fontFamily: FONT,
                fontSize: "clamp(15px, 1.4vw, 18px)",
                fontWeight: 400,
                lineHeight: 1.65,
                color: T.inkMuted,
                maxWidth: 640,
                margin: "0 auto",
              }}
            >
              Tanpa data yang rapi, simulasi yang mudah dipahami, dan rekomendasi yang personal,
              keputusan finansial sering berubah menjadi tebakan.
            </p>
          </div>

          {/* ── Bento Grid ── */}
          <div className="ps-grid ps-fade-up ps-d3">
            {CARDS.map((card, i) => {
              const Icon = card.icon;
              return (
                <div
                  key={card.title}
                  className={`ps-card ${card.isMain ? "ps-card-main" : ""} ps-stagger`}
                  style={{
                    ...cardBaseStyle,
                    background: card.gradient || "#FFFFFF",
                    animationDelay: `${i * 0.09}s`,
                  }}
                >
                  {/* Icon */}
                  <div
                    className="ps-icon-box"
                    style={{
                      width: 56,
                      height: 56,
                      borderRadius: 16,
                      background: card.accentBg,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: 24,
                      transition: "transform 0.3s ease",
                    }}
                  >
                    <Icon style={{ color: card.accentColor, width: 28, height: 28 }} />
                  </div>

                  {/* Title */}
                  <h3
                    style={{
                      fontFamily: FONT,
                      fontSize: card.isMain ? "clamp(24px, 2.5vw, 28px)" : "clamp(20px, 2vw, 24px)",
                      fontWeight: 700,
                      color: T.ink,
                      marginBottom: 12,
                      letterSpacing: "-0.01em",
                      lineHeight: 1.3,
                    }}
                  >
                    {card.title}
                  </h3>

                  {/* Description */}
                  <p
                    style={{
                      fontFamily: FONT,
                      fontSize: "clamp(15px, 1.5vw, 17px)",
                      fontWeight: 400,
                      lineHeight: 1.65,
                      color: T.inkMuted,
                    }}
                  >
                    {card.description}
                  </p>

                  {/* Mini flow text with dividers — main card only */}
                  {card.isMain && (
                    <div
                      className="ps-flow-steps"
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        alignItems: "center",
                        rowGap: 8,
                        columnGap: 16,
                        marginTop: 32,
                        fontFamily: FONT,
                        fontSize: "clamp(13px, 1.2vw, 15px)",
                        fontWeight: 600,
                        color: "#059669",
                        letterSpacing: "0.02em",
                      }}
                    >
                      {FLOW_STEPS.map((step, idx) => (
                        <span key={step} style={{ display: "inline-flex", alignItems: "center", gap: 16 }}>
                          <span>{step}</span>
                          {idx < FLOW_STEPS.length - 1 && (
                            <span style={{ color: "rgba(16, 185, 129, 0.4)", fontWeight: 400 }}>·</span>
                          )}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}

/* ─────────────────────────────────────────────
   Static styles
   ───────────────────────────────────────────── */

const badgeStyle: React.CSSProperties = {
  display: "inline-block",
  fontFamily: FONT,
  fontSize: 12,
  fontWeight: 700,
  letterSpacing: "0.12em",
  color: T.emerald,
  background: `${T.emerald}10`,
  border: `1px solid ${T.emerald}30`,
  borderRadius: 100,
  padding: "6px 18px",
};

const cardBaseStyle: React.CSSProperties = {
  borderRadius: 24,
  border: "1px solid rgba(15, 23, 42, 0.06)",
  boxShadow: "0 10px 40px rgba(15, 23, 42, 0.03)",
  padding: "clamp(32px, 4vw, 48px)",
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-start",
  position: "relative",
  overflow: "hidden",
  transition: "transform 0.35s cubic-bezier(0.16,1,0.3,1), box-shadow 0.35s cubic-bezier(0.16,1,0.3,1), border-color 0.35s ease",
};

/* ─────────────────────────────────────────────
   Scoped CSS (animations + grid)
   ───────────────────────────────────────────── */

const scopedCSS = `
/* ── Ambient glow ── */
.ps-ambient-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 600px;
  height: 600px;
  transform: translate(-50%, -50%);
  background: radial-gradient(circle, rgba(16,185,129,0.05) 0%, transparent 70%);
  pointer-events: none;
  z-index: 0;
}

/* ── Grid layout ── */
.ps-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
}
@media (min-width: 768px) {
  .ps-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 32px;
  }
  .ps-card-main {
    grid-column: span 2;
  }
}

/* ── Card hover ── */
.ps-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 60px rgba(15, 23, 42, 0.07), 0 0 0 1px rgba(15, 23, 42, 0.05);
  border-color: rgba(16, 185, 129, 0.18);
}
.ps-card:hover .ps-icon-box {
  transform: scale(1.08);
}

/* ── Fade-up animation ── */
.ps-fade-up {
  opacity: 0;
  transform: translateY(24px);
  transition: opacity 0.7s cubic-bezier(0.16,1,0.3,1), transform 0.7s cubic-bezier(0.16,1,0.3,1);
}
.ps-section.ps-in-view .ps-fade-up {
  opacity: 1;
  transform: translateY(0);
}

/* Stagger delays */
.ps-d0 { transition-delay: 0s; }
.ps-d1 { transition-delay: 0.1s; }
.ps-d2 { transition-delay: 0.2s; }
.ps-d3 { transition-delay: 0.3s; }
.ps-d4 { transition-delay: 0.5s; }

/* ── Stagger cards inside grid ── */
.ps-stagger {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.6s cubic-bezier(0.16,1,0.3,1), transform 0.6s cubic-bezier(0.16,1,0.3,1);
}
.ps-section.ps-in-view .ps-stagger:nth-child(1) { opacity: 1; transform: translateY(0); transition-delay: 0.35s; }
.ps-section.ps-in-view .ps-stagger:nth-child(2) { opacity: 1; transform: translateY(0); transition-delay: 0.44s; }
.ps-section.ps-in-view .ps-stagger:nth-child(3) { opacity: 1; transform: translateY(0); transition-delay: 0.53s; }
.ps-section.ps-in-view .ps-stagger:nth-child(4) { opacity: 1; transform: translateY(0); transition-delay: 0.62s; }
.ps-section.ps-in-view .ps-stagger:nth-child(5) { opacity: 1; transform: translateY(0); transition-delay: 0.71s; }
`;
