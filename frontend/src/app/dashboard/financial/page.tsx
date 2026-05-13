"use client";

import { useState } from "react";
import { FinancialForm } from "@/features/financial-profile/components/FinancialForm";
import { useSubmitFinancial } from "@/features/financial-profile/hooks/useOnboarding";
import { Wallet } from "lucide-react";
import { useRouter } from "next/navigation";

export default function FinancialManagementPage() {
  const { submitFinancial, isPending, error } = useSubmitFinancial();
  const [isSuccess, setIsSuccess] = useState(false);
  const router = useRouter();

  const handleUpdate = async (data: any) => {
    const ok = await submitFinancial(data);
    if (ok) {
      setIsSuccess(true);
      setTimeout(() => setIsSuccess(false), 3000);
    }
  };

  return (
    <div className="max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-700 text-sm font-bold mb-4">
          <Wallet size={16} /> Data Finansial
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 mb-2">
          Manajemen Data Finansial
        </h1>
        <p className="text-gray-500">
          Perbarui data pemasukan dan pengeluaranmu agar sistem bisa menyesuaikan proyeksi pensiun terbaru.
        </p>
      </div>

      {isSuccess && (
        <div className="mb-6 p-4 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl font-medium">
          ✅ Data finansial berhasil diperbarui!
        </div>
      )}

      <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
        <FinancialForm onSubmit={handleUpdate} isPending={isPending} error={error} />
      </div>
    </div>
  );
}
