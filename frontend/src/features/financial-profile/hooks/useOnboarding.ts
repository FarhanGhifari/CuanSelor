"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { financialProfileService } from "../services/financial-profile.service";
import { financialProfileMock } from "../services/financial-profile.mock";
import { ROUTES } from "@/lib/constants/routes";
import type { OnboardingPayload } from "../types/financial-profile.types";
import type { WizardData } from "../components/OnBoardingWizard";

const IS_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === "true";
const svc = IS_MOCK ? financialProfileMock : financialProfileService;

// ── Helper: sanitize WizardData → OnboardingPayload ────────────────
function sanitize(raw: WizardData): OnboardingPayload {
  return {
    monthlyIncome:      Number(raw.monthlyIncome)      || 0,
    annualBonusMonths:  Number(raw.annualBonusMonths)  || 0,
    monthlyExpense:     Number(raw.monthlyExpense)     || 0,
    savingsPercentage:  Number(raw.savingsPercentage)  || 0,
    currentSavings:     Number(raw.currentSavings)     || 0,
    totalDebt:          Number(raw.totalDebt)          || 0,
    retirementAge:      Number(raw.retirementAge)      || 55,
    lifestylePercent:   Number(raw.lifestylePercent)   || 80,
    riskProfile:        (raw.riskProfile as OnboardingPayload["riskProfile"]) ?? "moderate",
    riskAnswers:        (raw.riskAnswers as Record<string, number>) ?? {},
    sector:             String(raw.sector ?? ""),
    hasHealthInsurance: Boolean(raw.hasHealthInsurance),
    depositRate:        Number(raw.depositRate)        || 4.5,
    includePandemicRisk: Boolean(raw.includePandemicRisk),
  };
}

// ── useOnboarding — for post-registration flow ───────────────────────
export function useOnboarding() {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (raw: WizardData) => {
    setIsPending(true);
    setError(null);
    try {
      await svc.save(sanitize(raw));
      router.push(ROUTES.DASHBOARD);
      router.refresh();
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })
        ?.response?.data?.message;
      setError(msg ?? "Gagal menyimpan data. Coba lagi.");
    } finally {
      setIsPending(false);
    }
  };

  return { submit, isPending, error };
}

// ── useSubmitFinancial — for dashboard/financial update flow ─────────
export function useSubmitFinancial() {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitFinancial = async (raw: WizardData): Promise<boolean> => {
    setIsPending(true);
    setError(null);
    try {
      await svc.save(sanitize(raw));
      return true;
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })
        ?.response?.data?.message;
      setError(msg ?? "Gagal menyimpan data. Coba lagi.");
      return false;
    } finally {
      setIsPending(false);
    }
  };

  return { submitFinancial, isPending, error };
}

// ── useSubmitPension — for dashboard/pension update flow ─────────────
export function useSubmitPension() {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitPension = async (raw: WizardData): Promise<boolean> => {
    setIsPending(true);
    setError(null);
    try {
      await svc.save(sanitize(raw));
      return true;
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })
        ?.response?.data?.message;
      setError(msg ?? "Gagal menyimpan data. Coba lagi.");
      return false;
    } finally {
      setIsPending(false);
    }
  };

  return { submitPension, isPending, error };
}