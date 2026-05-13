import { Sparkles } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen pt-32 pb-20 px-4 md:px-8 max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-700 text-sm font-bold mb-6">
        <Sparkles size={16} /> About Us
      </div>
      <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 mb-8 leading-tight">
        Misi Kami di <span className="text-[#10B981]">CuanSelor</span>
      </h1>
      
      <div className="space-y-6 text-gray-600 text-lg leading-relaxed">
        <p>
          CuanSelor lahir dari keresahan melihat banyaknya Gen Z dan Milenial yang merasa masa depan finansial dan pensiun itu suram. Kami percaya bahwa setiap orang, berapapun pendapatannya, berhak memiliki rencana masa depan yang jelas dan bisa dicapai.
        </p>
        <p>
          Dengan bantuan kecerdasan buatan (AI) dan ilmu aktuaria terapan, kami menghadirkan <strong>Penasihat Keuangan Pribadi</strong> langsung ke dalam genggamanmu. Tanpa biaya mahal, tanpa bahasa yang bikin pusing.
        </p>
        <div className="p-6 mt-8 bg-gray-50 rounded-3xl border border-gray-100">
          <h3 className="text-xl font-bold text-gray-900 mb-2">Visi Kami</h3>
          <p>Menciptakan generasi yang melek finansial, merdeka secara finansial di usia muda, dan bebas dari rasa cemas (financial anxiety).</p>
        </div>
      </div>
    </div>
  );
}
