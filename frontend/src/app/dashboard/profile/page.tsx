"use client";

import { useState, useEffect } from "react";
import { apiClient } from "@/lib/api/axios.config";
import { API } from "@/lib/constants/api-endpoints";
import { User, Wallet, ShieldCheck, Umbrella, Loader2 } from "lucide-react";

interface AiSuggestion {
  message?: string;
  segment?: string;
  profile_segment?: string;
  financial_profile_segment?: string;
  risk_profile?: string;
  risk_category?: string;
  prediction?: string;
  label?: string;
  result?: {
    segment?: string;
    prediction?: string;
  };
}

interface ProfileResponse {
  personal?: {
    name?: string;
    email?: string;
  } | null;
  financial?: {
    monthly_income?: number;
    monthly_expenses?: number;
  } | null;
  pension?: {
    target_retirement_age?: number;
    post_retirement_lifestyle?: number;
  } | null;
  risk?: {
    risk_category?: string;
    ai_suggestion?: string | null;
    assessed_at?: string;
  } | null;
}

function formatRiskCategory(category?: string) {
  const labels: Record<string, string> = {
    conservative: "Conservative",
    moderate: "Moderate",
    aggressive: "Aggressive",
  };

  return labels[String(category || "").toLowerCase()] || category || "-";
}

function isAiSuggestion(value: unknown): value is AiSuggestion {
  return typeof value === "object" && value !== null;
}

function parseAiSuggestion(value?: string | null): AiSuggestion | null {
  if (!value) return null;

  try {
    const parsed: unknown = JSON.parse(value);
    return isAiSuggestion(parsed) ? parsed : { message: String(parsed) };
  } catch {
    return { message: value };
  }
}

function getAiSegment(aiSuggestion: AiSuggestion | null) {
  return (
    aiSuggestion?.segment ||
    aiSuggestion?.profile_segment ||
    aiSuggestion?.financial_profile_segment ||
    aiSuggestion?.risk_profile ||
    aiSuggestion?.risk_category ||
    aiSuggestion?.prediction ||
    aiSuggestion?.label ||
    aiSuggestion?.result?.segment ||
    aiSuggestion?.result?.prediction ||
    null
  );
}

export default function ProfilePage() {
  const [data, setData] = useState<ProfileResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await apiClient.get(API.PROFILE.GET);
        setData(res.data.data);
      } catch (err) {
        console.error("Failed to fetch profile", err);
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin text-emerald-500" size={32} />
      </div>
    );
  }

  if (!data) {
    return <div className="text-gray-500">Gagal memuat profil.</div>;
  }

  const aiSuggestion = parseAiSuggestion(data.risk?.ai_suggestion);
  const aiSegment = getAiSegment(aiSuggestion);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-16 h-16 rounded-full bg-linear-to-br from-emerald-400 to-[#10B981] flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-emerald-500/20">
          {data.personal?.name?.charAt(0) || "U"}
        </div>
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
            {data.personal?.name || "User"}
          </h1>
          <p className="text-gray-500 font-medium">{data.personal?.email}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Personal Info */}
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <User className="text-emerald-500" size={24} />
            <h2 className="text-xl font-bold text-gray-900">Personal Info</h2>
          </div>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-400 font-medium">Nama Lengkap</p>
              <p className="text-lg font-bold text-gray-900">{data.personal?.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400 font-medium">Email</p>
              <p className="text-lg font-bold text-gray-900">{data.personal?.email}</p>
            </div>
          </div>
        </div>

        {/* Financial Summary */}
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <Wallet className="text-emerald-500" size={24} />
            <h2 className="text-xl font-bold text-gray-900">Finansial</h2>
          </div>
          {data.financial ? (
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-400 font-medium">Penghasilan Bulanan</p>
                <p className="text-lg font-bold text-gray-900">Rp {data.financial.monthly_income?.toLocaleString("id-ID")}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400 font-medium">Pengeluaran Bulanan</p>
                <p className="text-lg font-bold text-gray-900">Rp {data.financial.monthly_expenses?.toLocaleString("id-ID")}</p>
              </div>
            </div>
          ) : (
            <p className="text-gray-500 text-sm">Data finansial belum dilengkapi.</p>
          )}
        </div>

        {/* Pension Summary */}
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <Umbrella className="text-emerald-500" size={24} />
            <h2 className="text-xl font-bold text-gray-900">Dana Pensiun</h2>
          </div>
          {data.pension ? (
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-400 font-medium">Target Usia Pensiun</p>
                <p className="text-lg font-bold text-gray-900">{data.pension.target_retirement_age} Tahun</p>
              </div>
              <div>
                <p className="text-sm text-gray-400 font-medium">Gaya Hidup Pensiun</p>
                <p className="text-lg font-bold text-gray-900">{data.pension.post_retirement_lifestyle}%</p>
              </div>
            </div>
          ) : (
            <p className="text-gray-500 text-sm">Data pensiun belum dilengkapi.</p>
          )}
        </div>

        {/* Risk Profile Summary */}
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <ShieldCheck className="text-emerald-500" size={24} />
            <h2 className="text-xl font-bold text-gray-900">Profil Risiko</h2>
          </div>
          {data.risk ? (
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-400 font-medium">Tipe Investor</p>
                <p className="text-lg font-bold text-gray-900">
                  {formatRiskCategory(data.risk.risk_category)}
                </p>
              </div>
              {aiSegment && (
                <div>
                  <p className="text-sm text-gray-400 font-medium">Segment AI</p>
                  <p className="text-lg font-bold text-gray-900">{aiSegment}</p>
                </div>
              )}
              {data.risk.assessed_at && (
                <div>
                  <p className="text-sm text-gray-400 font-medium">Terakhir Dinilai</p>
                  <p className="text-sm font-semibold text-gray-700">
                    {new Date(data.risk.assessed_at).toLocaleString("id-ID")}
                  </p>
                </div>
              )}
              {aiSuggestion?.message && (
                <p className="text-sm text-gray-600 leading-relaxed">{aiSuggestion.message}</p>
              )}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">Profil risiko belum dinilai.</p>
          )}
        </div>

      </div>
    </div>
  );
}
