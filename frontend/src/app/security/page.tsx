import { ShieldCheck } from "lucide-react";

export default function SecurityPage() {
  return (
    <div className="min-h-screen pt-32 pb-20 px-4 md:px-8 max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-700 text-sm font-bold mb-6">
        <ShieldCheck size={16} /> Security
      </div>
      <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 mb-8 leading-tight">
        Security <span className="text-[#10B981]">Commitment</span>
      </h1>
      
      <div className="space-y-6 text-gray-600 text-lg leading-relaxed prose prose-emerald max-w-none">
        <p>Keamanan datamu adalah hal yang sangat kami jaga ketat di CuanSelor.</p>
        
        <div className="grid gap-6 mt-8">
          <div className="p-6 bg-gray-50 border border-gray-100 rounded-3xl">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Enkripsi End-to-End</h3>
            <p>Semua komunikasi data antara browsermu dan server kami diamankan menggunakan protokol enkripsi TLS 1.3 terbaru.</p>
          </div>
          <div className="p-6 bg-gray-50 border border-gray-100 rounded-3xl">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Cloud Infrastructure</h3>
            <p>Database kami berjalan di atas infrastruktur cloud bersertifikat SOC2 (Supabase/AWS) yang memastikan standar keamanan tingkat enterprise dan mitigasi DDoS otomatis.</p>
          </div>
          <div className="p-6 bg-gray-50 border border-gray-100 rounded-3xl">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Secure Authentication</h3>
            <p>Kami menggunakan session cookies HttpOnly dan manajemen autentikasi canggih untuk mencegah serangan XSS dan pencurian sesi.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
