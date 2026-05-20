"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { T, FONT } from "./tokens";
import { Sparkles, BrainCircuit, LineChart, Activity, SlidersHorizontal, ArrowRight, TrendingUp, DollarSign, Wallet, ShieldCheck, CheckCircle2 } from "lucide-react";

/** Bento Grid Features Section */
export default function FeaturesSection() {
  return (
    <section className="relative py-[80px] md:py-[140px] px-6 md:px-[5%] overflow-hidden" style={{ background: T.bgBase }}>
      {/* Background Ambient Effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] rounded-full opacity-20 blur-[120px] pointer-events-none" style={{ background: `radial-gradient(circle, ${T.emerald} 0%, transparent 70%)` }} />
      <div className="absolute bottom-0 right-[-20%] w-[600px] h-[600px] rounded-full opacity-15 blur-[100px] pointer-events-none" style={{ background: `radial-gradient(circle, ${T.indigo} 0%, transparent 70%)` }} />
      
      {/* Floating Particles (CSS only via pseudo elements or simple divs) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div animate={{ y: [-20, 20, -20], x: [-10, 10, -10], opacity: [0.3, 0.6, 0.3] }} transition={{ duration: 8, repeat: Infinity, ease: "linear" }} className="absolute top-[20%] left-[10%] w-2 h-2 rounded-full" style={{ background: T.emerald }} />
        <motion.div animate={{ y: [20, -20, 20], x: [10, -10, 10], opacity: [0.2, 0.5, 0.2] }} transition={{ duration: 10, repeat: Infinity, ease: "linear" }} className="absolute bottom-[30%] right-[15%] w-3 h-3 rounded-full" style={{ background: T.indigo }} />
        <motion.div animate={{ y: [-30, 30, -30], opacity: [0.1, 0.4, 0.1] }} transition={{ duration: 12, repeat: Infinity, ease: "linear" }} className="absolute top-[60%] left-[5%] w-1.5 h-1.5 rounded-full" style={{ background: T.teal }} />
      </div>

      <div className="relative z-10 w-full max-w-[1200px] mx-auto">
        
        {/* Header */}
        <div className="text-center mb-[60px] md:mb-[80px]">
          <h2
            style={{
              fontSize: "clamp(36px, 5vw, 56px)",
              fontWeight: 700,
              letterSpacing: "-1.5px",
              lineHeight: 1.1,
              color: T.ink,
              marginBottom: 16,
            }}
          >
            Semua yang Kamu Butuhkan <br className="hidden sm:block" />
            <span style={{ 
              background: `linear-gradient(135deg, ${T.emerald}, ${T.indigo})`, 
              WebkitBackgroundClip: "text", 
              WebkitTextFillColor: "transparent" 
            }}>
              untuk Masa Depan Finansialmu.
            </span>
          </h2>
          <p className="max-w-[700px] mx-auto" style={{ fontFamily: FONT, fontSize: 20, fontWeight: 400, lineHeight: 1.5, color: T.inkMuted }}>
            Dari proyeksi pensiun berbasis AI hingga simulasi investasi interaktif, CuanSelor membantu kamu mengambil keputusan finansial dengan lebih percaya diri.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 auto-rows-min">
          
          {/* Feature 1: AI Retirement Projection (col-span-3) */}
          <BentoCard colSpan="lg:col-span-3" className="group">
            <div className="flex flex-col lg:flex-row gap-8 h-full min-h-[400px]">
              <div className="flex-1 flex flex-col justify-center relative z-10">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-600 mb-6 w-fit border border-emerald-500/20">
                  <Sparkles size={16} />
                  <span className="text-sm font-semibold tracking-wide">HERO FEATURE</span>
                </div>
                <h3 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4 tracking-tight">AI Retirement Projection</h3>
                <p className="text-lg text-slate-600 mb-8 max-w-[500px] leading-relaxed">
                  AI menganalisis kondisi finansialmu dan memproyeksikan kesiapan masa pensiun berdasarkan pemasukan, investasi, dan tujuan hidupmu.
                </p>
                <div className="mt-auto">
                  <button className="flex items-center gap-2 text-indigo-600 font-semibold group/btn">
                    Lihat masa depan finansialmu <ArrowRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
              
              <div className="flex-1 relative min-h-[300px] lg:min-h-full bg-slate-50/50 rounded-2xl overflow-hidden border border-slate-100 flex items-center justify-center p-6">
                {/* Decorative Blur */}
                <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/5 to-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                
                {/* Visual Representation */}
                <div className="w-full max-w-[400px] relative z-10">
                  <div className="bg-white rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-6 relative overflow-hidden">
                    <div className="flex justify-between items-end mb-8">
                      <div>
                        <p className="text-sm font-semibold text-slate-500 mb-1">Target Pensiun 2045</p>
                        <div className="flex items-center gap-3">
                          <h4 className="text-3xl font-bold text-slate-900">Rp 4.2 M</h4>
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-emerald-100 text-emerald-700">
                            78% Tercapai
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Animated Graph */}
                    <div className="relative h-[140px] w-full mt-4">
                      {/* Grid Lines */}
                      <div className="absolute inset-0 flex flex-col justify-between">
                        {[0,1,2,3].map(i => <div key={i} className="w-full h-px bg-slate-100" />)}
                      </div>
                      
                      <svg className="absolute inset-0 w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 400 140">
                        {/* Shadow/Fill */}
                        <motion.path
                          d="M 0 140 C 100 120, 200 130, 300 60 C 350 20, 400 10, 400 10 L 400 140 Z"
                          fill="url(#emerald-gradient)"
                          initial={{ opacity: 0 }}
                          whileInView={{ opacity: 0.2 }}
                          transition={{ duration: 1, delay: 0.5 }}
                        />
                        {/* Glow Line */}
                        <motion.path
                          d="M 0 140 C 100 120, 200 130, 300 60 C 350 20, 400 10, 400 10"
                          fill="none"
                          stroke={T.emerald}
                          strokeWidth="3"
                          strokeLinecap="round"
                          className="drop-shadow-[0_4px_12px_rgba(16,185,129,0.5)]"
                          initial={{ pathLength: 0 }}
                          whileInView={{ pathLength: 1 }}
                          transition={{ duration: 1.5, ease: "easeOut" }}
                        />
                        <defs>
                          <linearGradient id="emerald-gradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={T.emerald} />
                            <stop offset="100%" stopColor="transparent" />
                          </linearGradient>
                        </defs>
                      </svg>
                      
                      {/* Floating pulse point */}
                      <motion.div 
                        className="absolute w-3 h-3 rounded-full bg-white border-2 border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.8)]"
                        style={{ top: "10px", right: "0px" }}
                        animate={{ scale: [1, 1.4, 1], boxShadow: ["0 0 15px rgba(16,185,129,0.8)", "0 0 25px rgba(16,185,129,1)", "0 0 15px rgba(16,185,129,0.8)"] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </BentoCard>

          {/* Feature 2: AI Advisor (col-span-1) */}
          <BentoCard colSpan="lg:col-span-1" className="group">
            <div className="h-full flex flex-col">
              <div className="mb-6 h-[180px] w-full bg-gradient-to-br from-indigo-50 to-slate-50 rounded-xl border border-indigo-100/50 flex items-center justify-center relative overflow-hidden">
                <motion.div 
                  className="absolute w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl"
                  animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
                  transition={{ duration: 4, repeat: Infinity }}
                />
                
                <motion.div 
                  className="relative z-10 bg-white/90 backdrop-blur-sm p-4 rounded-xl shadow-lg border border-white max-w-[220px]"
                  animate={{ y: [-5, 5, -5] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <BrainCircuit size={16} className="text-indigo-600" />
                    <span className="text-xs font-bold text-slate-700">AI Insight</span>
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 ml-auto animate-pulse" />
                  </div>
                  <p className="text-sm text-slate-600 leading-snug">
                    Menambah investasi Rp500rb/bulan dapat mempercepat target pensiun <span className="text-emerald-600 font-semibold">3 tahun</span> lebih cepat.
                  </p>
                </motion.div>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">AI Financial Advisor</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Dapatkan rekomendasi finansial personal berdasarkan kondisi dan tujuan keuanganmu.
              </p>
            </div>
          </BentoCard>

          {/* Feature 3: Smart Portfolio (col-span-2) */}
          <BentoCard colSpan="lg:col-span-2" className="group">
            <div className="flex flex-col md:flex-row gap-6 h-full items-center">
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-slate-900 mb-3">Smart Portfolio Allocation</h3>
                <p className="text-slate-600 mb-6 leading-relaxed">
                  AI membantu menyusun alokasi investasi sesuai profil risiko dan target finansialmu.
                </p>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 text-slate-700 text-sm font-medium">
                  <ShieldCheck size={16} className="text-indigo-500" />
                  Risk Profile: <span className="font-bold">Moderate</span>
                </div>
              </div>
              
              <div className="w-full md:w-[320px] bg-slate-50 border border-slate-100 rounded-xl p-5 shadow-inner">
                <PortfolioBar label="Saham" target={45} color="bg-indigo-500" />
                <PortfolioBar label="Obligasi" target={35} color="bg-emerald-500" />
                <PortfolioBar label="Reksa Dana" target={15} color="bg-cyan-500" />
                <PortfolioBar label="Emas" target={5} color="bg-amber-500" />
              </div>
            </div>
          </BentoCard>

          {/* Feature 4: Financial Health Score (col-span-1) */}
          <BentoCard colSpan="lg:col-span-1" className="group">
            <div className="h-full flex flex-col">
              <div className="flex-1 flex items-center justify-center py-6">
                <div className="relative w-36 h-36">
                  {/* Outer glowing circle */}
                  <div className="absolute inset-0 rounded-full bg-emerald-500/20 blur-xl group-hover:bg-emerald-500/30 transition-colors" />
                  <svg className="w-full h-full -rotate-90 relative z-10" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" fill="none" stroke="#F1F5F9" strokeWidth="8" />
                    <motion.circle 
                      cx="50" cy="50" r="40" fill="none" 
                      stroke="url(#health-grad)" 
                      strokeWidth="8" 
                      strokeLinecap="round"
                      strokeDasharray="251.2"
                      initial={{ strokeDashoffset: 251.2 }}
                      whileInView={{ strokeDashoffset: 251.2 - (251.2 * 0.82) }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                    />
                    <defs>
                      <linearGradient id="health-grad" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor={T.emerald} />
                        <stop offset="100%" stopColor={T.teal} />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
                    <span className="text-4xl font-bold text-slate-900">82</span>
                    <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">/ 100</span>
                  </div>
                </div>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2 mt-4">Financial Health Score</h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                Pantau kesehatan finansialmu secara menyeluruh dengan analisis berbasis AI.
              </p>
              
              <div className="flex flex-col gap-2 mt-auto">
                <HealthIndicator text="Cash Flow Stabil" />
                <HealthIndicator text="Emergency Fund Aman" />
              </div>
            </div>
          </BentoCard>

          {/* Feature 5: Scenario Simulation (col-span-2) */}
          <BentoCard colSpan="lg:col-span-2" className="group">
             <SimulationInteractive />
          </BentoCard>

          {/* Feature 6: Future Timeline (col-span-3) */}
          <BentoCard colSpan="lg:col-span-3" className="group">
            <div className="mb-8 max-w-[600px]">
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Future Financial Timeline</h3>
              <p className="text-slate-600 leading-relaxed">
                Visualisasikan milestone finansialmu dari hari ini hingga masa depan.
              </p>
            </div>
            
            <div className="relative pt-6 pb-2 overflow-x-auto hide-scrollbar">
              <div className="min-w-[700px]">
                {/* Timeline Line */}
                <div className="absolute top-10 left-0 w-full h-1 bg-slate-100 rounded-full" />
                <motion.div 
                  className="absolute top-10 left-0 h-1 bg-gradient-to-r from-emerald-500 to-indigo-500 rounded-full"
                  initial={{ width: "0%" }}
                  whileInView={{ width: "100%" }}
                  transition={{ duration: 2, ease: "easeInOut" }}
                />
                
                <div className="relative z-10 flex justify-between">
                  <TimelinePoint year="2026" title="Dana Darurat Selesai" done delay={0.5} />
                  <TimelinePoint year="2029" title="Portofolio Rp100 Juta" done delay={1} />
                  <TimelinePoint year="2035" title="Passive Income Stabil" delay={1.5} />
                  <TimelinePoint year="2045" title="Target Pensiun Tercapai" delay={2} />
                </div>
              </div>
            </div>
          </BentoCard>

        </div>

        {/* Mini Emotional Statement */}
        <div className="mt-[80px] text-center">
          <p className="text-xl md:text-2xl font-medium text-slate-500 italic max-w-[600px] mx-auto leading-relaxed">
            "Perencanaan finansial bukan tentang menjadi kaya. Tapi tentang memiliki masa depan yang aman."
          </p>
        </div>
      </div>
    </section>
  );
}

// ── Sub-components ──────────────────────────────────────────────────────────

function BentoCard({ children, className = "", colSpan = "" }: { children: React.ReactNode, className?: string, colSpan?: string }) {
  return (
    <motion.div 
      whileHover={{ y: -4, boxShadow: "0 20px 40px rgba(15,23,42,0.08), 0 0 0 1px rgba(15,23,42,0.04)" }}
      transition={{ duration: 0.3 }}
      className={`bg-white/80 backdrop-blur-md rounded-3xl p-6 md:p-8 border border-slate-200/60 shadow-[0_4px_20px_rgba(15,23,42,0.03)] ${colSpan} ${className} relative overflow-hidden`}
    >
      {children}
    </motion.div>
  );
}

function PortfolioBar({ label, target, color }: { label: string, target: number, color: string }) {
  return (
    <div className="mb-3 last:mb-0">
      <div className="flex justify-between text-xs font-semibold text-slate-600 mb-1.5">
        <span>{label}</span>
        <span>{target}%</span>
      </div>
      <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
        <motion.div 
          className={`h-full ${color}`}
          initial={{ width: "0%" }}
          whileInView={{ width: `${target}%` }}
          transition={{ duration: 1, delay: 0.2 }}
        />
      </div>
    </div>
  );
}

function HealthIndicator({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-2 text-sm text-slate-600 bg-slate-50 py-1.5 px-3 rounded-lg border border-slate-100">
      <CheckCircle2 size={14} className="text-emerald-500" />
      <span className="font-medium">{text}</span>
    </div>
  );
}

function TimelinePoint({ year, title, done, delay }: { year: string, title: string, done?: boolean, delay: number }) {
  return (
    <div className="flex flex-col items-center w-32 relative">
      <motion.div 
        initial={{ scale: 0 }}
        whileInView={{ scale: 1 }}
        transition={{ delay, type: "spring" }}
        className={`w-6 h-6 rounded-full border-4 border-white shadow-md z-10 mb-4 flex items-center justify-center ${done ? "bg-emerald-500" : "bg-indigo-500"}`}
      >
        {done && <motion.div className="w-full h-full rounded-full bg-emerald-500 animate-ping opacity-30 absolute" />}
      </motion.div>
      <div className="text-center">
        <div className="text-sm font-bold text-slate-800 mb-1">{year}</div>
        <div className="text-xs text-slate-500 leading-tight">{title}</div>
      </div>
    </div>
  );
}

// Interactive Simulation Card State
function SimulationInteractive() {
  const [investment, setInvestment] = useState(2500000);
  
  // Calculate fake projection
  const baseAge = 60;
  const reduction = Math.floor((investment - 1000000) / 500000); // 1 year less per 500k over 1M
  const projectedAge = Math.max(45, Math.min(baseAge, baseAge - reduction));
  
  return (
    <div className="flex flex-col md:flex-row gap-8 h-full">
      <div className="flex-1 flex flex-col justify-center">
        <h3 className="text-2xl font-bold text-slate-900 mb-3">Scenario Simulation</h3>
        <p className="text-slate-600 mb-8 leading-relaxed">
          Simulasikan berbagai keputusan finansial sebelum mengambil langkah nyata.
        </p>
        
        <div className="space-y-6">
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-semibold text-slate-700">Investasi Bulanan</span>
              <span className="text-sm font-bold text-indigo-600">
                Rp {(investment / 1000000).toFixed(1)} Juta
              </span>
            </div>
            <input 
              type="range" 
              min="1000000" 
              max="10000000" 
              step="500000"
              value={investment}
              onChange={(e) => setInvestment(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600 hover:accent-indigo-500 transition-all"
            />
          </div>
        </div>
      </div>
      
      <div className="w-full md:w-[280px] bg-slate-900 rounded-2xl p-6 text-white relative overflow-hidden flex flex-col justify-center shadow-xl">
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 rounded-full blur-2xl pointer-events-none" />
        
        <div className="relative z-10">
          <p className="text-slate-400 text-sm mb-1">Target Pensiun Tercapai</p>
          <div className="text-4xl font-bold text-white mb-4">
            Usia {projectedAge}
          </div>
          
          <AnimatePresence mode="wait">
            <motion.div 
              key={projectedAge}
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-500/20 text-emerald-400 text-sm font-semibold border border-emerald-500/30"
            >
              <TrendingUp size={16} />
              {projectedAge < 60 ? `${60 - projectedAge} tahun lebih cepat!` : "Sesuai target standar"}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
