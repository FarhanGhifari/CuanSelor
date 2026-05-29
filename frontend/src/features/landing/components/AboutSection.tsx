import { TrendingUp, Shield, Brain, MessageCircle, Target, CheckCircle, Users, BarChart3 } from "lucide-react";
import { T, FONT } from "./tokens";

const PLATFORM_FEATURES = [
  { icon: Shield,        label: "Data Aktuaria Resmi",    sub: "Tabel Mortalitas Indonesia 2023" },
  { icon: Brain,         label: "Deep Learning Model",    sub: "TensorFlow · Prediksi inflasi & return" },
  { icon: MessageCircle, label: "LLM Financial Advisor",  sub: "Bahasa Indonesia · Kontekstual" },
  { icon: Target,        label: "Proyeksi What-If",        sub: "Simulasi real-time · 3 skenario" },
];

const QUICK_STATS = [
  { val: "100%",   label: "Gratis"   },
  { val: "< 5 mnt", label: "Setup"  },
  { val: "24/7",   label: "Tersedia" },
];

const PRINCIPLES = [
  { icon: Users,    title: "Aksesibel untuk semua",       desc: "Perencanaan keuangan tidak seharusnya berbayar. Semua fitur inti CuanSelor gratis tanpa paywall." },
  { icon: BarChart3,title: "Berbasis data, bukan asumsi", desc: "Setiap proyeksi didukung data aktuaria nyata - Tabel Mortalitas Penduduk Indonesia 2023." },
  { icon: Shield,   title: "Privasi adalah prioritas",    desc: "Data finansialmu adalah milikmu. Kami tidak pernah menjual atau menggunakannya untuk iklan." },
  { icon: Brain,    title: "Dirancang untuk non-expert",  desc: "Matematika finansial yang kompleks diterjemahkan menjadi langkah konkret yang bisa diikuti siapa saja." },
];

/** About / mission section on parchment background. */
export default function AboutSection() {
  return (
    <section className="py-[60px] md:py-[120px] px-6 md:px-[5%]" style={{ background: T.parchment }}>
      <div className="w-full max-w-[1400px] mx-auto">
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <p style={{ fontFamily: FONT, fontSize: 17, fontWeight: 600, letterSpacing: "-0.374px", color: T.blue, marginBottom: 12 }}>
            Tentang CuanSelor
          </p>
          <h2
            style={{
              fontSize: "clamp(40px, 5vw, 56px)",
              fontWeight: 600,
              letterSpacing: "-0.374px",
              lineHeight: 1.1,
              color: T.ink,
              maxWidth: 640,
              margin: "0 auto 16px",
            }}
          >
            Lebih dari sekadar kalkulator keuangan
          </h2>
          <p style={{ fontFamily: FONT, fontSize: 21, fontWeight: 300, lineHeight: 1.5, color: T.inkMuted, maxWidth: 560, margin: "0 auto" }}>
            CuanSelor lahir dari satu keyakinan - setiap anak muda Indonesia berhak mendapatkan panduan keuangan yang cerdas, berbasis data, dan personal.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
          {/* Platform card */}
          <div style={{ background: T.canvas, borderRadius: 12, padding: 32, border: `1px solid ${T.hairline}`, boxShadow: "0 0 0.5px rgba(0,0,0,0.14), 0 1px 1px rgba(0,0,0,0.24)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, paddingBottom: 20, borderBottom: `1px solid ${T.hairline}`, marginBottom: 20 }}>
              <div style={{ width: 40, height: 40, borderRadius: 11, background: "rgba(0,102,204,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <TrendingUp style={{ width: 20, height: 20, color: T.blue }} />
              </div>
              <div>
                <p style={{ fontFamily: FONT, fontSize: 14, fontWeight: 600, letterSpacing: "-0.224px", color: T.ink }}>CuanSelor Platform</p>
                <p style={{ fontFamily: FONT, fontSize: 12, color: T.inkMuted }}>AI-powered · Actuarial-grade</p>
              </div>
            </div>

            {PLATFORM_FEATURES.map(({ icon: Icon, label, sub }) => (
              <div key={label} style={{ display: "flex", alignItems: "center", gap: 14, padding: "10px 12px", borderRadius: 11, marginBottom: 4 }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: "rgba(0,102,204,0.08)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Icon style={{ width: 16, height: 16, color: T.blue }} />
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontFamily: FONT, fontSize: 14, fontWeight: 600, letterSpacing: "-0.224px", color: T.ink }}>{label}</p>
                  <p style={{ fontFamily: FONT, fontSize: 12, color: T.inkMuted }}>{sub}</p>
                </div>
                <CheckCircle style={{ width: 16, height: 16, color: T.blue, flexShrink: 0 }} />
              </div>
            ))}

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginTop: 20, paddingTop: 20, borderTop: `1px solid ${T.hairline}` }}>
              {QUICK_STATS.map((s) => (
                <div key={s.label} style={{ background: "rgba(0,102,204,0.05)", borderRadius: 11, padding: "10px 8px", textAlign: "center" }}>
                  <p style={{ fontFamily: FONT, fontSize: 14, fontWeight: 600, color: T.blue }}>{s.val}</p>
                  <p style={{ fontFamily: FONT, fontSize: 11, color: T.inkMuted }}>{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Principles */}
          <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
            {PRINCIPLES.map(({ icon: Icon, title, desc }) => (
              <div key={title} style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: "rgba(0,102,204,0.08)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}>
                  <Icon style={{ width: 16, height: 16, color: T.blue }} />
                </div>
                <div>
                  <p style={{ fontFamily: FONT, fontSize: 17, fontWeight: 600, letterSpacing: "-0.374px", color: T.ink, marginBottom: 4 }}>{title}</p>
                  <p style={{ fontFamily: FONT, fontSize: 14, fontWeight: 400, letterSpacing: "-0.224px", lineHeight: 1.43, color: T.inkMuted }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
