import { ArrowRight, Sparkles } from "lucide-react";
import { T, FONT } from "./tokens";
import { ROUTES } from "@/lib/constants/routes";
import AuthAwarePillCTA from "./AuthAwarePillCTA";

/** Final call-to-action section matching the light premium Hero style. */
export default function CtaSection() {
  return (
    <section
      className="relative py-[80px] md:py-[140px] px-6 text-center overflow-hidden"
      style={{
        background: "radial-gradient(at 50% 0%, rgba(99, 102, 241, 0.04) 0%, transparent 60%), radial-gradient(at 50% 100%, rgba(16, 185, 129, 0.05) 0%, transparent 60%), #FFFFFF",
        borderTop: "1px solid rgba(15, 23, 42, 0.05)",
        borderBottom: "1px solid rgba(15, 23, 42, 0.05)",
      }}
    >
      {/* Background noise and glows */}
      <div className="noise-overlay" />
      <div
        className="absolute pointer-events-none"
        style={{
          width: 500,
          height: 500,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(99,102,241,0.03) 0%, transparent 70%)",
          top: "-20%",
          left: "10%",
          filter: "blur(60px)",
        }}
      />
      <div
        className="absolute pointer-events-none"
        style={{
          width: 500,
          height: 500,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(16,185,129,0.04) 0%, transparent 70%)",
          bottom: "-20%",
          right: "10%",
          filter: "blur(60px)",
        }}
      />

      <div className="relative z-10 w-full max-w-[720px] mx-auto">
        {/* Sparkle badge */}
        <div
          className="inline-flex items-center gap-1.5 mb-6 animate-pulse-slow"
          style={{
            background: T.emeraldDim,
            border: "1px solid rgba(16,185,129,0.12)",
            borderRadius: 50,
            padding: "6px 14px",
          }}
        >
          <Sparkles style={{ width: 12, height: 12, color: T.emerald }} />
          <span style={{ fontSize: 11, fontWeight: 700, color: T.emerald, fontFamily: FONT, letterSpacing: "0.05em" }}>
            GET STARTED TODAY
          </span>
        </div>

        <h2
          style={{
            fontFamily: FONT,
            fontSize: "clamp(34px, 4.5vw, 52px)",
            fontWeight: 800,
            letterSpacing: "-0.03em",
            lineHeight: 1.12,
            color: "#000000",
            marginBottom: 20,
          }}
        >
          Pensiunmu tidak akan<br />
          merencanakan dirinya sendiri.
        </h2>

        <p
          style={{
            fontFamily: FONT,
            fontSize: 17,
            fontWeight: 400,
            lineHeight: 1.65,
            color: T.inkMuted,
            marginBottom: 36,
            maxWidth: 580,
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          Bergabunglah dengan ribuan anak muda Indonesia yang akhirnya tahu ke mana arah tujuan finansial mereka.
        </p>

        <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap", marginBottom: 28 }}>
          <AuthAwarePillCTA
            href={ROUTES.REGISTER}
            dashboardChildren={
              <>
                Dashboard
                <ArrowRight className="transition-transform duration-300 group-hover:translate-x-1.5" style={{ width: 16, height: 16, marginLeft: 4 }} />
              </>
            }
            style={{ padding: "14px 28px", fontSize: 15 }}
          >
            Start My Financial Journey
            <ArrowRight className="transition-transform duration-300 group-hover:translate-x-1.5" style={{ width: 16, height: 16, marginLeft: 4 }} />
          </AuthAwarePillCTA>
        </div>
      </div>
    </section>
  );
}
