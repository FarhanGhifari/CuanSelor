"use client";

import {
  memo,
  useMemo,
  useRef,
  useState,
  useDeferredValue,
} from "react";

import {
  AnimatePresence,
  LazyMotion,
  domAnimation,
  m,
  MotionValue,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";

import {
  ArrowRight,
  BrainCircuit,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  TrendingUp,
} from "lucide-react";

import { T } from "./tokens";

/* =========================================================
   DESIGN TOKENS
========================================================= */

const TEXT = Object.freeze({
  hero:
    "text-[clamp(40px,6vw,72px)] leading-[0.95] tracking-[-2px] font-black text-slate-950",

  heading:
    "text-3xl md:text-4xl font-bold tracking-tight text-slate-900",

  headingSmall:
    "text-xl md:text-2xl font-bold tracking-tight text-slate-900",

  body:
    "text-base md:text-lg leading-relaxed text-slate-600",

  bodySmall:
    "text-sm md:text-[15px] leading-relaxed text-slate-500",

  caption:
    "text-xs font-semibold uppercase tracking-[0.2em] text-slate-500",
});

const MOTION = Object.freeze({
  // Solusi TypeScript: Casting sebagai Tuple statis dengan 4 element number
  ease: [0.22, 1, 0.36, 1] as [number, number, number, number],

  fadeUp: {
    hidden: {
      opacity: 0,
      y: 24,
    },

    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.65,
        ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
      },
    },
  },

  stagger: {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.12,
      },
    },
  },
});

/* =========================================================
   DATA
========================================================= */

const PORTFOLIO_ALLOCATION = [
  {
    label: "Saham",
    value: 45,
    color: "bg-indigo-500",
  },
  {
    label: "Obligasi",
    value: 35,
    color: "bg-emerald-500",
  },
  {
    label: "Reksa Dana",
    value: 20,
    color: "bg-cyan-500",
  },
];

/* =========================================================
   SVG GRAPH GENERATOR
========================================================= */

const createGraphPath = (width: number, height: number) => {
  return `
    M 0 ${height}
    C ${width * 0.18} ${height * 0.78},
      ${width * 0.4} ${height * 0.95},
      ${width * 0.62} ${height * 0.45}

    C ${width * 0.8} ${height * 0.1},
      ${width * 0.92} ${height * 0.08},
      ${width} ${height * 0.04}

    L ${width} ${height}
    Z
  `;
};

const createGraphLine = (width: number, height: number) => {
  return `
    M 0 ${height}

    C ${width * 0.18} ${height * 0.78},
      ${width * 0.4} ${height * 0.95},
      ${width * 0.62} ${height * 0.45}

    C ${width * 0.8} ${height * 0.1},
      ${width * 0.92} ${height * 0.08},
      ${width} ${height * 0.04}
  `;
};

