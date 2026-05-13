"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FinancialForm } from "@/features/financial-profile/components/FinancialForm";
import { PensionForm } from "@/features/financial-profile/components/PensionForm";
import { useSubmitFinancial, useSubmitPension } from "@/features/financial-profile/hooks/useOnboarding";
import { Modal } from "@/components/ui/Modal";
import { ROUTES } from "@/lib/constants/routes";
import type { FinancialOnboardingInput, PensionOnboardingInput } from "@/features/auth/validations/auth.schema";

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState<2 | 3>(2);
  const [showFinancialSuccess, setShowFinancialSuccess] = useState(false);
  const [showFinalSuccess, setShowFinalSuccess] = useState(false);

  const {
    submitFinancial,
    isPending: financialPending,
    error: financialError,
  } = useSubmitFinancial();

  const {
    submitPension,
    isPending: pensionPending,
    error: pensionError,
  } = useSubmitPension();

  // ── Step 2: Financial Submit ────────────────────────────────
  const handleFinancialSubmit = async (data: FinancialOnboardingInput) => {
    const ok = await submitFinancial(data);
    if (ok) setShowFinancialSuccess(true);
  };

  // ── Step 3: Pension Submit ──────────────────────────────────
  const handlePensionSubmit = async (
    data: PensionOnboardingInput & { riskAnswers?: Record<string, number> }
  ) => {
    const ok = await submitPension(data);
    if (ok) setShowFinalSuccess(true);
  };

  return (
    <div className="min-h-screen bg-muted/30 flex items-center justify-center px-4 py-12">
      {/* Step 2 — Financial Form */}
      {step === 2 && (
        <FinancialForm
          onSubmit={handleFinancialSubmit}
          isPending={financialPending}
          error={financialError}
        />
      )}

      {/* Step 3 — Pension Form */}
      {step === 3 && (
        <PensionForm
          onSubmit={handlePensionSubmit}
          isPending={pensionPending}
          error={pensionError}
        />
      )}

      {/* Popup: Financial Success → move to Step 3 */}
      <Modal
        open={showFinancialSuccess}
        title="Data Finansial Tersimpan! ✅"
        description="Data finansialmu berhasil disimpan. Yuk lanjut isi data proyeksi pensiun."
        primaryLabel="Lanjut ke Proyeksi Pensiun"
        onPrimary={() => {
          setShowFinancialSuccess(false);
          setStep(3);
        }}
        onClose={() => setShowFinancialSuccess(false)}
      />

      {/* Popup: Final Success → go to Dashboard */}
      <Modal
        open={showFinalSuccess}
        title="Selamat! Onboarding Selesai 🎉"
        description="Semua data sudah lengkap. Saatnya melihat proyeksi keuangan dan rekomendasi personalmu."
        primaryLabel="Ke Dashboard"
        onPrimary={() => router.push(ROUTES.DASHBOARD)}
        onClose={() => setShowFinalSuccess(false)}
      />
    </div>
  );
}
