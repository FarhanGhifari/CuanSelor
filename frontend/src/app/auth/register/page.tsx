"use client";

import { useState } from "react";
import { RegisterForm } from "@/features/auth/components/RegisterForm";
import { FinancialForm } from "@/features/financial-profile/components/FinancialForm";
import { useRegister } from "@/features/auth/hooks/useAuth";
import type {
    PersonalInfoInput,
    FinancialInfoInput,
    RegisterInput,
} from "@/features/auth/validations/auth.schema";

export default function RegisterPage() {
    const [step, setStep] = useState<1 | 2>(1);
    const [personalData, setPersonalData] = useState<PersonalInfoInput | null>(null);
    const { register, isPending, error } = useRegister();

    const handlePersonalNext = (data: PersonalInfoInput) => {
        setPersonalData(data);
        setStep(2);
    };

    const handleFinancialSubmit = async (data: FinancialInfoInput) => {
        if (!personalData) return;
        const payload: RegisterInput = { ...personalData, ...data };
        await register(payload);
    };

    return (
        <div className="min-h-screen bg-muted/30 flex items-center justify-center px-4 py-12">
            {step === 1 ? (
                <RegisterForm onNext={handlePersonalNext} />
            ) : (
                <FinancialForm
                    onSubmit={handleFinancialSubmit}
                    onBack={() => setStep(1)}
                    isPending={isPending}
                    error={error}
                />
            )}
        </div>
    );
}