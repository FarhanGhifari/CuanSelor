import { ShieldQuestion } from "lucide-react";

export default function FAQPage() {
  return (
    <div className="min-h-screen pt-32 pb-20 px-4 md:px-8 max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-700 text-sm font-bold mb-6">
        <ShieldQuestion size={16} /> FAQ
      </div>
      <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 mb-8 leading-tight">
        Frequently Asked <span className="text-[#10B981]">Questions</span>
      </h1>
      
      <div className="space-y-6 text-gray-600 text-lg">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="font-bold text-gray-900 mb-2">Apakah aplikasi ini gratis?</h3>
          <p>Yups, 100% gratis! Kami percaya akses ke literasi dan perencanaan finansial harus bisa dinikmati siapa saja tanpa bayar mahal.</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="font-bold text-gray-900 mb-2">Bagaimana data saya diamankan?</h3>
          <p>Data kamu dienkripsi menggunakan standar industri terkini dan kami tidak pernah menjual data pribadimu ke pihak ketiga.</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="font-bold text-gray-900 mb-2">Apakah saran AI CuanSelor dijamin akurat?</h3>
          <p>AI kami dilatih dengan prinsip aktuaria dan perencana keuangan standar, tapi hasilnya bersifat rekomendasi. Keputusan akhir tetap di tangan kamu.</p>
        </div>
      </div>
    </div>
  );
}
