import { FileText } from "lucide-react";

export default function BlogPage() {
  return (
    <div className="min-h-screen pt-32 pb-20 px-4 md:px-8 max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-700 text-sm font-bold mb-6">
        <FileText size={16} /> Blog
      </div>
      <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 mb-8 leading-tight">
        Insight <span className="text-[#10B981]">Finansial</span>
      </h1>
      
      <div className="space-y-6">
        {[
          { title: "Cara Mulai Investasi Reksadana untuk Mahasiswa", date: "12 May 2026", category: "Investasi" },
          { title: "Mitos Pensiun Dini yang Bikin Kamu Miskin", date: "05 May 2026", category: "Mindset" },
          { title: "Alokasi Gaji UMR Biar Tetap Bisa Nongkrong", date: "28 Apr 2026", category: "Budgeting" },
        ].map((post, i) => (
          <div key={i} className="group p-6 bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all cursor-pointer">
            <div className="flex items-center gap-3 mb-3">
              <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-bold rounded-full">{post.category}</span>
              <span className="text-sm text-gray-400">{post.date}</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 group-hover:text-[#10B981] transition-colors">{post.title}</h3>
            <p className="text-gray-500 mt-2">Baca panduan lengkap dan insight menarik tentang topik ini untuk meningkatkan kecerdasan finansialmu...</p>
          </div>
        ))}
      </div>
    </div>
  );
}
