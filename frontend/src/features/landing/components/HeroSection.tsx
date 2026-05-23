"use client";

import { useEffect, useRef, useState } from "react";
import { Brain, MessageCircle, TrendingUp, Users, ArrowRight, Sparkles, Lock, BarChart3 } from "lucide-react";
import { T, FONT } from "./tokens";
import { ROUTES } from "@/lib/constants/routes";
import PillCTA from "./PillCTA";

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const dashboardRef = useRef<HTMLDivElement>(null);
  const orbRef1 = useRef<HTMLDivElement>(null);
  const orbRef2 = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let currentY = window.scrollY;
    let targetY = window.scrollY;
    let isScrolling = false;
    let animId: number;

    const lerp = (start: number, end: number, factor: number) => {
      return start + (end - start) * factor;
    };

    const updateParallax = () => {
      currentY = lerp(currentY, targetY, 0.08); // Butter-smooth premium inertial delay

      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect();
        // Only run transform if section is visible in viewport
        if (rect.bottom > 0 && rect.top < window.innerHeight) {
          if (dashboardRef.current) {
            dashboardRef.current.style.transform = `translate3d(0, ${currentY * 0.03}px, 0)`;
          }
          if (orbRef1.current) {
            orbRef1.current.style.transform = `translate3d(0, ${currentY * 0.02}px, 0)`;
          }
          if (orbRef2.current) {
            orbRef2.current.style.transform = `translate3d(0, ${currentY * 0.015}px, 0)`;
          }
        }
      }

      if (Math.abs(targetY - currentY) > 0.1) {
        animId = requestAnimationFrame(updateParallax);
      } else {
        currentY = targetY;
        isScrolling = false;
      }
    };

    const handleScroll = () => {
      targetY = window.scrollY;
      if (!isScrolling) {
        isScrolling = true;
        animId = requestAnimationFrame(updateParallax);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    // Trigger once for initial paint
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(animId);
    };
  }, []);


  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative min-h-screen flex items-center overflow-hidden"
      style={{
        background: "radial-gradient(at 0% 0%, rgba(99, 102, 241, 0.04) 0%, transparent 60%), radial-gradient(at 100% 100%, rgba(16, 185, 129, 0.06) 0%, transparent 60%), #FFFFFF",
      }}
    >
      {/* ═══ LAYER 1: Background Effects (Inlined for direct ref binding and zero re-renders) ═══ */}
      <div className="noise-overlay pointer-events-none" />

      {/* Ambient orbs */}
      <div
        className="absolute pointer-events-none hero-orb-1"
        style={{
          width: 800, height: 800, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(16,185,129,0.06) 0%, transparent 65%)",
          top: -300, left: -200,
          filter: "blur(60px)",
        }}
      />
      <div
        className="absolute pointer-events-none hero-orb-2"
        style={{
          width: 600, height: 600, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(99,102,241,0.05) 0%, transparent 65%)",
          top: "20%", right: -100,
          filter: "blur(80px)",
        }}
      />
      <div
        className="absolute pointer-events-none hero-orb-3"
        style={{
          width: 500, height: 500, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(20,184,166,0.04) 0%, transparent 65%)",
          bottom: -200, left: "40%",
          filter: "blur(70px)",
        }}
      />

      {/* Glow behind dashboard — hardware accelerated soft ambient orbs */}
      <div
        ref={orbRef1}
        className="absolute pointer-events-none"
        style={{
          width: 700, height: 500, borderRadius: "50%",
          background: "radial-gradient(ellipse, rgba(16,185,129,0.07) 0%, transparent 70%)",
          top: "15%", right: "-10%",
          filter: "blur(60px)",
          willChange: "transform",
        }}
      />
      <div
        ref={orbRef2}
        className="absolute pointer-events-none"
        style={{
          width: 500, height: 500, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(99,102,241,0.06) 0%, transparent 70%)",
          top: "35%", right: "-5%",
          filter: "blur(70px)",
          willChange: "transform",
        }}
      />

      {/* Interactive Morphing Canvas Waves */}
      <CanvasWave />

      <div
        className="relative z-10 w-full max-w-[1536px] mx-auto px-6 md:px-10 lg:px-16"
        style={{ paddingTop: 160, paddingBottom: 100 }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-center">

          {/* ══════════ LEFT COLUMN ══════════ */}
          <div className="lg:col-span-5 flex flex-col items-start">

            {/* ── Badge ── */}
            <div
              className="hero-fade-1 inline-flex items-center gap-2 mb-8 animate-pulse-slow"
              style={{
                background: T.emeraldDim,
                border: "1px solid rgba(16,185,129,0.15)",
                borderRadius: 50,
                padding: "8px 16px",
              }}
            >
              <Sparkles style={{ width: 14, height: 14, color: T.emerald }} />
              <span style={{ fontSize: 12, fontWeight: 700, color: T.emerald, fontFamily: FONT, letterSpacing: "0.05em" }}>
                AI-Powered Financial Planning
              </span>
            </div>

            {/* ── Headline — Short, bold, and punchy ── */}
            <h1
              className="hero-fade-2"
              style={{
                fontFamily: FONT,
                fontSize: "clamp(38px, 4.5vw, 64px)",
                fontWeight: 800,
                letterSpacing: "-0.035em",
                lineHeight: 1.08,
                color: T.ink,
                marginBottom: 24,
              }}
            >
              Berhenti Menebak.<br />
              <span
                style={{
                  background: `linear-gradient(135deg, ${T.emerald} 0%, ${T.teal} 50%, ${T.indigo} 100%)`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Mulai Merencanakan.
              </span>
            </h1>

            {/* ── Subheadline ── */}
            <p
              className="hero-fade-3"
              style={{
                fontFamily: FONT,
                fontSize: 17,
                fontWeight: 400,
                lineHeight: 1.7,
                color: T.inkMuted,
                marginBottom: 16,
                maxWidth: 580,
              }}
            >
              Analisis kondisi keuangan, proyeksi masa depan pensiun, dan dapatkan rekomendasi investasi personal — diperkuat oleh kecerdasan buatan.
            </p>

            {/* ── Emotional Statement ── */}
            <p
              className="hero-fade-3"
              style={{
                fontFamily: FONT,
                fontSize: 14,
                fontWeight: 400,
                fontStyle: "italic",
                lineHeight: 1.6,
                color: T.inkMuted48,
                marginBottom: 36,
                maxWidth: 500,
              }}
            >
              Perencanaan finansial bukan tentang menjadi kaya.<br />
              Tapi tentang memiliki masa depan yang aman.
            </p>

            {/* ── CTA Buttons ── */}
            <div className="hero-fade-4" style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 48 }}>
              <PillCTA href={ROUTES.REGISTER} style={{ padding: "14px 28px", fontSize: 15 }}>
                Mulai Gratis Sekarang
                <ArrowRight className="transition-transform duration-300 group-hover:translate-x-1.5" style={{ width: 16, height: 16, marginLeft: 4 }} />
              </PillCTA>
              <PillCTA href={ROUTES.PROJECTION} variant="ghost" style={{ padding: "14px 28px", fontSize: 15 }}>
                Coba Simulasi
              </PillCTA>
            </div>
          </div>

          {/* ══════════ RIGHT COLUMN — Dashboard — Hardware Accelerated ══════════ */}
          <div
            ref={dashboardRef}
            className="lg:col-span-6 lg:col-start-7 relative hidden lg:block hero-fade-7"
            style={{
              height: 600,
              willChange: "transform",
            }}
          >
            <FloatingDashboard />
          </div>
        </div>
      </div>

      {/* ── Animated Ticker ── */}
      <div
        className="absolute bottom-0 left-0 right-0"
        style={{
          height: 48,
          background: "rgba(15,23,42,0.02)",
          borderTop: `1px solid rgba(15,23,42,0.05)`,
          display: "flex",
          alignItems: "center",
          overflow: "hidden",
        }}
      >
      </div>
    </section>
  );
}

