"use client";

import { useState } from "react";
import { PensionForm } from "@/features/financial-profile/components/PensionForm";
import { useSubmitPension } from "@/features/financial-profile/hooks/useOnboarding";
import type { PensionOnboardingInput } from "@/features/auth/validations/auth.schema";
import { Umbrella } from "lucide-react";

export default function PensionManagementPage() {
  const { submitPension, isPending, error } = useSubmitPension();
  const [isSuccess, setIsSuccess] = useState(false);

  const handleUpdate = async (
    data: PensionOnboardingInput & { riskAnswers?: Record<string, number> }
  ) => {
    const ok = await submitPension(data);
    if (ok) {
      setIsSuccess(true);
      setTimeout(() => setIsSuccess(false), 3000);
    }
  };

  return (
    <div className="max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-100 text-blue-700 text-sm font-bold mb-4">
          <Umbrella size={16} /> Proyeksi Pensiun
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 mb-2">
          Konfigurasi Dana Pensiun
        </h1>
        <p className="text-gray-500">
          Ubah target usia pensiun atau gaya hidup masa tuamu di sini. AI kami akan otomatis mengkalkulasi ulang.
        </p>
      </div>

      {isSuccess && (
        <div className="mb-6 p-4 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl font-medium">
          ✅ Target pensiun berhasil diperbarui!
        </div>
      )}

      <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
        <PensionForm onSubmit={handleUpdate} isPending={isPending} error={error} />
      </div>
    </div>
  );
}
