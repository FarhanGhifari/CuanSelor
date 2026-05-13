import { Lock } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen pt-32 pb-20 px-4 md:px-8 max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-700 text-sm font-bold mb-6">
        <Lock size={16} /> Legal
      </div>
      <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 mb-8 leading-tight">
        Privacy <span className="text-[#10B981]">Policy</span>
      </h1>
      
      <div className="space-y-6 text-gray-600 text-lg leading-relaxed prose prose-emerald max-w-none">
        <p>Terakhir diperbarui: Mei 2026</p>
        <p>Di CuanSelor, privasi kamu adalah prioritas kami. Kami berkomitmen untuk melindungi dan menghargai privasi informasi finansialmu.</p>
        <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">1. Data yang Kami Kumpulkan</h3>
        <p>Kami mengumpulkan informasi yang kamu berikan saat mendaftar, seperti nama, email, dan data finansial untuk keperluan perhitungan proyeksi (seperti pendapatan, pengeluaran, dan persentase tabungan).</p>
        
        <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">2. Penggunaan Data</h3>
        <p>Data kamu murni digunakan untuk memberikan analisis, proyeksi pensiun, dan rekomendasi personal melalui AI kami. Kami <strong>tidak pernah</strong> menjual data pengguna ke pihak ketiga, pengiklan, atau lembaga keuangan lain.</p>
      </div>
    </div>
  );
}
