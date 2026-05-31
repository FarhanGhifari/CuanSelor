import { T, FONT } from "./tokens";
import { TESTIMONIALS } from "@/features/landing/data/landing-page";

/** Reusable testimonial card. */
function TestimonialCard({ t }: { t: (typeof TESTIMONIALS)[number] }) {
  return (
    <div
      className="w-[280px] sm:w-[380px] shrink-0 flex flex-col gap-4 p-5 sm:p-6 rounded-2xl text-left border"
      style={{
        background: T.canvas,
        borderColor: T.hairline,
        boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <div
          style={{
            width: 44, height: 44, borderRadius: "50%",
            background: T.parchment,
            border: `1px solid ${T.hairline}`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 14, fontWeight: 600, color: T.blueDark,
            fontFamily: FONT,
          }}
        >
          {t.initials}
        </div>
        <div>
          <p style={{ fontFamily: FONT, fontSize: 16, fontWeight: 600, color: T.ink, lineHeight: 1.2 }}>{t.name}</p>
          <p style={{ fontFamily: FONT, fontSize: 13, color: T.inkMuted, marginTop: 2 }}>{t.role}</p>
        </div>
      </div>
      <p style={{ fontFamily: FONT, fontSize: 15, fontWeight: 400, lineHeight: 1.5, color: T.inkMuted }}>
        {t.quote}
      </p>
    </div>
  );
}

/** Dual-row infinite marquee testimonials section. */
export default function TestimonialsSection() {
  const row1 = [...TESTIMONIALS, ...TESTIMONIALS, ...TESTIMONIALS];
  const row2 = [...TESTIMONIALS.slice(3), ...TESTIMONIALS, ...TESTIMONIALS, ...TESTIMONIALS.slice(0, 3)];

  return (
    <section className="py-[60px] md:py-[140px] overflow-hidden" style={{ background: T.canvas }}>
      <div className="text-center mb-10 md:mb-16 px-4 md:px-6">
        <p style={{ fontFamily: FONT, fontSize: 16, fontWeight: 500, color: T.inkMuted, marginBottom: 16 }}>
          Ribuan Gen Z Indonesia sudah bergabung
        </p>
        <h2 style={{ fontSize: "clamp(34px, 5vw, 56px)", fontWeight: 600, letterSpacing: "-0.03em", color: "#000000" }}>
          Apa kata pengguna CuanSelor
        </h2>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        {/* Row 1 */}
        <div style={{ position: "relative", width: "100%" }}>
          <div className="lp-marquee-1">
            {row1.map((t, idx) => <TestimonialCard key={`r1-${idx}`} t={t} />)}
          </div>
        </div>
        {/* Row 2 */}
        <div style={{ position: "relative", width: "100%" }}>
          <div className="lp-marquee-2">
            {row2.map((t, idx) => <TestimonialCard key={`r2-${idx}`} t={t} />)}
          </div>
        </div>
      </div>
    </section>
  );
}
