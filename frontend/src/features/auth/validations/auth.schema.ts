import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email wajib diisi")
    .email("Format email tidak valid"),
  password: z
    .string()
    .min(1, "Password wajib diisi")
    .min(8, "Password minimal 8 karakter"),
  rememberMe: z.boolean().optional(),
});

export type LoginInput = z.infer<typeof loginSchema>;


export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, "Email wajib diisi")
    .email("Format email tidak valid"),
});

export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;


export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "Password minimal 8 karakter")
      .regex(/[A-Z]/, "Harus mengandung setidaknya satu huruf kapital")
      .regex(/[0-9]/, "Harus mengandung setidaknya satu angka"),
    confirmPassword: z.string().min(1, "Konfirmasi password wajib diisi"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password tidak cocok",
    path: ["confirmPassword"],
  });

export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;



export const personalInfoSchema = z.object({
  fullName: z
    .string()
    .min(1, "Nama lengkap wajib diisi")
    .min(2, "Nama minimal 2 karakter"),
  email: z
    .string()
    .min(1, "Email wajib diisi")
    .email("Format email tidak valid"),
  password: z
    .string()
    .min(1, "Password wajib diisi")
    .min(8, "Password minimal 8 karakter"),
  confirmPassword: z.string().min(1, "Konfirmasi password wajib diisi"),
}).refine((d) => d.password === d.confirmPassword, {
  message: "Password tidak cocok",
  path:    ["confirmPassword"],
});

export type PersonalInfoInput = z.infer<typeof personalInfoSchema>;

// Alias — agar mock services yang import RegisterInput tetap kompatibel
export type RegisterInput = PersonalInfoInput;

export const financialOnboardingSchema = z.object({
  monthlyIncome: z
    .string()
    .min(1, "Pendapatan bulanan wajib diisi"),
  monthlyExpense: z
    .string()
    .min(1, "Pengeluaran bulanan wajib diisi"),
  annualBonusMonths: z
    .string()
    .min(1, "Bonus/THR wajib diisi"),
  currentSavings: z
    .string()
    .min(1, "Dana investasi saat ini wajib diisi"),
  savingsPercentage: z
    .string()
    .min(1, "Persentase nabung wajib diisi"),
});

export type FinancialOnboardingInput = z.infer<typeof financialOnboardingSchema>;

export const pensionOnboardingSchema = z.object({
  retirementAge: z
    .string()
    .min(1, "Target usia pensiun wajib diisi"),
  lifestylePercent: z
    .string()
    .min(1, "Target gaya hidup wajib diisi"),
  hasHealthInsurance: z.boolean().optional(),
  riskProfile: z
    .enum(["conservative", "moderate", "aggressive"], {
      message: "Profil risiko wajib dipilih",
    }),
  sector: z
    .string()
    .min(1, "Sektor pekerjaan wajib dipilih"),
  includePandemicRisk: z.boolean().optional(),
  depositRate: z
    .string()
    .min(1, "Bunga deposito wajib diisi"),
  confirmAccuracy: z
    .boolean()
    .refine((v) => v, { message: "Konfirmasi data wajib dicentang" }),
});

export type PensionOnboardingInput = z.infer<typeof pensionOnboardingSchema>;