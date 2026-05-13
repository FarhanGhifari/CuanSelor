"use client";

import { useState } from "react";
import { onboardingService } from "../services/onboarding.service";
import { onboardingMock } from "../services/onboarding.mock";
import type { FinancialOnboardingInput, PensionOnboardingInput } from "@/features/auth/validations/auth.schema";

const IS_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === "true";

// ── useSubmitFinancial ────────────────────────────────────────
export function useSubmitFinancial() {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitFinancial = async (data: FinancialOnboardingInput): Promise<boolean> => {
    setIsPending(true);
    setError(null);

    try {
      if (IS_MOCK) {
        const result = await onboardingMock.submitFinancial(data);
        if (result.error) {
          setError(result.error.message);
          return false;
        }
        return true;
      }

      await onboardingService.submitFinancial(data);
      return true;
    } catch (err: any) {
      const respData = err.response?.data;
      const message = respData?.error || respData?.message || (err instanceof Error ? err.message : "Gagal menyimpan data finansial");
      setError(message);
      return false;
    } finally {
      setIsPending(false);
    }
  };

  return { submitFinancial, isPending, error };
}

// ── useSubmitPension ──────────────────────────────────────────
export function useSubmitPension() {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitPension = async (
    data: PensionOnboardingInput & { riskAnswers?: Record<string, number> }
  ): Promise<boolean> => {
    setIsPending(true);
    setError(null);

    try {
      if (IS_MOCK) {
        const result = await onboardingMock.submitPension(data);
        if (result.error) {
          setError(result.error.message);
          return false;
        }
        return true;
      }

      await onboardingService.submitPension(data);
      return true;
    } catch (err: any) {
      const respData = err.response?.data;
      const message = respData?.error || respData?.message || (err instanceof Error ? err.message : "Gagal menyimpan data proyeksi pensiun");
      setError(message);
      return false;
    } finally {
      setIsPending(false);
    }
  };

  return { submitPension, isPending, error };
}
