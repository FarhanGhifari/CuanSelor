import { CheckCircle, XCircle, Shield, Brain, Users } from "lucide-react";
import { T, FONT } from "./tokens";
import { COMPARISON } from "@/features/landing/data/landing-page";

const WHY_US_PILLARS = [
  { icon: Shield, title: "Aman & Privat", desc: "Enkripsi bank-level. Data kamu tidak pernah dijual." },
  { icon: Brain, title: "Berbasis AI", desc: "Rekomendasi cerdas yang disesuaikan situasi unikmu." },
  { icon: Users, title: "Untuk Gen Z", desc: "Dirancang untuk kebutuhan finansial anak muda Indonesia." },
];

/** Comparison table + 3-pillar section on parchment background. */
export default function ComparisonSection() {
  return (
    <section style={{ background: T.parchment, padding: "120px 5%" }}>
      <div style={{ maxWidth: 1400, margin: "0 auto", textAlign: "center" }}>
        <h2
          style={{
            fontSize: "clamp(40px, 5vw, 56px)",
            fontWeight: 600,
            letterSpacing: "-0.374px",
            lineHeight: 1.1,
            color: T.ink,
            marginBottom: 16,
          }}
        >
          CuanSelor vs cara konvensional
        </h2>
        <p style={{ fontFamily: FONT, fontSize: 21, fontWeight: 400, lineHeight: 1.19, color: T.inkMuted, marginBottom: 64 }}>
          Kenapa harus bayar mahal kalau bisa lebih baik secara gratis?
        </p>

        {/* Comparison grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, maxWidth: 680, margin: "0 auto 80px" }}>
          {/* Old */}
          <div style={{ background: T.canvas, borderRadius: 12, padding: 32, border: `1px solid ${T.hairline}`, textAlign: "left" }}>
            <p style={{ fontFamily: FONT, fontSize: 14, fontWeight: 600, letterSpacing: "-0.224px", color: T.inkMuted, marginBottom: 24 }}>
              {COMPARISON.old.label}
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {COMPARISON.old.items.map((item) => (
                <div key={item} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                  <XCircle style={{ width: 16, height: 16, color: "#ff453a", flexShrink: 0, marginTop: 2 }} />
                  <span style={{ fontFamily: FONT, fontSize: 14, letterSpacing: "-0.224px", lineHeight: 1.43, color: T.inkMuted }}>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* New */}
          <div style={{ background: T.canvas, borderRadius: 12, padding: 32, border: `2px solid ${T.blue}`, textAlign: "left" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 24 }}>
              <p style={{ fontFamily: FONT, fontSize: 14, fontWeight: 600, letterSpacing: "-0.224px", color: T.blue }}>
                {COMPARISON.new.label}
              </p>
              <span style={{ fontFamily: FONT, fontSize: 10, fontWeight: 600, padding: "3px 8px", background: T.blue, color: "#fff", borderRadius: 9999 }}>
                Recommended
              </span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {COMPARISON.new.items.map((item) => (
                <div key={item} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                  <CheckCircle style={{ width: 16, height: 16, color: "#30d158", flexShrink: 0, marginTop: 2 }} />
                  <span style={{ fontFamily: FONT, fontSize: 14, letterSpacing: "-0.224px", lineHeight: 1.43, color: T.ink }}>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 3 Pillars */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 40 }}>
          {WHY_US_PILLARS.map(({ icon: Icon, title, desc }) => (
            <div key={title} style={{ textAlign: "center" }}>
              <div style={{ width: 56, height: 56, borderRadius: 12, background: T.blue, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                <Icon style={{ width: 28, height: 28, color: "#fff" }} />
              </div>
              <p style={{ fontSize: 17, fontWeight: 600, letterSpacing: "-0.374px", color: T.ink, marginBottom: 6, fontFamily: FONT }}>{title}</p>
              <p style={{ fontFamily: FONT, fontSize: 14, letterSpacing: "-0.224px", lineHeight: 1.43, color: T.inkMuted }}>{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