function CanvasWave() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = 900);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = canvas.parentElement?.clientHeight || 900;
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    let isVisible = true;
    let lastTime = 0;
    const fpsInterval = 1000 / 45; // Throttled to 45 FPS for maximum energy savings

    let lastWidth = 0;
    let gradient1: CanvasGradient | null = null;
    let gradient2: CanvasGradient | null = null;

    const draw = (timestamp: number) => {
      if (!isVisible) return;

      animId = requestAnimationFrame(draw);

      if (!lastTime) lastTime = timestamp;
      const elapsed = timestamp - lastTime;

      // Skip frames to throttle redraw rate
      if (elapsed < fpsInterval) return;
      lastTime = timestamp - (elapsed % fpsInterval);

      ctx.clearRect(0, 0, width, height);

      const time = timestamp * 0.0004;

      // Re-create gradients only when canvas width changes (huge GC savings)
      if (width !== lastWidth || !gradient1 || !gradient2) {
        lastWidth = width;

        gradient1 = ctx.createLinearGradient(0, 0, width, 0);
        gradient1.addColorStop(0, "rgba(255, 255, 255, 0)");
        gradient1.addColorStop(0.2, "rgba(16, 185, 129, 0.18)");
        gradient1.addColorStop(0.8, "rgba(20, 184, 166, 0.10)");
        gradient1.addColorStop(1, "rgba(255, 255, 255, 0)");

        gradient2 = ctx.createLinearGradient(0, 0, width, 0);
        gradient2.addColorStop(0, "rgba(255, 255, 255, 0)");
        gradient2.addColorStop(0.2, "rgba(99, 102, 241, 0.14)");
        gradient2.addColorStop(0.8, "rgba(139, 92, 246, 0.08)");
        gradient2.addColorStop(1, "rgba(255, 255, 255, 0)");
      }

      // Ribbon 1: Emerald / Teal (Left center flowing right)
      drawRibbon(ctx, width, height, time, gradient1, {
        lineCount: 12,
        yOffset: height * 0.48,
        amplitude: 75,
        speed: 0.35,
        spacing: 5.5,
      });

      // Ribbon 2: Indigo / Violet (Right center flowing left)
      drawRibbon(ctx, width, height, time + 15, gradient2, {
        lineCount: 10,
        yOffset: height * 0.54,
        amplitude: 60,
        speed: -0.28,
        spacing: 6.5,
      });
    };

    const drawRibbon = (
      c: CanvasRenderingContext2D,
      w: number,
      h: number,
      t: number,
      strokeStyle: CanvasGradient,
      opt: {
        lineCount: number;
        yOffset: number;
        amplitude: number;
        speed: number;
        spacing: number;
      }
    ) => {
      c.strokeStyle = strokeStyle;

      for (let i = 0; i < opt.lineCount; i++) {
        c.beginPath();
        c.lineWidth = 1.1;

        const offset = i * opt.spacing;

        for (let x = 0; x <= w; x += 45) {
          const progress = x / w;
          const angle = progress * Math.PI * 2.4;
          
          const sinVal1 = Math.sin(angle * 1.15 + t * opt.speed + i * 0.045) * opt.amplitude;
          const sinVal2 = Math.cos(angle * 0.58 - t * opt.speed * 0.75 + i * 0.025) * (opt.amplitude * 0.38);
          
          const y = opt.yOffset + sinVal1 + sinVal2 + offset;

          if (x === 0) {
            c.moveTo(x, y);
          } else {
            c.lineTo(x, y);
          }
        }
        c.stroke();
      }
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        const wasVisible = isVisible;
        isVisible = entry.isIntersecting;
        if (isVisible && !wasVisible) {
          animId = requestAnimationFrame(draw);
        }
      },
      { threshold: 0 }
    );
    observer.observe(canvas);

    // Initial start
    animId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animId);
      observer.disconnect();
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ mixBlendMode: "multiply", zIndex: 1 }}
    />
  );
}

