"use client";

import { useFinancialProfile } from "@/features/financial-profile/hooks/useOnboarding";
import {
  Wallet,
  User,
  TrendingUp,
  PiggyBank,
  Target,
  Shield,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  Building2,
  HeartPulse,
  BadgePercent,
  Landmark,
} from "lucide-react";

// ── Helper formatters ────────────────────────────────────────────────
function formatRupiah(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

function formatPercent(value: number) {
  return `${value}%`;
}

const RISK_LABEL: Record<string, { label: string; color: string; bg: string }> = {
  conservative: { label: "Konservatif",  color: "text-blue-600",   bg: "bg-blue-50"   },
  moderate:     { label: "Moderat",       color: "text-amber-600",  bg: "bg-amber-50"  },
  aggressive:   { label: "Agresif",       color: "text-rose-600",   bg: "bg-rose-50"   },
};

const GENDER_LABEL: Record<string, string> = {
  male: "Laki-laki",
  female: "Perempuan",
};

// ── Skeleton loader ──────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="bg-white rounded-3xl p-6 border border-gray-100 animate-pulse">
      <div className="h-4 w-1/3 bg-gray-200 rounded-full mb-4" />
      <div className="space-y-3">
        <div className="h-3 w-full bg-gray-100 rounded-full" />
        <div className="h-3 w-4/5 bg-gray-100 rounded-full" />
        <div className="h-3 w-3/5 bg-gray-100 rounded-full" />
      </div>
    </div>
  );
}

// ── Info row inside a card ───────────────────────────────────────────
function InfoRow({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0">
      <span className="text-sm text-gray-500">{label}</span>
      <span
        className={`text-sm font-semibold ${
          highlight ? "text-emerald-600" : "text-gray-800"
        }`}
      >
        {value}
      </span>
    </div>
  );
}

// ── Section card ─────────────────────────────────────────────────────
function DataCard({
  title,
  icon: Icon,
  iconColor,
  iconBg,
  children,
}: {
  title: string;
  icon: React.ElementType;
  iconColor: string;
  iconBg: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center gap-3 mb-5">
        <div className={`w-10 h-10 rounded-2xl ${iconBg} flex items-center justify-center`}>
          <Icon size={20} className={iconColor} />
        </div>
        <h2 className="font-bold text-gray-800 text-base">{title}</h2>
      </div>
      {children}
    </div>
  );
}

