import React from "react";
import { TrendingDown, ShoppingBag, Clock, HeartPulse, BrainCircuit } from "lucide-react";
import { T, FONT } from "./tokens";

export default function ProblemSection() {
  return (
    <section className="py-[100px] px-6 lg:px-[10%]" style={{ background: T.bgBase }}>
      <div className="max-w-[1200px] mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
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
            Banyak Gen Z kesulitan merencanakan masa depan finansial mereka.
          </h2>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1: Inflation (Large/Span 2) */}
          <div className="md:col-span-2 lg:col-span-2 relative overflow-hidden group p-8" style={cardStyle}>
            <div style={iconBoxStyle("#EF4444")}>
              <TrendingDown style={{ color: "#EF4444", width: 24, height: 24 }} />
            </div>
            <h3 style={titleStyle}>Ancaman Inflasi Siluman</h3>
            <p style={descStyle}>
              Tabungan Anda kehilangan nilainya setiap hari. Tanpa strategi investasi yang mengalahkan tingkat inflasi tahunan, masa depan pensiun Anda perlahan-lahan tergerus.
            </p>
            {/* Background graphic */}
            <svg className="absolute bottom-0 right-0 opacity-10 transition-transform duration-500 group-hover:scale-110" width="200" height="150" viewBox="0 0 200 150">
              <path d="M0,150 L0,80 Q50,90 100,50 T200,20 L200,150 Z" fill="#EF4444" />
            </svg>
          </div>

          {/* Card 2: FOMO Investing */}
          <div className="relative overflow-hidden group p-8" style={cardStyle}>
            <div style={iconBoxStyle("#8B5CF6")}>
              <BrainCircuit style={{ color: "#8B5CF6", width: 24, height: 24 }} />
            </div>
            <h3 style={titleStyle}>Jebakan FOMO</h3>
            <p style={descStyle}>
              Terlalu sering ikut-ikutan tren investasi tanpa dasar analisis pribadi atau perencanaan jangka panjang yang terstruktur.
            </p>
          </div>

          {/* Card 3: Konsumtif */}
          <div className="relative overflow-hidden group p-8" style={cardStyle}>
            <div style={iconBoxStyle("#F59E0B")}>
              <ShoppingBag style={{ color: "#F59E0B", width: 24, height: 24 }} />
            </div>
            <h3 style={titleStyle}>Gaya Hidup Konsumtif</h3>
            <p style={descStyle}>
              Godaan *paylater* dan tren gaya hidup yang membuat pendapatan habis tak bersisa, merusak alokasi tabungan pensiun.
            </p>
          </div>

          {/* Card 4: Lack of retirement planning */}
          <div className="relative overflow-hidden group p-8" style={cardStyle}>
            <div style={iconBoxStyle(T.teal)}>
              <Clock style={{ color: T.teal, width: 24, height: 24 }} />
            </div>
            <h3 style={titleStyle}>Tanpa Rencana Pensiun</h3>
            <p style={descStyle}>
              Fokus hanya pada hari ini tanpa memiliki simulasi yang jelas tentang berapa biaya hidup yang dibutuhkan saat usia pensiun tiba.
            </p>
          </div>

          {/* Card 5: Financial Anxiety */}
          <div className="relative overflow-hidden group p-8" style={cardStyle}>
            <div style={iconBoxStyle("#F43F5E")}>
              <HeartPulse style={{ color: "#F43F5E", width: 24, height: 24 }} />
            </div>
            <h3 style={titleStyle}>Financial Anxiety</h3>
            <p style={descStyle}>
              Merasa stres dan cemas tentang masa depan keuangan karena data yang berserakan dan kebingungan harus mulai dari mana.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

const cardStyle: React.CSSProperties = {
  background: "#FFFFFF",
  borderRadius: 24,
  border: "1px solid rgba(15, 23, 42, 0.05)",
  boxShadow: "0 10px 40px rgba(15, 23, 42, 0.03)",
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-start",
};

const iconBoxStyle = (color: string): React.CSSProperties => ({
  width: 48,
  height: 48,
  borderRadius: 14,
  background: `${color}15`,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  marginBottom: 20,
});

const titleStyle: React.CSSProperties = {
  fontFamily: FONT,
  fontSize: 20,
  fontWeight: 700,
  color: T.ink,
  marginBottom: 10,
  letterSpacing: "-0.01em",
};

const descStyle: React.CSSProperties = {
  fontFamily: FONT,
  fontSize: 15,
  fontWeight: 400,
  lineHeight: 1.6,
  color: T.inkMuted,
  position: "relative",
  zIndex: 10,
};