function TrustStrip() {
  const items = [
    { icon: <Users style={{ width: 14, height: 14, color: T.emerald }} />, value: "50K+", label: "Pengguna" },
    { icon: <BarChart3 style={{ width: 14, height: 14, color: T.teal }} />, value: "1.200+", label: "Simulasi/mg" },
    { icon: <Sparkles style={{ width: 14, height: 14, color: T.indigo }} />, value: "24/7", label: "AI Advisor" },
    { icon: <Lock style={{ width: 14, height: 14, color: T.emerald }} />, value: "100%", label: "Aman" },
  ];

  return (
    <div
      style={{
        display: "inline-flex",
        flexWrap: "wrap",
        alignItems: "center",
        columnGap: 16,
        rowGap: 8,
        padding: "10px 24px",
        background: "rgba(255, 255, 255, 0.8)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        border: "1px solid rgba(15, 23, 42, 0.06)",
        borderRadius: 50,
        boxShadow: "0 10px 30px rgba(15, 23, 42, 0.03)",
      }}
    >
      {items.map((item, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
          {item.icon}
          <span style={{ fontSize: 13, fontWeight: 800, color: T.ink, fontFamily: FONT }}>
            {item.value}
          </span>
          <span style={{ fontSize: 11, fontWeight: 500, color: T.inkMuted48, fontFamily: FONT }}>
            {item.label}
          </span>
          {i < items.length - 1 && (
            <span style={{ color: "rgba(15, 23, 42, 0.12)", fontSize: 12, paddingLeft: 8 }}>|</span>
          )}
        </div>
      ))}
    </div>
  );
}