/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function FeaturesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const backgroundY = useTransform(
    scrollYProgress,
    [0, 1],
    ["0%", "18%"]
  );

  const backgroundOpacity = useTransform(
    scrollYProgress,
    [0, 0.2, 0.8, 1],
    [0, 1, 1, 0]
  );

  return (
    <LazyMotion features={domAnimation}>
      <section
        ref={sectionRef}
        className="relative overflow-hidden bg-slate-50 py-28 md:py-36"
      >
        <BackgroundEffects
          shouldReduceMotion={shouldReduceMotion}
          y={backgroundY}
          opacity={backgroundOpacity}
        />

        <div className="relative z-10 mx-auto w-full max-w-7xl px-6">
          {/* HEADER */}

          <m.div
            variants={MOTION.fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-120px" }}
            className="mx-auto mb-20 max-w-4xl text-center"
          >
            <h2 className={TEXT.hero}>
              Semua yang Kamu Butuhkan
              <br />
              <span className="bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-600 bg-clip-text text-transparent">
                untuk Masa Depan Finansialmu.
              </span>
            </h2>

            <p className={`${TEXT.body} mx-auto mt-8 max-w-3xl`}>
              CuanSelor membantu kamu memahami kondisi finansial,
              mempersiapkan masa pensiun, dan membuat keputusan
              investasi yang lebih strategis menggunakan simulasi
              interaktif dan analisis berbasis AI.
            </p>
          </m.div>

          {/* GRID */}

          <m.div
            variants={MOTION.stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-1 gap-6 lg:grid-cols-3"
          >
            {/* 1. HERO CARD (col-span-3) */}
            <BentoCard className="lg:col-span-3">
              <div className="flex flex-col gap-10 lg:flex-row">
                <div className="flex flex-1 flex-col justify-center">
                  <div className="mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-indigo-700">
                    <Sparkles size={14} />
                    Hero Feature
                  </div>

                  <h3 className={`${TEXT.heading} mb-5`}>
                    AI Retirement Projection
                  </h3>

                  <p className={`${TEXT.body} mb-10 max-w-xl`}>
                    Sistem AI menganalisis pemasukan, pola investasi,
                    pengeluaran, dan tujuan hidupmu untuk memberikan
                    proyeksi kesiapan finansial jangka panjang secara
                    real-time.
                  </p>

                  <button
                    suppressHydrationWarning
                    className="group inline-flex w-fit items-center gap-3 rounded-2xl bg-slate-950 px-5 py-3 font-semibold text-white transition-all duration-300 hover:scale-[1.02] hover:bg-slate-800"
                  >
                    Lihat Proyeksi Masa Depan
                    <m.div
                      animate={
                        shouldReduceMotion
                          ? {}
                          : { x: [0, 4, 0] }
                      }
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                      }}
                    >
                      <ArrowRight size={18} />
                    </m.div>
                  </button>
                </div>

                <div className="relative flex flex-1 items-center justify-center overflow-hidden rounded-[28px] border border-slate-200 bg-gradient-to-br from-white to-slate-100 p-6">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.12),transparent_40%)]" />

                  <div className="relative z-10 w-full max-w-md rounded-3xl border border-slate-200 bg-white p-7 shadow-[0_20px_80px_rgba(15,23,42,0.08)]">
                    <div className="mb-6 flex items-start justify-between">
                      <div>
                        <p className={TEXT.caption}>
                          Retirement Goal
                        </p>
                        <h4 className="mt-2 text-4xl font-black tracking-tight text-slate-900">
                          Rp 4.2 M
                        </h4>
                      </div>

                      <div className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">
                        78% Ready
                      </div>
                    </div>

                    <div className="relative mt-8 h-[160px] w-full">
                      <div className="absolute inset-0 flex flex-col justify-between">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <div
                            key={i}
                            className="h-px w-full bg-slate-100"
                          />
                        ))}
                      </div>

                      <svg
                        viewBox="0 0 400 160"
                        preserveAspectRatio="none"
                        className="absolute inset-0 h-full w-full overflow-visible"
                      >
                        <defs>
                          <linearGradient
                            id="retirement-gradient"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="0%"
                              stopColor={T.emerald}
                            />
                            <stop
                              offset="100%"
                              stopColor="transparent"
                            />
                          </linearGradient>
                        </defs>

                        <m.path
                          d={createGraphPath(400, 160)}
                          fill="url(#retirement-gradient)"
                          initial={{ opacity: 0 }}
                          whileInView={{ opacity: 0.22 }}
                          transition={{ duration: 1 }}
                        />

                        <m.path
                          d={createGraphLine(400, 160)}
                          fill="none"
                          stroke={T.emerald}
                          strokeWidth={4}
                          strokeLinecap="round"
                          initial={{ pathLength: 0 }}
                          whileInView={{ pathLength: 1 }}
                          transition={{
                            duration: 1.6,
                            ease: "easeOut",
                          }}
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </BentoCard>

            {/* 2. AI ADVISOR (col-span-1) - DIKEMBALIKAN */}
            <AiAdvisorCard />

            {/* 3. PORTFOLIO (col-span-2) */}
            <BentoCard className="lg:col-span-2">
              <div className="flex h-full flex-col gap-8 md:flex-row md:items-center">
                <div className="flex-1">
                  <h3 className={`${TEXT.headingSmall} mb-4`}>
                    Smart Portfolio Allocation
                  </h3>

                  <p className={`${TEXT.bodySmall} mb-7 max-w-lg`}>
                    AI menyusun komposisi investasi ideal berdasarkan
                    profil risiko, usia, cashflow, dan target finansial
                    jangka panjangmu.
                  </p>

                  <div className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700">
                    <ShieldCheck
                      size={16}
                      className="text-indigo-500"
                    />
                    Risk Profile:
                    <span className="font-bold">Moderate</span>
                  </div>
                </div>

                <div className="w-full rounded-3xl border border-slate-200 bg-white p-6 md:w-[340px]">
                  {PORTFOLIO_ALLOCATION.map((item) => (
                    <PortfolioBar
                      key={item.label}
                      label={item.label}
                      value={item.value}
                      color={item.color}
                    />
                  ))}
                </div>
              </div>
            </BentoCard>

            {/* 4. HEALTH (col-span-1) */}
            <BentoCard className="lg:col-span-1">
              <div className="flex h-full flex-col">
                <h3 className={`${TEXT.headingSmall} mb-3`}>
                  Financial Health
                </h3>

                <p className={`${TEXT.bodySmall} mb-8`}>
                  Pantau stabilitas cashflow, emergency fund, dan
                  kesehatan finansial harianmu.
                </p>

                <div className="mb-8 flex flex-1 items-center justify-center">
                  <HealthScore />
                </div>

                <div className="mt-auto flex flex-col gap-3">
                  <HealthIndicator text="Cash Flow Stabil" />
                  <HealthIndicator text="Emergency Fund Aman" />
                  <HealthIndicator text="Debt Ratio Sehat" />
                </div>
              </div>
            </BentoCard>

            {/* 5. SIMULATION (col-span-2) */}
            <BentoCard className="lg:col-span-2">
              <SimulationInteractive />
            </BentoCard>

            {/* 6. TIMELINE (col-span-3) - DIKEMBALIKAN */}
            <TimelineCard />

          </m.div>
        </div>
      </section>
    </LazyMotion>
  );
}

