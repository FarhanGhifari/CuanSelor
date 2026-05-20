import React from "react";
import { ShieldCheck, Cpu, Calculator, TrendingUp, Lock, RefreshCw } from "lucide-react";
import { T, FONT } from "./tokens";

export default function TrustSection() {
  const trustFeatures = [
    {
      icon: <Cpu size={24} color={T.indigo} />,
      title: "AI & Machine Learning",
      desc: "Analisis personal yang cerdas dan beradaptasi dengan profil risiko serta kondisi keuangan Anda yang sebenarnya.",
      color: T.indigo,
    },
    {
      icon: <Calculator size={24} color={T.teal} />,
      title: "Actuarial Projection",
      desc: "Menggunakan pemodelan aktuaria standar industri asuransi untuk memastikan proyeksi masa pensiun yang sangat akurat.",
      color: T.teal,
    },
    {
      icon: <TrendingUp size={24} color={T.emerald} />,
      title: "Inflation Analysis",
      desc: "Sistem otomatis memperhitungkan gerusan inflasi terhadap nilai uang di masa depan secara real-time.",
      color: T.emerald,
    },
    {
      icon: <ShieldCheck size={24} color="#F59E0B" />,
      title: "Financial Risk Modeling",
      desc: "Mitigasi dan simulasi risiko terukur untuk setiap instrumen investasi yang direkomendasikan.",
      color: "#F59E0B",
    },
    {
      icon: <Lock size={24} color={T.emerald} />,
      title: "Secure Authentication",
      desc: "Keamanan privasi tingkat tinggi dengan enkripsi end-to-end standar perbankan. Data Anda tidak pernah dijual.",
      color: T.emerald,
    },
    {
      icon: <RefreshCw size={24} color={T.indigo} />,
      title: "Real-time Projection",
      desc: "Perhitungan dan analisis grafik yang selalu sinkron dan up-to-date setiap kali terjadi perubahan data.",
      color: T.indigo,
    },
  ];

  return (
    <section className="relative py-[100px] px-6 lg:px-[10%] overflow-hidden" style={{ background: "#FFFFFF" }}>
      {/* Background soft mesh glow for trust section */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: 600,
          height: 600,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(16,185,129,0.03) 0%, transparent 60%)",
          top: "-10%",
          left: "-10%",
          filter: "blur(60px)",
        }}
      />
      <div
        className="absolute pointer-events-none"
        style={{
          width: 500,
          height: 500,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(99,102,241,0.03) 0%, transparent 60%)",
          bottom: "-10%",
          right: "-10%",
          filter: "blur(60px)",
        }}
      />

      <div className="relative z-10 max-w-[1200px] mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div
            className="inline-flex items-center gap-2 mb-6"
            style={{
              background: "rgba(16, 185, 129, 0.08)",
              border: "1px solid rgba(16, 185, 129, 0.15)",
              borderRadius: 50,
              padding: "6px 14px",
            }}
          >
            <ShieldCheck style={{ width: 14, height: 14, color: T.emerald }} />
            <span style={{ fontSize: 11, fontWeight: 700, color: T.emerald, fontFamily: FONT, letterSpacing: "0.05em" }}>
              TEKNOLOGI & KEAMANAN
            </span>
          </div>
          <h2
            style={{
              fontFamily: FONT,
              fontSize: "clamp(32px, 4vw, 48px)",
              fontWeight: 800,
              letterSpacing: "-0.03em",
              lineHeight: 1.15,
              color: T.ink,
              maxWidth: 800,
              margin: "0 auto",
            }}
          >
            Infrastruktur Finansial Kelas Dunia.
          </h2>
        </div>

        {/* Icon Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
          {trustFeatures.map((feat, idx) => (
            <div key={idx} className="flex flex-col items-start group">
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 16,
                  background: `${feat.color}10`,
                  border: `1px solid ${feat.color}20`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 20,
                  transition: "all 0.3s ease",
                }}
                className="group-hover:scale-110 group-hover:shadow-lg"
              >
                {feat.icon}
              </div>
              <h3
                style={{
                  fontFamily: FONT,
                  fontSize: 18,
                  fontWeight: 700,
                  color: T.ink,
                  marginBottom: 10,
                  letterSpacing: "-0.01em",
                }}
              >
                {feat.title}
              </h3>
              <p
                style={{
                  fontFamily: FONT,
                  fontSize: 15,
                  fontWeight: 400,
                  lineHeight: 1.6,
                  color: T.inkMuted,
                }}
              >
                {feat.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
