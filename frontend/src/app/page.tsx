"use client";

import Link from "next/link";
import { useState } from "react";
import {
  TrendingUp, Brain, Target, Shield, Zap, Users,
  CheckCircle, XCircle, ChevronDown, ChevronUp,
  MessageCircle, BarChart3, Wallet,
} from "lucide-react";
import { ROUTES } from "@/lib/constants/routes";
import {
  STATS,
  HOW_IT_WORKS,
  FEATURES,
  COMPARISON,
  TESTIMONIALS,
  FAQS,
} from "@/lib/constants/landing-page";

// ── FAQ Item component ─────────────────────────────────────────
function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-border/40 last:border-0">
      <button
        onClick={() => setOpen((p) => !p)}
        className="w-full flex items-center justify-between py-5 text-left gap-4 group"
      >
        <span className="text-base font-medium text-foreground group-hover:text-primary transition-colors">
          {q}
        </span>
        {open
          ? <ChevronUp className="w-5 h-5 text-primary shrink-0" />
          : <ChevronDown className="w-5 h-5 text-muted-foreground shrink-0" />
        }
      </button>
      {open && (
        <p className="pb-5 text-muted-foreground leading-relaxed text-sm">{a}</p>
      )}
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────
export default function HomePage() {
  return (
    <>
      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="min-h-screen flex items-center pt-20 px-8 lg:px-12">
        <div className="max-w-screen-2xl mx-auto w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">

            {/* Left */}
            <div>
              <div className="inline-block px-4 py-2 bg-primary/10 rounded-full text-primary font-medium text-sm mb-6">
                AI-Powered Financial Advisor for Gen Z 🇮🇩
              </div>
              <h1 className="text-5xl lg:text-7xl font-bold text-foreground mb-6 leading-tight">
                Stop guessing your financial future.
              </h1>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                CuanSelor memberikan proyeksi pensiun personal, portofolio investasi sesuai
                risiko, dan AI advisor — semuanya gratis. Untuk Gen Z yang ingin{" "}
                <span className="text-foreground font-medium">financial freedom</span> bukan
                sekadar impian.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href={ROUTES.REGISTER}
                  className="px-8 py-4 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 flex items-center gap-2 font-medium"
                >
                  Mulai Gratis
                  <TrendingUp className="w-5 h-5" />
                </Link>
                <Link
                  href={ROUTES.PROJECTION}
                  className="px-8 py-4 bg-background text-foreground border border-border rounded-xl hover:bg-muted transition-all shadow-sm font-medium"
                >
                  Coba Simulasi →
                </Link>
              </div>
              {/* Social proof mini */}
              <div className="flex items-center gap-3 mt-8">
                <div className="flex -space-x-2">
                  {["AR", "SR", "BW", "DP"].map((init) => (
                    <div
                      key={init}
                      className="w-8 h-8 rounded-full bg-primary/20 border-2 border-background flex items-center justify-center text-xs font-medium text-primary"
                    >
                      {init}
                    </div>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">
                  <span className="text-foreground font-medium">50.000+</span> pengguna sudah merencanakan pensiunnya
                </p>
              </div>
            </div>

            {/* Dashboard Preview */}
            <div className="relative group transition-all duration-500 hover:scale-[1.03] hover:-rotate-1">
              <div className="absolute inset-0 bg-primary/10 rounded-3xl blur-3xl opacity-50 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative bg-card rounded-2xl shadow-2xl p-8 border border-border transition-all duration-500 group-hover:shadow-primary/20">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-3 h-3 rounded-full bg-destructive" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                </div>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-primary rounded-xl p-4 text-primary-foreground shadow-sm transition-transform duration-500 group-hover:scale-[1.02]">
                      <div className="text-xs opacity-80 mb-1">Total Aset</div>
                      <div className="text-xl font-semibold">Rp 24,58 jt</div>
                      <div className="text-xs opacity-70 mt-1">+12.5% bulan ini</div>
                    </div>
                    <div className="bg-[#56A8F9] rounded-xl p-4 text-white shadow-sm transition-transform duration-500 group-hover:scale-[1.02]">
                      <div className="text-xs text-white/80 mb-1">Tabungan</div>
                      <div className="text-xl font-semibold">Rp 8,24 jt</div>
                      <div className="text-xs text-white/70 mt-1">+8.3% bulan ini</div>
                    </div>
                  </div>
                  <div className="bg-muted/30 rounded-xl p-4 border border-border/50 transition-colors duration-500 group-hover:bg-muted/50">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm text-muted-foreground">Target Dana Pensiun</span>
                      <span className="text-sm font-medium text-primary">65%</span>
                    </div>
                    <div className="h-2 bg-background rounded-full overflow-hidden border border-border/50">
                      <div className="h-full bg-linear-to-r from-primary to-[#56A8F9] w-2/3 transition-all duration-1000 group-hover:w-[70%]" />
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">Target pensiun usia 55 · Est. 2047</p>
                  </div>
                  <div className="bg-muted/30 rounded-xl p-4 border border-border/50">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
                        <Brain className="w-3 h-3 text-primary" />
                      </div>
                      <div className="text-sm text-muted-foreground">Saran AI</div>
                    </div>
                    <div className="text-sm text-foreground italic leading-relaxed">
                      &quot;Tingkatkan investasi Rp 500rb/bulan ke reksa dana saham untuk mencapai target pensiunmu 3 tahun lebih cepat.&quot;
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS ─────────────────────────────────────────────── */}
      <section className="py-16 px-8 lg:px-12 bg-primary">
        <div className="max-w-screen-2xl mx-auto">
          <p className="text-primary-foreground/70 text-sm text-center mb-10 uppercase tracking-widest">
            Mengapa ini penting
          </p>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {STATS.map((s) => (
              <div key={s.value} className="text-center">
                <p className="text-4xl lg:text-5xl font-bold text-primary-foreground mb-2">
                  {s.value}
                </p>
                <p className="text-primary-foreground/70 text-sm leading-relaxed">
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ──────────────────────────────────────── */}
      <section id="how-it-works" className="py-24 px-8 lg:px-12 scroll-mt-32">
        <div className="max-w-screen-2xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
              Dari daftar ke kejelasan finansial dalam 5 menit
            </h2>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              Tidak perlu background finance. Tidak perlu bayar. Cukup jawab beberapa pertanyaan.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {HOW_IT_WORKS.map((step, i) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.title}
                  className="bg-card rounded-2xl p-6 border border-border shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 relative"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold shrink-0">
                      {i + 1}
                    </div>
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Icon className="w-4 h-4 text-primary" />
                    </div>
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">{step.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{step.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── FEATURES ──────────────────────────────────────────── */}
      <section id="features" className="py-20 px-8 lg:px-12 bg-muted/30 border-y border-border/40 scroll-mt-32">
        <div className="max-w-screen-2xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
              Semua yang kamu butuhkan untuk merencanakan masa depan
            </h2>
            <p className="text-lg text-muted-foreground">
              Bukan kalkulator biasa — ini advisor finansial berbasis AI dan data aktuaria.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map((f) => {
              const Icon = f.icon;
              return (
                <div
                  key={f.title}
                  className="bg-card rounded-2xl p-8 border border-border shadow-sm hover:shadow-md hover:-translate-y-2 transition-all duration-300"
                >
                  <div className="w-14 h-14 bg-primary/5 rounded-xl flex items-center justify-center mb-6">
                    <Icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">{f.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── COMPARISON ────────────────────────────────────────── */}
      <section id="why-us" className="py-24 px-8 lg:px-12 scroll-mt-32">
        <div className="max-w-screen-2xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
              CuanSelor vs cara konvensional
            </h2>
            <p className="text-lg text-muted-foreground">
              Kenapa harus bayar mahal kalau bisa lebih baik secara gratis?
            </p>
          </div>

          <div className="max-w-3xl mx-auto grid grid-cols-2 gap-4">
            {/* Old */}
            <div className="bg-muted/40 rounded-2xl p-6 border border-border">
              <p className="font-semibold text-muted-foreground mb-5 text-sm">
                {COMPARISON.old.label}
              </p>
              <div className="space-y-3">
                {COMPARISON.old.items.map((item) => (
                  <div key={item} className="flex items-center gap-2.5 text-sm text-muted-foreground">
                    <XCircle className="w-4 h-4 text-destructive shrink-0" />
                    {item}
                  </div>
                ))}
              </div>
            </div>

            {/* New */}
            <div className="bg-primary/5 rounded-2xl p-6 border-2 border-primary/30">
              <p className="font-semibold text-primary mb-5 text-sm flex items-center gap-2">
                {COMPARISON.new.label}
                <span className="text-xs px-2 py-0.5 bg-primary text-primary-foreground rounded-full">
                  Recommended
                </span>
              </p>
              <div className="space-y-3">
                {COMPARISON.new.items.map((item) => (
                  <div key={item} className="flex items-center gap-2.5 text-sm text-foreground">
                    <CheckCircle className="w-4 h-4 text-primary shrink-0" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Why us pills */}
          <div className="grid md:grid-cols-3 gap-6 mt-16">
            {[
              { icon: Shield, title: "Aman & Privat", desc: "Enkripsi bank-level. Data kamu tidak pernah dijual." },
              { icon: Brain, title: "Berbasis AI", desc: "Rekomendasi cerdas yang disesuaikan situasi unikmu." },
              { icon: Users, title: "Untuk Gen Z", desc: "Dirancang untuk kebutuhan finansial anak muda Indonesia." },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="text-center group">
                <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
                  <Icon className="w-8 h-8 text-primary-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
                <p className="text-muted-foreground text-sm">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ──────────────────────────────────────── */}
      <section className="py-20 px-8 lg:px-12 bg-muted/30 border-y border-border/40">
        <div className="max-w-screen-2xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
              Apa kata pengguna CuanSelor
            </h2>
            <p className="text-lg text-muted-foreground">
              Ribuan Gen Z Indonesia sudah mulai merencanakan keuangan mereka.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t) => (
              <div
                key={t.name}
                className="bg-card rounded-2xl p-6 border border-border shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col"
              >
                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <svg key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-foreground italic leading-relaxed mb-6 flex-1 text-sm">
                  &quot;{t.quote}&quot;
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-sm font-semibold text-primary shrink-0">
                    {t.initials}
                  </div>
                  <div>
                    <p className="font-medium text-foreground text-sm">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ABOUT ─────────────────────────────────────────────── */}
      <section id="about" className="py-24 px-8 lg:px-12 bg-muted/50 border-y border-border/40 scroll-mt-32">
        <div className="max-w-7xl mx-auto">
          {/* Centered Title Header */}
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-2 bg-primary/10 rounded-full text-primary font-bold text-2xl mb-6">
              Tentang CuanSelor
            </div>
            <h2 className="text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight max-w-4xl mx-auto">
              Lebih dari sekadar kalkulator keuangan
            </h2>
            <p className="text-lg text-muted-foreground mb-6 leading-relaxed max-w-3xl mx-auto">
              CuanSelor lahir dari satu keyakinan — setiap anak muda Indonesia berhak
              mendapatkan panduan keuangan yang cerdas, berbasis data, dan personal.
              Bukan hanya mereka yang mampu membayar financial advisor.
            </p>
            <p className="text-muted-foreground leading-relaxed max-w-3xl mx-auto">
              Kami menggabungkan <span className="text-foreground font-medium">ilmu aktuaria</span>,{" "}
              <span className="text-foreground font-medium">deep learning</span>, dan{" "}
              <span className="text-foreground font-medium">large language model</span> untuk
              memberikan proyeksi pensiun yang akurat secara ilmiah — bukan tebak-tebakan
              usia 80 tahun seperti kalkulator konvensional.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 items-center">

            {/* Left — Visual pengganti gambar */}
            <div className="relative group">
              <div className="absolute -inset-4 bg-primary/10 rounded-3xl blur-2xl opacity-50 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative bg-card rounded-2xl border border-border shadow-xl p-8 space-y-4">
                {/* Header card */}
                <div className="flex items-center gap-3 pb-4 border-b border-border/40">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground text-sm">CuanSelor Platform</p>
                    <p className="text-xs text-muted-foreground">AI-powered · Actuarial-grade</p>
                  </div>
                </div>

                {/* Pillars */}
                {[
                  {
                    icon: Shield,
                    label: "Data Aktuaria Resmi",
                    sub: "Tabel Mortalitas Indonesia 2023",
                    color: "bg-blue-500/10 text-blue-500",
                  },
                  {
                    icon: Brain,
                    label: "Deep Learning Model",
                    sub: "TensorFlow · Prediksi inflasi & return",
                    color: "bg-primary/10 text-primary",
                  },
                  {
                    icon: MessageCircle,
                    label: "LLM Financial Advisor",
                    sub: "Bahasa Indonesia · Kontekstual · Personal",
                    color: "bg-yellow-500/10 text-yellow-600",
                  },
                  {
                    icon: Target,
                    label: "Proyeksi What-If",
                    sub: "Simulasi real-time · 3 skenario",
                    color: "bg-green-500/10 text-green-600",
                  },
                ].map(({ icon: Icon, label, sub, color }) => (
                  <div
                    key={label}
                    className="flex items-center gap-4 p-3 rounded-xl bg-muted/40 hover:bg-muted/70 transition-colors"
                  >
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{label}</p>
                      <p className="text-xs text-muted-foreground">{sub}</p>
                    </div>
                    <CheckCircle className="w-4 h-4 text-primary ml-auto shrink-0" />
                  </div>
                ))}

                {/* Bottom stat */}
                <div className="pt-4 border-t border-border/40 grid grid-cols-3 gap-3 text-center">
                  {[
                    { val: "100%", label: "Gratis" },
                    { val: "< 5 mnt", label: "Setup" },
                    { val: "24/7", label: "Tersedia" },
                  ].map((s) => (
                    <div key={s.label} className="bg-primary/5 rounded-xl p-2">
                      <p className="font-bold text-primary text-sm">{s.val}</p>
                      <p className="text-xs text-muted-foreground">{s.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right — Principles */}
            <div>
              {/* Principles */}
              <div className="space-y-4">
                {[
                  {
                    icon: Users,
                    title: "Aksesibel untuk semua",
                    desc: "Perencanaan keuangan tidak seharusnya berbayar. Semua fitur inti CuanSelor gratis tanpa paywall.",
                  },
                  {
                    icon: BarChart3,
                    title: "Berbasis data, bukan asumsi",
                    desc: "Setiap proyeksi didukung data aktuaria nyata — Tabel Mortalitas Penduduk Indonesia 2023.",
                  },
                  {
                    icon: Shield,
                    title: "Privasi adalah prioritas",
                    desc: "Data finansialmu adalah milikmu. Kami tidak pernah menjual atau menggunakannya untuk iklan.",
                  },
                  {
                    icon: Brain,
                    title: "Dirancang untuk non-expert",
                    desc: "Matematika finansial yang kompleks diterjemahkan menjadi langkah konkret yang bisa diikuti siapa saja.",
                  },
                ].map(({ icon: Icon, title, desc }) => (
                  <div key={title} className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center mt-0.5 shrink-0">
                      <Icon className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground text-sm mb-1">{title}</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────────── */}
      <section className="py-24 px-8 lg:px-12">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-block px-4 py-2 bg-primary/10 rounded-full text-primary font-medium text-sm mb-4">
              FAQ
            </div>
            <h2 className="text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
              Pertanyaan yang sering ditanyakan
            </h2>
            <p className="text-muted-foreground">
              Masih ragu? Semoga ini membantu.
            </p>
          </div>

          <div className="border border-border/40 rounded-2xl px-6 divide-y divide-border/40">
            {FAQS.map((faq) => (
              <FaqItem key={faq.q} q={faq.q} a={faq.a} />
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────── */}
      <section className="py-24 px-8 lg:px-12 bg-primary">
        <div className="max-w-screen-2xl mx-auto text-center">
          <h2 className="text-5xl lg:text-6xl font-bold text-primary-foreground mb-8 leading-tight">
            Pensiunmu tidak akan merencanakan dirinya sendiri.
          </h2>
          <p className="text-lg text-primary-foreground/70 mb-10 max-w-xl mx-auto leading-relaxed">
            Bergabunglah dengan ribuan anak muda Indonesia yang akhirnya tahu di mana
            mereka berdiri secara finansial — dan ke mana mereka menuju.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href={ROUTES.REGISTER}
              className="px-10 py-4 bg-white text-primary rounded-xl font-semibold hover:bg-white/90 transition-all shadow-lg flex items-center gap-2"
            >
              Mulai Gratis Sekarang
              <TrendingUp className="w-5 h-5" />
            </Link>
            <Link
              href={ROUTES.PROJECTION}
              className="px-10 py-4 bg-transparent text-primary-foreground border border-primary-foreground/30 rounded-xl font-medium hover:bg-primary-foreground/10 transition-all"
            >
              Coba Simulasi →
            </Link>
          </div>
          <p className="text-primary-foreground/50 text-sm mt-6">
            Gratis selamanya · Tidak perlu kartu kredit · Selesai dalam 5 menit
          </p>
        </div>
      </section>
    </>
  );
}