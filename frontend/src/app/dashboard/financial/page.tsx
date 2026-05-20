"use client";

import { useState } from "react";
import { OnboardingWizard, type WizardData } from "@/features/financial-profile/components/OnBoardingWizard";
import { useSubmitFinancial } from "@/features/financial-profile/hooks/useOnboarding";
import { Wallet, CheckCircle } from "lucide-react";

export default function FinancialManagementPage() {
  const { submitFinancial, isPending, error } = useSubmitFinancial();
  const [isSuccess, setIsSuccess] = useState(false);

  const handleUpdate = async (data: WizardData) => {
    const ok = await submitFinancial(data);
    if (ok) {
      setIsSuccess(true);
      setTimeout(() => setIsSuccess(false), 4000);
    }
  };

  return (
    <div className="max-w-2xl">
      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 text-blue-600 text-sm font-semibold mb-4">
          <Wallet size={15} /> Data Finansial
        </div>
        <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 mb-2">
          Perbarui Profil Finansial
        </h1>
        <p className="text-gray-500 text-sm">
          Jawab pertanyaan berikut untuk memperbarui data finansialmu dan menyesuaikan proyeksi pensiun terbaru.
        </p>
      </div>

      {/* Success banner */}
      {isSuccess && (
        <div className="mb-6 flex items-center gap-3 p-4 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-2xl font-medium text-sm">
          <CheckCircle size={18} className="shrink-0" />
          Data finansial berhasil diperbarui! Proyeksimu sedang dihitung ulang.
        </div>
      )}

      {/* Wizard — reuse the same conversational wizard */}
      <OnboardingWizard
        onComplete={handleUpdate}
        isPending={isPending}
        error={error}
      />
    </div>
  );
}
