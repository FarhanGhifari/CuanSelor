"use client";

import { 
  Wallet, 
  TrendingUp, 
  Target, 
  ArrowRight,
  ShieldCheck,
  Zap
} from "lucide-react";
import Link from "next/link";

export default function DashboardOverview() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-[32px] bg-gray-900 text-white p-8 lg:p-12">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-72 h-72 rounded-full bg-[#10B981] blur-[80px] opacity-40"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-72 h-72 rounded-full bg-emerald-600 blur-[80px] opacity-40"></div>
        
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-sm font-medium mb-6">
            <Zap size={16} className="text-emerald-400" />
            <span>Overview Finansial Terkini</span>
          </div>
          <h2 className="text-3xl lg:text-5xl font-extrabold tracking-tight mb-4 leading-tight">
            Kendalikan Masa Depan <br/> Finansialmu Hari Ini.
          </h2>
          <p className="text-gray-400 text-lg mb-8 max-w-xl">
            Semua ringkasan data keuangan, proyeksi pensiun, dan profil risikomu ada di sini. Terus pantau agar targetmu tercapai.
          </p>
          <button className="bg-[#10B981] hover:bg-[#059669] text-white px-8 py-4 rounded-2xl font-bold transition-all duration-300 flex items-center gap-3">
            Tanya AI Advisor <ArrowRight size={20} />
          </button>
        </div>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Card 1: Data Finansial */}
        <div className="group bg-white rounded-[32px] p-8 border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_40px_rgb(16,185,129,0.1)] transition-all duration-300">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-[#10B981] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
            <Wallet size={28} strokeWidth={2} />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Manajemen Finansial</h3>
          <p className="text-gray-500 mb-6 line-clamp-2">
            Kelola pendapatan, pengeluaran, dan porsi investasi bulananmu agar arus kas tetap sehat.
          </p>
          <Link 
            href="/dashboard/financial" 
            className="inline-flex items-center gap-2 text-[#10B981] font-bold hover:text-[#059669] transition-colors"
          >
            Kelola Data <ArrowRight size={18} />
          </Link>
        </div>

        {/* Card 2: Proyeksi Pensiun */}
        <div className="group bg-white rounded-[32px] p-8 border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_40px_rgb(16,185,129,0.1)] transition-all duration-300">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-500 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
            <TrendingUp size={28} strokeWidth={2} />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Proyeksi Pensiun</h3>
          <p className="text-gray-500 mb-6 line-clamp-2">
            Lihat hitungan aktuaria kapan kamu bisa pensiun dini dan berapa dana yang dibutuhkan.
          </p>
          <Link 
            href="/dashboard/pension" 
            className="inline-flex items-center gap-2 text-blue-500 font-bold hover:text-blue-600 transition-colors"
          >
            Lihat Proyeksi <ArrowRight size={18} />
          </Link>
        </div>

        {/* Card 3: Profil Risiko */}
        <div className="group bg-white rounded-[32px] p-8 border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_40px_rgb(16,185,129,0.1)] transition-all duration-300">
          <div className="w-14 h-14 rounded-2xl bg-purple-50 text-purple-500 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
            <ShieldCheck size={28} strokeWidth={2} />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Profil Risiko</h3>
          <div className="flex items-center gap-3 mb-6">
            <span className="px-4 py-1.5 rounded-full bg-purple-100 text-purple-700 text-sm font-bold">
              Moderat
            </span>
            <span className="text-sm text-gray-400">Score: 18</span>
          </div>
          <Link 
            href="/dashboard/profile" 
            className="inline-flex items-center gap-2 text-purple-500 font-bold hover:text-purple-600 transition-colors mt-auto"
          >
            Update Profil <ArrowRight size={18} />
          </Link>
        </div>

      </div>

      {/* Progress Section */}
      <div className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Target Pensiun</h3>
            <p className="text-gray-500">Progress pengumpulan dana pensiunmu saat ini.</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500 font-medium mb-1">Total Terkumpul</p>
            <p className="text-3xl font-extrabold text-[#10B981]">Rp 5.000.000</p>
          </div>
        </div>

        <div className="relative w-full h-6 bg-gray-100 rounded-full overflow-hidden">
          <div 
            className="absolute top-0 left-0 h-full bg-linear-to-r from-[#10B981] to-emerald-400 rounded-full"
            style={{ width: '15%' }}
          ></div>
        </div>
        <div className="flex justify-between items-center mt-3 text-sm font-medium text-gray-400">
          <span>0%</span>
          <span>Target: Rp 2M+</span>
        </div>
      </div>
      
    </div>
  );
}