// ── Summary metric card at the top ───────────────────────────────────
function MetricCard({
  label,
  value,
  sub,
  icon: Icon,
  gradient,
}: {
  label: string;
  value: string;
  sub?: string;
  icon: React.ElementType;
  gradient: string;
}) {
  return (
    <div className={`rounded-3xl p-5 text-white ${gradient} shadow-lg`}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-white/80 text-sm font-medium">{label}</span>
        <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
          <Icon size={16} className="text-white" />
        </div>
      </div>
      <p className="text-xl font-extrabold leading-tight">{value}</p>
      {sub && <p className="text-white/70 text-xs mt-1">{sub}</p>}
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────
export default function FinancialDataPage() {
  const { profile, isLoading, error, refetch } = useFinancialProfile();

  // ── Loading state ──
  if (isLoading) {
    return (
      <div className="space-y-6 max-w-5xl">
        <div className="h-8 w-48 bg-gray-200 rounded-full animate-pulse mb-2" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-28 bg-gray-200 rounded-3xl animate-pulse" />
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    );
  }

  // ── Error state ──
  if (error) {
    return (
      <div className="max-w-md mx-auto mt-16 text-center">
        <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
          <AlertCircle size={28} className="text-red-500" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Gagal Memuat Data</h2>
        <p className="text-gray-500 text-sm mb-6">{error}</p>
        <button
          onClick={refetch}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-500 text-white rounded-full text-sm font-semibold hover:bg-emerald-600 transition-colors"
        >
          <RefreshCw size={16} />
          Coba Lagi
        </button>
      </div>
    );
  }

  // ── No data state ──
  if (!profile) {
    return (
      <div className="max-w-md mx-auto mt-16 text-center">
        <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-4">
          <Wallet size={28} className="text-emerald-500" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Data Finansial Belum Ada</h2>
        <p className="text-gray-500 text-sm">
          Sepertinya data finansialmu belum tersedia. Pastikan kamu sudah menyelesaikan proses onboarding saat mendaftar.
        </p>
      </div>
    );
  }

  const risk = RISK_LABEL[profile.riskProfile] ?? RISK_LABEL.moderate;
  const netCashflow = profile.monthlyIncome - profile.monthlyExpense;
  const savingsAmount = (profile.monthlyIncome * profile.savingsPercentage) / 100;

  return (
    <div className="max-w-5xl space-y-8">
      {/* ── Page Header ── */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-600 text-sm font-semibold mb-3">
            <Wallet size={15} />
            Data Finansial
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-gray-900">
            Profil Finansial Kamu
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Ringkasan data keuangan berdasarkan informasi yang kamu berikan saat onboarding.
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-semibold">
          <CheckCircle2 size={13} />
          Terverifikasi
        </div>
      </div>

      {/* ── Summary Metric Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="Pendapatan Bulanan"
          value={formatRupiah(profile.monthlyIncome)}
          icon={TrendingUp}
          gradient="bg-gradient-to-br from-emerald-500 to-emerald-600"
        />
        <MetricCard
          label="Pengeluaran Bulanan"
          value={formatRupiah(profile.monthlyExpense)}
          icon={Wallet}
          gradient="bg-gradient-to-br from-blue-500 to-blue-600"
        />
        <MetricCard
          label="Tabungan Saat Ini"
          value={formatRupiah(profile.currentSavings)}
          icon={PiggyBank}
          gradient="bg-gradient-to-br from-violet-500 to-violet-600"
        />
        <MetricCard
          label="Total Utang"
          value={formatRupiah(profile.totalDebt)}
          sub={profile.totalDebt === 0 ? "Bebas utang 🎉" : undefined}
          icon={Landmark}
          gradient={
            profile.totalDebt === 0
              ? "bg-gradient-to-br from-teal-500 to-teal-600"
              : "bg-gradient-to-br from-rose-500 to-rose-600"
          }
        />
      </div>

      {/* ── Data Cards Grid ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* Data Pribadi */}
        <DataCard
          title="Data Pribadi"
          icon={User}
          iconColor="text-blue-600"
          iconBg="bg-blue-50"
        >
          <InfoRow label="Nama Lengkap" value={profile.fullName || "—"} />
          <InfoRow label="Usia" value={`${profile.age} tahun`} />
          <InfoRow label="Jenis Kelamin" value={GENDER_LABEL[profile.gender] ?? profile.gender} />
        </DataCard>

        {/* Pendapatan & Pengeluaran */}
        <DataCard
          title="Pendapatan & Pengeluaran"
          icon={TrendingUp}
          iconColor="text-emerald-600"
          iconBg="bg-emerald-50"
        >
          <InfoRow label="Pendapatan Bulanan" value={formatRupiah(profile.monthlyIncome)} highlight />
          <InfoRow label="Bonus Tahunan" value={`${profile.annualBonusMonths} bulan gaji`} />
          <InfoRow label="Pengeluaran Bulanan" value={formatRupiah(profile.monthlyExpense)} />
          <InfoRow
            label="Arus Kas Bersih"
            value={formatRupiah(netCashflow)}
            highlight={netCashflow >= 0}
          />
        </DataCard>

        {/* Tabungan & Investasi */}
        <DataCard
          title="Tabungan & Aset"
          icon={PiggyBank}
          iconColor="text-violet-600"
          iconBg="bg-violet-50"
        >
          <InfoRow label="Tabungan Saat Ini" value={formatRupiah(profile.currentSavings)} highlight />
          <InfoRow label="Persentase Menabung" value={formatPercent(profile.savingsPercentage)} />
          <InfoRow label="Estimasi Tabungan/bulan" value={formatRupiah(savingsAmount)} />
          <InfoRow label="Total Utang" value={formatRupiah(profile.totalDebt)} />
        </DataCard>

        {/* Target Pensiun */}
        <DataCard
          title="Target Pensiun"
          icon={Target}
          iconColor="text-amber-600"
          iconBg="bg-amber-50"
        >
          <InfoRow label="Usia Pensiun" value={`${profile.retirementAge} tahun`} />
          <InfoRow
            label="Sisa Tahun Aktif"
            value={`${Math.max(0, profile.retirementAge - profile.age)} tahun`}
          />
          <InfoRow label="Gaya Hidup Pensiun" value={formatPercent(profile.lifestylePercent)} />
          <InfoRow label="Rate Deposito" value={formatPercent(profile.depositRate)} />
        </DataCard>

        {/* Profil Risiko */}
        <DataCard
          title="Profil Risiko"
          icon={Shield}
          iconColor="text-rose-600"
          iconBg="bg-rose-50"
        >
          <div className="flex items-center gap-3 mb-4">
            <span
              className={`px-4 py-1.5 rounded-full text-sm font-bold ${risk.bg} ${risk.color}`}
            >
              {risk.label}
            </span>
          </div>
          <p className="text-xs text-gray-400">
            Profil risiko ditentukan berdasarkan jawaban kuesioner saat onboarding dan akan mempengaruhi rekomendasi investasi kamu.
          </p>
        </DataCard>

        {/* Informasi Lainnya */}
        <DataCard
          title="Informasi Tambahan"
          icon={Building2}
          iconColor="text-indigo-600"
          iconBg="bg-indigo-50"
        >
          <InfoRow label="Sektor Pekerjaan" value={profile.sector || "—"} />
          <InfoRow
            label="Asuransi Kesehatan"
            value={profile.hasHealthInsurance ? "Ada" : "Tidak Ada"}
          />
          <InfoRow
            label="Pertimbangkan Risiko Pandemi"
            value={profile.includePandemicRisk ? "Ya" : "Tidak"}
          />
        </DataCard>

      </div>

      {/* ── Footer note ── */}
      <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-100 rounded-2xl text-sm text-amber-700">
        <HeartPulse size={16} className="shrink-0 mt-0.5" />
        <p>
          Data ini digunakan untuk menghitung proyeksi pensiunmu dan memberikan rekomendasi keuangan yang tepat.
          Jika ada perubahan kondisi finansial, hubungi tim CuanSelor.
        </p>
      </div>
    </div>
  );
}
