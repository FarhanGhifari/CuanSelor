import { ArrowRight } from "lucide-react";
import { T, FONT } from "./tokens";
import { HOW_IT_WORKS } from "@/lib/constants/landing-page";

const STEP_BG_COLORS = [
  "linear-gradient(180deg, #ff5a5a 0%, #b32121 100%)",
  "#0b192c",
  "linear-gradient(180deg, #3b3bff 0%, #7c0020 100%)",
  "#1a473b",
];

/** How-it-works section with animated entrance step cards. */
export default function HowItWorksSection() {
  return (
    <section className="py-[60px] md:py-[120px] px-6 md:px-[5%]" style={{ background: T.canvas }}>
      <div className="w-full max-w-[1400px] mx-auto">
        {/* Heading */}
        <div style={{ textAlign: "left", marginBottom: 40, maxWidth: 640 }}>
          <h2
            style={{
              fontSize: "clamp(40px, 5vw, 56px)",
              fontWeight: 700,
              letterSpacing: "-0.03em",
              lineHeight: 1.1,
              color: T.ink,
              marginBottom: 16,
            }}
          >
            Mulai atur masa depanmu hari ini{" "}
            <span className="lp-star" style={{ color: "#ff4b4b" }}>✦</span>
          </h2>
          <p style={{ fontFamily: FONT, fontSize: 18, fontWeight: 400, lineHeight: 1.4, color: T.inkMuted }}>
            Dari daftar ke kejelasan finansial dalam 5 menit. Tidak perlu background finance, sepenuhnya gratis.
          </p>
        </div>

        {/* Step Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5" style={{ perspective: 1200 }}>
          {HOW_IT_WORKS.map((step, i) => {
            const Icon = step.icon;
            return (
              <div
                key={step.title}
                className="lp-step-card"
                style={{
                  position: "relative",
                  background: STEP_BG_COLORS[i % STEP_BG_COLORS.length],
                  borderRadius: 24,
                  padding: "32px 24px",
                  textAlign: "left",
                  minHeight: 460,
                  display: "flex",
                  flexDirection: "column",
                  overflow: "hidden",
                  animationDelay: `${i * 0.16}s`,
                }}
              >
                {/* Top-right arrow */}
                <div style={{ position: "absolute", top: 24, right: 24, width: 32, height: 32, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 10 }}>
                  <ArrowRight style={{ color: "#fff", width: 16, height: 16 }} />
                </div>

                {/* Icon */}
                <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 32, zIndex: 10 }}>
                  <Icon style={{ color: "rgba(255,255,255,0.9)", width: 80, height: 80, strokeWidth: 1.5 }} />
                </div>

                {/* Gradient overlay for text readability */}
                <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "50%", background: "linear-gradient(to top, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0) 100%)", pointerEvents: "none", zIndex: 1 }} />

                {/* Text */}
                <div style={{ position: "relative", zIndex: 10 }}>
                  <p style={{ fontSize: 24, fontWeight: 700, letterSpacing: "-0.02em", lineHeight: 1.15, color: "#fff", marginBottom: 12, fontFamily: FONT }}>
                    {step.title}
                  </p>
                  <p style={{ fontFamily: FONT, fontSize: 14, fontWeight: 400, lineHeight: 1.43, color: "rgba(255,255,255,0.85)" }}>
                    {step.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
