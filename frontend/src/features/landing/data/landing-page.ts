import {
  TrendingUp, Brain, Target, Shield, Zap, Users,
  MessageCircle, BarChart3, Wallet,
} from "lucide-react";

export const STATS = [
  { value: "55%", desc: "Orang Indonesia tidak punya rencana keuangan jangka panjang" },
  { value: "39.9%", desc: "Gen Z menyumbang pengguna pinjol terbesar di Indonesia (2025)" },
  { value: "6%", desc: "Pekerja yang dilindungi dana pensiun formal" },
  { value: "2038", desc: "Tahun prediksi 100 juta penduduk Indonesia jatuh miskin di hari tua" },
];

export const HOW_IT_WORKS = [
  {
    icon: Wallet,
    title: "Buat profil finansialmu",
    desc: "Isi pendapatan, pengeluaran, tabungan, dan target pensiun. Tidak perlu sambungkan rekening bank.",
  },
  {
    icon: BarChart3,
    title: "Dapatkan profil risiko",
    desc: "Jawab 10 pertanyaan singkat. AI kami mengklasifikasikan toleransi risikomu dan membangun portofolio yang sesuai.",
  },
  {
    icon: TrendingUp,
    title: "Lihat proyeksi pensiunmu",
    desc: "Visualisasikan berapa yang kamu butuhkan untuk pensiun - disesuaikan inflasi, kenaikan gaji, dan harapan hidup riil.",
  },
  {
    icon: MessageCircle,
    title: "Tanya AI advisor-mu",
    desc: "Chat dengan AI yang tahu datamu. Tanya apapun - 'Bisakah saya pensiun di usia 50?' atau 'Prioritas bayar utang atau investasi?'",
  },
];

export const FEATURES = [
  {
    icon: Brain,
    title: "Proyeksi pensiun aktuaria",
    desc: "Dibangun berdasarkan Tabel Mortalitas Indonesia 2023 - bukan asumsi usia sembarangan. Proyeksimu menyesuaikan gaya hidup dan faktor risikomu.",
  },
  {
    icon: Zap,
    title: "Portofolio personal",
    desc: "Dapatkan alokasi konkret - deposito, obligasi negara, reksa dana, atau saham - sesuai toleransi risiko dan horizon waktumu.",
  },
  {
    icon: Target,
    title: "Simulasi what-if",
    desc: "Ubah usia pensiun, besaran tabungan, atau jenis investasi - lihat dampaknya pada proyeksimu secara real-time.",
  },
  {
    icon: MessageCircle,
    title: "AI financial advisor",
    desc: "Saran kontekstual dalam Bahasa Indonesia yang jelas. Tanpa jargon. Tanpa penghakiman. Tanpa biaya per jam.",
  },
];

export const COMPARISON = {
  old: {
    label: "Financial advisor konvensional",
    items: [
      "Rp 500rb–2jt per sesi",
      "Susah booking, slot terbatas",
      "Saran generik, tidak berbasis data",
      "Tidak ada simulasi real-time",
      "Pakai asumsi usia statis",
      "Tidak tersedia 24/7",
    ],
  },
  new: {
    label: "CuanSelor",
    items: [
      "100% gratis, tanpa biaya tersembunyi",
      "Tersedia 24/7, hasil instan",
      "Personal sesuai profilmu",
      "Simulasi what-if real-time",
      "Proyeksi berbasis aktuaria",
      "Terintegrasi dengan AI",
      "Bisa diakses kapan saja",
    ],
  },
};

export const TESTIMONIALS = [
  {
    initials: "AR",
    quote: "Baru tau ternyata gue butuh nabung Rp 3,2 juta per bulan buat pensiun di usia 55. Tanpa CuanSelor gue ga bakal pernah hitung ini.",
    name: "Aldi R.",
    role: "Karyawan swasta, 24 thn",
  },
  {
    initials: "SR",
    quote: "AI advisornya bisa jawab pertanyaan spesifik gue - langsung tau kalau invest Rp 500k/bulan ke reksa dana saham, kapan gue bisa pensiun.",
    name: "Sinta R.",
    role: "Freelancer, 27 thn",
  },
  {
    initials: "BW",
    quote: "Sebagai mahasiswa yang baru mulai kerja part-time, ini pertama kalinya gue ngerti kondisi finansial gue sendiri. Simple banget dipakenya.",
    name: "Bagas W.",
    role: "Mahasiswa, 21 thn",
  },
  {
    initials: "DP",
    quote: "Bantu banget buat nge-track target dana darurat! Simulasi what-if nya ngebantu gue mutusin beli laptop baru sekarang atau nabung dulu.",
    name: "Dian P.",
    role: "Graphic Designer, 25 thn",
  },
  {
    initials: "RK",
    quote: "Fitur kalkulator inflasinya bikin mata melek. Dulu mikir pensiun bawa Rp 1 M cukup, ternyata pas dihitung pake aktuaria, butuhnya Rp 5 M gara-gara inflasi!",
    name: "Rian K.",
    role: "Software Engineer, 23 thn",
  },
  {
    initials: "CA",
    quote: "Gue suka banget fitur portofolio sesuai profil risiko. AI-nya nyaranin porsi reksa dana sama SBN yang pas banget buat profil moderat kayak gue.",
    name: "Clara A.",
    role: "Content Creator, 22 thn",
  },
  {
    initials: "FM",
    quote: "UI-nya gokil, bersih dan estetik banget! Fitur target dana pensiun dengan progress bar bikin gue termotivasi buat nyisihin sisa gaji tiap akhir bulan.",
    name: "Fajar M.",
    role: "Junior Auditor, 26 thn",
  },
  {
    initials: "NS",
    quote: "Paling suka konsultasi sama AI Advisor-nya tengah malem pas lagi overthinking finansial. Jawabannya berbobot dan gak bikin pusing kepala.",
    name: "Nabila S.",
    role: "Digital Marketer, 24 thn",
  },
];

export const FAQS = [
  {
    q: "Apakah CuanSelor benar-benar gratis?",
    a: "Ya, sepenuhnya gratis. Tidak ada biaya langganan, tidak ada fitur berbayar. Semua fitur inti - proyeksi pensiun, rekomendasi portofolio, dan AI advisor - bisa diakses tanpa biaya.",
  },
  {
    q: "Apakah data finansial saya aman?",
    a: "Data kamu dienkripsi dan tidak pernah dijual atau dibagikan ke pihak ketiga. CuanSelor tidak menyimpan data kartu kredit atau rekening bank - kami hanya menggunakan data yang kamu input sendiri.",
  },
  {
    q: "Apakah ini menggantikan financial advisor sungguhan?",
    a: "CuanSelor adalah alat perencanaan berbasis data, bukan pengganti financial advisor berlisensi. Rekomendasi kami bersifat edukatif - untuk keputusan investasi besar, konsultasi dengan profesional tetap disarankan.",
  },
  {
    q: "Seberapa akurat proyeksi pensiun CuanSelor?",
    a: "Proyeksi kami menggunakan Tabel Mortalitas dan Morbiditas Penduduk Indonesia 2023 dan model deep learning untuk prediksi inflasi dan return investasi - jauh lebih akurat dari kalkulator konvensional yang pakai asumsi statis.",
  },
  {
    q: "Siapa yang cocok pakai CuanSelor?",
    a: "Siapa saja yang ingin memahami kondisi finansial mereka - terutama Gen Z (18–30 tahun) yang baru mulai bekerja dan ingin merencanakan masa depan sejak dini.",
  },
];