function FloatingDashboard() {
  return (
    <div className="relative w-full h-full">

      {/* ── Main Dashboard Card — Depth & Inner Glow ── */}
      <div
        className="absolute lp-float-dashboard"
        style={{
          top: 0, right: 0, left: "2%", bottom: "2%",
          background: "rgba(255, 255, 255, 0.85)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          borderRadius: 24,
          border: "1px solid rgba(255, 255, 255, 0.6)",
          boxShadow: "0 40px 90px rgba(15, 23, 42, 0.12), 0 0 0 1px rgba(15, 23, 42, 0.04), inset 0 1px 1px rgba(255, 255, 255, 0.85)",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Dashboard Header Bar */}
        <div
          style={{
            height: 52,
            borderBottom: "1px solid rgba(15, 23, 42, 0.05)",
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "0 22px",
            background: "rgba(15, 23, 42, 0.01)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 28, height: 28, borderRadius: 8,
                background: `linear-gradient(135deg, ${T.emerald}, ${T.teal})`,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >
              <TrendingUp style={{ width: 14, height: 14, color: "#fff" }} />
            </div>
            <span style={{ fontSize: 14, fontWeight: 800, color: T.ink, fontFamily: FONT }}>cuanSelor</span>
            {/* Live indicator */}
            <div style={{ display: "flex", alignItems: "center", gap: 4, marginLeft: 8 }}>
              <span className="live-pulse-dot" style={{ width: 6, height: 6, borderRadius: "50%", background: "#10B981", display: "inline-block" }} />
              <span style={{ fontSize: 9, fontWeight: 600, color: "#10B981", fontFamily: FONT }}>Live</span>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ fontSize: 15, opacity: 0.6, cursor: "pointer" }}>🔔</div>
            <div
              style={{
                width: 30, height: 30, borderRadius: "50%",
                background: `linear-gradient(135deg, ${T.indigo}, ${T.violet})`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 11, fontWeight: 800, color: "#fff", fontFamily: FONT,
              }}
            >
              CG
            </div>
          </div>
        </div>

        {/* Dashboard Body */}
        <div style={{ flex: 1, padding: "18px 22px", display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Metric Cards Row */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <MetricCard
              label="TOTAL SALDO"
              value="Rp 124,5 jt"
              badge="↑ +18.3%"
              accentColor={T.emerald}
              bg="rgba(16,185,129,0.04)"
              border="rgba(16,185,129,0.10)"
            />
            <MetricCard
              label="TARGET 2047"
              value="65%"
              badge="35% lagi"
              accentColor={T.indigo}
              bg="rgba(99,102,241,0.04)"
              border="rgba(99,102,241,0.10)"
              hasProgress
              progress={65}
            />
          </div>

          {/* Chart Section — Glowing Centerpiece */}
          <div
            style={{
              flex: 1,
              background: "rgba(15,23,42,0.01)",
              border: "1px solid rgba(15, 23, 42, 0.05)",
              borderRadius: 16,
              padding: "16px 18px",
              display: "flex", flexDirection: "column",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: T.ink, fontFamily: FONT }}>
                Grafik Akumulasi (Proyeksi AI)
              </span>
              <div style={{ display: "flex", gap: 6 }}>
                {["1B", "6B", "1T", "Semua"].map((f, i) => (
                  <span
                    key={f}
                    style={{
                      fontSize: 10, fontWeight: 700, fontFamily: FONT,
                      color: i === 3 ? T.emerald : T.inkMuted48,
                      background: i === 3 ? T.emeraldDim : "transparent",
                      padding: "4px 10px", borderRadius: 8, cursor: "pointer",
                    }}
                  >
                    {f}
                  </span>
                ))}
              </div>
            </div>
            <AnimatedChart />
          </div>
        </div>
      </div>

      {/* ═══ FLOATING CARDS (Layer 3) — Interactive Hover Depth ═══ */}

      {/* AI Insight Card — top-left */}
      <div className="absolute lp-float-a" style={{ top: "5%", left: "-12%", zIndex: 20 }}>
        <AIInsightBubble />
      </div>

      {/* Portfolio Card — mid-left */}
      <div className="absolute lp-float-b" style={{ top: "38%", left: "-15%", zIndex: 20 }}>
        <PortfolioMini />
      </div>

      {/* Return Metric — bottom-right */}
      <div className="absolute lp-float-c" style={{ bottom: "15%", right: "-8%", zIndex: 20 }}>
        <ReturnBubble />
      </div>

      {/* AI Chat — bottom-left */}
      <div className="absolute lp-float-d" style={{ bottom: "2%", left: "-10%", zIndex: 20 }}>
        <AIChatBubble />
      </div>
    </div>
  );
}

interface MetricCardProps {
  label: string;
  value: string;
  badge: string;
  accentColor: string;
  bg: string;
  border: string;
  hasProgress?: boolean;
  progress?: number;
}

function MetricCard({ label, value, badge, accentColor, bg, border, hasProgress, progress }: MetricCardProps) {
  return (
    <div style={{ background: bg, border: `1px solid ${border}`, borderRadius: 14, padding: "14px 16px" }}>
      <p style={{ fontSize: 9, fontWeight: 800, color: accentColor, letterSpacing: "0.06em", fontFamily: FONT, marginBottom: 6, opacity: 0.8 }}>
        {label}
      </p>
      <AnimatedNumber value={value} color={T.ink} />
      {hasProgress && (
        <div style={{ height: 4, background: "rgba(15,23,42,0.06)", borderRadius: 999, marginBottom: 6, marginTop: 6, overflow: "hidden" }}>
          <div style={{ width: `${progress}%`, height: "100%", background: `linear-gradient(90deg, ${accentColor}, ${T.teal})`, borderRadius: 999 }} />
        </div>
      )}
      <span style={{ fontSize: 10, fontWeight: 700, color: accentColor, fontFamily: FONT }}>{badge}</span>
    </div>
  );
}

/* ─────────────────────────────────────────────────────── */
/*  Animated Number Counter                                */
/* ─────────────────────────────────────────────────────── */
function AnimatedNumber({ value, color }: { value: string; color: string }) {
  const [displayed, setDisplayed] = useState(value);

  useEffect(() => {
    const parts = value.match(/(\d+)/g);
    if (!parts) return;

    let step = 0;
    const totalSteps = 20;
    const finalNum = parseInt(parts[0]);
    const interval = setInterval(() => {
      step++;
      const current = Math.round((finalNum / totalSteps) * step);
      setDisplayed(value.replace(parts[0], current.toString()));
      if (step >= totalSteps) {
        clearInterval(interval);
        setDisplayed(value);
      }
    }, 50);
    return () => clearInterval(interval);
  }, [value]);

  return (
    <p style={{ fontSize: 20, fontWeight: 800, color, fontFamily: FONT, marginBottom: 4, letterSpacing: "-0.02em" }}>
      {displayed}
    </p>
  );
}


/*  Animated SVG Chart — Glowing Centerpiece */

function AnimatedChart() {
  const pathRef = useRef<SVGPathElement | null>(null);

  useEffect(() => {
    const path = pathRef.current;
    if (!path) return;
    const len = path.getTotalLength();
    path.style.strokeDasharray = `${len}`;
    path.style.strokeDashoffset = `${len}`;
    path.style.transition = "stroke-dashoffset 3s cubic-bezier(0.4,0,0.2,1)";
    const t = setTimeout(() => { path.style.strokeDashoffset = "0"; }, 600);
    return () => clearTimeout(t);
  }, []);

  return (
    <div style={{ flex: 1, position: "relative", minHeight: 110 }}>
      <svg viewBox="0 0 400 90" preserveAspectRatio="none" style={{ width: "100%", height: "100%", display: "block" }}>
        <defs>
          <linearGradient id="heroChartArea" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#10B981" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#10B981" stopOpacity="0.00" />
          </linearGradient>
          <linearGradient id="heroChartLine" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={T.emerald} />
            <stop offset="50%" stopColor={T.teal} />
            <stop offset="100%" stopColor={T.indigo} />
          </linearGradient>
          <filter id="chartGlow">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {/* Grid lines */}
        {[18, 36, 54, 72].map((y) => (
          <line key={y} x1="0" y1={y} x2="400" y2={y} stroke="rgba(15,23,42,0.03)" strokeDasharray="4,6" />
        ))}
        {/* Area fill */}
        <path d="M 0 70 Q 60 65 130 55 T 260 32 T 370 12 T 400 7 L 400 90 L 0 90 Z" fill="url(#heroChartArea)" />
        {/* Animated line */}
        <path
          ref={pathRef}
          d="M 0 70 Q 60 65 130 55 T 260 32 T 370 12 T 400 7"
          fill="none" stroke="url(#heroChartLine)" strokeWidth="3.5" strokeLinecap="round" filter="url(#chartGlow)"
        />
        {/* Outer glowing pulsing circles */}
        <circle cx="370" cy="12" r="12" fill="rgba(16,185,129,0.15)" className="lp-chart-dot-glow" style={{ transformOrigin: "370px 12px" }} />
        <circle cx="370" cy="12" r="8" fill="none" stroke={T.emerald} strokeWidth="1" opacity="0.35" className="lp-chart-dot-glow" style={{ transformOrigin: "370px 12px" }} />
        {/* Pulse point dot */}
        <circle cx="370" cy="12" r="4.5" fill={T.emerald} stroke="#FFFFFF" strokeWidth="2.5" className="lp-chart-dot" style={{ transformOrigin: "370px 12px" }} />
        {/* Tooltip */}
        <rect x="328" y="0" width="74" height="22" rx="7" fill="rgba(16,185,129,0.9)" />
        <text x="365" y="15" textAnchor="middle" fill="#fff" fontSize="9" fontWeight="800" fontFamily="sans-serif">
          +11.2% / thn
        </text>
      </svg>
    </div>
  );
}

/*  AI Insight Bubble  */

function AIInsightBubble() {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "rgba(255, 255, 255, 0.85)",
        backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",
        borderRadius: 18,
        border: "1px solid rgba(99,102,241,0.15)",
        boxShadow: hovered ? "0 24px 50px rgba(99,102,241,0.12)" : "0 16px 40px rgba(15,23,42,0.06)",
        transform: hovered ? "scale(1.04) translateY(-6px)" : "scale(1) translateY(0)",
        transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
        padding: "16px 18px",
        maxWidth: 240,
        cursor: "default",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
        <div
          style={{
            width: 28, height: 28, borderRadius: 9,
            background: `linear-gradient(135deg, ${T.indigo}, ${T.violet})`,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >
          <Brain style={{ width: 14, height: 14, color: "#fff" }} />
        </div>
        <span style={{ fontSize: 12, fontWeight: 800, color: T.ink, fontFamily: FONT }}>AI Insight</span>
        <span className="live-pulse-dot" style={{ marginLeft: "auto", width: 7, height: 7, borderRadius: "50%", background: "#10B981", display: "inline-block" }} />
      </div>
      <p style={{ fontSize: 12, color: T.inkMuted, lineHeight: 1.6, fontFamily: FONT }}>
        &ldquo;Menambah investasi Rp500rb/bulan dapat mempercepat target pensiun 3 tahun.&rdquo;
      </p>
    </div>
  );
}

/*  Portfolio Mini Bubble  */

function PortfolioMini() {
  const [hovered, setHovered] = useState(false);
  const items = [
    { label: "Reksa Dana Saham", pct: 45, color: T.emerald },
    { label: "SBN / Obligasi", pct: 30, color: T.indigo },
    { label: "Emas & Komoditas", pct: 25, color: "#F59E0B" },
  ];

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "rgba(255, 255, 255, 0.85)",
        backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",
        borderRadius: 18,
        border: "1px solid rgba(16,185,129,0.15)",
        boxShadow: hovered ? "0 24px 50px rgba(16,185,129,0.10)" : "0 16px 40px rgba(15,23,42,0.06)",
        transform: hovered ? "scale(1.04) translateY(-6px)" : "scale(1) translateY(0)",
        transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
        padding: "16px 18px",
        minWidth: 210,
        cursor: "default",
      }}
    >
      <p style={{ fontSize: 11, fontWeight: 800, color: T.emerald, fontFamily: FONT, marginBottom: 12 }}>
        Alokasi Portofolio
      </p>
      {items.map((item) => (
        <div key={item.label} style={{ marginBottom: 8 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
            <span style={{ fontSize: 10, color: T.inkMuted, fontFamily: FONT }}>{item.label}</span>
            <span style={{ fontSize: 10, fontWeight: 800, color: item.color, fontFamily: FONT }}>{item.pct}%</span>
          </div>
          <div style={{ height: 4, background: "rgba(15,23,42,0.06)", borderRadius: 999, overflow: "hidden" }}>
            <div style={{ width: `${item.pct}%`, height: "100%", background: item.color, borderRadius: 999 }} />
          </div>
        </div>
      ))}
    </div>
  );
}

/*  Return Metric Bubble */

function ReturnBubble() {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "rgba(255, 255, 255, 0.85)",
        backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",
        borderRadius: 18,
        border: "1px solid rgba(245,158,11,0.20)",
        boxShadow: hovered ? "0 24px 50px rgba(245,158,11,0.10)" : "0 16px 40px rgba(15,23,42,0.06)",
        transform: hovered ? "scale(1.04) translateY(-6px)" : "scale(1) translateY(0)",
        transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
        padding: "16px 22px",
        cursor: "default",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <div
          style={{
            width: 42, height: 42, borderRadius: 12,
            background: "rgba(245,158,11,0.08)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >
          <TrendingUp style={{ width: 20, height: 20, color: "#F59E0B" }} />
        </div>
        <div>
          <p style={{ fontSize: 10, color: T.inkMuted48, fontFamily: FONT, marginBottom: 2 }}>Proyeksi Return</p>
          <p style={{ fontSize: 26, fontWeight: 800, color: T.ink, fontFamily: FONT, letterSpacing: "-0.03em", lineHeight: 1 }}>
            11.2%
          </p>
          <p style={{ fontSize: 10, color: "#F59E0B", fontFamily: FONT, marginTop: 2 }}>rata-rata per tahun ↗</p>
        </div>
      </div>
    </div>
  );
}

/*  AI Chat Bubble */

function AIChatBubble() {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "rgba(255, 255, 255, 0.85)",
        backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",
        borderRadius: 18,
        border: "1px solid rgba(15,23,42,0.08)",
        boxShadow: hovered ? "0 24px 50px rgba(15,23,42,0.10)" : "0 16px 40px rgba(15,23,42,0.06)",
        transform: hovered ? "scale(1.04) translateY(-6px)" : "scale(1) translateY(0)",
        transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
        padding: "16px 18px",
        maxWidth: 250,
        cursor: "default",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
        <div
          style={{
            width: 28, height: 28, borderRadius: "50%",
            background: `linear-gradient(135deg, ${T.emerald}, ${T.teal})`,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >
          <MessageCircle style={{ width: 14, height: 14, color: "#fff" }} />
        </div>
        <div>
          <p style={{ fontSize: 12, fontWeight: 800, color: T.ink, fontFamily: FONT }}>AI Advisor</p>
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <span className="live-pulse-dot" style={{ width: 5, height: 5, borderRadius: "50%", background: "#10B981", display: "inline-block" }} />
            <span style={{ fontSize: 9, color: "#10B981", fontFamily: FONT, fontWeight: 600 }}>Online</span>
          </div>
        </div>
      </div>
      <div style={{ background: "rgba(16,185,129,0.04)", borderRadius: 12, padding: "10px 14px", marginBottom: 10 }}>
        <p style={{ fontSize: 12, color: T.inkMuted, fontFamily: FONT, lineHeight: 1.5 }}>
          Dana daruratmu sudah cukup. Siap mulai investasi? 🚀
        </p>
      </div>
      {/* Typing indicator */}
      <div style={{ display: "flex", alignItems: "center", gap: 3, paddingLeft: 4 }}>
        <span className="typing-dot-1" style={{ width: 5, height: 5, borderRadius: "50%", background: T.inkMuted48, display: "inline-block" }} />
        <span className="typing-dot-2" style={{ width: 5, height: 5, borderRadius: "50%", background: T.inkMuted48, display: "inline-block" }} />
        <span className="typing-dot-3" style={{ width: 5, height: 5, borderRadius: "50%", background: T.inkMuted48, display: "inline-block" }} />
      </div>
    </div>
  );
}