/* =========================================================
   BACKGROUND
========================================================= */

const BackgroundEffects = memo(function BackgroundEffects({
  shouldReduceMotion,
  y,
  opacity,
}: {
  shouldReduceMotion: boolean | null;
  y: MotionValue<string>;
  opacity: MotionValue<number>;
}) {
  return (
    <>
      <m.div
        style={{ y, opacity }}
        className="pointer-events-none absolute inset-0"
      >
        <div
          className="absolute left-1/2 top-0 h-[500px] w-[700px] -translate-x-1/2 rounded-full blur-[90px]"
          style={{
            background: `radial-gradient(circle, ${T.emerald}25 0%, transparent 70%)`,
          }}
        />

        <div
          className="absolute bottom-[-10%] right-[-5%] h-[450px] w-[450px] rounded-full blur-[90px]"
          style={{
            background: `radial-gradient(circle, ${T.indigo}20 0%, transparent 70%)`,
          }}
        />
      </m.div>

      {!shouldReduceMotion && (
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <FloatingParticle className="left-[10%] top-[20%]" duration={9} color={T.emerald} />
          <FloatingParticle className="right-[12%] top-[40%]" duration={12} color={T.indigo} />
          <FloatingParticle className="bottom-[20%] left-[25%]" duration={15} color={T.emerald} />
        </div>
      )}
    </>
  );
});

/* =========================================================
   BENTO CARD
========================================================= */

const BentoCard = memo(function BentoCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <m.article
      variants={MOTION.fadeUp}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.25 }}
      className={`
        relative overflow-hidden rounded-[32px]
        border border-slate-200/70
        bg-white/90
        p-6 md:p-8
        shadow-[0_10px_40px_rgba(15,23,42,0.04)]
        backdrop-blur-xl
        ${className}
      `}
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent" />
      {children}
    </m.article>
  );
});

/* =========================================================
   NEW: AI ADVISOR CARD (Di-extract dengan memo)
========================================================= */

const AiAdvisorCard = memo(function AiAdvisorCard() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <BentoCard className="lg:col-span-1">
      <div className="flex h-full flex-col">
        <div className="mb-6 flex h-[180px] w-full items-center justify-center overflow-hidden rounded-[24px] border border-indigo-100/50 bg-gradient-to-br from-indigo-50 to-slate-50 relative">
          <m.div
            className="absolute h-32 w-32 rounded-full bg-indigo-500/10 blur-[40px]"
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 4, repeat: Infinity }}
          />
          <m.div
            className="relative z-10 max-w-[220px] rounded-xl border border-white bg-white/90 p-4 shadow-lg backdrop-blur-sm"
            animate={shouldReduceMotion ? {} : { y: [-5, 5, -5] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="mb-2 flex items-center gap-2">
              <BrainCircuit size={16} className="text-indigo-600" />
              <span className="text-xs font-bold text-slate-700">AI Insight</span>
              <div className="ml-auto h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
            </div>
            <p className="text-sm leading-snug text-slate-600">
              Menambah investasi Rp500rb/bulan dapat mempercepat target pensiun <span className="font-semibold text-emerald-600">3 tahun</span> lebih cepat.
            </p>
          </m.div>
        </div>
        <h3 className={`${TEXT.headingSmall} mb-2`}>AI Financial Advisor</h3>
        <p className={`${TEXT.bodySmall} mt-auto`}>
          Dapatkan rekomendasi finansial personal berdasarkan kondisi dan tujuan keuanganmu.
        </p>
      </div>
    </BentoCard>
  );
});

