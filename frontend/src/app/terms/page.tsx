import { FileCheck } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="min-h-screen pt-32 pb-20 px-4 md:px-8 max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-700 text-sm font-bold mb-6">
        <FileCheck size={16} /> Legal
      </div>
      <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 mb-8 leading-tight">
        Terms of <span className="text-[#10B981]">Service</span>
      </h1>
      
      <div className="space-y-6 text-gray-600 text-lg leading-relaxed prose prose-emerald max-w-none">
        <p>Terakhir diperbarui: Mei 2026</p>
        <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">1. Ketentuan Penggunaan</h3>
        <p>Dengan mengakses atau menggunakan platform CuanSelor, kamu setuju untuk terikat oleh Ketentuan Layanan ini. Jika kamu tidak setuju dengan bagian mana pun dari ketentuan ini, kamu tidak dapat mengakses layanan.</p>
        
        <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">2. Disclaimer Finansial</h3>
        <p>CuanSelor adalah platform analitik dan edukasi berbasis AI. Kami <strong>bukan</strong> penasihat keuangan bersertifikat, pialang, atau manajer investasi. Semua proyeksi dan rekomendasi yang dihasilkan oleh platform kami bersifat estimasi dan saran edukatif. Kamu bertanggung jawab penuh atas keputusan finansialmu sendiri.</p>
      </div>
    </div>
  );
}