/* =========================================================
   PORTFOLIO BAR
========================================================= */

const PortfolioBar = memo(function PortfolioBar({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className="mb-5 last:mb-0">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm font-semibold text-slate-700">{label}</span>
        <span className="text-sm font-bold text-slate-900">{value}%</span>
      </div>
      <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
        <m.div
          initial={{ width: 0 }}
          whileInView={{ width: `${value}%` }}
          viewport={{ once: true }}
          transition={{
            duration: 1,
            ease: "circOut",
          }}
          className={`h-full rounded-full ${color}`}
        />
      </div>
    </div>
  );
});

/* =========================================================
   HEALTH SCORE
========================================================= */

const HealthScore = memo(function HealthScore() {
  const circumference = 251.2;
  const progress = circumference - circumference * 0.82;

  return (
    <div className="relative h-36 w-36">
      <svg className="-rotate-90" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="40" fill="none" stroke="#E2E8F0" strokeWidth="8" />
        <m.circle
          cx="50" cy="50" r="40" fill="none"
          stroke={T.emerald} strokeWidth="8" strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          whileInView={{ strokeDashoffset: progress }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-4xl font-black text-slate-900">82</span>
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          Excellent
        </span>
      </div>
    </div>
  );
});

/* =========================================================
   HEALTH INDICATOR
========================================================= */

const HealthIndicator = memo(function HealthIndicator({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
      <CheckCircle2 size={18} className="text-emerald-500" />
      <span className="text-sm font-medium text-slate-700">{text}</span>
    </div>
  );
});

/* =========================================================
   FLOATING PARTICLE
========================================================= */

const FloatingParticle = memo(function FloatingParticle({
  className,
  duration,
  color,
}: {
  className: string;
  duration: number;
  color: string;
}) {
  return (
    <m.div
      animate={{ y: [-12, 12, -12], opacity: [0.15, 0.4, 0.15] }}
      transition={{ duration, repeat: Infinity, ease: "linear" }}
      className={`absolute h-3 w-3 rounded-full ${className}`}
      style={{ background: color }}
    />
  );
});

/* =========================================================
   INTERACTIVE SIMULATION
========================================================= */

const SimulationInteractive = memo(function SimulationInteractive() {
  const [investment, setInvestment] = useState(2500000);
  const deferredInvestment = useDeferredValue(investment);

  const projectedAge = useMemo(() => {
    const baseAge = 60;
    const reduction = Math.floor((deferredInvestment - 1000000) / 500000);
    return Math.max(45, Math.min(baseAge, baseAge - reduction));
  }, [deferredInvestment]);

  const investmentText = useMemo(() => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(investment);
  }, [investment]);

  return (
    <div className="flex flex-col gap-10 lg:flex-row">
      <div className="flex flex-1 flex-col justify-center">
        <h3 className={`${TEXT.headingSmall} mb-4`}>
          Interactive Retirement Simulation
        </h3>
        <p className={`${TEXT.bodySmall} mb-10 max-w-xl`}>
          Simulasikan investasi bulanan dan lihat bagaimana
          keputusan finansial hari ini memengaruhi usia pensiunmu
          di masa depan.
        </p>

        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
          <div className="mb-5 flex items-center justify-between gap-4">
            <label htmlFor="investment-range" className="text-sm font-semibold text-slate-700">
              Investasi Bulanan
            </label>
            <div className="rounded-xl bg-indigo-100 px-3 py-2 text-sm font-bold text-indigo-700">
              {investmentText}
            </div>
          </div>
          <input
            id="investment-range"
            type="range"
            min={1000000}
            max={10000000}
            step={500000}
            value={investment}
            onChange={(e) => setInvestment(Number(e.target.value))}
            className="h-2 w-full cursor-pointer appearance-none rounded-full bg-slate-200 accent-indigo-600"
          />
        </div>
      </div>

      <div className="flex w-full flex-col justify-center rounded-[32px] bg-slate-950 p-8 text-white lg:w-[320px]">
        <p className="mb-2 text-sm font-medium text-slate-400">
          Prediksi Pensiun
        </p>
        <div className="mb-6 text-5xl font-black tracking-tight">
          {projectedAge}
          <span className="ml-2 text-xl text-slate-400">Tahun</span>
        </div>

        <AnimatePresence mode="wait">
          <m.div
            key={projectedAge}
            initial={{ y: 8, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -8, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="inline-flex w-fit items-center gap-2 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm font-semibold text-emerald-400"
          >
            <TrendingUp size={16} />
            {projectedAge < 60
              ? `${60 - projectedAge} tahun lebih cepat`
              : "Sesuai target standar"}
          </m.div>
        </AnimatePresence>
      </div>
    </div>
  );
});

/* =========================================================
   NEW: TIMELINE CARDS (Di-extract dengan memo)
========================================================= */

const TimelineCard = memo(function TimelineCard() {
  return (
    <BentoCard className="lg:col-span-3">
      <div className="mb-10 max-w-[600px]">
        <h3 className={`${TEXT.headingSmall} mb-2`}>Future Financial Timeline</h3>
        <p className={TEXT.bodySmall}>
          Visualisasikan milestone finansialmu dari hari ini hingga masa depan.
        </p>
      </div>

      <div className="relative pb-4 pt-6">
        {/* Desktop Horizontal */}
        <div className="relative hidden w-full md:block">
          <div className="absolute left-0 top-10 h-1 w-full rounded-full bg-slate-100" />
          <m.div
            className="absolute left-0 top-10 h-1 rounded-full bg-gradient-to-r from-emerald-500 to-indigo-500"
            initial={{ width: "0%" }}
            whileInView={{ width: "100%" }}
            transition={{ duration: 2, ease: "easeInOut" }}
            viewport={{ once: true }}
          />
          <div className="relative z-10 flex justify-between">
            <TimelinePoint year="2026" title="Dana Darurat Selesai" done delay={0.3} layout="horizontal" />
            <TimelinePoint year="2029" title="Portofolio Rp100 Juta" done delay={0.6} layout="horizontal" />
            <TimelinePoint year="2035" title="Passive Income Stabil" delay={0.9} layout="horizontal" />
            <TimelinePoint year="2045" title="Target Pensiun Tercapai" delay={1.2} layout="horizontal" />
          </div>
        </div>

        {/* Mobile Vertical */}
        <div className="relative block py-2 pl-8 md:hidden">
          <div className="absolute bottom-0 left-[11px] top-0 w-1 rounded-full bg-slate-100" />
          <m.div
            className="absolute left-[11px] top-0 w-1 rounded-full bg-gradient-to-b from-emerald-500 to-indigo-500"
            initial={{ height: "0%" }}
            whileInView={{ height: "100%" }}
            transition={{ duration: 2, ease: "easeInOut" }}
            viewport={{ once: true }}
          />
          <div className="relative z-10 flex flex-col gap-10">
            <TimelinePoint year="2026" title="Dana Darurat Selesai" done delay={0.3} layout="vertical" />
            <TimelinePoint year="2029" title="Portofolio Rp100 Juta" done delay={0.5} layout="vertical" />
            <TimelinePoint year="2035" title="Passive Income Stabil" delay={0.7} layout="vertical" />
            <TimelinePoint year="2045" title="Target Pensiun Tercapai" delay={0.9} layout="vertical" />
          </div>
        </div>
      </div>
    </BentoCard>
  );
});

const TimelinePoint = memo(function TimelinePoint({
  year,
  title,
  done,
  delay,
  layout = "horizontal",
}: {
  year: string;
  title: string;
  done?: boolean;
  delay: number;
  layout?: "horizontal" | "vertical";
}) {
  const isVertical = layout === "vertical";

  return (
    <div className={isVertical ? "relative flex items-start gap-5" : "relative flex w-32 flex-col items-center"}>
      <m.div
        initial={{ scale: 0 }}
        whileInView={{ scale: 1 }}
        transition={{ delay, type: "spring" }}
        viewport={{ once: true }}
        className={`z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-4 border-white shadow-sm ${done ? "bg-emerald-500" : "bg-indigo-500"} ${!isVertical ? "mb-5" : ""}`}
      >
        {done && <div className="absolute h-full w-full animate-ping rounded-full bg-emerald-500 opacity-30" />}
      </m.div>
      <div className={isVertical ? "" : "text-center"}>
        <div className="mb-1 text-sm font-bold text-slate-800">{year}</div>
        <div className="text-[13px] leading-tight text-slate-500">{title}</div>
      </div>
    </div>
  );
});
